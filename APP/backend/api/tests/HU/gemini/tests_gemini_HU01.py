from django.test import TestCase
from django.urls import reverse
from rest_framework import status
from django.contrib.auth.models import User
import json

class UserRegistrationTest(TestCase):

    def test_user_registration(self):
        url = reverse('register')  # Asegúrate de que 'register' coincida con el nombre en urls.py
        data = {
            'username': 'testuser',
            'email': 'test@example.com',
            'password': 'Testpass123'
        }
        response = self.client.post(url, data, format='json')

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(User.objects.count(), 1)  # Verificar que se creó un usuario
        self.assertEqual(User.objects.get().username, 'testuser')
        self.assertEqual(User.objects.get().email, 'test@example.com')
        # No verificamos la contraseña directamente ya que está hasheada

    def test_user_registration_missing_fields(self):
        url = reverse('register')
        data = {
            'username': 'testuser',
            'email': 'test@example.com',
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("error", json.loads(response.content.decode('utf-8')))

    def test_user_registration_short_password(self):
        url = reverse('register')
        data = {
            'username': 'testuser2',
            'email': 'test2@example.com',
            'password': 'short'
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_user_registration_duplicate_username(self):
        # Crear un usuario existente
        User.objects.create_user(username='existinguser', email='existing@example.com', password='password123')

        url = reverse('register')
        data = {
            'username': 'existinguser',
            'email': 'new@example.com',
            'password': 'password123'
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("error", json.loads(response.content.decode('utf-8')))

    def test_user_registration_duplicate_email(self):
        # Crear un usuario existente
        User.objects.create_user(username='existinguser', email='existing@example.com', password='password123')

        url = reverse('register')
        data = {
            'username': 'newuser',
            'email': 'existing@example.com',
            'password': 'password123'
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("error", json.loads(response.content.decode('utf-8')))