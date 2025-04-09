# /home/jesus/python/TFG/APP/backend/api/tests/HU/nvidia/HU-13-nvidia.py

from rest_framework import status
from rest_framework.test import APITestCase
from .models import Comentario, Tarea
from django.contrib.auth.models import User

class HU13CrearComentariosTestCase(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(username='john', password='password', email='john@example.com')
        self.tarea = Tarea.objects.create(titulo='Tarea ejemplo', usuario=self.user)
        self.api_authentication()

    def api_authentication(self):
        response = self.client.post('/api/token/', {'username': 'john', 'password': 'password'}, format='json')
        self.token = response.data['access']
        self.client.credentials(HTTP_AUTHORIZATION='Bearer ' + self.token)

    def test_crear_comentario_vacio(self):
        response = self.client.post(f'/api/tareas/{self.tarea.id}/comentarios/', {'texto': ''}, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('El comentario no puede estar vacío', str(response.data))

    def test_crear_comentario(self):
        response = self.client.post(f'/api/tareas/{self.tarea.id}/comentarios/', {'texto': 'Nuevo comentario'}, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Comentario.objects.count(), 1)

    def test_ver_comentario_creado(self):
        Comentario.objects.create(tarea=self.tarea, usuario=self.user, texto='Comentario existente')
        response = self.client.get(f'/api/tareas/{self.tarea.id}/comentarios/', format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)