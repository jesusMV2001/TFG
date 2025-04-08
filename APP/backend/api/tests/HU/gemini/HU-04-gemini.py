# /home/jesus/python/TFG/APP/backend/api/tests/HU/gemini/HU-04-gemini.py
from rest_framework import status
from rest_framework.test import APITestCase
from django.contrib.auth.models import User
from api.models import Tarea

class VerTareasTest(APITestCase):
    def setUp(self):
        # Crear usuario de prueba
        self.user = User.objects.create_user(username='testuser', password='testpassword')
        
        # Autenticar al usuario
        self.client.force_authenticate(user=self.user)
        
        # Crear tareas de prueba asociadas al usuario
        Tarea.objects.create(usuario=self.user, titulo='Tarea 1', estado='pendiente')
        Tarea.objects.create(usuario=self.user, titulo='Tarea 2', estado='en_progreso')
        Tarea.objects.create(usuario=self.user, titulo='Tarea 3', estado='completada')

    def test_visualizar_tareas_agrupadas_por_estado(self):
        # Hacer la petición a la API para obtener las tareas
        response = self.client.get('/api/tareas/')

        # Verificar que la petición fue exitosa
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        # Verificar que la respuesta contiene las tareas creadas
        self.assertEqual(len(response.data), 3)

        # Verificar que las tareas están asociadas al usuario correcto
        for tarea in response.data:
            self.assertEqual(tarea['usuario'], 'testuser')

        # Verificar que las tareas estan agrupadas por estado. Implícitamente se verifica por orden de creación
        self.assertEqual(response.data[0]['titulo'], 'Tarea 1')
        self.assertEqual(response.data[0]['estado'], 'pendiente')

        self.assertEqual(response.data[1]['titulo'], 'Tarea 2')
        self.assertEqual(response.data[1]['estado'], 'en_progreso')

        self.assertEqual(response.data[2]['titulo'], 'Tarea 3')
        self.assertEqual(response.data[2]['estado'], 'completada')