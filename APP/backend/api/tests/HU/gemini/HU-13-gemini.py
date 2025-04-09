# /home/jesus/python/TFG/APP/backend/api/tests/HU/gemini/HU-13-gemini.py
from rest_framework import status
from rest_framework.test import APITestCase
from django.contrib.auth.models import User
from api.models import Tarea, Comentario

class ComentarioTests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(username='testuser', password='testpassword')
        self.tarea = Tarea.objects.create(titulo='Test Tarea', usuario=self.user)
        self.client.force_authenticate(user=self.user)

    def test_crear_comentario_exitoso(self):
        url = f'/api/tareas/{self.tarea.id}/comentarios/'
        data = {'texto': 'Este es un comentario de prueba'}
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Comentario.objects.count(), 1)
        comentario = Comentario.objects.first()
        self.assertEqual(comentario.texto, 'Este es un comentario de prueba')
        self.assertEqual(comentario.tarea, self.tarea)
        self.assertEqual(comentario.usuario, self.user)

    def test_crear_comentario_tarea_no_existente(self):
        url = '/api/tareas/999/comentarios/'
        data = {'texto': 'Este es un comentario de prueba'}
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        self.assertEqual(response.data['detail'], 'Tarea no encontrada')

    def test_crear_comentario_sin_texto(self):
        url = f'/api/tareas/{self.tarea.id}/comentarios/'
        data = {'texto': ''}
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('texto', response.data)