import json
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase, APIClient
from django.contrib.auth.models import User
from api.models import Comentario, Tarea

class ComentarioDeleteTestCase(APITestCase):

    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(username='testuser', email='testuser@example.com', password='testpassword')
        self.tarea = Tarea.objects.create(titulo="Tarea de prueba", usuario=self.user)
        self.client.login(username='testuser', password='testpassword')
        self.comentario = Comentario.objects.create(texto="Comentario de prueba", tarea=self.tarea, usuario=self.user)

    def test_delete_comentario(self):
        url = reverse('comentario-delete', kwargs={'pk': self.comentario.pk})
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(Comentario.objects.filter(pk=self.comentario.pk).exists())

    def test_delete_comentario_not_found(self):
        url = reverse('comentario-delete', kwargs={'pk': 9999})
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_delete_comentario_unauthorized(self):
        self.client.logout()
        url = reverse('comentario-delete', kwargs={'pk': self.comentario.pk})
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_delete_comentario_not_owner(self):
        other_user = User.objects.create_user(username='otheruser', email='otheruser@example.com', password='otherpassword')
        other_comentario = Comentario.objects.create(texto="Comentario de otro usuario", tarea=self.tarea, usuario=other_user)
        url = reverse('comentario-delete', kwargs={'pk': other_comentario.pk})
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        self.assertTrue(Comentario.objects.filter(pk=other_comentario.pk).exists())

    def test_delete_comentario_message(self):
        url = reverse('comentario-delete', kwargs={'pk': self.comentario.pk})
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(response.data, {"detail": "Comentario eliminado correctamente."})