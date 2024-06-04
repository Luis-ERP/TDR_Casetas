# Generated by Django 4.2.13 on 2024-06-03 05:31

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('casetas', '0008_alter_ordencaseta_orden'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='lugar',
            options={'default_related_name': 'lugares', 'verbose_name_plural': 'lugares'},
        ),
        migrations.AlterModelOptions(
            name='orden',
            options={'default_related_name': 'ordenes', 'verbose_name_plural': 'ordenes'},
        ),
        migrations.AlterModelOptions(
            name='ordencaseta',
            options={'default_related_name': 'cruces', 'verbose_name_plural': 'cruces'},
        ),
        migrations.AlterModelOptions(
            name='unidadtractor',
            options={'default_related_name': 'unidades', 'verbose_name_plural': 'unidades'},
        ),
        migrations.AddField(
            model_name='lugar',
            name='estado',
            field=models.CharField(blank=True, max_length=256, null=True),
        ),
    ]