from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from api.models import Tarea
from django.contrib.auth.models import User
from datetime import date, timedelta

class TareaCreateTestCase(APITestCase):

    def setUp(self):
        self.user = User.objects.create_user(username='testuser', password='testpassword')
        self.client.force_authenticate(user=self.user)
        self.url = reverse('tarea-list-create')

    def test_create_tarea_success(self):
        data = {
            'titulo': 'Tarea de prueba',
            'descripcion': 'Descripción de la tarea de prueba',
            'fecha_vencimiento': (date.today() + timedelta(days=1)).isoformat(),
            'prioridad': 'alta',
            'estado': 'pendiente'
        }
        response = self.client.post(self.url, data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Tarea.objects.count(), 1)
        self.assertEqual(Tarea.objects.get().titulo, 'Tarea de prueba')

    def test_create_tarea_without_titulo(self):
        data = {
            'descripcion': 'Descripción de la tarea de prueba',
            'fecha_vencimiento': (date.today() + timedelta(days=1)).isoformat(),
            'prioridad': 'alta',
            'estado': 'pendiente'
        }
        response = self.client.post(self.url, data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(Tarea.objects.count(), 0)

    def test_create_tarea_without_fecha_vencimiento(self):
        data = {
            'titulo': 'Tarea de prueba',
            'descripcion': 'Descripción de la tarea de prueba',
            'prioridad': 'alta',
            'estado': 'pendiente'
        }
        response = self.client.post(self.url, data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(Tarea.objects.count(), 0)

    def test_create_tarea_without_prioridad(self):
        data = {
            'titulo': 'Tarea de prueba',
            'descripcion': 'Descripción de la tarea de prueba',
            'fecha_vencimiento': (date.today() + timedelta(days=1)).isoformat(),
            'estado': 'pendiente'
        }
        response = self.client.post(self.url, data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(Tarea.objects.count(), 0)

    def test_create_tarea_with_invalid_fecha_vencimiento(self):
        data = {
            'titulo': 'Tarea de prueba',
            'descripcion': 'Descripción de la tarea de prueba',
            'fecha_vencimiento': (date.today() - timedelta(days=1)).isoformat(),
            'prioridad': 'alta',
            'estado': 'pendiente'
        }
        response = self.client.post(self.url, data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(Tarea.objects.count(), 0)