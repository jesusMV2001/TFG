# /home/jesus/python/TFG/APP/backend/api/tests/RF/mistral/test_RF_04_mistral.py

from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from django.contrib.auth.models import User
from rest_framework_simplejwt.tokens import RefreshToken

class LoginLogoutTestCase(APITestCase):

    def setUp(self):
        self.username = 'testuser'
        self.password = 'testpassword123'
        self.user = User.objects.create_user(username=self.username, password=self.password, email='testuser@example.com')

    def test_login(self):
        url = reverse('token_obtain_pair')
        data = {
            'username': self.username,
            'password': self.password
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('access', response.data)
        self.assertIn('refresh', response.data)

    def test_logout(self):
        # Obtener token de acceso y refresh token
        refresh = RefreshToken.for_user(self.user)
        access_token = str(refresh.access_token)

        # Configurar el cliente con el token de acceso
        self.client.credentials(HTTP_AUTHORIZATION='Bearer ' + access_token)

        # Intentar cerrar sesión
        url = reverse('token_refresh')
        data = {
            'refresh': str(refresh)
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('access', response.data)

    def test_login_invalid_credentials(self):
        url = reverse('token_obtain_pair')
        data = {
            'username': self.username,
            'password': 'wrongpassword'
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_logout_invalid_token(self):
        url = reverse('token_refresh')
        data = {
            'refresh': 'invalidtoken'
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)