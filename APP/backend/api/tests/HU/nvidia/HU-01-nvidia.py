# /home/jesus/python/TFG/APP/backend/api/tests/HU/nvidia/HU-01-nvidia.py

from django.test import TestCase, Client
from django.urls import reverse
from django.contrib.auth.models import User
from rest_framework import status

class HU01RegistroUsuariosTestCase(TestCase):
    def setUp(self):
        self.client = Client()

    def test_campos_obligatorios(self):
        response = self.client.post(reverse('register'))
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertJSONEqual(response.json(), {'error': 'Todos los campos son obligatorios.'})

    def test_contrasena_minimo_8_caracteres(self):
        data = {'username': 'testuser', 'email': 'test@example.com', 'password': 'short'}
        response = self.client.post(reverse('register'), data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertJSONEqual(response.json(), {'error': 'La contraseña debe tener al menos 8 caracteres.'})

    def test_nombre_y_correo_no_registrados(self):
        data = {'username': 'testuser', 'email': 'test@example.com', 'password': 'longenoughpassword'}
        response = self.client.post(reverse('register'), data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_nombre_y_correo_ya_registrados(self):
        User.objects.create_user(username='existinguser', email='existing@example.com', password='password')
        data = {'username': 'existinguser', 'email': 'existing@example.com', 'password': 'longenoughpassword'}
        response = self.client.post(reverse('register'), data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertJSONEqual(response.json(), {'error': 'El nombre de usuario ya está registrado.'})