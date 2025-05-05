import json
from rest_framework import status
from rest_framework.test import APITestCase, APIClient
from django.urls import reverse
from django.contrib.auth.models import User

class TestRF04LoginLogout(APITestCase):

    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(username='testuser', email='test@example.com', password='strongpassword')
        self.register_url = reverse('register')
        self.token_obtain_pair_url = reverse('token_obtain_pair')
        self.token_refresh_url = reverse('token_refresh')

    def test_register_user(self):
        # Registro de usuario
        data = {'username': 'newtestuser', 'email': 'newtest@example.com', 'password': 'strongpassword'}
        response = self.client.post(self.register_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_login_user(self):
        # Registro de usuario para obtener credenciales
        data = {'username': 'testuser', 'email': 'test@example.com', 'password': 'strongpassword'}
        self.client.post(self.register_url, data, format='json')

        # Inicio de sesión del usuario
        data = {'username': 'testuser', 'password': 'strongpassword'}
        response = self.client.post(self.token_obtain_pair_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue('access' in response.data)
        self.assertTrue('refresh' in response.data)

        # Uso del token de acceso para una petición protegida (verifica.math.login_required)
        access_token = response.data['access']
        auth_header = {'HTTP_AUTHORIZATION': f'Bearer {access_token}'}
        response = self.client.get('/api/tareas/', **auth_header)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_refresh_token(self):
        # Registro de usuario para obtener credenciales
        data = {'username': 'testuser', 'email': 'test@example.com', 'password': 'strongpassword'}
        self.client.post(self.register_url, data, format='json')

        # Inicio de sesión del usuario
        data = {'username': 'testuser', 'password': 'strongpassword'}
        response = self.client.post(self.token_obtain_pair_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue('access' in response.data)
        self.assertTrue('refresh' in response.data)

        # Refresh del token
        refresh_token = response.data['refresh']
        data = {'refresh': refresh_token}
        response = self.client.post(self.token_refresh_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue('access' in response.data)

    def test_logout_user(self):
        # Dado que Django REST framework simple-jwt no implementa una ruta de cierre de sesión explícita,
        # el "cierre de sesión" se logra simplemente descartando el token de acceso del cliente.
        # Sin embargo, para probar el concepto de "no poder usar el token de acceso después de 'cerrar sesión'",
        # simularemos esto invalidando el token de acceso mediante su eliminación del cliente y
        # verificando que el servidor rechace los tokens de acceso "inválidos" o "descartados".
        
        # Registro de usuario para obtener credenciales
        data = {'username': 'testuser', 'email': 'test@example.com', 'password': 'strongpassword'}
        self.client.post(self.register_url, data, format='json')

        # Inicio de sesión del usuario
        data = {'username': 'testuser', 'password': 'strongpassword'}
        response = self.client.post(self.token_obtain_pair_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue('access' in response.data)
        self.assertTrue('refresh' in response.data)

        # Simulando cierre de sesión - Eliminar (o descartar) el token de acceso del cliente
        access_token = response.data['access']
        auth_header = {'HTTP_AUTHORIZATION': f'Bearer {access_token}'}

        # Simula intento de uso después del "cierre de sesión" (debería fallar)
        response = self.client.get('/api/tareas/', **auth_header)
        # En este punto, el servidor esperaría un token de acceso válido; después de "cerrar sesión",
        # el token anterior debe ser inválido. Aunque no hay un mecanismo de "logout" explícito,
        # el descarte del token logra este propósito. Aquí, asumimos el código de estado de autorización
        # incorrecta como evidencia de que el token es inválido después de "cerrar sesión".
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)