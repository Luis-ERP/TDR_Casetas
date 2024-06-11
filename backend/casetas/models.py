from django.db import models, transaction
from datetime import timedelta, datetime
import pandas as pd

# Create your models here.
class Lugar(models.Model):
    nombre = models.CharField(max_length=256, null=True, blank=True)
    estado = models.CharField(max_length=256, null=True, blank=True)
    nombre_id = models.CharField(max_length=256, null=True, blank=True)

    def __str__(self) -> str:
        return f'{self.nombre} ({self.id})'
    
    class Meta:
        default_related_name = 'lugares'
        verbose_name_plural = 'lugares'


class Caseta(models.Model):
    nombre = models.CharField(max_length=256)
    costo = models.FloatField()
    lugar = models.ForeignKey(Lugar, on_delete=models.CASCADE, null=True, blank=True)

    def __str__(self) -> str:
        return f'{str(self.lugar)} ${self.costo} ({self.id})'


class Ruta(models.Model):
    nombre = models.CharField(max_length=256)
    casetas = models.ManyToManyField(Caseta)
    lugar_origen = models.ForeignKey(Lugar, on_delete=models.CASCADE, related_name='lugar_origen')
    lugar_destino = models.ForeignKey(Lugar, on_delete=models.CASCADE, related_name='lugar_destino') 
    available = models.BooleanField(default=True)

    @property
    def costo_esperado(self):
        return sum([caseta.costo for caseta in self.casetas.all()])

    def __str__(self) -> str:
        return f'{self.nombre} ${self.costo_esperado} [{self.id}]'


class Unidad(models.Model):
    tag = models.CharField(max_length=64, null=True, blank=True)
    numero = models.IntegerField(null=True, blank=True)

    def __str__(self) -> str:
        return f'{self.tag} ({self.id})'
    
    class Meta:
        default_related_name = 'unidades'
        verbose_name_plural = 'unidades'


class Cruce(models.Model):
    ext_id = models.CharField(max_length=256, null=True, blank=True)
    fecha = models.DateTimeField()
    costo = models.FloatField(null=True, blank=True)
    caseta = models.ForeignKey(Caseta, on_delete=models.CASCADE)
    orden = models.ForeignKey('Orden', on_delete=models.CASCADE, null=True, blank=True)
    unidad = models.ForeignKey(Unidad, on_delete=models.CASCADE, null=True, blank=True)

    @property
    def costo_esperado(self):
        return self.caseta.costo
    
    @property
    def diferencia(self):
        return self.costo - self.costo_esperado
    
    @staticmethod
    def get_costo_total(cruce_qs, group_by='month'):
        grouped_data = {}

        if group_by == 'month':
            for i in range(1, 13):
                grouped_data[str(i).zfill(2)] = {'costo_total': 0, 'cruces': 0}
                def get_period_label(date):
                    return date.strftime('%m').zfill(2)
        elif group_by == 'day':
            for i in range(1, 32):
                grouped_data[str(i).zfill(2)] = {'costo_total': 0, 'cruces': 0}
                def get_period_label(date):
                    return date.strftime('%d').zfill(2)
        elif group_by == 'week':
            for i in range(1, 53):
                grouped_data[str(i).zfill(2)] = {'costo_total': 0, 'cruces': 0}
                def get_period_label(date):
                    return date.strftime('%V').zfill(2)

        for cruce in cruce_qs:
            date = cruce.fecha
            period = get_period_label(date)
            grouped_data[period]['costo_total'] += cruce.costo
            grouped_data[period]['cruces'] = grouped_data[period].get('cruces', 0) + 1

        return grouped_data

    def __str__(self) -> str:
        return f'{self.caseta} - {self.orden} ({self.id})'
    
    class Meta:
        default_related_name = 'cruces'
        verbose_name_plural = 'cruces'


class Orden(models.Model):
    numero = models.CharField(max_length=256)
    fecha = models.DateTimeField(null=True, blank=True)
    fecha_inicio = models.DateTimeField()
    fecha_fin = models.DateTimeField()
    ruta = models.ForeignKey(Ruta, on_delete=models.CASCADE, null=True, blank=True)
    lugar_destino = models.ForeignKey(Lugar, on_delete=models.CASCADE, related_name='lugar_destino_orden', null=True, blank=True)
    lugar_origen = models.ForeignKey(Lugar, on_delete=models.CASCADE, related_name='lugar_origen_orden', null=True, blank=True)
    unidad = models.ForeignKey(Unidad, on_delete=models.CASCADE, null=True, blank=True)

    @property
    def get_cruces(self):
        return self.cruces.all()
    
    @property
    def cruces_esperados(self):
        return self.ruta.casetas.all()
    
    @property
    def costo_total(self):
        cruces = self.get_cruces
        return sum([cruce.costo for cruce in cruces])
    
    @property
    def costo_esperado(self):
        return sum([cruce.costo for cruce in self.cruces_esperados.all()])

    @property
    def diferencia(self):
        return self.costo_total - self.costo_esperado
    
    @staticmethod
    def get_costo_total_esperado(orden_qs, group_by='month'):
        grouped_data = {}

        if group_by == 'month':
            for i in range(1, 13):
                grouped_data[str(i).zfill(2)] = {'costo_esperado': 0}
                def get_period_label(date):
                    return date.strftime('%m').zfill(2)
        elif group_by == 'day':
            for i in range(1, 32):
                grouped_data[str(i).zfill(2)] = {'costo_esperado': 0}
                def get_period_label(date):
                    return date.strftime('%d').zfill(2)
        elif group_by == 'week':
            for i in range(1, 53):
                grouped_data[str(i).zfill(2)] = {'costo_esperado': 0}
                def get_period_label(date):
                    return date.strftime('%V').zfill(2)

        for order in orden_qs:
            date = order.fecha_inicio
            period = get_period_label(date)
            grouped_data[period]['costo_esperado'] += order.costo_esperado

        return grouped_data

    def __str__(self) -> str:
        return f'{self.numero} ({self.id})'
    
    class Meta:
        default_related_name = 'ordenes'
        verbose_name_plural = 'ordenes'
