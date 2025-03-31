import json
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from django.contrib.auth.models import User


class UserRegistrationTests(APITestCase):

    def test_user_registration_success(self):
        """
        Asegura que un nuevo usuario puede registrarse exitosamente.
        """
        url = reverse('register')
        data = {
            'username': 'testuser',
            'email': 'test@example.com',
            'password': 'testpassword123'
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(User.objects.count(), 1)
        self.assertEqual(User.objects.get().username, 'testuser')

    def test_user_registration_empty_fields(self):
        """
        Asegura que se retorna un error si algun campo esta vacio
        """
        url = reverse('register')
        data = {
            'username': '',
            'email': 'test@example.com',
            'password': 'testpassword123'
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

        data = {
            'username': 'testuser',
            'email': '',
            'password': 'testpassword123'
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

        data = {
            'username': 'testuser',
            'email': 'test@example.com',
            'password': ''
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)


    def test_user_registration_username_already_exists(self):
        """
        Asegura que se retorna un error si el nombre de usuario ya existe.
        """
        User.objects.create_user(username='existinguser', email='existing@example.com', password='password123')
        url = reverse('register')
        data = {
            'username': 'existinguser',
            'email': 'new@example.com',
            'password': 'newpassword123'
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("El nombre de usuario ya está registrado.", str(response.data))

    def test_user_registration_email_already_exists(self):
        """
        Asegura que se retorna un error si el correo electrónico ya existe.
        """
        User.objects.create_user(username='existinguser', email='existing@example.com', password='password123')
        url = reverse('register')
        data = {
            'username': 'newuser',
            'email': 'existing@example.com',
            'password': 'newpassword123'
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("El correo electrónico ya está registrado.", str(response.data))

    def test_user_registration_password_too_short(self):
        """
        Asegura que se retorna un error si la contraseña es menor a 8 caracteres.
        """
        url = reverse('register')
        data = {
            'username': 'testuser',
            'email': 'test@example.com',
            'password': 'short'
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("La contraseña debe tener al menos 8 caracteres.", str(response.data['password']))