from mesa import Agent, Model
from mesa.space import MultiGrid
from mesa.time import SimultaneousActivation
from mesa.datacollection import DataCollector

import matplotlib.pyplot as plt
import matplotlib.animation as animation
import numpy as np
import random
import time
import datetime

class Basura(Agent):
    def __init__(self, pos, model, cantidad):
        super().__init__(pos, model)
        self.pos = pos
        self.cantidad = cantidad
        self.siguiente_cantidad = None

    def step(self):
        self.siguiente_cantidad = self.cantidad

    def advance(self):
        self.cantidad = self.siguiente_cantidad

class Robot(Agent):
    CAPACIDAD_MAXIMA = 5

    def __init__(self, unique_id, model, pos_papelera):
        super().__init__(unique_id, model)
        self.pos_papelera = pos_papelera
        self.deposito = 0
        self.movimientos = 0
        self.nueva_posicion = None

    def step(self):
        if self.deposito >= self.CAPACIDAD_MAXIMA:
            self.nueva_posicion = self.pos_papelera
        else:
            vecinos = self.model.grid.get_neighbors(self.pos, moore=False, include_center=True)
            celdas_con_basura = [v for v in vecinos if isinstance(v, Basura) and v.cantidad > 0]
            if celdas_con_basura:
                celda_basura = random.choice(celdas_con_basura)
                self.nueva_posicion = celda_basura.pos
                celda_basura.siguiente_cantidad -= 1
                self.deposito += 1
            else:
                celdas_libres = [v.pos for v in vecinos if not isinstance(v, Basura)]
                if celdas_libres:
                    self.nueva_posicion = random.choice(celdas_libres)

    def advance(self):
        if self.nueva_posicion:
            self.model.grid.move_agent(self, self.nueva_posicion)
            self.movimientos += 1

class Oficina(Model):
    def __init__(self, ancho, alto, matrix):
        super().__init__()
        self.grid = MultiGrid(ancho, alto, True)
        self.schedule = SimultaneousActivation(self)
        self.alto, self.ancho = self.grid.height, self.grid.width
        self.pos_papelera = None
        self.cargar_configuracion(lineas[1:])
        self.datacollector = DataCollector(
            model_reporters={"Grid": self.obtener_estado_grid}
        )

    def cargar_configuracion(self, matrix):
        for y, linea in enumerate(matrix):
            celdas = linea.strip().split()
            for x, celda in enumerate(celdas):
                if celda == 'X':
                    continue
                elif celda == 'P':
                    self.pos_papelera = (x, y)
                else:
                    try:
                        cantidad_basura = int(celda)
                        basura = Basura((x, y), self, cantidad_basura)
                        self.grid.place_agent(basura, (x, y))
                        self.schedule.add(basura)
                    except ValueError:
                        continue

        for i in range(5):
            robot = Robot(i, self, self.pos_papelera)
            self.grid.place_agent(robot, (random.randint(0, self.ancho-1), random.randint(0, self.alto-1)))
            self.schedule.add(robot)

    def step(self):
        self.datacollector.collect(self)
        self.schedule.step()

    def obtener_estado_grid(self):
        grid = np.zeros((self.alto, self.ancho))
        for cell in self.grid.coord_iter():
            cell_content, x, y = cell
            for obj in cell_content:
                if isinstance(obj, Basura):
                    grid[y][x] = obj.cantidad
                elif isinstance(obj, Robot):
                    grid[y][x] = -1
        return grid

    def todas_celdas_limpias(self):
        for cell in self.grid.coord_iter():
            cell_content, x, y = cell
            for obj in cell_content:
                if isinstance(obj, Basura) and obj.cantidad > 0:
                    return False
        return True
        

# Crear archivo de configuración en Google Colab
matrix = [['0', 'X', '0', '0', '0', '7', '0'], ['0', '7', 'X', '0', '0', '2', '0'], ['0', '0', 'P', '0', '0', '0', '0'], ['0', '0', '0', '0', '3', '0', '4'], ['5', '0', '0', '4', '0', '8', 'X'], ['0', '5', '0', 'X', '3', '3', '0'], ['5', '0', '8', '0', '0', '6', '5'], ['X', '0', '0', 'X', 'X', '0', '8'], ['2', '7', '6', '2', '4', '6', '0'], ['0', '8', '0', '0', '0', '0', '0'], ['0', '6', '0', '3', '0', '0', '5'], ['0', '0', '0', '8', '5', '5', 'X'], ['0', '8', '0', 'X', '0', '0', '4']]

# Datos de la habitación y archivo de configuración
ANCHO = 13
ALTO = 7
TIEMPO_MAXIMO_EJECUCION = 60  # tiempo máximo de ejecución en segundos

# Iniciar el modelo
start_time = time.time()
modelo = Oficina(ANCHO, ALTO, matrix)

while (time.time() - start_time) < TIEMPO_MAXIMO_EJECUCION and not modelo.todas_celdas_limpias():
    modelo.step ()


"""0 X 0 0 0 7 0
0 7 X 0 0 2 0
0 0 P 0 0 0 0
0 0 0 0 3 0 4
5 0 0 4 0 8 X
0 5 0 X 3 3 0
5 0 8 0 0 6 5
X 0 0 X X 0 8
2 7 6 2 4 6 0
0 8 0 0 0 0 0
0 6 0 3 0 0 5
0 0 0 8 5 5 X
0 8 0 X 0 0 4"""