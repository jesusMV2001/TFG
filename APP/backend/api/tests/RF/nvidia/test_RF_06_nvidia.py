# /home/jesus/python/TFG/APP/backend/api/tests/RF/nvidia/test_RF_06_nvidia.py

from django.urls import reverse
from rest_framework import status
from rest_framework.authtoken.models import Token
from rest_framework.test import APITestCase, APIClient
from django.contrib.auth.models import User
from ..models import Tarea

class TestTareaListado(APITestCase):

    def setUp(self):
        self.user1 = User.objects.create_user(username='usuario1', password='password123', email='usuario1@example.com')
        self.user2 = User.objects.create_user(username='usuario2', password='password123', email='usuario2@example.com')
        
        # Crear tareas para usuario1
        Tarea.objects.create(titulo='Tarea 1 usuario 1', descripcion='Descripción 1', usuario=self.user1)
        Tarea.objects.create(titulo='Tarea 2 usuario 1', descripcion='Descripción 2', usuario=self.user1)
        
        # Crear tareas para usuario2
        Tarea.objects.create(titulo='Tarea 1 usuario 2', descripcion='Descripción 1', usuario=self.user2)
        Tarea.objects.create(titulo='Tarea 2 usuario 2', descripcion='Descripción 2', usuario=self.user2)

        # Obtener token de autenticación para usuario1
        self.token, _ = Token.objects.get_or_create(user=self.user1)
        self.client = APIClient()
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + self.token.key)

    def test_listado_tareas CreateMap_propio_usuario(self):
        # Verificar listado de tareas del usuario autenticado
        response = self.client.get(reverse('tarea-list-create'))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 2)  # Debe devolver 2 tareas del usuario1

    def test_listado_tareas_no_devuelve_tareas_otros_usuarios(self):
        # Verificar que no se devuelven tareas de otros usuarios
        response = self.client.get(reverse('tarea-list-create'))
        for tarea in response.data:
            self.assertEqual(tarea['usuario'], self.user1.username)

    def test_listado_tareas_sin_autenticar_devuelve_error(self):
        # Verificar error al acceder sin autenticación
        client_anonimo = APIClient()
        response = client_anonimo.get(reverse('tarea-list-create'))
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)