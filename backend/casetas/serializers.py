from rest_framework import serializers
from .models import Lugar, Caseta, Ruta, OrdenCaseta, Orden, UnidadTractor

class LugarSerializer(serializers.ModelSerializer):
    class Meta:
        model = Lugar
        fields = '__all__'

class CasetaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Caseta
        fields = '__all__'

class RutaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Ruta
        fields = '__all__'

class OrdenCasetaSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrdenCaseta
        fields = '__all__'

class OrdenSerializer(serializers.ModelSerializer):
    class Meta:
        model = Orden
        fields = '__all__'

    def to_representation(self, instance):
        response = super().to_representation(instance)
        cruces = instance.cruces.all()
        response['cruces'] = cruces.count()
        total_cost = sum([cruce.costo for cruce in cruces])
        response['total_cost'] = total_cost
        return response


class UnidadTractorSerializer(serializers.ModelSerializer):
    class Meta:
        model = UnidadTractor
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
            total_cost = sum([cruce.costo for cruce in instance.cruces.filter(fecha__range=[start_dt, end_dt])])
            response['total_cost'] = total_cost

        return response