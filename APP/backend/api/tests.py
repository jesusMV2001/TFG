from django.contrib.auth.models import User
from rest_framework.test import APITestCase
from rest_framework import status


# Prueba con los dos primeros requisitos hechos por gpt

class UserRegistrationTests(APITestCase):
    def setUp(self):
        # Crear un usuario existente para probar la validación de correo único
        self.existing_user = User.objects.create_user(
            username="existinguser",
            email="existing@example.com",
            password="password123"
        )
        self.register_url = "/api/register/"  # Cambia esta URL si es diferente en tu configuración

    def test_user_registration_success(self):
        """
        Verifica que un usuario pueda registrarse correctamente.
        """
        payload = {
            "username": "newuser",
            "email": "newuser@example.com",
            "password": "password123"
        }
        response = self.client.post(self.register_url, payload)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertIn("id", response.data)  # Verifica que el ID del usuario esté en la respuesta
        self.assertEqual(User.objects.count(), 2)  # Debe haber dos usuarios en la base de datos

    def test_user_registration_email_already_exists(self):
        """
        Verifica que no se pueda registrar un usuario con un correo ya existente.
        """
        payload = {
            "username": "anotheruser",
            "email": "existing@example.com",  # Correo ya registrado
            "password": "password123"
        }
        response = self.client.post(self.register_url, payload)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("error", response.data)  # Verifica que el mensaje de error esté presente
        self.assertEqual(response.data["error"], "El correo electrónico ya está registrado.")