import pandas as pd


df = pd.read_json('./casetas/static/cobros_televia.json')

print(df['entrada'].unique())