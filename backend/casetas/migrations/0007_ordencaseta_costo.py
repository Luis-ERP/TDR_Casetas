# Generated by Django 4.2.13 on 2024-05-09 16:57

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('casetas', '0006_unidadtractor_numero_alter_unidadtractor_tag'),
    ]

    operations = [
        migrations.AddField(
            model_name='ordencaseta',
            name='costo',
            field=models.FloatField(blank=True, null=True),
        ),
    ]
