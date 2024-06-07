from django.core.management.base import BaseCommand
from django.db import transaction
from casetas.models import Orden, Lugar, Unidad, Ruta, Cruce
from datetime import datetime, timedelta
import pandas as pd

class Command(BaseCommand):
    help = 'Import data from a CSV file into a Pandas DataFrame'

    def handle(self, *args, **options):
        csv_file = './casetas/static/ordenes_tdr.csv'
        df = pd.read_csv(csv_file)
        
        with transaction.atomic():
            for index, row in df.iterrows():
                lugar_origen, created = Lugar.objects.get_or_create(nombre=row['origin_cmp_name'])
                lugar_destino, created = Lugar.objects.get_or_create(nombre=row['dest_cmp_name'])
                ruta = Ruta.objects.filter(
                    lugar_origen=lugar_origen,
                    lugar_destino=lugar_destino
                ).first()
                numero = row['ord_number']

                # Unidad
                id_unidad = int(row['ord_tractor'])
                unidad = Unidad.objects.filter(numero=id_unidad).first()
                if not unidad:
                    unidad = Unidad.objects.create(numero=id_unidad)

                fecha_inicio = datetime.strptime(row['origin_earliest'], '%m/%d/%Y %H:%M')
                fecha_fin = datetime.strptime(row['dest_latest'], '%m/%d/%Y %H:%M')

                orden, created = Orden.objects.get_or_create(
                    numero=numero,
                    fecha_inicio=fecha_inicio,
                    fecha_fin=fecha_fin,
                    lugar_origen=lugar_origen,
                    lugar_destino=lugar_destino,
                    unidad=unidad,
                    ruta=ruta
                )

                # Buscar y asociar cruces de casetas
                fecha_inicio = orden.fecha_inicio - timedelta(hours=10)
                fecha_fin = orden.fecha_fin + timedelta(hours=10)
                cruces = Cruce.objects.filter(
                    fecha__range=(fecha_inicio, fecha_fin),
                    unidad=unidad
                )
                cruces.update(orden=orden)
