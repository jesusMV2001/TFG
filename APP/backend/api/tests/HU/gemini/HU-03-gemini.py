# /home/jesus/python/TFG/APP/backend/api/tests/HU/gemini/HU-03-gemini.py
from rest_framework import status
from rest_framework.test import APITestCase
from django.contrib.auth.models import User
from api.models import Tarea
from datetime import date, timedelta

class TareaCreateTests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(username='testuser', password='testpassword')
        self.client.force_authenticate(user=self.user)
        self.api_url = '/api/tareas/'

    def test_can_create_tarea_with_valid_data(self):
        payload = {
            'titulo': 'Tarea de prueba',
            'descripcion': 'Descripción de prueba',
            'fecha_vencimiento': date.today() + timedelta(days=1),
            'prioridad': 'alta',
            'estado': 'pendiente',
        }
        response = self.client.post(self.api_url, payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Tarea.objects.count(), 1)
        tarea = Tarea.objects.first()
        self.assertEqual(tarea.titulo, 'Tarea de prueba')
        self.assertEqual(tarea.usuario, self.user)

    def test_cannot_create_tarea_with_missing_titulo(self):
        payload = {
            'descripcion': 'Descripción de prueba',
            'fecha_vencimiento': date.today() + timedelta(days=1),
            'prioridad': 'alta',
            'estado': 'pendiente',
        }
        response = self.client.post(self.api_url, payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_cannot_create_tarea_with_missing_fecha_vencimiento(self):
        payload = {
            'titulo': 'Tarea de prueba',
            'descripcion': 'Descripción de prueba',
            'prioridad': 'alta',
            'estado': 'pendiente',
        }
        response = self.client.post(self.api_url, payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_cannot_create_tarea_with_missing_prioridad(self):
        payload = {
            'titulo': 'Tarea de prueba',
            'descripcion': 'Descripción de prueba',
            'fecha_vencimiento': date.today() + timedelta(days=1),
            'estado': 'pendiente',
        }
        response = self.client.post(self.api_url, payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_cannot_create_tarea_with_past_fecha_vencimiento(self):
        payload = {
            'titulo': 'Tarea de prueba',
            'descripcion': 'Descripción de prueba',
            'fecha_vencimiento': date.today() - timedelta(days=1),
            'prioridad': 'alta',
            'estado': 'pendiente',
        }
        response = self.client.post(self.api_url, payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)