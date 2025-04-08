# /home/jesus/python/TFG/APP/backend/api/tests/HU/gemini/HU-03-gemini.py
from rest_framework import status
from rest_framework.test import APITestCase
from django.contrib.auth.models import User
from api.models import Tarea
from datetime import date, timedelta
from rest_framework_simplejwt.tokens import RefreshToken

class CrearTareaTests(APITestCase):
    def setUp(self):
        # Crear un usuario de prueba
        self.user = User.objects.create_user(username='testuser', password='testpassword')

        # Obtener token para el usuario
        refresh = RefreshToken.for_user(self.user)
        self.token = str(refresh.access_token)
        self.client.credentials(HTTP_AUTHORIZATION='Bearer ' + self.token)

        # URL para crear tareas
        self.url = '/api/tareas/'

    def test_crear_tarea_exito(self):
        """
        Asegura que se puede crear una tarea con datos válidos.
        """
        data = {
            'titulo': 'Tarea de prueba',
            'descripcion': 'Descripción de la tarea',
            'fecha_vencimiento': date.today() + timedelta(days=7),
            'prioridad': 'media',
            'estado': 'pendiente'
        }
        response = self.client.post(self.url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Tarea.objects.count(), 1)
        self.assertEqual(Tarea.objects.get().titulo, 'Tarea de prueba')

    def test_crear_tarea_titulo_vacio(self):
        """
        Asegura que no se puede crear una tarea sin título.
        """
        data = {
            'descripcion': 'Descripción de la tarea',
            'fecha_vencimiento': date.today() + timedelta(days=7),
            'prioridad': 'media',
            'estado': 'pendiente'
        }
        response = self.client.post(self.url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_crear_tarea_fecha_vencimiento_vacia(self):
        """
        Asegura que se puede crear una tarea sin fecha de vencimiento.
        """
        data = {
            'titulo': 'Tarea de prueba',
            'descripcion': 'Descripción de la tarea',
            'prioridad': 'media',
            'estado': 'pendiente'
        }
        response = self.client.post(self.url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_crear_tarea_fecha_vencimiento_anterior(self):
        """
        Asegura que no se puede crear una tarea con fecha de vencimiento anterior a la actual.
        """
        data = {
            'titulo': 'Tarea de prueba',
            'descripcion': 'Descripción de la tarea',
            'fecha_vencimiento': date.today() - timedelta(days=1),
            'prioridad': 'media',
            'estado': 'pendiente'
        }
        response = self.client.post(self.url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_crear_tarea_prioridad_vacia(self):
        """
        Asegura que se puede crear una tarea sin prioridad.
        """
        data = {
            'titulo': 'Tarea de prueba',
            'descripcion': 'Descripción de la tarea',
            'fecha_vencimiento': date.today() + timedelta(days=7),
            'estado': 'pendiente'
        }
        response = self.client.post(self.url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)