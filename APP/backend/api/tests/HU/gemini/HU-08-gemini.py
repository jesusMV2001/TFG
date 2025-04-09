# /home/jesus/python/TFG/APP/backend/api/tests/HU/gemini/HU-08-gemini.py
from django.contrib.auth.models import User
from rest_framework import status
from rest_framework.test import APITestCase
from api.models import Tarea
from datetime import datetime
import pytz

class OrdenarTareasTests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(username='testuser', password='testpassword')
        self.client.force_authenticate(user=self.user)

        # Crear tareas con diferentes prioridades y fechas de vencimiento
        self.tarea_alta = Tarea.objects.create(
            titulo='Tarea Alta',
            prioridad='alta',
            fecha_vencimiento=datetime(2024, 12, 31, tzinfo=pytz.utc),
            usuario=self.user
        )
        self.tarea_baja = Tarea.objects.create(
            titulo='Tarea Baja',
            prioridad='baja',
            fecha_vencimiento=datetime(2024, 12, 25, tzinfo=pytz.utc),
            usuario=self.user
        )
        self.tarea_media = Tarea.objects.create(
            titulo='Tarea Media',
            prioridad='media',
            fecha_vencimiento=datetime(2025, 1, 5, tzinfo=pytz.utc),
            usuario=self.user
        )

    def test_ordenar_tareas_por_prioridad(self):
        response = self.client.get('/api/tareas/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        data = response.json()

        # Verificar el orden esperado: alta, media, baja
        self.assertEqual(data[0]['titulo'], 'Tarea Alta')
        self.assertEqual(data[1]['titulo'], 'Tarea Media')
        self.assertEqual(data[2]['titulo'], 'Tarea Baja')

    def test_ordenar_tareas_por_fecha_vencimiento(self):
        # Invertir el orden de creación para forzar una ordenación por fecha
        Tarea.objects.all().delete()  # Eliminar tareas existentes

        tarea_media = Tarea.objects.create(
            titulo='Tarea Media',
            prioridad='media',
            fecha_vencimiento=datetime(2025, 1, 5, tzinfo=pytz.utc),
            usuario=self.user
        )

        tarea_alta = Tarea.objects.create(
            titulo='Tarea Alta',
            prioridad='alta',
            fecha_vencimiento=datetime(2024, 12, 31, tzinfo=pytz.utc),
            usuario=self.user
        )
        tarea_baja = Tarea.objects.create(
            titulo='Tarea Baja',
            prioridad='baja',
            fecha_vencimiento=datetime(2024, 12, 25, tzinfo=pytz.utc),
            usuario=self.user
        )

        response = self.client.get('/api/tareas/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        data = response.json()

        # Verificar el orden esperado: baja, alta, media
        self.assertEqual(data[0]['titulo'], 'Tarea Baja')
        self.assertEqual(data[1]['titulo'], 'Tarea Alta')
        self.assertEqual(data[2]['titulo'], 'Tarea Media')