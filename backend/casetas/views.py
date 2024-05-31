from rest_framework import viewsets, views, status
from rest_framework.response import Response
from django.db import models
from django.db.models import Q
import functools
from casetas.models import (Orden, 
                            UnidadTractor, 
                            OrdenCaseta)
from casetas.serializers import (OrdenSerializer, 
                                UnidadTractorSerializer, 
                                OrdenCasetaSerializer)
from casetas.utils import parse_query_params
from casetas.client.televia import TeleviaAPI
from datetime import datetime


class OrderViewset(viewsets.ModelViewSet):
    queryset = Orden.objects.all()
    serializer_class = OrdenSerializer

    def get_queryset(self):
        params = parse_query_params(self.request.GET)
        fields = [f.name.split('__')[0] for f in self.queryset.model._meta.get_fields()]

        exclude_fields = {}
        for param_key, param_val in params.copy().items():
            if 'exclude__' in param_key:
                exclude_fields[param_key] = param_val
                params.pop(param_key)

        # Filter all the query params that are invalid for the model orm
        query_params = {}
        for param in params.copy().keys():
            param_key = param.split('__')[0]
            matching_keys = [True if field == param_key else False for field in fields]
            matched_any = functools.reduce(lambda prev, next: prev or next, matching_keys, False)
            if matched_any:
                query_params[param] = params[param]

        # Filter search param
        char_field_names = [field.name for field in self.queryset.model._meta.fields 
                            if isinstance(field, models.CharField)]
        query_params_list = []
        search_string = params.get('search')
        if search_string:
            for field in char_field_names:
                query_key = f'{field}__icontains'
                query_params_list.append({query_key: search_string})
        
        # Combine Q objects using the OR operator
        combined_q = []
        if query_params_list:
            q_objects = [Q(**qp) for qp in query_params_list]
            combined_q = q_objects.pop()
            for q in q_objects:
                combined_q |= q

        if combined_q:
            qs = self.queryset.filter(combined_q, **query_params)
        else:
            qs = self.queryset.filter(**query_params)
        
        return qs.order_by('-id')
    

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

        cruces = OrdenCaseta.objects.filter(fecha__gte=start_dt, fecha__lt=end_dt)
        serialized_cruces = OrdenCasetaSerializer(cruces, many=True).data

        if "group_by" in params:
            group_by = params.get("group_by")
            if group_by == "month":
                grouped_data = {}
                for cruce in serialized_cruces:
                    date = datetime.fromisoformat(cruce['fecha'].replace('Z', ''))
                    month = date.strftime('%m')
                    if month not in grouped_data:
                        grouped_data[month] = { 'total_cost': 0, 'cruces': [] }
                    grouped_data[month]['total_cost'] += cruce['costo']
                    grouped_data[month]['cruces'].append(cruce)

                # Fill the missing months with total_cost=0 and cruces=0
                for month in range(1, 13):
                    month_str = str(month).zfill(2)
                    if month_str not in grouped_data:
                        grouped_data[month_str] = { 'total_cost': 0, 'cruces': [] }

                grouped_data = dict(sorted(grouped_data.items(), key=lambda item: item[0]))
                grouped_data = [{'month': key, 'total_cost': value['total_cost'], 'cruces': value['cruces']} for key, value in grouped_data.items()]

            elif group_by == "week":
                grouped_data = {}
                for cruce in serialized_cruces:
                    date = datetime.fromisoformat(cruce['fecha'].replace('Z', ''))
                    week = date.strftime('%V')
                    if week not in grouped_data:
                        grouped_data[week] = { 'total_cost': 0, 'cruces': [] }
                    grouped_data[week]['total_cost'] += cruce['costo']
                    grouped_data[week]['cruces'].append(cruce)

                # Fill the missing weeks with total_cost=0 and cruces=0
                for week in range(1, 53):
                    week_str = str(week).zfill(2)
                    if week_str not in grouped_data:
                        grouped_data[week_str] = { 'total_cost': 0, 'cruces': [] }
                
                grouped_data = dict(sorted(grouped_data.items(), key=lambda item: item[0]))
                grouped_data = [{'week': key, 'total_cost': value['total_cost'], 'cruces': value['cruces']} for key, value in grouped_data.items()]

        return Response(grouped_data, status=status.HTTP_200_OK)


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
                grouped_units[cruce.unidad.tag] = { 'total_cost': 0, 'cruces': [], 'unidad': None }
            grouped_units[cruce.unidad.tag]['total_cost'] += cruce.costo
            grouped_units[cruce.unidad.tag]['unidad'] = cruce.unidad.numero
            grouped_units[cruce.unidad.tag]['cruces'].append(OrdenCasetaSerializer(cruce).data)

        grouped_units = [{'tag': key, 'total_cost': value['total_cost'], 'cruces': value['cruces'], 'unidad': value['unidad']} for key, value in grouped_units.items()]
        grouped_units = sorted(grouped_units, key=lambda x: x['total_cost'], reverse=True)
        return Response(grouped_units, status=status.HTTP_200_OK)
    