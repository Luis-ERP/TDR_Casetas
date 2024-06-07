from django.contrib import admin
from casetas.models import Lugar, Caseta, Ruta, Cruce, Orden, Unidad

# Register your models here.
@admin.register(Lugar)
class LugarAdmin(admin.ModelAdmin):
    list_display = ('nombre', 'nombre_id')

@admin.register(Caseta)
class CasetaAdmin(admin.ModelAdmin):
    list_display = ('nombre', 'costo', 'lugar')
    search_fields = ('nombre', 'lugar__nombre')

@admin.register(Ruta)
class RutaAdmin(admin.ModelAdmin):
    list_display = ('nombre', 'lugar_origen', 'lugar_destino', 'available')

@admin.register(Cruce)
class OrdenCasetaAdmin(admin.ModelAdmin):
    list_display = ('fecha', 'caseta', 'orden', 'unidad', 'costo')
    search_fields = ('caseta__nombre', 'orden__numero')

@admin.register(Orden)
class OrdenAdmin(admin.ModelAdmin):
    list_display = ('numero', 'fecha', 'fecha_inicio', 'fecha_fin', 'ruta', 'unidad')
    search_fields = ('numero', 'ruta__nombre', 'unidad__tag')


@admin.register(Unidad)
class UnidadTractorAdmin(admin.ModelAdmin):
    list_display = ('tag', 'numero')
    list_filter = ('numero','tag')