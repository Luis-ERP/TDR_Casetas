from rest_framework import serializers
from casetas.models import Lugar, Caseta, Ruta, Cruce, Orden, Unidad

class LugarSerializer(serializers.ModelSerializer):
    class Meta:
        model = Lugar
        fields = '__all__'


class CasetaSerializer(serializers.ModelSerializer):
    lugar = LugarSerializer()
    
    class Meta:
        model = Caseta
        fields = '__all__'



class RutaSerializer(serializers.ModelSerializer):
    lugar_origen = LugarSerializer()
    lugar_destino = LugarSerializer()
    casetas = CasetaSerializer(many=True)
    
    class Meta:
        model = Ruta
        fields = '__all__'


class CruceSerializer(serializers.ModelSerializer):
    caseta = CasetaSerializer()
    
    class Meta:
        model = Cruce
        fields = '__all__'

    def to_representation(self, instance, *args, **kwargs):
        data = super(CruceSerializer, self).to_representation(instance, *args, **kwargs)
        data['diferencia'] = instance.diferencia
        data['costo_esperado'] = instance.costo_esperado
        data['fecha'] = instance.fecha.strftime('%Y-%m-%dT%H:%M:%S')
        return data


class UnidadSerializer(serializers.ModelSerializer):
    class Meta:
        model = Unidad
        fields = '__all__'
        
    def to_representation(self, instance):
        response = super().to_representation(instance)
        if self.context.get('start_dt') and self.context.get('end_dt'):
            start_dt = self.context.get('start_dt')
            end_dt = self.context.get('end_dt')
            ordenes = instance.ordenes.filter(fecha_inicio__range=[start_dt, end_dt]).count()
            response['ordenes'] = ordenes
            cruces = instance.cruces.filter(fecha__range=[start_dt, end_dt]).count()
            response['cruces'] = cruces
            costo_total = sum([cruce.costo for cruce in instance.cruces.filter(fecha__range=[start_dt, end_dt])])
            response['costo_total'] = costo_total

        return response


class OrdenSerializer(serializers.ModelSerializer):
    unidad = UnidadSerializer()
    lugar_destino = LugarSerializer()
    lugar_origen = LugarSerializer()
    ruta = RutaSerializer()
    
    class Meta:
        model = Orden
        fields = '__all__'

    def to_representation(self, instance):
        response = super().to_representation(instance)
        response['costo_total'] = instance.costo_total
        response['costo_esperado'] = instance.costo_esperado
        response['diferencia'] = instance.diferencia
        response['fecha_inicio'] = instance.fecha_inicio.strftime('%Y-%m-%dT%H:%M:%S')
        response['fecha_fin'] = instance.fecha_fin.strftime('%Y-%m-%dT%H:%M:%S')
        response['fecha'] = instance.fecha.strftime('%Y-%m-%dT%H:%M:%S')
        return response
