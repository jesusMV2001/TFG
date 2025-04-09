# /home/jesus/python/TFG/APP/backend/api/tests/HU/nvidia/HU-15-nvidia.py
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase, APIClient
from api.models import Comentario, Tarea
from django.contrib.auth.models import User

class HU15EliminarComentarios(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user('usuario', 'usuario@example.com', 'password')
        self.tarea = Tarea.objects.create(titulo='Tarea 1', usuario=self.user)
        self.comentario = Comentario.objects.create(texto='Comentario 1', usuario=self.user, tarea=self.tarea)

        self.client.force_authenticate(user=self.user)

    def test_eliminar_comentario(self):
        url = reverse('comentario-delete', kwargs={'pk': self.comentario.pk})
        response = self.client.delete(url)

        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(Comentario.objects.filter(pk=self.comentario.pk).exists())

    def test_mensaje_al_eliminar_comentario(self):
        url = reverse('comentario-delete', kwargs={'pk': self.comentario.pk})
        response = self.client.delete(url, format='json')

        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertIn('message', response.data)
        self.assertEqual(response.data['message'], 'Comentario eliminado correctamente.')