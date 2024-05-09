from django.core.management.base import BaseCommand
from django.db import transaction
from casetas.models import Orden, Lugar, UnidadTractor, Caseta, OrdenCaseta
from datetime import datetime
import pandas as pd

class Command(BaseCommand):
    help = 'Import data from a CSV file into a Pandas DataFrame'

    def handle(self, *args, **options):
        json_file = './casetas/static/cobros_televia.json'
        df = pd.read_json(json_file)
        
        with transaction.atomic():
            for index, row in df.iterrows():
                fecha = datetime.strptime(row['fechIni'], '%d/%m/%Y %H:%M:%S')
                costo = float(row['monto'])
                unidad = UnidadTractor.objects.get_or_create(tag=row['viajesTag'])[0]
                caseta = Caseta.objects.filter(nombre=row['entrada']).first()
                if not caseta:
                    lugar = Lugar.objects.get_or_create(nombre=row['entrada'])[0]
                    caseta = Caseta.objects.create(
                        nombre=row['entrada'],
                        costo=costo,
                        lugar=lugar
                    )
                orden = Orden.objects.filter(unidad=unidad, fecha_inicio__lte=fecha, fecha_fin__gte=fecha).first()
                orden_caseta = OrdenCaseta.objects.get_or_create(
                    fecha=fecha,
                    caseta=caseta,
                    orden=orden,
                    unidad=unidad,
                    costo=costo
                )[0]

