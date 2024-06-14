from django.db import models, transaction
from datetime import datetime


class Lugar(models.Model):
    nombre = models.CharField(max_length=256, null=True, blank=True)
    estado = models.CharField(max_length=256, null=True, blank=True)
    nombre_id = models.CharField(max_length=256, null=True, blank=True)

    def __str__(self) -> str:
        return f'{self.nombre} ({self.id})'
    
    class Meta:
        default_related_name = 'lugares'
        verbose_name_plural = 'lugares'


class Caseta(models.Model):
    nombre = models.CharField(max_length=256)
    costo = models.FloatField()
    lugar = models.ForeignKey(Lugar, on_delete=models.CASCADE, null=True, blank=True)

    def __str__(self) -> str:
        return f'{str(self.lugar)} ${self.costo} ({self.id})'


class Ruta(models.Model):
    nombre = models.CharField(max_length=256)
    casetas = models.ManyToManyField(Caseta)
    lugar_origen = models.ForeignKey(Lugar, on_delete=models.CASCADE, related_name='lugar_origen')
    lugar_destino = models.ForeignKey(Lugar, on_delete=models.CASCADE, related_name='lugar_destino') 
    available = models.BooleanField(default=True)

    @property
    def costo_esperado(self):
        return sum([caseta.costo for caseta in self.casetas.all()])

    def __str__(self) -> str:
        return f'{self.nombre} ${self.costo_esperado} [{self.id}]'


class Unidad(models.Model):
    tag = models.CharField(max_length=64, null=True, blank=True)
    numero = models.IntegerField(null=True, blank=True)

    def __str__(self) -> str:
        return f'{self.tag} ({self.id})'
    
    class Meta:
        default_related_name = 'unidades'
        verbose_name_plural = 'unidades'


class Cruce(models.Model):
    ext_id = models.CharField(max_length=256, null=True, blank=True)
    fecha = models.DateTimeField()
    costo = models.FloatField(null=True, blank=True)
    caseta = models.ForeignKey(Caseta, on_delete=models.CASCADE)
    orden = models.ForeignKey('Orden', on_delete=models.CASCADE, null=True, blank=True)
    unidad = models.ForeignKey(Unidad, on_delete=models.CASCADE, null=True, blank=True)

    @property
    def costo_esperado(self):
        return self.caseta.costo
    
    @property
    def diferencia(self):
        return self.costo - self.costo_esperado
    
    @staticmethod
    def get_costo_total(cruce_qs, group_by='month'):
        grouped_data = {}

        if group_by == 'month':
            for i in range(1, 13):
                grouped_data[str(i).zfill(2)] = {'costo_total': 0, 'cruces': 0}
                def get_period_label(date):
                    return date.strftime('%m').zfill(2)
        elif group_by == 'day':
            for i in range(1, 32):
                grouped_data[str(i).zfill(2)] = {'costo_total': 0, 'cruces': 0}
                def get_period_label(date):
                    return date.strftime('%d').zfill(2)
        elif group_by == 'week':
            for i in range(1, 53):
                grouped_data[str(i).zfill(2)] = {'costo_total': 0, 'cruces': 0}
                def get_period_label(date):
                    return date.strftime('%V').zfill(2)

        for cruce in cruce_qs:
            date = cruce.fecha
            period = get_period_label(date)
            grouped_data[period]['costo_total'] += cruce.costo
            grouped_data[period]['cruces'] = grouped_data[period].get('cruces', 0) + 1

        return grouped_data

    @staticmethod
    def import_from_raw_data(df):
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
        return new_cruces

    
    def __str__(self) -> str:
        return f'{self.caseta} - {self.orden} ({self.id})'
    
    class Meta:
        default_related_name = 'cruces'
        verbose_name_plural = 'cruces'


class Orden(models.Model):
    numero = models.CharField(max_length=256)
    fecha = models.DateTimeField(null=True, blank=True)
    fecha_inicio = models.DateTimeField()
    fecha_fin = models.DateTimeField()
    ruta = models.ForeignKey(Ruta, on_delete=models.CASCADE, null=True, blank=True)
    lugar_destino = models.ForeignKey(Lugar, on_delete=models.CASCADE, related_name='lugar_destino_orden', null=True, blank=True)
    lugar_origen = models.ForeignKey(Lugar, on_delete=models.CASCADE, related_name='lugar_origen_orden', null=True, blank=True)
    unidad = models.ForeignKey(Unidad, on_delete=models.CASCADE, null=True, blank=True)

    @property
    def get_cruces(self):
        return self.cruces.all()
    
    @property
    def cruces_esperados(self):
        return self.ruta.casetas.all()
    
    @property
    def costo_total(self):
        cruces = self.get_cruces
        return sum([cruce.costo for cruce in cruces])
    
    @property
    def costo_esperado(self):
        return sum([cruce.costo for cruce in self.cruces_esperados.all()])

    @property
    def diferencia(self):
        return self.costo_total - self.costo_esperado
    
    @staticmethod
    def get_costo_total_esperado(orden_qs, group_by='month'):
        grouped_data = {}

        if group_by == 'month':
            for i in range(1, 13):
                grouped_data[str(i).zfill(2)] = {'costo_esperado': 0}
                def get_period_label(date):
                    return date.strftime('%m').zfill(2)
        elif group_by == 'day':
            for i in range(1, 32):
                grouped_data[str(i).zfill(2)] = {'costo_esperado': 0}
                def get_period_label(date):
                    return date.strftime('%d').zfill(2)
        elif group_by == 'week':
            for i in range(1, 53):
                grouped_data[str(i).zfill(2)] = {'costo_esperado': 0}
                def get_period_label(date):
                    return date.strftime('%V').zfill(2)

        for order in orden_qs:
            date = order.fecha_inicio
            period = get_period_label(date)
            grouped_data[period]['costo_esperado'] += order.costo_esperado

        return grouped_data

    @staticmethod
    def import_from_raw_data(df):
        orders = []
        with transaction.atomic():
            new_orders = []
            for index, row in df.iterrows():
                numero = row['ord_number']
                orden = Orden.objects.filter(numero=numero).first()
                if orden:
                    continue

                lugar_origen, created = Lugar.objects.get_or_create(nombre=row['origin_cmp_name'])
                lugar_destino, created = Lugar.objects.get_or_create(nombre=row['dest_cmp_name'])
                ruta = Ruta.objects.filter(
                    lugar_origen=lugar_origen,
                    lugar_destino=lugar_destino
                ).first()

                # Unidad
                id_unidad = int(row['ord_tractor'])
                unidad = Unidad.objects.filter(numero=id_unidad).first()
                if not unidad:
                    unidad = Unidad.objects.create(numero=id_unidad)

                fecha = datetime.strptime(row['ord_startdate'], '%m/%d/%Y %H:%M:%S')
                fecha_inicio = fecha
                fecha_inicio = fecha_inicio.replace(hour=0, minute=0, second=0, microsecond=0)
                fecha_fin = datetime.strptime(row['ord_completiondate'], '%m/%d/%Y %H:%M:%S')
                fecha_fin = fecha_fin.replace(hour=23, minute=59, second=59, microsecond=999999)

                orden, created = Orden.objects.get_or_create(
                    numero=numero,
                    fecha=fecha,
                    fecha_inicio=fecha_inicio,
                    fecha_fin=fecha_fin,
                    lugar_origen=lugar_origen,
                    lugar_destino=lugar_destino,
                    unidad=unidad,
                    ruta=ruta
                )

                # Buscar y asociar cruces de casetas
                cruces = Cruce.objects.filter(
                    fecha__gte=fecha_inicio,
                    fecha__lte=fecha_fin,
                    unidad=unidad,
                    orden__isnull=True
                )
                print(f'Orden {orden} - {cruces.count()} cruces')
                cruces.update(orden=orden)
                new_orders.append(orden)
            orders = new_orders
        return orders

    def __str__(self) -> str:
        return f'{self.numero} ({self.id})'
    
    class Meta:
        default_related_name = 'ordenes'
        verbose_name_plural = 'ordenes'
