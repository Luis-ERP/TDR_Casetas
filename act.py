"""
Compañía: FedEx

Paleta:
#fb7c0c
#442c93
#f7f0e9
#d2926c
#9c94cc

Color principal
#442c93

Esquema complementario
#442c93
#7b932c

Esquema monocromatico
#000032
#0d124c
#241c67
#392784
#553aa2
#7656c0
#9773df
#b892ff

Esquema complementarios divididos
#452d95
#792d95
#2d4895

Elegí el color #442c93 porque es el más representativo de la marca FedEx. 
Los demás colores fueron generados por el sistema de paleta de colores.
"""

import pandas as pd
from pandas import Series, DataFrame
import altair as alt
import chardet

# Se lee una pequeña parte del archivo para detectar la codificación
with open('EjemploData.csv', 'rb') as f:
    result = chardet.detect(f.read(10000))

# Se imprime la codificación detectada
print(result['encoding'])

# Usar la codificación detectada para leer el archivo
df = pd.read_csv('EjemploData.csv', encoding = result['encoding'])
df.head()
"""
index,Order ID,Segment,City,Region,Category,Sub-Category,Product Name,Sales,Quantity,Discount,Profit
0,US-2016-118983,Home Office,Fort Worth,Central,Office Supplies,Appliances,"Holmes Replacement Filter for HEPA Air Cleaner, Very Large Room, HEPA Filter",68.81,5,0.8,-123.858
1,US-2016-118983,Home Office,Fort Worth,Central,Office Supplies,Binders,Storex DuraTech Recycled Plastic Frosted Binders,2.544,3,0.8,-3.816
2,CA-2015-105893,Consumer,Madison,Central,Office Supplies,Storage,"Stur-D-Stor Shelving, Vertical 5-Shelf: 72""H x 36""W x 18 1/2""D",665.88,6,0.0,13.3176
3,CA-2017-137330,Corporate,Fremont,Central,Office Supplies,Art,Newell 318,19.46,7,0.0,5.0596
4,CA-2017-137330,Corporate,Fremont,Central,Office Supplies,Appliances,"Acco Six-Outlet Power Strip, 4' Cord Length",60.34,7,0.0,15.6884
"""

df.info()
"""
<class 'pandas.core.frame.DataFrame'>
RangeIndex: 200 entries, 0 to 199
Data columns (total 11 columns):
 #   Column        Non-Null Count  Dtype  
---  ------        --------------  -----  
 0   Order ID      200 non-null    object 
 1   Segment       200 non-null    object 
 2   City          200 non-null    object 
 3   Region        200 non-null    object 
 4   Category      200 non-null    object 
 5   Sub-Category  200 non-null    object 
 6   Product Name  200 non-null    object 
 7   Sales         200 non-null    float64
 8   Quantity      200 non-null    int64  
 9   Discount      200 non-null    float64
 10  Profit        200 non-null    float64
dtypes: float64(3), int64(1), object(7)
memory usage: 17.3+ KB
"""

# Se crea una grafica de barras con las cateogiras de Segment y Sales
# Por cada categoria de Segment usar un color de la paleta de colores
# Paleta:
#fb7c0c
#442c93
#f7f0e9
#d2926c
#9c94cc
alt.Chart(df).mark_bar().encode(
    x='Segment:N',
    y='sum(Sales)',
    color=alt.Color('Segment:N', scale=alt.Scale(domain=['Home Office', 'Consumer', 'Corporate'], range=['#fb7c0c', '#442c93', '#f7f0e9']))
)

# Se crea una grafica de barras con las ventas, descuentos y ganancias de cada producto
# Por cada categoria de Segment usar un color de la paleta de colores del esquema monocromatico
# Paleta monocromatica:
#000032
#0d124c
#241c67
#392784
#553aa2
#7656c0
#9773df
#b892ff




