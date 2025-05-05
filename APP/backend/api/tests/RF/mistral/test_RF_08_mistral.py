from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from django.contrib.auth.models import User
from api.models import Tarea

class TareaDeleteTestCase(APITestCase):

    def setUp(self):
        # Crear un usuario de prueba
        self.user = User.objects.create_user(username='testuser', password='testpassword')

        # Autenticar al usuario
        self.client.login(username='testuser', password='testpassword')

        # Crear una tarea de prueba
        self.tarea = Tarea.objects.create(
            titulo='Tarea de prueba',
            descripcion='Descripción de la tarea de prueba',
            usuario=self.user
        )

    def test_delete_tarea(self):
        # URL para eliminar la tarea
        url = reverse('tarea-delete', kwargs={'pk': self.tarea.pk})

        # Realizar la solicitud DELETE
        response = self.client.delete(url)

        # Verificar que la respuesta sea 204 NO CONTENT
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)

        # Verificar que la tarea haya sido eliminada de la base de datos
        self.assertFalse(Tarea.objects.filter(pk=self.tarea.pk).exists())

    def test_delete_tarea_not_found(self):
        # URL para eliminar una tarea que no existe
        url = reverse('tarea-delete', kwargs={'pk': 999})

        # Realizar la solicitud DELETE
        response = self.client.delete(url)

        # Verificar que la respuesta sea 404 NOT FOUND
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_delete_tarea_unauthenticated(self):
        # Desautenticar al usuario
        self.client.logout()

        # URL para eliminar la tarea
        url = reverse('tarea-delete', kwargs={'pk': self.tarea.pk})

        # Realizar la solicitud DELETE
        response = self.client.delete(url)

        # Verificar que la respuesta sea 403 FORBIDDEN
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)