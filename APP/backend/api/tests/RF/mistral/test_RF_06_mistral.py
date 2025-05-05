# /home/jesus/python/TFG/APP/backend/api/tests/RF/mistral/test_RF_06_mistral.py

from django.contrib.auth.models import User
from rest_framework.test import APITestCase
from rest_framework import status
from api.models import Tarea
from django.urls import reverse

class RF06TestCase(APITestCase):

    def setUp(self):
        # Crear un usuario de prueba
        self.user = User.objects.create_user(username='testuser', password='testpassword')

        # Autenticar al usuario
        self.client.login(username='testuser', password='testpassword')

        # Crear algunas tareas de prueba
        self.tarea1 = Tarea.objects.create(titulo='Tarea 1', usuario=self.user)
        self.tarea2 = Tarea.objects.create(titulo='Tarea 2', usuario=self.user)
        self.tarea3 = Tarea.objects.create(titulo='Tarea 3', usuario=self.user)

    def test_list_tareas(self):
        # Obtener la URL para listar tareas
        url = reverse('tarea-list-create')

        # Hacer una solicitud GET a la URL
        response = self.client.get(url)

        # Verificar que la respuesta tenga un código de estado 200 (OK)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        # Verificar que la respuesta contenga 3 tareas
        self.assertEqual(len(response.data), 3)

        # Verificar que las tareas en la respuesta coincidan con las tareas creadas
        self.assertEqual(response.data[0]['titulo'], self.tarea1.titulo)
        self.assertEqual(response.data[1]['titulo'], self.tarea2.titulo)
        self.assertEqual(response.data[2]['titulo'], self.tarea3.titulo)

    def test_list_tareas_empty(self):
        # Crear otro usuario de prueba
        other_user = User.objects.create_user(username='otheruser', password='otherpassword')

        # Autenticar al otro usuario
        self.client.login(username='otheruser', password='otherpassword')

        # Obtener la URL para listar tareas
        url = reverse('tarea-list-create')

        # Hacer una solicitud GET a la URL
        response = self.client.get(url)

        # Verificar que la respuesta tenga un código de estado 200 (OK)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        # Verificar que la respuesta no contenga tareas
        self.assertEqual(len(response.data), 0)

    def test_list_tareas_unauthenticated(self):
        # Cerrar sesión del usuario
        self.client.logout()

        # Obtener la URL para listar tareas
        url = reverse('tarea-list-create')

        # Hacer una solicitud GET a la URL
        response = self.client.get(url)

        # Verificar que la respuesta tenga un código de estado 401 (Unauthorized)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)