# /home/jesus/python/TFG/APP/backend/api/tests/HU/gemini/HU-15-gemini.py
from rest_framework import status
from rest_framework.test import APITestCase
from django.contrib.auth.models import User
from api.models import Tarea, Comentario

class ComentarioDeleteTest(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(username='testuser', password='testpassword')
        self.tarea = Tarea.objects.create(titulo='Tarea de prueba', usuario=self.user)
        self.comentario = Comentario.objects.create(tarea=self.tarea, usuario=self.user, texto='Comentario de prueba')
        self.client.force_authenticate(user=self.user)

    def test_delete_comentario_success(self):
        url = f'/api/comentarios/delete/{self.comentario.id}/'
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(Comentario.objects.count(), 0)

    def test_delete_comentario_unauthorized(self):
        other_user = User.objects.create_user(username='otheruser', password='otherpassword')
        self.client.force_authenticate(user=other_user)
        url = f'/api/comentarios/delete/{self.comentario.id}/'
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_delete_comentario_not_found(self):
        url = '/api/comentarios/delete/999/'  # ID que no existe
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)