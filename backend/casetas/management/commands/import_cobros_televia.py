from django.core.management.base import BaseCommand
from django.db import transaction
from casetas.models import Orden, Lugar, Unidad, Caseta, Cruce
from datetime import datetime
import pandas as pd


class Command(BaseCommand):
    help = 'Import data from a CSV file into a Pandas DataFrame'

    def handle(self, *args, **options):
        csv_file_path = 'casetas/static/televia_data.csv'
        try:
            df = pd.read_csv(csv_file_path)
        except FileNotFoundError:
            print('File "televia_data.csv" not found in casetas/static/ folder.')
            return
        new_cruces = []
        with transaction.atomic():
            for index, row in df.iterrows():
                ext_id = row['idViaje']
                cruce = Cruce.objects.filter(ext_id=ext_id).first()
                if cruce:
                    continue

                caseta = Caseta.objects.filter(nombre=row['entrada']).first()
                costo = float(row['monto'])
                if not caseta:
                    lugar, created = Lugar.objects.get_or_create(nombre=row['entrada'])
                    caseta = Caseta.objects.create(nombre=row['entrada'], costo=costo, lugar=lugar)

                unidad = Unidad.objects.filter(tag=row['viajesTag']).first()
                if not unidad:
                    unidad = Unidad.objects.create(tag=row['viajesTag'])

                fecha = datetime.strptime(row['fechIni'], '%d/%m/%Y %H:%M:%S')
                orden = Orden.objects.filter(unidad=unidad, 
                                             fecha_inicio__lte=fecha,
                                             fecha_fin__gte=fecha).first()
                cruce = Cruce.objects.create(fecha=fecha, 
                                             ext_id=ext_id,
                                             costo=costo, 
                                             caseta=caseta, 
                                             orden=orden, 
                                             unidad=unidad)
                new_cruces.append(cruce)

