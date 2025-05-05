import json
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase, APIClient
from django.contrib.auth.models import User

class HU02InicioSesionAutenticacionTestCase(APITestCase):

    def setUp(self):
        self.user = User.objects.create_user(username='testuser', email='testuser@example.com', password='strongpassword')
        self.client = APIClient()

    def test_inicio_sesion_credenciales_validas(self):
        # Iniciar sesión con credenciales válidas
        response = self.client.post(reverse('token_obtain_pair'), {
            'username': 'testuser',
            'password': 'strongpassword'
        }, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('access', response.data)

    def test_inicio_sesion_credenciales_invalidas(self):
        # Iniciar sesión con credenciales inválidas
        response = self.client.post(reverse('token_obtain_pair'), {
            'username': 'testuser',
            'password': 'wrongpassword'
        }, format='json')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        self.assertIn('detail', response.data)
        self.assertEqual(response.data['detail'], 'No active account found with the given credentials')

    def test_autenticacion_sesion_activa(self):
        # Iniciar sesión con credenciales válidas
        response = self.client.post(reverse('token_obtain_pair'), {
            'username': 'testuser',
            'password': 'strongpassword'
        }, format='json')
        access_token = response.data['access']

        # Realizar una solicitud autenticada
        auth_header = {'HTTP_AUTHORIZATION': f'Bearer {access_token}'}
        response = self.client.get(reverse('tarea-list-create'), **auth_header)
        self.assertEqual(response.status_code, status.HTTP_200_OK)