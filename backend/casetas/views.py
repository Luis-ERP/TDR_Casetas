from rest_framework import viewsets, views, status
from rest_framework.response import Response
from django.db import models
from django.db.models import Q
import functools
from casetas.models import (Orden, 
                            UnidadTractor, 
                            Ruta,
                            Caseta,
                            OrdenCaseta)
from casetas.serializers import (OrdenSerializer, 
                                UnidadTractorSerializer, 
                                CasetaSerializer,
                                RutaSerializer,
                                OrdenCasetaSerializer)
from casetas.utils import parse_query_params
from casetas.client.televia import TeleviaAPI
from datetime import datetime


class OrderViewset(viewsets.ModelViewSet):
    queryset = Orden.objects.all()
    serializer_class = OrdenSerializer


    def retrieve(self, request, pk=None):
        qs = self.get_queryset().get(numero=pk)
        serializer = self.serializer_class(qs)
        return Response(serializer.data)
    

class UnitViewset(viewsets.ModelViewSet):
    queryset = UnidadTractor.objects.all()
    serializer_class = UnidadTractorSerializer

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
    

class CasetaViewset(viewsets.ModelViewSet):
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


class RutasViewset(viewsets.ModelViewSet):
    queryset = Ruta.objects.all()
    serializer_class = RutaSerializer


class LoginWithTeleviaView(views.APIView):
    
    def post(self, request):
        data = request.data
        if 'username' not in data or 'password' not in data:
            return Response({'message': 'Invalid data'}, status=status.HTTP_400_BAD_REQUEST)
        
        # televia = TeleviaAPI()
        # televia.login(data['username'], data['password'])
        # try:
        # except Exception as e:
        # return Response({'message': str(e)}, status=status.HTTP_400_BAD_REQUEST)

        return Response({'message': 'Login with televia successful'}, status=status.HTTP_200_OK)


class CrucesView(views.APIView):
    
    def get(self, request):
        params = parse_query_params(request.GET)
        start_dt = params.get('start_dt')
        end_dt = params.get('end_dt')
        unidad = params.get('tag')
        orden = params.get('orden')

        qs_params = {}
        if start_dt and end_dt:
            qs_params['fecha__gte'] = start_dt
            qs_params['fecha__lt'] = end_dt
        elif unidad:
            qs_params['unidad__tag'] = unidad
        elif orden:
            qs_params['orden__numero'] = orden
        else:
            return Response({ "error": "Missing query parameters" }, status=status.HTTP_400_BAD_REQUEST)
        
        cruces = OrdenCaseta.objects.filter(**qs_params)
        serialized_cruces = OrdenCasetaSerializer(cruces, many=True).data
        response_data = serialized_cruces

        if "group_by" in params:
            group_by = params.get("group_by")
            if group_by == "month":
                grouped_data = {}
                for cruce in serialized_cruces:
                    date = datetime.fromisoformat(cruce['fecha'].replace('Z', ''))
                    month = date.strftime('%m')
                    if month not in grouped_data:
                        grouped_data[month] = { 'costo_total': 0, 'cruces': [] }
                    grouped_data[month]['costo_total'] += cruce['costo']
                    grouped_data[month]['cruces'].append(cruce)

                # Fill the missing months with costo_total=0 and cruces=0
                for month in range(1, 13):
                    month_str = str(month).zfill(2)
                    if month_str not in grouped_data:
                        grouped_data[month_str] = { 'costo_total': 0, 'cruces': [] }

                grouped_data = dict(sorted(grouped_data.items(), key=lambda item: item[0]))
                grouped_data = [{'month': key, 'costo_total': value['costo_total'], 'cruces': value['cruces']} for key, value in grouped_data.items()]
                response_data = grouped_data

            elif group_by == "week":
                grouped_data = {}
                for cruce in serialized_cruces:
                    date = datetime.fromisoformat(cruce['fecha'].replace('Z', ''))
                    week = date.strftime('%V')
                    if week not in grouped_data:
                        grouped_data[week] = { 'costo_total': 0, 'cruces': [] }
                    grouped_data[week]['costo_total'] += cruce['costo']
                    grouped_data[week]['cruces'].append(cruce)

                # Fill the missing weeks with costo_total=0 and cruces=0
                for week in range(1, 53):
                    week_str = str(week).zfill(2)
                    if week_str not in grouped_data:
                        grouped_data[week_str] = { 'costo_total': 0, 'cruces': [] }
                
                grouped_data = dict(sorted(grouped_data.items(), key=lambda item: item[0]))
                grouped_data = [{'week': key, 'costo_total': value['costo_total'], 'cruces': value['cruces']} for key, value in grouped_data.items()]
                response_data = grouped_data

        return Response(response_data, status=status.HTTP_200_OK)


class CrucesByUnitView(views.APIView):
    def get(self, request):
        params = parse_query_params(request.GET)
        start_dt = params.get('start_dt')
        end_dt = params.get('end_dt')

        cruces = OrdenCaseta.objects.filter(fecha__gte=start_dt, fecha__lt=end_dt)
        grouped_units = {}
        for cruce in cruces:
            cruce.unidad.tag = cruce.unidad.tag if cruce.unidad.tag else 'Sin tag'
            if cruce.unidad.tag not in grouped_units:
                grouped_units[cruce.unidad.tag] = { 'costo_total': 0, 'cruces': [], 'unidad': None }
            grouped_units[cruce.unidad.tag]['costo_total'] += cruce.costo
            grouped_units[cruce.unidad.tag]['unidad'] = cruce.unidad.numero
            grouped_units[cruce.unidad.tag]['cruces'].append(OrdenCasetaSerializer(cruce).data)

        grouped_units = [{'tag': key, 'costo_total': value['costo_total'], 'cruces': value['cruces'], 'unidad': value['unidad']} for key, value in grouped_units.items()]
        grouped_units = sorted(grouped_units, key=lambda x: x['costo_total'], reverse=True)
        return Response(grouped_units, status=status.HTTP_200_OK)
    

class CrucesByOrderView(views.APIView):
    def get(self, request):
        params = parse_query_params(request.GET)
        start_dt = params.get('start_dt')
        end_dt = params.get('end_dt')

        cruces = OrdenCaseta.objects.filter(fecha__gte=start_dt, fecha__lt=end_dt)
        grouped_orders = {}
        for cruce in cruces:
            if cruce.orden:
                numero = cruce.orden.numero
            else:
                numero = 'Sin orden'
            if numero not in grouped_orders:
                grouped_orders[numero] = { 'costo_total': 0, 'cruces': []}
            grouped_orders[numero]['costo_total'] += cruce.costo
            grouped_orders[numero]['cruces'].append(OrdenCasetaSerializer(cruce).data)

        grouped_orders = [{'numero': key, 'costo_total': value['costo_total'], 'cruces': value['cruces']} for key, value in grouped_orders.items()]
        grouped_orders = sorted(grouped_orders, key=lambda x: x['costo_total'], reverse=True)
        return Response(grouped_orders, status=status.HTTP_200_OK)
    

class CrucesByCasetaView(views.APIView):
    def get(self, request):
        params = parse_query_params(request.GET)
        start_dt = params.get('start_dt')
        end_dt = params.get('end_dt')

        cruces = OrdenCaseta.objects.filter(fecha__gte=start_dt, fecha__lt=end_dt)
        grouped_casetas = {}
        for cruce in cruces:
            if cruce.caseta:
                nombre = cruce.caseta.nombre
            else:
                nombre = 'Sin caseta'
            if nombre not in grouped_casetas:
                grouped_casetas[nombre] = { 'costo_total': 0, 'cruces': []}
            grouped_casetas[nombre]['costo_total'] += cruce.costo
            grouped_casetas[nombre]['cruces'].append(OrdenCasetaSerializer(cruce).data)

        grouped_casetas = [{'nombre': key, 'costo_total': value['costo_total'], 'cruces': value['cruces']} for key, value in grouped_casetas.items()]
        grouped_casetas = sorted(grouped_casetas, key=lambda x: x['costo_total'], reverse=True)
        return Response(grouped_casetas, status=status.HTTP_200_OK)
    