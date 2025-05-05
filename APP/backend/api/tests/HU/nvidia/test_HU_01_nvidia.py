import json
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase, APIClient
from django.contrib.auth.models import User

class HU01RegistroUsuariosTestCase(APITestCase):

    def setUp(self):
        self.client = APIClient()
        self.url_registro = reverse('register')

    def test_registro_exitoso(self):
        # Datos válidos
        data = {
            'username': 'nuevo_usuario',
            'email': 'nuevo_usuario@example.com',
            'password': 'P@ssw0rd123'
        }
        response = self.client.post(self.url_registro, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(User.objects.count(), 1)
        self.assertEqual(User.objects.get().username, data['username'])

    def test_campos_vacios(self):
        # Campos vacíos
        data = {
            'username': '',
            'email': '',
            'password': ''
        }
        response = self.client.post(self.url_registro, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(json.loads(response.content)['error'], "Todos los campos son obligatorios.")

    def test_contrasena_corta(self):
        # Contraseña corta
        data = {
            'username': 'nuevo_usuario',
            'email': 'nuevo_usuario@example.com',
            'password': 'abc'
        }
        response = self.client.post(self.url_registro, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(json.loads(response.content)['error'], "La contraseña debe tener al menos 8 caracteres.")

    def test_correo_ya_registrado(self):
        # Correo ya registrado
        User.objects.create_user(username='usuario_existente', email='usuario_existente@example.com', password='P@ssw0rd123')
        data = {
            'username': 'nuevo_usuario',
            'email': 'usuario_existente@example.com',
            'password': 'P@ssw0rd123'
        }
        response = self.client.post(self.url_registro, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(json.loads(response.content)['error'], "El correo electrónico ya está registrado.")

    def test_nombre_usuario_ya_registrado(self):
        # Nombre de usuario ya registrado
        User.objects.create_user(username='usuario_existente', email='usuario_existente@example.com', password='P@ssw0rd123')
        data = {
            'username': 'usuario_existente',
            'email': 'nuevo_usuario@example.com',
            'password': 'P@ssw0rd123'
        }
        response = self.client.post(self.url_registro, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(json.loads(response.content)['error'], "El nombre de usuario ya está registrado.")