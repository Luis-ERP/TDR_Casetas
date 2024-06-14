from django.core.management.base import BaseCommand
from casetas.models import Cruce
import pandas as pd


class Command(BaseCommand):
    help = 'Import data from a CSV file into a Pandas DataFrame'

    def handle(self, *args, **options):
        csv_file_path = 'casetas/static/televia_data.csv'
        try:
            df = pd.read_csv(csv_file_path)
            Cruce.import_from_raw_data(df)
        except FileNotFoundError:
            self.stdout.write(self.style.ERROR('File not found %s' % csv_file_path))
            return
