# /home/jesus/python/TFG/APP/backend/api/tests/HU/gemini/HU-04-gemini.py
from django.contrib.auth.models import User
from rest_framework import status
from rest_framework.test import APITestCase
from api.models import Tarea

class VerTareasTest(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(username='testuser', password='testpassword')
        self.client.force_authenticate(user=self.user)
        
        Tarea.objects.create(titulo='Tarea 1', estado='pendiente', prioridad='alta', usuario=self.user, fecha_vencimiento='2024-12-31')
        Tarea.objects.create(titulo='Tarea 2', estado='en_progreso', prioridad='media', usuario=self.user, fecha_vencimiento='2024-11-30')
        Tarea.objects.create(titulo='Tarea 3', estado='completada', prioridad='baja', usuario=self.user, fecha_vencimiento='2024-10-31')

    def test_ver_tareas_usuario(self):
        url = '/api/tareas/'
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 3)

    def test_tareas_agrupadas_por_estado(self):
      url = '/api/tareas/'
      response = self.client.get(url)
      self.assertEqual(response.status_code, status.HTTP_200_OK)

      tareas = response.data
      self.assertTrue(any(tarea['estado'] == 'pendiente' for tarea in tareas))
      self.assertTrue(any(tarea['estado'] == 'en_progreso' for tarea in tareas))
      self.assertTrue(any(tarea['estado'] == 'completada' for tarea in tareas))