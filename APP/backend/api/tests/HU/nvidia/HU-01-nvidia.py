# /home/jesus/python/TFG/APP/backend/api/tests/HU/nvidia/HU-01-nvidia.py

from django.test import TestCase, Client
from django.contrib.auth.models import User
from rest_framework import status
from .models import User
from .serializers import UserSerializer

class TestRegistroUsuarios(TestCase):
    def test_registro_exitoso(self):
        data = {
            'username': 'testuser',
            'email': 'test@example.com',
            'password': 'longpassword',
        }
        response = self.client.post('/api/user/register/', data, content_type='application/json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_nombre_usuario_vacio(self):
        data = {
            'username': '',
            'email': 'test@example.com',
            'password': 'longpassword',
        }
        response = self.client.post('/api/user/register/', data, content_type='application/json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.json()['error'], 'Todos los campos son obligatorios.')

    def test_correo_electronico_vacio(self):
        data = {
            'username': 'testuser',
            'email': '',
            'password': 'longpassword',
        }
        response = self.client.post('/api/user/register/', data, content_type='application/json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.json()['error'], 'Todos los campos son obligatorios.')

    def test_contrasena_vacia(self):
        data = {
            'username': 'testuser',
            'email': 'test@example.com',
            'password': '',
        }
        response = self.client.post('/api/user/register/', data, content_type='application/json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.json()['error'], 'Todos los campos son obligatorios.')

    def test_contrasena_corta(self):
        data = {
            'username': 'testuser',
            'email': 'test@example.com',
            'password': 'short',
        }
        response = self.client.post('/api/user/register/', data, content_type='application/json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.json()['error'], 'La contraseña debe tener al menos 8 caracteres.')

    def test_correo_electronico_ya_registrado(self):
        User.objects.create_user(username='existinguser', email='existing@example.com', password='longpassword')
        data = {
            'username': 'testuser',
            'email': 'existing@example.com',
            'password': 'longpassword',
        }
        response = self.client.post('/api/user/register/', data, content_type='application/json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.json()['error'], 'El correo electrónico ya está registrado.')

    def test_nombre_usuario_ya_registrado(self):
        User.objects.create_user(username='existinguser', email='test@example.com', password='longpassword')
        data = {
            'username': 'existinguser',
            'email': 'test2@example.com',
            'password': 'longpassword',
        }
        response = self.client.post('/api/user/register/', data, content_type='application/json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.json()['error'], 'El nombre de usuario ya está registrado.')