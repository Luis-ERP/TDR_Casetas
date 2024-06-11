from django.core.management.base import BaseCommand
from casetas.models import Orden
import pandas as pd


class Command(BaseCommand):
    help = 'Import data from a CSV file into a Pandas DataFrame'

    def handle(self, *args, **options):
        csv_file = './casetas/static/ordenes_tdr.csv'
        df = pd.read_csv(csv_file)
        try:
            Orden.import_from_raw_data(df)
        except Exception as e:
            self.stderr.write(self.style.ERROR(f'Error importing data: {e}'))