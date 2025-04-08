# /home/jesus/python/TFG/APP/backend/api/tests/HU/gemini/HU-02-gemini.py
from django.contrib.auth.models import User
from rest_framework import status
from rest_framework.test import APITestCase
from django.urls import reverse
from rest_framework_simplejwt.tokens import RefreshToken


class HU02Tests(APITestCase):

    def setUp(self):
        # Crear un usuario de prueba
        self.user = User.objects.create_user(username='testuser', password='password123')
        self.login_url = reverse('token_obtain_pair')

    def test_login_with_valid_credentials(self):
        """
        Asegura que un usuario puede iniciar sesión con credenciales válidas.
        """
        data = {'username': 'testuser', 'password': 'password123'}
        response = self.client.post(self.login_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('access', response.data)
        self.assertIn('refresh', response.data)

    def test_login_with_invalid_credentials(self):
        """
        Asegura que se devuelve un error al intentar iniciar sesión con credenciales inválidas.
        """
        data = {'username': 'testuser', 'password': 'wrongpassword'}
        response = self.client.post(self.login_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_authenticated_user_can_access_protected_resource(self):
        """
        Asegura que un usuario autenticado puede acceder a un recurso protegido.
        (Este test depende de tener una vista protegida definida en las URLs).
        """
        # Iniciar sesión para obtener el token
        data = {'username': 'testuser', 'password': 'password123'}
        response = self.client.post(self.login_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        access_token = response.data['access']

        # Establecer el encabezado de autorización con el token
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {access_token}')

        # Intentar acceder a la lista de tareas (vista protegida)
        tasks_url = reverse('tarea-list-create')
        response = self.client.get(tasks_url, format='json')

        # Verificar que el acceso es exitoso (código 200 OK)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_unauthenticated_user_cannot_access_protected_resource(self):
        """
        Asegura que un usuario no autenticado no puede acceder a un recurso protegido.
        """
        # Intentar acceder a la lista de tareas sin estar autenticado
        tasks_url = reverse('tarea-list-create')
        response = self.client.get(tasks_url, format='json')

        # Verificar que el acceso está prohibido (código 401 No autorizado)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)