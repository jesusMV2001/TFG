# /home/jesus/python/TFG/APP/backend/api/tests/HU/nvidia/HU-06-nvidia.py

from django.test import TestCase, Client
from django.urls import reverse
from api.models import Tarea
from rest_framework import status
from rest_framework.test import APITestCase, APIClient
from rest_framework.authtoken.models import Token

class TareaDeleteTest(APITestCase):

    def setUp(self):
        self.user = User.objects.create_user(username='testuser', password='12345')
        self.token = Token.objects.create(user=self.user)
        self.tarea = Tarea.objects.create(
            titulo='Tarea de ejemplo',
            descripcion='Descripción de ejemplo',
            usuario=self.user,
        )
        self.api_client = APIClient()
        self.api_client.credentials(HTTP_AUTHORIZATION='Token ' + self.token.key)

    def test_delete_tarea_success(self):
        response = self.api_client.delete(reverse('tarea-delete', args=[self.tarea.id]))
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)

    def test_delete_tarea_error(self):
        # Intentar eliminar tarea que no existe
        response = self.api_client.delete(reverse('tarea-delete', args=[999]))
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_delete_tarea_unauthorized(self):
        # Desautenticar y probar eliminar tarea
        self.api_client.credentials()
        response = self.api_client.delete(reverse('tarea-delete', args=[self.tarea.id]))
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)