from django.db import models
from django.db.models import Q
from casetas.utils import parse_query_params
import functools

class GetQuerysetMixin:
    
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
        
        if self.default_ordering:
            qs = qs.order_by(*self.default_ordering)
        else:
            qs.order_by('-id')
        return qs
   