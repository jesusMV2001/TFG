# Generated by Django 5.1.7 on 2025-04-01 21:25

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0001_initial'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='tarea',
            name='etiquetas',
        ),
        migrations.AddField(
            model_name='etiqueta',
            name='tarea',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='etiquetas', to='api.tarea'),
        ),
    ]
