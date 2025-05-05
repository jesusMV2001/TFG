from rest_framework import status
from rest_framework.test import APITestCase, APIClient
from django.urls import reverse
from django.contrib.auth.models import User
from .models import Tarea

class TestTareaOrdering(APITestCase):

    def setUp(self):
        self.user = User.objects.create_superuser('testuser', 'testemail@example.com', 'password')
        self.client = APIClient()
        self.client.force_authenticate(user=self.user)

        # Crear tareas para testing
        Tarea.objects.create(titulo='Tarea 1', prioridad='alta', fecha_vencimiento='2024-03-20', usuario=self.user)
        Tarea.objects.create(titulo='Tarea 2', prioridad='media', fecha_vencimiento='2024-03-15', usuario=self.user)
        Tarea.objects.create(titulo='Tarea 3', prioridad='baja', fecha_vencimiento='2024-03-25', usuario=self.user)
        Tarea.objects.create(titulo='Tarea 4', prioridad='alta', fecha_vencimiento='2024-03-10', usuario=self.user)

    def test_order_by_prioridad(self):
        url = reverse('tarea-list-create')
        response = self.client.get(url, {'ordering': 'prioridad'})

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 4)
        # Comprobar orden de prioridad (alta, media, baja)
        expected_priorities = ['alta', 'alta', 'media', 'baja']
        priorities = [tarea['prioridad'] for tarea in response.data]
        self.assertEqual(priorities, expected_priorities)

    def test_order_by_fecha_vencimiento(self):
        url = reverse('tarea-list-create')
        response = self.client.get(url, {'ordering': 'fecha_vencimiento'})

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 4)
        # Comprobar orden de fecha de vencimiento (ascendente)
        expected_vencimientos = ['2024-03-10', '2024-03-15', '2024-03-20', '2024-03-25']
        vencimientos = [tarea['fecha_vencimiento'] for tarea in response.data]
        self.assertEqual(vencimientos, expected_vencimientos)

    def test_order_by_prioridad_y_fecha_vencimiento(self):
        url = reverse('tarea-list-create')
        response = self.client.get(url, {'ordering': 'prioridad,fecha_vencimiento'})

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 4)
        # Comprobar orden de prioridad y fecha de vencimiento
        expected_priorities = ['alta', 'alta', 'media', 'baja']
        priorities = [tarea['prioridad'] for tarea in response.data]
        self.assertEqual(priorities, expected_priorities)
        # Tareas con misma prioridad ordenadas por fecha de vencimiento
        expected_vencimientos_alta = ['2024-03-10', '2024-03-20']
        vencimientos_alta = [tarea['fecha_vencimiento'] for tarea in response.data[:2]]
        self.assertEqual(vencimientos_alta, expected_vencimientos_alta)