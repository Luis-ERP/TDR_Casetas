from django.db import models

# Create your models here.
class Lugar(models.Model):
    nombre = models.CharField(max_length=256, null=True, blank=True)
    nombre_id = models.CharField(max_length=256, null=True, blank=True)

    def __str__(self) -> str:
        return f'{self.nombre} ({self.id})'


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

    def get_total_cost(self):
        return sum([caseta.costo for caseta in self.casetas.all()])

    def __str__(self) -> str:
        return f'{self.nombre} ${self.get_total_cost()} [{self.id}]'


class UnidadTractor(models.Model):
    tag = models.CharField(max_length=64, null=True, blank=True)
    numero = models.IntegerField(null=True, blank=True)

    def __str__(self) -> str:
        return f'{self.tag} ({self.id})'


class OrdenCaseta(models.Model):
    fecha = models.DateTimeField()
    costo = models.FloatField(null=True, blank=True)
    caseta = models.ForeignKey(Caseta, on_delete=models.CASCADE)
    orden = models.ForeignKey('Orden', on_delete=models.CASCADE, null=True, blank=True)
    unidad = models.ForeignKey(UnidadTractor, on_delete=models.CASCADE, null=True, blank=True)

    def __str__(self) -> str:
        return f'{self.caseta} - {self.orden} ({self.id})'


class Orden(models.Model):
    numero = models.CharField(max_length=256)
    fecha = models.DateTimeField(null=True, blank=True)
    fecha_inicio = models.DateTimeField()
    fecha_fin = models.DateTimeField()
    ruta = models.ForeignKey(Ruta, on_delete=models.CASCADE, null=True, blank=True)
    lugar_destino = models.ForeignKey(Lugar, on_delete=models.CASCADE, related_name='lugar_destino_orden', null=True, blank=True)
    lugar_origen = models.ForeignKey(Lugar, on_delete=models.CASCADE, related_name='lugar_origen_orden', null=True, blank=True)
    unidad = models.ForeignKey(UnidadTractor, on_delete=models.CASCADE, null=True, blank=True)

    def __str__(self) -> str:
        return f'{self.numero} ({self.id})'
