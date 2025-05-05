import json
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from django.contrib.auth.models import User

class TestRegistroUsuario(APITestCase):

    def test_registro_usuario_exitoso(self):
        """
        Test para registrar un usuario con éxito
        """
        url = reverse('register')
        data = {
            'username': 'nuevousuario',
            'email': 'nuevousuario@example.com',
            'password': 'contrasena123'
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(User.objects.count(), 1)
        self.assertEqual(User.objects.get().username, data['username'])

    def test_registro_usuario_sin_datos(self):
        """
        Test para registrar un usuario sin datos (debe fallar)
        """
        url = reverse('register')
        data = {}
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(User.objects.count(), 0)

    def test_registro_usuario_con_campos_vacios(self):
        """
        Test para registrar un usuario con campos vacíos (debe fallar)
        """
        url = reverse('register')
        data = {
            'username': '',
            'email': '',
            'password': ''
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(User.objects.count(), 0)

    def test_registro_usuario_con_nombre_usuario_existente(self):
        """
        Test para registrar un usuario con nombre de usuario existente (debe fallar)
        """
        User.objects.create_user(username='existente', email='existente@example.com', password='contrasena123')
        url = reverse('register')
        data = {
            'username': 'existente',
            'email': 'nuevo@example.com',
            'password': 'contrasena123'
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(User.objects.count(), 1)

    def test_registro_usuario_con_email_existente(self):
        """
        Test para registrar un usuario con correo electrónico existente (debe fallar)
        """
        User.objects.create_user(username='existente', email='existente@example.com', password='contrasena123')
        url = reverse('register')
        data = {
            'username': 'nuevo',
            'email': 'existente@example.com',
            'password': 'contrasena123'
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(User.objects.count(), 1)

    def test_registro_usuario_con_contrasena_corta(self):
        """
        Test para registrar un usuario con contraseña corta (debe fallar)
        """
        url = reverse('register')
        data = {
            'username': 'nuevousuario',
            'email': 'nuevousuario@example.com',
            'password': '123'
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(User.objects.count(), 0)