from django.core.management.base import BaseCommand
from django.db import transaction
from casetas.models import Caseta, Lugar, Ruta
import pandas as pd

class Command(BaseCommand):
    help = 'Import data from a CSV file into a Pandas DataFrame'

    def handle(self, *args, **options):
        csv_file = './casetas/static/rutas.csv'
        df = pd.read_csv(csv_file)
        
        with transaction.atomic():
            for index, row in df.iterrows():
                # Caseta
                caseta_raw = row['CASETA'].upper()
                nombre = row['CASETA']

                # Lugar
                nombre_lugar = caseta_raw.replace('CASETA ', '').replace(' - MULTITAG', '')
                lugar = Lugar.objects.filter(nombre=nombre_lugar).first()
                if not lugar:
                    lugar = Lugar.objects.create(nombre=nombre_lugar)
                
                cost = float(row['COSTO'].replace('$', '').replace(',', ''))

                caseta = Caseta.objects.get_or_create(
                    nombre=nombre,
                    costo=cost,
                    lugar=lugar
                )[0]

                # Ruta
                lugar_origen = Lugar.objects.get_or_create(nombre=row['ORIGEN'])[0]
                lugar_destino = Lugar.objects.get_or_create(nombre=row['DESTINO'])[0]
                nombre = lugar_origen.nombre + ' - ' + lugar_destino.nombre
                ruta = Ruta.objects.get_or_create(
                    nombre=nombre,
                    lugar_origen=lugar_origen,
                    lugar_destino=lugar_destino
                )[0]
                ruta.casetas.add(caseta)