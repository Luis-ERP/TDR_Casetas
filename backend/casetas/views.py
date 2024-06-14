from rest_framework import viewsets, views, status
from rest_framework.response import Response
from rest_framework.decorators import action
from django.db import models
from django.db.models import Q
import functools
from casetas.models import (Orden, 
                            Unidad, 
                            Ruta,
                            Caseta,
                            Cruce)
from casetas.serializers import (OrdenSerializer, 
                                UnidadSerializer, 
                                CasetaSerializer,
                                RutaSerializer,
                                CruceSerializer)
from casetas.utils import parse_query_params
from casetas.mixins import GetQuerysetMixin
from casetas.client.televia import TeleviaAPI
import pandas as pd


class OrderViewset(viewsets.ModelViewSet, GetQuerysetMixin):
    queryset = Orden.objects.all()
    serializer_class = OrdenSerializer

    def retrieve(self, request, pk=None):
        qs = self.get_queryset().get(numero=pk)
        serializer = self.serializer_class(qs)
        return Response(serializer.data)
    
    @action(detail=False, methods=['post'], url_path='raw', url_name='raw')
    def create_raw(self, request):
        data = request.data
        df = pd.DataFrame(data[1:], columns=data[0])
        df = df.replace('UNKNOWN', pd.NA)
        # Filter all rows where column origin_cmp_name equals 'COLGATE ITURBIDE'
        df = df[df['origin_cmp_name'] == 'COLGATE ITURBIDE']
        rows_to_check_for_nan = [
            'ord_number', 
            'ord_tractor', 
            'ord_startdate', 
            'ord_completiondate', 
            'origin_cmp_name', 
            'dest_cmp_name']
        nan_df = df[df[rows_to_check_for_nan].isna().any(axis=1)]
        df = df.dropna(subset=rows_to_check_for_nan)
        try:
            Orden.import_from_raw_data(df)
            Orden.objects.filter(ruta__isnull=True).delete()
        except Exception as e:
            return Response({'message': str(e)}, status=status.HTTP_400_BAD_REQUEST)
        return Response({'message': 'Missing data in the following rows', 'rows': nan_df.to_dict(orient='records')}, status=status.HTTP_201_CREATED)


class UnitViewset(viewsets.ModelViewSet, GetQuerysetMixin):
    queryset = Unidad.objects.all()
    serializer_class = UnidadSerializer

    def list(self, request):
        queryset = self.get_queryset()
        context = {}
        if 'start_dt' in request.GET and 'end_dt' in request.GET:
            start_dt = request.GET.get('start_dt')
            end_dt = request.GET.get('end_dt')
            context['start_dt'] = start_dt
            context['end_dt'] = end_dt
            queryset = queryset.filter(ordenes__fecha_inicio__gte=start_dt, 
                                       ordenes__fecha_inicio__lt=end_dt)
        queryset = queryset.distinct()
        serializer = self.get_serializer(queryset, many=True, context=context)
        return Response(serializer.data)
    

class CasetaViewset(viewsets.ModelViewSet, GetQuerysetMixin):
    queryset = Caseta.objects.all()
    serializer_class = CasetaSerializer

    def partial_update(self, request, pk=None):
        data = request.data
        caseta = self.get_queryset().get(pk=pk)
        caseta.nombre = data.get('nombre', caseta.nombre)
        caseta.costo = data.get('costo', caseta.costo)
        caseta.save()
        
        lugar = caseta.lugar
        lugar.estado = data.get('lugar__estado', lugar.estado)
        lugar.nombre_id = data.get('lugar__nombre_id', lugar.nombre_id)
        lugar.save()

        serializer = self.serializer_class(caseta)
        return Response(serializer.data)


class RutasViewset(viewsets.ModelViewSet, GetQuerysetMixin):
    queryset = Ruta.objects.all()
    serializer_class = RutaSerializer


class LoginWithTeleviaView(views.APIView):
    
    def post(self, request):
        data = request.data
        if 'username' not in data or 'password' not in data:
            return Response({'message': 'Invalid data'}, status=status.HTTP_400_BAD_REQUEST)
        try:
            televia = TeleviaAPI()
            token = televia.login(data['username'], data['password'])
            return Response({'token': token}, status=status.HTTP_200_OK)
        
        except Exception as e:
            return Response({'message': str(e)}, status=status.HTTP_400_BAD_REQUEST)


class CrucesView(views.APIView):
    
    def get(self, request):
        params = parse_query_params(request.GET)
        start_dt = params.get('start_dt')
        end_dt = params.get('end_dt')
        unidad = params.get('tag')
        orden = params.get('orden')

        cruces_qs_params = {}
        orders_qs_params = {}
        if start_dt and end_dt:
            cruces_qs_params['fecha__gte'] = start_dt
            cruces_qs_params['fecha__lt'] = end_dt
            orders_qs_params['fecha_inicio__gte'] = start_dt
            orders_qs_params['fecha_inicio__lt'] = end_dt
        elif unidad:
            cruces_qs_params['unidad__tag'] = unidad
            orders_qs_params['unidad__tag'] = unidad
        elif orden:
            cruces_qs_params['orden__numero'] = orden
            orders_qs_params['numero'] = orden
        else:
            return Response({ "error": "Missing query parameters" }, status=status.HTTP_400_BAD_REQUEST)
        
        cruces = Cruce.objects.filter(**cruces_qs_params)
        serialized_cruces = CruceSerializer(cruces, many=True).data
        response_data = serialized_cruces
        
        if "group_by" in params:
            group_by = params.get("group_by")
            grouped_data = {}
            orders = Orden.objects.filter(**orders_qs_params)
            cruces_grouped = Cruce.get_costo_total(cruces, group_by=group_by)
            orders_grouped = Orden.get_costo_total_esperado(orders, group_by=group_by)
            for key in cruces_grouped:
                grouped_data[key] = {
                    group_by: key,
                    'costo_total': cruces_grouped[key]['costo_total'],
                    'costo_esperado': orders_grouped[key]['costo_esperado'],
                    'diferencia_total': cruces_grouped[key]['costo_total'] - orders_grouped[key]['costo_esperado'],
                    'cruces': cruces_grouped[key]['cruces'],
                }

            grouped_data = sorted(grouped_data.values(), key=lambda x: x[group_by])
            response_data = grouped_data

        return Response(response_data, status=status.HTTP_200_OK)


class CrucesByUnitView(views.APIView):
    def get(self, request):
        params = parse_query_params(request.GET)
        start_dt = params.get('start_dt')
        end_dt = params.get('end_dt')

        cruces = Cruce.objects.filter(fecha__gte=start_dt, fecha__lt=end_dt)
        grouped_units = {}
        for cruce in cruces:
            cruce.unidad.tag = cruce.unidad.tag if cruce.unidad.tag else 'Sin tag'
            if cruce.unidad.tag not in grouped_units:
                grouped_units[cruce.unidad.tag] = { 'costo_total': 0, 'cruces': 0, 'unidad': None }
            grouped_units[cruce.unidad.tag]['costo_total'] += cruce.costo
            grouped_units[cruce.unidad.tag]['unidad'] = cruce.unidad.numero
            grouped_units[cruce.unidad.tag]['cruces'] += 1

        # Agregar el costo esperado sacando las ordenes de la unidad
        for tag, grouped_unit in grouped_units.items():
            unidad = Unidad.objects.get(numero=grouped_unit['unidad'])
            ordenes = Orden.objects.filter(unidad=unidad, fecha_inicio__gte=start_dt, fecha_inicio__lt=end_dt)
            costo_esperado = functools.reduce(lambda x, y: x + y.costo_esperado, ordenes, 0)
            grouped_units[tag]['costo_esperado'] = costo_esperado
            grouped_units[tag]['diferencia'] = grouped_unit['costo_total'] - costo_esperado
            grouped_units[tag]['tag'] = tag

        grouped_units = sorted(grouped_units.values(), key=lambda x: x['costo_total'], reverse=True)
        return Response(grouped_units, status=status.HTTP_200_OK)
    

class CrucesByOrderView(views.APIView):
    def get(self, request):
        params = parse_query_params(request.GET)
        start_dt = params.get('start_dt')
        end_dt = params.get('end_dt')

        cruces = Cruce.objects.filter(fecha__gte=start_dt, fecha__lt=end_dt)
        grouped_orders = {}
        for cruce in cruces:
            if cruce.orden:
                orden = cruce.orden
                numero = cruce.orden.numero
            else:
                orden = None
                numero = 'Sin orden'
            if numero not in grouped_orders:
                grouped_orders[numero] = { 'costo_total': 0, 'cruces': 0, 'costo_esperado': 0, 'numero': None }
            grouped_orders[numero]['costo_total'] += cruce.costo
            grouped_orders[numero]['cruces'] += 1
            grouped_orders[numero]['costo_esperado'] += orden.costo_esperado if orden else 0
            grouped_orders[numero]['diferencia'] = grouped_orders[numero]['costo_total'] - grouped_orders[numero]['costo_esperado']
            grouped_orders[numero]['numero'] = numero

        grouped_orders = sorted(grouped_orders.values(), key=lambda x: x['costo_total'], reverse=True)
        return Response(grouped_orders, status=status.HTTP_200_OK)
    

class CrucesByCasetaView(views.APIView):
    def get(self, request):
        params = parse_query_params(request.GET)
        start_dt = params.get('start_dt')
        end_dt = params.get('end_dt')

        cruces = Cruce.objects.filter(fecha__gte=start_dt, fecha__lt=end_dt)
        grouped_casetas = {}
        for cruce in cruces:
            if cruce.caseta:
                caseta = cruce.caseta
                nombre = cruce.caseta.nombre
            else:
                caseta = None
                nombre = 'Sin caseta'
            if nombre not in grouped_casetas:
                grouped_casetas[nombre] = { 'costo_total': 0, 'cruces': 0, 'costo_esperado': 0, 'nombre': None }
            grouped_casetas[nombre]['costo_total'] += cruce.costo
            grouped_casetas[nombre]['cruces'] += 1
            grouped_casetas[nombre]['costo_esperado'] += caseta.costo if caseta else 0
            grouped_casetas[nombre]['diferencia'] = grouped_casetas[nombre]['costo_total'] - grouped_casetas[nombre]['costo_esperado']
            grouped_casetas[nombre]['nombre'] = nombre

        grouped_casetas = sorted(grouped_casetas.values(), key=lambda x: x['costo_total'], reverse=True)
        return Response(grouped_casetas, status=status.HTTP_200_OK)
    