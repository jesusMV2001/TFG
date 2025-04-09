# /home/jesus/python/TFG/APP/backend/api/tests/HU/gemini/HU-01-gemini.py
from django.test import TestCase
from django.contrib.auth.models import User
from rest_framework.test import APIClient
from rest_framework import status

class UserRegistrationTest(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.register_url = '/api/user/register/'

    def test_user_can_register_with_valid_data(self):
        data = {
            'username': 'newuser',
            'email': 'newuser@example.com',
            'password': 'StrongPassword123'
        }
        response = self.client.post(self.register_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(User.objects.count(), 1)
        self.assertEqual(User.objects.get().username, 'newuser')

    def test_user_cannot_register_with_short_password(self):
        data = {
            'username': 'shortpassuser',
            'email': 'shortpassuser@example.com',
            'password': 'short'
        }
        response = self.client.post(self.register_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('La contraseña debe tener al menos 8 caracteres.', str(response.data))
        self.assertEqual(User.objects.count(), 0)

    def test_user_cannot_register_with_existing_username(self):
        User.objects.create_user(username='existinguser', email='test@example.com', password='StrongPassword123')
        data = {
            'username': 'existinguser',
            'email': 'newemail@example.com',
            'password': 'AnotherStrongPassword123'
        }
        response = self.client.post(self.register_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('El nombre de usuario ya está registrado.', str(response.data))
        self.assertEqual(User.objects.count(), 1)

    def test_user_cannot_register_with_existing_email(self):
        User.objects.create_user(username='testuser', email='existingemail@example.com', password='StrongPassword123')
        data = {
            'username': 'newuser',
            'email': 'existingemail@example.com',
            'password': 'AnotherStrongPassword123'
        }
        response = self.client.post(self.register_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('El correo electrónico ya está registrado.', str(response.data))
        self.assertEqual(User.objects.count(), 1)

    def test_user_cannot_register_with_missing_data(self):
        data = {
            'username': 'missingdatauser',
            'email': '',
            'password': 'StrongPassword123'
        }
        response = self.client.post(self.register_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('Todos los campos son obligatorios.', str(response.data))
        self.assertEqual(User.objects.count(), 0)