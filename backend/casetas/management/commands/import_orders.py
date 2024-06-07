from django.core.management.base import BaseCommand
from django.db import transaction
from casetas.models import Orden, Lugar, Unidad, Ruta, Cruce
from datetime import datetime
import pandas as pd


class Command(BaseCommand):
    help = 'Import data from a CSV file into a Pandas DataFrame'

    def handle(self, *args, **options):
        csv_file = './casetas/static/ordenes_tdr.csv'
        df = pd.read_csv(csv_file)
        
        with transaction.atomic():
            for index, row in df.iterrows():
                numero = row['ord_number']
                orden = Orden.objects.filter(numero=numero).first()
                if orden:
                    continue

                lugar_origen, created = Lugar.objects.get_or_create(nombre=row['origin_cmp_name'])
                lugar_destino, created = Lugar.objects.get_or_create(nombre=row['dest_cmp_name'])
                ruta = Ruta.objects.filter(
                    lugar_origen=lugar_origen,
                    lugar_destino=lugar_destino
                ).first()

                # Unidad
                id_unidad = int(row['ord_tractor'])
                unidad = Unidad.objects.filter(numero=id_unidad).first()
                if not unidad:
                    unidad = Unidad.objects.create(numero=id_unidad)

                fecha  = datetime.strptime(row['ord_date'], '%m/%d/%Y %H:%M:%S')
                fecha_inicio = fecha
                fecha_inicio = fecha_inicio.replace(hour=0, minute=0, second=0, microsecond=0)
                fecha_fin = fecha
                fecha_fin = fecha_fin.replace(hour=23, minute=59, second=59, microsecond=999999)

                orden, created = Orden.objects.get_or_create(
                    numero=numero,
                    fecha=fecha,
                    fecha_inicio=fecha_inicio,
                    fecha_fin=fecha_fin,
                    lugar_origen=lugar_origen,
                    lugar_destino=lugar_destino,
                    unidad=unidad,
                    ruta=ruta
                )

                # Buscar y asociar cruces de casetas
                cruces = Cruce.objects.filter(
                    fecha__gte=fecha_inicio,
                    fecha__lte=fecha_fin,
                    unidad=unidad,
                    orden__isnull=True
                )
                self.stdout.write(f'Orden {orden} - {cruces.count()} cruces')
                cruces.update(orden=orden)
