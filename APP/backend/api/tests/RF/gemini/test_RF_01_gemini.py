import json
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from django.contrib.auth.models import User


class UserRegistrationTests(APITestCase):
    def test_user_registration_success(self):
        url = reverse('register')
        data = {
            'username': 'testuser',
            'email': 'test@example.com',
            'password': 'Testpass123'
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(User.objects.count(), 1)
        self.assertEqual(User.objects.get().username, 'testuser')

    def test_user_registration_missing_fields(self):
        url = reverse('register')
        data = {
            'username': 'testuser',
            'email': 'test@example.com',
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("error", response.data)
        self.assertEqual(response.data["error"], "Todos los campos son obligatorios.")

    def test_user_registration_username_exists(self):
        url = reverse('register')
        User.objects.create_user(username='existinguser', password='password', email='test2@example.com')
        data = {
            'username': 'existinguser',
            'email': 'new@example.com',
            'password': 'Testpass123'
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("error", response.data)
        self.assertEqual(response.data["error"], "El nombre de usuario ya está registrado.")

    def test_user_registration_email_exists(self):
        url = reverse('register')
        User.objects.create_user(username='test2user', password='password', email='existing@example.com')
        data = {
            'username': 'newuser',
            'email': 'existing@example.com',
            'password': 'Testpass123'
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("error", response.data)
        self.assertEqual(response.data["error"], "El correo electrónico ya está registrado.")