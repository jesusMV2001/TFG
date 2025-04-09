# /home/jesus/python/TFG/APP/backend/api/tests/HU/nvidia/HU-04-nvidia.py

from rest_framework import status
from rest_framework.test import APITestCase
from django.contrib.auth.models import User
from api.models import Tarea

class HU04VerTareasTestCase(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user('testuser', 'test@example.com', 'password')
        self.client.force_authenticate(user=self.user)

    def test_muestra_todas_las_tareas_asociadas_al_usuario(self):
        # Crear tareas de ejemplo
        Tarea.objects.create(titulo='Tarea 1', usuario=self.user, estado='pendiente')
        Tarea.objects.create(titulo='Tarea 2', usuario=self.user, estado='en_progreso')
        Tarea.objects.create(titulo='Tarea 3', usuario=self.user, estado='completada')

        # Hacer petición GET a la API
        response = self.client.get('/api/tareas/')

        # Verificar que se devuelvan todas las tareas
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 3)

    def test_agrupa_tareas_por_estado(self):
        # Crear tareas de ejemplo
        Tarea.objects.create(titulo='Tarea 1', usuario=self.user, estado='pendiente')
        Tarea.objects.create(titulo='Tarea 2', usuario=self.user, estado='en_progreso')
        Tarea.objects.create(titulo='Tarea 3', usuario=self.user, estado='en_progreso')
        Tarea.objects.create(titulo='Tarea 4', usuario=self.user, estado='completada')

        # Hacer petición GET a la API
        response = self.client.get('/api/tareas/')

        # Verificar que las tareas estén agrupadas por estado
        pendientes = [tarea for tarea in response.data if tarea['estado'] == 'pendiente']
        en_progreso = [tarea for tarea in response.data if tarea['estado'] == 'en_progreso']
        completadas = [tarea for tarea in response.data if tarea['estado'] == 'completada']

        self.assertEqual(len(pendientes), 1)
        self.assertEqual(len(en_progreso), 2)
        self.assertEqual(len(completadas), 1)