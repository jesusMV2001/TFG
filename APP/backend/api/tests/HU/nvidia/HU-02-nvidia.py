# /home/jesus/python/TFG/APP/backend/api/tests/HU/nvidia/HU-02-nvidia.py

from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from .factories import UserFactory
from django.contrib.auth.models import User

class TestHU02InicioSesionAutenticacion(APITestCase):

    def test_iniciar_sesion_credenciales_validas(self):
        user = UserFactory()
        url = reverse('token_obtain_pair')
        data = {'username': user.username, 'password': 'password123'}
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual('access' in response.data, True)

    def test_iniciar_sesion_credenciales_invalidas(self):
        url = reverse('token_obtain_pair')
        data = {'username': 'invalid_user', 'password': 'invalid_password'}
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_mantener_sesion_activa_despues_de_autenticacion(self):
        user = UserFactory()
        url = reverse('token_obtain_pair')
        data = {'username': user.username, 'password': 'password123'}
        response = self.client.post(url, data, format='json')
        access_token = response.data['access']

        # Verificar que el token de acceso funcione en una vista protegida
        tarea_list_url = reverse('tarea-list-create')
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {access_token}')
        response = self.client.get(tarea_list_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)