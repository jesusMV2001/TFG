from django.test import TestCase
from django.contrib.auth.models import User
from django.urls import reverse
from rest_framework.test import APIClient
from rest_framework import status

class PasswordValidationTest(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.register_url = reverse('register')

    def test_password_less_than_8_characters(self):
        data = {
            'username': 'testuser',
            'email': 'testuser@example.com',
            'password': 'short'
        }
        response = self.client.post(self.register_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data['password'][0], 'La contraseña debe tener al menos 8 caracteres.')

    def test_password_exactly_8_characters(self):
        data = {
            'username': 'testuser',
            'email': 'testuser@example.com',
            'password': '12345678'
        }
        response = self.client.post(self.register_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(User.objects.filter(username='testuser').exists())

    def test_password_more_than_8_characters(self):
        data = {
            'username': 'testuser',
            'email': 'testuser@example.com',
            'password': '123456789'
        }
        response = self.client.post(self.register_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(User.objects.filter(username='testuser').exists())