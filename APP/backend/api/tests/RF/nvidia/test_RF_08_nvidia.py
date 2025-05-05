from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase, APIClient
from django.contrib.auth.models import User
from api.models import Tarea

class TestEliminarTarea(APITestCase):

    def setUp(self):
        self.user = User.objects.create_superuser('testuser', 'testemail@example.com', 'strongpassword123')
        self.client.force_authenticate(user=self.user)
        self.tarea = Tarea.objects.create(
            titulo='Tarea de prueba',
            descripcion='Esta es una tarea de prueba',
            usuario=self.user
        )

    def test_eliminar_tarea_existe(self):
        url = reverse('tarea-delete', kwargs={'pk': self.tarea.id})
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(Tarea.objects.filter(id=self.tarea.id).exists())

    def test_eliminar_tarea_no_existe(self):
        url = reverse('tarea-delete', kwargs={'pk': 9999})  # ID de tarea inexistente
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_eliminar_tarea_sin_autenticacion(self):
        self.client.force_authenticate(user=None)
        url = reverse('tarea-delete', kwargs={'pk': self.tarea.id})
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_eliminar_tarea_no_propia(self):
        otro_usuario = User.objects.create_user('otro_testuser', 'otro_testemail@example.com', 'strongpassword123')
        otra_tarea = Tarea.objects.create(
            titulo='Otra tarea de prueba',
            descripcion='Esta es otra tarea de prueba',
            usuario=otro_usuario
        )
        self.client.force_authenticate(user=self.user)
        url = reverse('tarea-delete', kwargs={'pk': otra_tarea.id})
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)  # La tarea no es del usuario autenticado