from django.core.management.base import BaseCommand
from django.db import transaction
from casetas.models import Orden, Lugar, UnidadTractor
from datetime import datetime
import pandas as pd

class Command(BaseCommand):
    help = 'Import data from a CSV file into a Pandas DataFrame'

    def handle(self, *args, **options):
        csv_file = './casetas/static/ordenes_tdr.csv'
        df = pd.read_csv(csv_file)
        
        with transaction.atomic():
            for index, row in df.iterrows():
                lugar_origen = Lugar.objects.get_or_create(nombre=row['origin_cmp_name'], nombre_id=row['origin_cmp_id'])[0]
                lugar_destino = Lugar.objects.get_or_create(nombre=row['dest_cmp_name'], nombre_id=row['dest_cmp_id'])[0]
                fecha_inicio = datetime.strptime(row['origin_earliest'], '%d/%m/%Y %H:%M')
                fecha_fin = datetime.strptime(row['dest_latest'], '%d/%m/%Y %H:%M')
                numero = row['ord_number']

                # Unidad
                id_unidad = int(row['ord_tractor'])
                unidad = UnidadTractor.objects.get_or_create(numero=id_unidad)[0]

                orden = Orden.objects.get_or_create(
                    numero=numero,
                    fecha_inicio=fecha_inicio,
                    fecha_fin=fecha_fin,
                    lugar_origen=lugar_origen,
                    lugar_destino=lugar_destino,
                    unidad=unidad
                )
