from django.core.management.base import BaseCommand
from django.db import transaction
from casetas.models import Orden, Lugar, UnidadTractor, Caseta, OrdenCaseta
from datetime import datetime, timedelta
import pandas as pd

class Command(BaseCommand):
    help = 'Import data from a CSV file into a Pandas DataFrame'

    def handle(self, *args, **options):
        csv_file_path = 'televia_data.csv'
        try:
            df = pd.read_csv(csv_file_path)
        except FileNotFoundError:
            print('File "televia_data.csv" not found in root folder.')
            return
        new_cruces = []
        with transaction.atomic():
            for index, row in df.iterrows():
                caseta = Caseta.objects.filter(nombre=row['entrada']).first()
                costo = float(row['monto'])
                if not caseta:
                    lugar, created = Lugar.objects.get_or_create(nombre=row['entrada'])
                    caseta = Caseta.objects.create(nombre=row['entrada'], costo=costo, lugar=lugar)

                unidad = UnidadTractor.objects.filter(tag=row['viajesTag']).first()
                if not unidad:
                    unidad = UnidadTractor.objects.create(tag=row['viajesTag'])

                fecha = datetime.strptime(row['fechIni'], '%d/%m/%Y %H:%M:%S')
                orden = Orden.objects.filter(unidad=unidad, fecha__range=(fecha - timedelta(days=1), fecha + timedelta(days=1))).first()
                cruce = OrdenCaseta.objects.create(fecha=fecha, costo=costo, caseta=caseta, orden=orden, unidad=unidad)
                new_cruces.append(cruce)

