# /home/jesus/python/TFG/APP/backend/api/tests/HU/mistral/test_HU_01_mistral.py

from django.urls import reverse
from rest_framework.test import APITestCase
from django.contrib.auth.models import User
from rest_framework import status

class UserRegistrationTestCase(APITestCase):

    def test_register_user_success(self):
        url = reverse('register')
        data = {
            'username': 'newuser',
            'email': 'newuser@example.com',
            'password': 'securepassword123'
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(User.objects.count(), 1)
        self.assertEqual(User.objects.get().username, 'newuser')

    def test_register_user_missing_fields(self):
        url = reverse('register')
        data = {
            'username': '',
            'email': 'newuser@example.com',
            'password': 'securepassword123'
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("Todos los campos son obligatorios", response.data['error'])

    def test_register_user_short_password(self):
        url = reverse('register')
        data = {
            'username': 'newuser',
            'email': 'newuser@example.com',
            'password': 'short'
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("La contraseña debe tener al menos 8 caracteres", response.data['password'])

    def test_register_user_existing_username(self):
        User.objects.create_user(username='existinguser', email='existinguser@example.com', password='password123')
        url = reverse('register')
        data = {
            'username': 'existinguser',
            'email': 'newuser@example.com',
            'password': 'securepassword123'
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("El nombre de usuario ya está registrado", response.data['error'])

    def test_register_user_existing_email(self):
        User.objects.create_user(username='existinguser', email='existinguser@example.com', password='password123')
        url = reverse('register')
        data = {
            'username': 'newuser',
            'email': 'existinguser@example.com',
            'password': 'securepassword123'
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("El correo electrónico ya está registrado", response.data['error'])