# /home/jesus/python/TFG/APP/backend/api/tests/HU/mistral/HU-01-mistral.py
from django.test import TestCase
from rest_framework import status
from rest_framework.test import APIClient
from django.contrib.auth.models import User
from django.urls import reverse

class UserRegistrationTest(TestCase):

    def setUp(self):
        self.client = APIClient()
        self.register_url = reverse('register')

    def test_user_registration_success(self):
        data = {
            'username': 'testuser',
            'email': 'test@example.com',
            'password': 'password123'
        }
        response = self.client.post(self.register_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(User.objects.count(), 1)
        self.assertEqual(User.objects.get().username, 'testuser')

    def test_user_registration_missing_fields(self):
        data = {
            'username': '',
            'email': '',
            'password': ''
        }
        response = self.client.post(self.register_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data['error'], 'Todos los campos son obligatorios.')

    def test_user_registration_short_password(self):
        data = {
            'username': 'testuser',
            'email': 'test@example.com',
            'password': 'short'
        }
        response = self.client.post(self.register_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data['password'][0], 'La contraseña debe tener al menos 8 caracteres.')

    def test_user_registration_existing_username(self):
        User.objects.create_user(username='existinguser', email='existing@example.com', password='password123')
        data = {
            'username': 'existinguser',
            'email': 'new@example.com',
            'password': 'password123'
        }
        response = self.client.post(self.register_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data['error'], 'El nombre de usuario ya está registrado.')

    def test_user_registration_existing_email(self):
        User.objects.create_user(username='existinguser', email='existing@example.com', password='password123')
        data = {
            'username': 'newuser',
            'email': 'existing@example.com',
            'password': 'password123'
        }
        response = self.client.post(self.register_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data['error'], 'El correo electrónico ya está registrado.')