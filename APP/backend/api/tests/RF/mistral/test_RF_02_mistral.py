# /home/jesus/python/TFG/APP/backend/api/tests/RF/mistral/test_RF_02_mistral.py

from django.contrib.auth.models import User
from rest_framework.test import APITestCase
from rest_framework import status
from django.urls import reverse

class UserRegistrationTests(APITestCase):

    def setUp(self):
        self.register_url = reverse('register')
        self.existing_user_data = {
            'username': 'existinguser',
            'email': 'existinguser@example.com',
            'password': 'existingpassword123'
        }
        self.new_user_data = {
            'username': 'newuser',
            'email': 'newuser@example.com',
            'password': 'newpassword123'
        }
        User.objects.create_user(**self.existing_user_data)

    def test_register_user_with_existing_email(self):
        """
        Test that a user cannot register with an email that is already registered.
        """
        response = self.client.post(self.register_url, {
            'username': 'newuser2',
            'email': self.existing_user_data['email'],
            'password': 'newpassword123'
        })
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data['error'], "El correo electrónico ya está registrado.")

    def test_register_user_with_new_email(self):
        """
        Test that a user can register with a new email.
        """
        response = self.client.post(self.register_url, self.new_user_data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(User.objects.count(), 2)
        self.assertEqual(User.objects.get(email=self.new_user_data['email']).username, self.new_user_data['username'])

    def test_register_user_without_email(self):
        """
        Test that a user cannot register without providing an email.
        """
        response = self.client.post(self.register_url, {
            'username': 'newuser3',
            'password': 'newpassword123'
        })
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data['error'], "Todos los campos son obligatorios.")

    def test_register_user_without_username(self):
        """
        Test that a user cannot register without providing a username.
        """
        response = self.client.post(self.register_url, {
            'email': 'newuser4@example.com',
            'password': 'newpassword123'
        })
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data['error'], "Todos los campos son obligatorios.")

    def test_register_user_without_password(self):
        """
        Test that a user cannot register without providing a password.
        """
        response = self.client.post(self.register_url, {
            'username': 'newuser5',
            'email': 'newuser5@example.com',
        })
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data['error'], "Todos los campos son obligatorios.")