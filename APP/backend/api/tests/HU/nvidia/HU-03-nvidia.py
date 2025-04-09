# /home/jesus/python/TFG/APP/backend/api/tests/HU/nvidia/HU-03-nvidia.py
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from datetime import date

class TareaCreationTest(APITestCase):

    def setUp(self):
        self.user_data = {'username': 'testuser', 'email': 'test@example.com', 'password': 'strongpassword'}
        self.tarea_data = {
            'titulo': 'Nueva Tarea',
            'descripcion': 'Descripción de la tarea',
            'fecha_vencimiento': '2030-01-01',
            'prioridad': 'alta',
            'estado': 'pendiente'
        }
        self.create_user_response = self.client.post(reverse('register'), self.user_data, format='json')
        self.token_response = self.client.post(reverse('token_obtain_pair'), {'username': self.user_data['username'], 'password': self.user_data['password']}, format='json')
        self.token = self.token_response.data['access']

    def test_crear_tarea_completa(self):
        self.client.credentials(HTTP_AUTHORIZATION='Bearer ' + self.token)
        response = self.client.post(reverse('tarea-list-create'), self.tarea_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_titulo_obligatorio(self):
        self.client.credentials(HTTP_AUTHORIZATION='Bearer ' + self.token)
        del self.tarea_data['titulo']
        response = self.client.post(reverse('tarea-list-create'), self.tarea_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('titulo', response.data)

    def test_fecha_vencimiento_obligatoria(self):
        self.client.credentials(HTTP_AUTHORIZATION='Bearer ' + self.token)
        del self.tarea_data['fecha_vencimiento']
        response = self.client.post(reverse('tarea-list-create'), self.tarea_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('fecha_vencimiento', response.data)

    def test_fecha_vencimiento_no_anterior(self):
        self.client.credentials(HTTP_AUTHORIZATION='Bearer ' + self.token)
        self.tarea_data['fecha_vencimiento'] = date.today().strftime('%Y-%m-%d')
        response = self.client.post(reverse('tarea-list-create'), self.tarea_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('fecha_vencimiento', response.data)