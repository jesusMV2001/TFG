# /home/jesus/python/TFG/APP/backend/api/tests/HU/gemini/HU-02-gemini.py
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from django.contrib.auth.models import User
import json


class LoginTests(APITestCase):

    def setUp(self):
        # Crear un usuario para las pruebas
        self.username = 'testuser'
        self.password = 'password123'
        self.user = User.objects.create_user(username=self.username, password=self.password)
        self.login_url = reverse('token_obtain_pair')

    def test_login_with_valid_credentials(self):
        """
        Asegura que un usuario puede iniciar sesión con credenciales válidas.
        """
        data = {'username': self.username, 'password': self.password}
        response = self.client.post(self.login_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('access', response.data)
        self.assertIn('refresh', response.data)

    def test_login_with_invalid_credentials(self):
        """
        Asegura que un usuario no puede iniciar sesión con credenciales inválidas.
        """
        data = {'username': self.username, 'password': 'wrongpassword'}
        response = self.client.post(self.login_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_login_with_empty_username(self):
        """
        Asegura que no se puede iniciar sesión con un nombre de usuario vacío.
        """
        data = {'username': '', 'password': self.password}
        response = self.client.post(self.login_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_login_with_empty_password(self):
        """
        Asegura que no se puede iniciar sesión con una contraseña vacía.
        """
        data = {'username': self.username, 'password': ''}
        response = self.client.post(self.login_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_access_protected_route_with_token(self):
        """
        Asegura que se puede acceder a una ruta protegida con un token válido.
        """
        # Iniciar sesión para obtener el token
        data = {'username': self.username, 'password': self.password}
        response = self.client.post(self.login_url, data, format='json')
        access_token = response.data['access']

        # Establecer el encabezado de autorización
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {access_token}')

        # Intentar acceder a una ruta protegida (ejemplo: lista de tareas)
        tareas_url = reverse('tarea-list-create')
        response = self.client.get(tareas_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_access_protected_route_without_token(self):
        """
        Asegura que no se puede acceder a una ruta protegida sin un token.
        """
        tareas_url = reverse('tarea-list-create')
        response = self.client.get(tareas_url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_access_protected_route_with_invalid_token(self):
        """
        Asegura que no se puede acceder a una ruta protegida con un token inválido.
        """
        self.client.credentials(HTTP_AUTHORIZATION='Bearer invalidtoken')
        tareas_url = reverse('tarea-list-create')
        response = self.client.get(tareas_url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)