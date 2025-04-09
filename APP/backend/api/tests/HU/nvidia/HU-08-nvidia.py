# /home/jesus/python/TFG/APP/backend/api/tests/HU/nvidia/HU-08-nvidia.py
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase, APIClient
from .models import Tarea
from django.contrib.auth.models import User

class TareaOrderingTestCase(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user('testuser', 'testuser@example.com', 'password123')
        self.client = APIClient()
        self.client.force_authenticate(user=self.user)

        Tarea.objects.create(titulo='Tarea 1', prioridad='alta', fecha_vencimiento='2024-03-15', usuario=self.user)
        Tarea.objects.create(titulo='Tarea 2', prioridad='media', fecha_vencimiento='2024-03-10', usuario=self.user)
        Tarea.objects.create(titulo='Tarea 3', prioridad='baja', fecha_vencimiento='2024-03-20', usuario=self.user)

    def test_order_by_prioridad(self):
        url = reverse('tarea-list-create')
        response = self.client.get(url, {'ordering': 'prioridad'})

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 3)
        self.assertEqual(response.data[0]['titulo'], 'Tarea 1')  # Alta
        self.assertEqual(response.data[1]['titulo'], 'Tarea 2')  # Media
        self.assertEqual(response.data[2]['titulo'], 'Tarea 3')  # Baja

    def test_order_by_fecha_vencimiento(self):
        url = reverse('tarea-list-create')
        response = self.client.get(url, {'ordering': 'fecha_vencimiento'})

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 3)
        self.assertEqual(response.data[0]['titulo'], 'Tarea 2')  # 2024-03-10
        self.assertEqual(response.data[1]['titulo'], 'Tarea 1')  # 2024-03-15
        self.assertEqual(response.data[2]['titulo'], 'Tarea 3')  # 2024-03-20