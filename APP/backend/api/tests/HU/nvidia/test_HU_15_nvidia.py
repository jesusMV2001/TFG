import json
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase, APIClient
from django.contrib.auth.models import User
from api.models import Tarea, Comentario

class TestEliminarComentario(APITestCase):

    def setUp(self):
        self.client = APIClient()
        self.usuario = User.objects.create_user(username='testuser', email='test@email.com', password='strongpassword')
        self.tarea = Tarea.objects.create(titulo='Tarea de Prueba', descripcion='Descripción de la tarea', usuario=self.usuario)
        self.comentario = Comentario.objects.create(texto='Comentario de prueba', tarea=self.tarea, usuario=self.usuario)
        self.url = reverse('comentario-delete', kwargs={'pk': self.comentario.pk})

    def test_eliminar_comentario_autorizado(self):
        self.client.force_authenticate(user=self.usuario)
        response = self.client.delete(self.url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(Comentario.objects.filter(pk=self.comentario.pk).exists())

    def test_eliminar_comentario_no_autorizado(self):
        otro_usuario = User.objects.create_user(username='otrouser', email='otro@email.com', password='strongpassword')
        self.client.force_authenticate(user=otro_usuario)
        response = self.client.delete(self.url)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        self.assertTrue(Comentario.objects.filter(pk=self.comentario.pk).exists())

    def test_eliminar_comentario_no_existente(self):
        self.client.force_authenticate(user=self.usuario)
        url_no_existente = reverse('comentario-delete', kwargs={'pk': 9999})
        response = self.client.delete(url_no_existente)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_eliminar_comentario_sin_autenticar(self):
        response = self.client.delete(self.url)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)