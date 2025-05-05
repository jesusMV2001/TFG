import json
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from django.contrib.auth.models import User

class InicioSesionAutenticacionTests(APITestCase):

    def setUp(self):
        # Crear un usuario para las pruebas
        self.username = 'testuser'
        self.email = 'test@example.com'
        self.password = 'testpassword123'
        self.user = User.objects.create_user(self.username, self.email, self.password)

    def test_inicio_sesion_exitoso(self):
        """
        Prueba el inicio de sesión exitoso con credenciales válidas.
        """
        url = reverse('token_obtain_pair')
        data = {'username': self.username, 'password': self.password}
        response = self.client.post(url, data, format='json')

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('access', response.data)
        self.assertIn('refresh', response.data)

    def test_inicio_sesion_credenciales_incorrectas(self):
        """
        Prueba el inicio de sesión con credenciales incorrectas.
        """
        url = reverse('token_obtain_pair')
        data = {'username': self.username, 'password': 'wrongpassword'}
        response = self.client.post(url, data, format='json')

        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        self.assertIn('detail', response.data)

    def test_acceso_restringido_con_token_valido(self):
        """
        Prueba el acceso a una vista restringida con un token válido.
        """
        # Iniciar sesión para obtener el token
        url = reverse('token_obtain_pair')
        data = {'username': self.username, 'password': self.password}
        response = self.client.post(url, data, format='json')
        access_token = response.data['access']

        # Acceder a una vista restringida (ejemplo: lista de tareas)
        url_tareas = reverse('tarea-list-create')
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {access_token}')
        response_tareas = self.client.get(url_tareas)

        self.assertEqual(response_tareas.status_code, status.HTTP_200_OK)

    def test_acceso_restringido_sin_token(self):
        """
        Prueba el acceso a una vista restringida sin token.
        """
        url = reverse('tarea-list-create')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_acceso_restringido_con_token_invalido(self):
        """
        Prueba el acceso a una vista restringida con un token inválido.
        """
        url = reverse('tarea-list-create')
        self.client.credentials(HTTP_AUTHORIZATION='Bearer invalidtoken')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)