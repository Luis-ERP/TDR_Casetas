from django.db import models

# Create your models here.
class Lugar(models.Model):
    nombre = models.CharField(max_length=256)


class Caseta(models.Model):
    nombre = models.CharField(max_length=256)
    costo = models.FloatField()
    lugar = models.ForeignKey(Lugar, on_delete=models.CASCADE)


class Ruta(models.Model):
    nombre = models.CharField(max_length=256)
    casetas = models.ManyToManyField(Caseta)
    lugar_origen = models.ForeignKey(Lugar, on_delete=models.CASCADE, related_name='lugar_origen')
    lugar_destino = models.ForeignKey(Lugar, on_delete=models.CASCADE, related_name='lugar_destino') 
    available = models.BooleanField(default=True)


class OrdenCaseta(models.Model):
    fecha = models.DateTimeField()
    caseta = models.ForeignKey(Caseta, on_delete=models.CASCADE)
    orden = models.ForeignKey('Orden', on_delete=models.CASCADE)
    tag = models.CharField(max_length=64)


class Orden(models.Model):
    fecha = models.DateTimeField()
    fecha_inicio = models.DateTimeField()
    fecha_fin = models.DateTimeField()
    ruta = models.ForeignKey(Ruta, on_delete=models.CASCADE)
