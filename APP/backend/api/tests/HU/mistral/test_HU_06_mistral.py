import json
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from django.contrib.auth.models import User
from api.models import Tarea

class TareaDeleteTestCase(APITestCase):
    def setUp(self):
        # Crear un usuario de prueba
        self.user = User.objects.create_user(username='testuser', password='testpassword')

        # Crear una tarea de prueba
        self.tarea = Tarea.objects.create(
            titulo='Tarea de prueba',
            descripcion='Descripción de prueba',
            estado='pendiente',
            prioridad='media',
            usuario=self.user
        )

        # Autenticar al usuario
        self.client.login(username='testuser', password='testpassword')

    def test_delete_tarea_successfully(self):
        url = reverse('tarea-delete', kwargs={'pk': self.tarea.id})
        response = self.client.delete(url)

        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(Tarea.objects.filter(id=self.tarea.id).exists())

    def test_delete_tarea_not_found(self):
        url = reverse('tarea-delete', kwargs={'pk': 9999})
        response = self.client.delete(url)

        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        self.assertEqual(json.loads(response.content), {'detail': 'Not found.'})

    def test_delete_tarea_unauthenticated(self):
        self.client.logout()
        url = reverse('tarea-delete', kwargs={'pk': self.tarea.id})
        response = self.client.delete(url)

        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        self.assertEqual(json.loads(response.content), {'detail': 'Authentication credentials were not provided.'})

    def test_delete_tarea_unauthorized(self):
        # Crear otro usuario
        another_user = User.objects.create_user(username='anotheruser', password='anotherpassword')
        self.client.login(username='anotheruser', password='anotherpassword')

        url = reverse('tarea-delete', kwargs={'pk': self.tarea.id})
        response = self.client.delete(url)

        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        self.assertEqual(json.loads(response.content), {'detail': 'Not found.'})