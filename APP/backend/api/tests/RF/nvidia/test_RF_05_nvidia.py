from rest_framework import status
from rest_framework.test import APITestCase, APIClient
from django.urls import reverse
from django.contrib.auth.models import User
from api.models import Tarea
from datetime import datetime, timedelta

class TestTareaCreacion(APITestCase):

    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user('testuser', 'testuser@test.com', 'password123')
        self.client.force_authenticate(user=self.user)

    def test_crear_tarea_exitosamente(self):
        url = reverse('tarea-list-create')
        data = {
            'titulo': 'Tarea de prueba',
            'fecha_vencimiento': (datetime.now() + timedelta(days=3)).strftime("%Y-%m-%d %H:%M:%S"),
            'prioridad': 'alta'
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Tarea.objects.count(), 1)
        self.assertEqual(Tarea.objects.get().titulo, 'Tarea de prueba')

    def test_falta_titulo(self):
        url = reverse('tarea-list-create')
        data = {
            'fecha_vencimiento': (datetime.now() + timedelta(days=3)).strftime("%Y-%m-%d %H:%M:%S"),
            'prioridad': 'alta'
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('titulo', response.data)
        self.assertEqual(Tarea.objects.count(), 0)

    def test_falta_fecha_vencimiento(self):
        url = reverse('tarea-list-create')
        data = {
            'titulo': 'Tarea de prueba',
            'prioridad': 'alta'
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('fecha_vencimiento', response.data)
        self.assertEqual(Tarea.objects.count(), 0)

    def test_falta_prioridad(self):
        url = reverse('tarea-list-create')
        data = {
            'titulo': 'Tarea de prueba',
            'fecha_vencimiento': (datetime.now() + timedelta(days=3)).strftime("%Y-%m-%d %H:%M:%S")
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('prioridad', response.data)
        self.assertEqual(Tarea.objects.count(), 0)

    def test_fecha_vencimiento_pasada(self):
        url = reverse('tarea-list-create')
        data = {
            'titulo': 'Tarea de prueba',
            'fecha_vencimiento': (datetime.now() - timedelta(days=1)).strftime("%Y-%m-%d %H:%M:%S"),
            'prioridad': 'alta'
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('fecha_vencimiento', response.data)
        self.assertEqual(Tarea.objects.count(), 0)

    def test_prioridad_invalida(self):
        url = reverse('tarea-list-create')
        data = {
            'titulo': 'Tarea de prueba',
            'fecha_vencimiento': (datetime.now() + timedelta(days=3)).strftime("%Y-%m-%d %H:%M:%S"),
            'prioridad': 'invalida'
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('prioridad', response.data)
        self.assertEqual(Tarea.objects.count(), 0)