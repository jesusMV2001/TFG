import json
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from django.contrib.auth.models import User


class UserRegistrationTestCase(APITestCase):

    def test_register_user_with_existing_email(self):
        """
        Ensure that the system validates that the email address entered is not already registered.
        """
        # Create a user with a specific email address
        User.objects.create_user(username='testuser', password='testpassword', email='existing@example.com')

        # Attempt to register a new user with the same email address
        url = reverse('register')  # Assuming 'register' is the name of your registration URL
        data = {
            'username': 'newuser',
            'password': 'newpassword',
            'email': 'existing@example.com'
        }
        response = self.client.post(url, data, format='json')

        # Assert that the registration fails with a 400 Bad Request status code
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

        # Assert that the response contains an error message indicating that the email is already registered
        self.assertIn('error', response.data)
        self.assertEqual(response.data['error'], 'El correo electrónico ya está registrado.')