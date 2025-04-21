# /home/jesus/python/TFG/APP/backend/api/tests/HU/nvidia/HU-03-nvidia.py
from django.urls import reverse
from rest_framework.test import APITestCase
from rest_framework import status
from .models import Tarea
import json

class TareaCreationTests(APITestCase):
    def test_create_task_with_valid_data(self):
        url = reverse('tarea-list-create')
        data = {
            'titulo': 'Nueva Tarea',
            'descripcion': 'Este es un ejemplo de tarea',
            'fecha_vencimiento': '2024-03-16',
            'prioridad': 'alta',
            'estado': 'pendiente'
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Tarea.objects.count(), 1)
        self.assertEqual(Tarea.objects.get().titulo, 'Nueva Tarea')

    def test_create_task_with_missing_title(self):
        url = reverse('tarea-list-create')
        data = {
            'descripcion': 'Este es un ejemplo de tarea',
            'fecha_vencimiento': '2024-03-16',
            'prioridad': 'alta',
            'estado': 'pendiente'
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(Tarea.objects.count(), 0)

    def test_create_task_with_past_due_date(self):
        url = reverse('tarea-list-create')
        data = {
            'titulo': 'Nueva Tarea',
            'descripcion': 'Este es un ejemplo de tarea',
            'fecha_vencimiento': '2022-01-01',
            'prioridad': 'alta',
            'estado': 'pendiente'
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(Tarea.objects.count(), 0)