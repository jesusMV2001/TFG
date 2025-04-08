# /home/jesus/python/TFG/APP/backend/api/tests/HU/gemini/HU-01-gemini.py
from django.test import TestCase
from django.contrib.auth.models import User
from rest_framework.test import APIClient
from rest_framework import status
from django.urls import reverse

class UserRegistrationTest(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.registration_url = reverse('register')

    def test_user_can_register_with_valid_data(self):
        data = {
            'username': 'testuser',
            'email': 'test@example.com',
            'password': 'password123'
        }
        response = self.client.post(self.registration_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(User.objects.count(), 1)
        self.assertEqual(User.objects.get().username, 'testuser')
        self.assertEqual(User.objects.get().email, 'test@example.com')

    def test_user_cannot_register_with_existing_username(self):
        User.objects.create_user(username='existinguser', password='password123')
        data = {
            'username': 'existinguser',
            'email': 'test@example.com',
            'password': 'password123'
        }
        response = self.client.post(self.registration_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('error', response.data)
        self.assertEqual(response.data['error'], 'El nombre de usuario ya está registrado.')

    def test_user_cannot_register_with_existing_email(self):
        User.objects.create_user(username='testuser', email='existing@example.com', password='password123')
        data = {
            'username': 'newuser',
            'email': 'existing@example.com',
            'password': 'password123'
        }
        response = self.client.post(self.registration_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('error', response.data)
        self.assertEqual(response.data['error'], 'El correo electrónico ya está registrado.')

    def test_user_cannot_register_with_missing_fields(self):
        data = {
            'username': 'testuser',
            'email': 'test@example.com',
        }
        response = self.client.post(self.registration_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('error', response.data)
        self.assertEqual(response.data['error'], 'Todos los campos son obligatorios.')