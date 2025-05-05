# /home/jesus/python/TFG/APP/backend/api/tests/RF/mistral/test_RF_05_mistral.py

from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase, APIClient
from django.contrib.auth.models import User
from api.models import Tarea
from datetime import datetime, timedelta

class TareaCreationTestCase(APITestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(username='testuser', password='testpassword')
        self.client.force_authenticate(user=self.user)
        self.url = reverse('tarea-list-create')

    def test_create_tarea_with_required_fields(self):
        data = {
            'titulo': 'Nueva Tarea',
            'fecha_vencimiento': (datetime.now() + timedelta(days=1)).isoformat(),
            'prioridad': 'alta'
        }
        response = self.client.post(self.url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Tarea.objects.count(), 1)
        self.assertEqual(Tarea.objects.get().titulo, 'Nueva Tarea')
        self.assertEqual(Tarea.objects.get().prioridad, 'alta')

    def test_create_tarea_without_titulo(self):
        data = {
            'fecha_vencimiento': (datetime.now() + timedelta(days=1)).isoformat(),
            'prioridad': 'alta'
        }
        response = self.client.post(self.url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('titulo', response.data)

    def test_create_tarea_without_fecha_vencimiento(self):
        data = {
            'titulo': 'Nueva Tarea',
            'prioridad': 'alta'
        }
        response = self.client.post(self.url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('fecha_vencimiento', response.data)

    def test_create_tarea_without_prioridad(self):
        data = {
            'titulo': 'Nueva Tarea',
            'fecha_vencimiento': (datetime.now() + timedelta(days=1)).isoformat()
        }
        response = self.client.post(self.url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('prioridad', response.data)

    def test_create_tarea_with_invalid_prioridad(self):
        data = {
            'titulo': 'Nueva Tarea',
            'fecha_vencimiento': (datetime.now() + timedelta(days=1)).isoformat(),
            'prioridad': 'urgente'
        }
        response = self.client.post(self.url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('prioridad', response.data)

    def test_create_tarea_with_past_fecha_vencimiento(self):
        data = {
            'titulo': 'Nueva Tarea',
            'fecha_vencimiento': (datetime.now() - timedelta(days=1)).isoformat(),
            'prioridad': 'alta'
        }
        response = self.client.post(self.url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('fecha_vencimiento', response.data)