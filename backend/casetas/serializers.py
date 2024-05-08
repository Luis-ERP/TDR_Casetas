from rest_framework import serializers
from .models import Lugar, Caseta, Ruta, OrdenCaseta, Orden

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
