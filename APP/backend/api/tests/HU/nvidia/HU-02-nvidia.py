# /home/jesus/python/TFG/APP/backend/api/tests/HU/nvidia/HU-02-nvidia.py

from django.contrib.auth.models import User
from django.test import TestCase, Client
from rest_framework import status
from rest_framework.authtoken.models import Token
from api.models import UserCreateView

class HU02TestCase(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(username='usuario_de_prueba', email='correo@example.com', password='contraseña_de_prueba')
        self.token = Token.objects.create(user=self.user)

    def test_inicio_sesion_exitoso(self):
        client = Client()
        response = client.post('/api/token/', {'username': 'usuario_de_prueba', 'password': 'contraseña_de_prueba'})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('access', response.data)

    def test_inicio_sesion_fallido(self):
        client = Client()
        response = client.post('/api/token/', {'username': 'usuario_invalido', 'password': 'contraseña_invalida'})
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        self.assertIn('error', response.data)

    def test_mantener_sesion_activa(self):
        client = Client()
        client.force_authenticate(user=self.user)
        response = client.get('/api/tareas/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_registro_usuario_nuevo(self):
        client = Client()
        data = {'username': 'nuevo_usuario', 'email': 'nuevo_correo@example.com', 'password': 'nueva_contraseña'}
        response = client.post('/api/user/register/', data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(User.objects.filter(username='nuevo_usuario').exists())