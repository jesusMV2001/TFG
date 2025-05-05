# /home/jesus/python/TFG/APP/backend/api/tests/RF/mistral/test_RF_11_mistral.py

from django.urls import reverse
from rest_framework.test import APITestCase
from rest_framework import status
from django.contrib.auth.models import User
from api.models import Tarea

class TareaSearchTests(APITestCase):

    def setUp(self):
        # Crear un usuario de prueba
        self.user = User.objects.create_user(username='testuser', password='testpassword')

        # Crear algunas tareas de prueba
        self.tarea1 = Tarea.objects.create(titulo='Tarea de prueba 1', descripcion='Esta es una descripción de prueba', usuario=self.user)
        self.tarea2 = Tarea.objects.create(titulo='Tarea de prueba 2', descripcion='Otra descripción de prueba', usuario=self.user)
        self.tarea3 = Tarea.objects.create(titulo='Tarea de prueba 3', descripcion='Descripción sin palabras clave', usuario=self.user)

    def test_search_tareas_by_titulo(self):
        url = reverse('tarea-list-create')
        self.client.force_authenticate(user=self.user)
        response = self.client.get(url, {'search': 'Tarea de prueba 1'})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['titulo'], 'Tarea de prueba 1')

    def test_search_tareas_by_descripcion(self):
        url = reverse('tarea-list-create')
        self.client.force_authenticate(user=self.user)
        response = self.client.get(url, {'search': 'otra descripción'})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['titulo'], 'Tarea de prueba 2')

    def test_search_tareas_no_results(self):
        url = reverse('tarea-list-create')
        self.client.force_authenticate(user=self.user)
        response = self.client.get(url, {'search': 'no existe'})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 0)

    def test_search_tareas_multiple_results(self):
        url = reverse('tarea-list-create')
        self.client.force_authenticate(user=self.user)
        response = self.client.get(url, {'search': 'prueba'})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 2)
        titulos = [tarea['titulo'] for tarea in response.data]
        self.assertIn('Tarea de prueba 1', titulos)
        self.assertIn('Tarea de prueba 2', titulos)