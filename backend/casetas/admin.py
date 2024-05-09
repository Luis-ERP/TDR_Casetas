from django.contrib import admin
from casetas.models import Lugar, Caseta, Ruta, OrdenCaseta, Orden, UnidadTractor

# Register your models here.
@admin.register(Lugar)
class LugarAdmin(admin.ModelAdmin):
    list_display = ('nombre',)

@admin.register(Caseta)
class CasetaAdmin(admin.ModelAdmin):
    list_display = ('nombre', 'costo', 'lugar')

@admin.register(Ruta)
class RutaAdmin(admin.ModelAdmin):
    list_display = ('nombre', 'lugar_origen', 'lugar_destino', 'available')

@admin.register(OrdenCaseta)
class OrdenCasetaAdmin(admin.ModelAdmin):
    list_display = ('fecha', 'caseta', 'orden', 'unidad')

@admin.register(Orden)
class OrdenAdmin(admin.ModelAdmin):
    list_display = ('numero', 'fecha', 'fecha_inicio', 'fecha_fin', 'ruta', 'unidad')


@admin.register(UnidadTractor)
class UnidadTractorAdmin(admin.ModelAdmin):
    list_display = ('tag', 'numero')