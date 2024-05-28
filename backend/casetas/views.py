from rest_framework import viewsets, views, status
from rest_framework.response import Response
from django.db import models
from django.db.models import Q
import functools
from casetas.models import Orden, UnidadTractor
from casetas.serializers import OrdenSerializer, UnidadTractorSerializer
from casetas.utils import parse_query_params
from casetas.client.televia import TeleviaAPI


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
            queryset = queryset.filter(ordenes__fecha_inicio__range=[start_dt, end_dt])
        queryset = queryset.prefetch_related('ordenes', 'cruces')
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
