from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase, APIClient
from django.contrib.auth.models import User
from api.models import Tarea

class HU03CrearTareaTest(APITestCase):

    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user('john', 'john@example.com', 'password')
        self.client.force_authenticate(user=self.user)

    def test_crear_tarea_completa(self):
        # Datos válidos
        data = {
            'titulo': 'Tarea de prueba',
            'descripcion': 'Descripción de la tarea',
            'fecha_vencimiento': '2024-03-20T14:30:00Z',
            'prioridad': 'alta',
            'estado': 'pendiente'
        }
        response = self.client.post(reverse('tarea-list-create'), data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Tarea.objects.count(), 1)
        self.assertEqual(Tarea.objects.get().titulo, 'Tarea de prueba')

    def test_crear_tarea_sin_titulo(self):
        # Sin título
        data = {
            'descripcion': 'Descripción de la tarea',
            'fecha_vencimiento': '2024-03-20T14:30:00Z',
            'prioridad': 'alta',
            'estado': 'pendiente'
        }
        response = self.client.post(reverse('tarea-list-create'), data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(Tarea.objects.count(), 0)

    def test_crear_tarea_sin_fecha_vencimiento(self):
        # Sin fecha de vencimiento
        data = {
            'titulo': 'Tarea de prueba',
            'descripcion': 'Descripción de la tarea',
            'prioridad': 'alta',
            'estado': 'pendiente'
        }
        response = self.client.post(reverse('tarea-list-create'), data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(Tarea.objects.count(), 0)

    def test_crear_tarea_sin_prioridad(self):
        # Sin prioridad
        data = {
            'titulo': 'Tarea de prueba',
            'descripcion': 'Descripción de la tarea',
            'fecha_vencimiento': '2024-03-20T14:30:00Z',
            'estado': 'pendiente'
        }
        response = self.client.post(reverse('tarea-list-create'), data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(Tarea.objects.count(), 0)

    def test_crear_tarea_con_fecha_vencimiento_anterior(self):
        # Fecha de vencimiento anterior a la actual
        data = {
            'titulo': 'Tarea de prueba',
            'descripcion': 'Descripción de la tarea',
            'fecha_vencimiento': '2020-03-20T14:30:00Z',
            'prioridad': 'alta',
            'estado': 'pendiente'
        }
        response = self.client.post(reverse('tarea-list-create'), data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(Tarea.objects.count(), 0)