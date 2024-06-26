# Generated by Django 4.2.13 on 2024-05-07 22:49

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Caseta',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('nombre', models.CharField(max_length=256)),
                ('costo', models.FloatField()),
            ],
        ),
        migrations.CreateModel(
            name='Lugar',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('nombre', models.CharField(max_length=256)),
            ],
        ),
        migrations.CreateModel(
            name='Orden',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('fecha', models.DateTimeField()),
                ('fecha_inicio', models.DateTimeField()),
                ('fecha_fin', models.DateTimeField()),
            ],
        ),
        migrations.CreateModel(
            name='Ruta',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('nombre', models.CharField(max_length=256)),
                ('casetas', models.ManyToManyField(to='casetas.caseta')),
                ('lugar_destino', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='lugar_destino', to='casetas.lugar')),
                ('lugar_origen', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='lugar_origen', to='casetas.lugar')),
            ],
        ),
        migrations.CreateModel(
            name='OrdenCaseta',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('fecha', models.DateTimeField()),
                ('tag', models.CharField(max_length=64)),
                ('caseta', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='casetas.caseta')),
                ('orden', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='casetas.orden')),
            ],
        ),
        migrations.AddField(
            model_name='orden',
            name='ruta',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='casetas.ruta'),
        ),
        migrations.AddField(
            model_name='caseta',
            name='lugar',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='casetas.lugar'),
        ),
    ]
