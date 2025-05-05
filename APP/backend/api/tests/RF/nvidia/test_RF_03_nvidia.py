from django.test import TestCase
from rest_framework.test import APIClient
from rest_framework import status
from django.contrib.auth.models import User
from api.serializers import UserSerializer

class TestRF03(TestCase):

    def setUp(self):
        self.client = APIClient()
        self.url = '/api/user/register/'

    def test_contrasena_minimo_8_caracteres(self):
        # Contrasena con menos de 8 caracteres
        data = {
            'username': 'testuser',
            'email': 'test@example.com',
            'password': 'short'
        }
        response = self.client.post(self.url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('La contraseña debe tener al menos 8 caracteres.', response.data['password'])

    def test_contrasenaexactamente_8_caracteres(self):
        # Contrasena con exactamente 8 caracteres
        data = {
            'username': 'testuser',
            'email': 'test@example.com',
            'password': '12345678'
        }
        response = self.client.post(self.url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_contrasena_mas_de_8_caracteres(self):
        # Contrasena con más de 8 caracteres
        data = {
            'username': 'testuser',
            'email': 'test@example.com',
            'password': '123456789'
        }
        response = self.client.post(self.url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201 CREATED)

    def test_validacion_contrasena_within_serializer(self):
        # Verificar que la validación se realice dentro del serializer
        serializer = UserSerializer(data={
            'username': 'testuser',
            'email': 'test@example.com',
            'password': 'short'
        })
        self.assertFalse(serializer.is_valid())
        self.assertIn('La contraseña debe tener al menos 8 caracteres.', serializer.errors['password'])