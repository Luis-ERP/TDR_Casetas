from django.core.management.base import BaseCommand
from django.db import transaction
from casetas.models import Unidad
import pandas as pd

class Command(BaseCommand):
    help = 'Import data from a CSV file into a Pandas DataFrame'

    def handle(self, *args, **options):
        csv_file = './casetas/static/unidades.csv'
        df = pd.read_csv(csv_file)
        
        with transaction.atomic():
            for index, row in df.iterrows():
                numero = row['Unidad']
                tag = row['Tag']

                unidad = Unidad.objects.filter(numero=numero).first()
                if not unidad:
                    unidad = Unidad.objects.create(tag=tag)

                else:
                    unidad = Unidad.objects.create(tag=tag)

                unidad.numero = numero
                unidad.tag = tag
                unidad.save()

