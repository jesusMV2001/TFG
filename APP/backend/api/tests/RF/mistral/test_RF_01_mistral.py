# /home/jesus/python/TFG/APP/backend/api/tests/RF/mistral/test_RF_01_mistral.py

from django.contrib.auth.models import User
from rest_framework import status
from rest_framework.test import APITestCase
from django.urls import reverse

class UserRegistrationTestCase(APITestCase):
    def setUp(self):
        self.register_url = reverse('register')
        self.user_data = {
            'username': 'testuser',
            'email': 'testuser@example.com',
            'password': 'testpassword123'
        }

    def test_user_registration(self):
        response = self.client.post(self.register_url, self.user_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(User.objects.count(), 1)
        self.assertEqual(User.objects.get().username, 'testuser')

    def test_user_registration_missing_fields(self):
        incomplete_data = {
            'username': '',
            'email': 'testuser@example.com',
            'password': 'testpassword123'
        }
        response = self.client.post(self.register_url, incomplete_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(User.objects.count(), 0)

    def test_user_registration_duplicate_username(self):
        User.objects.create_user(username='testuser', email='anotheruser@example.com', password='testpassword123')
        response = self.client.post(self.register_url, self.user_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(User.objects.count(), 1)

    def test_user_registration_duplicate_email(self):
        User.objects.create_user(username='anotheruser', email='testuser@example.com', password='testpassword123')
        response = self.client.post(self.register_url, self.user_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(User.objects.count(), 1)

    def test_user_registration_short_password(self):
        short_password_data = {
            'username': 'testuser',
            'email': 'testuser@example.com',
            'password': 'short'
        }
        response = self.client.post(self.register_url, short_password_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(User.objects.count(), 0)