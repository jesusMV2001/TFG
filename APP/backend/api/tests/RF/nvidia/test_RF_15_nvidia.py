from rest_framework import status
from rest_framework.test import APITestCase, APIClient
from django.urls import reverse
from .models import Etiqueta, Tarea, User

class TestRF15EliminarEtiquetaTarea(APITestCase):

    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user('testuser', 'test@example.com', 'password123')
        self.tarea = Tarea.objects.create(titulo='Tarea de prueba', usuario=self.user)
        self.etiqueta = Etiqueta.objects.create(nombre='Etiqueta de prueba', tarea=self.tarea)
        self.client.force_authenticate(user=self.user)

    def test_eliminar_etiqueta_existe(self):
        url = reverse('etiqueta-delete', kwargs={'pk': self.etiqueta.pk})
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(Etiqueta.objects.filter(pk=self.etiqueta.pk).exists())

    def test_eliminar_etiqueta_no_existe(self):
        url = reverse('etiqueta-delete', kwargs={'pk': 99999})  # Etiqueta inexistente
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_eliminar_etiqueta_sin_autenticar(self):
        self.client.force_authenticate(user=None)
        url = reverse('etiqueta-delete', kwargs={'pk': self.etiqueta.pk})
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_eliminar_etiqueta_de_otro_usuario(self):
        otro_usuario = User.objects.create_user('otro_usuario', 'otro@example.com', 'password123')
        altri_tarea = Tarea.objects.create(titulo='Otra tarea de prueba', usuario=otro_usuario)
        otra_etiqueta = Etiqueta.objects.create(nombre='Otra etiqueta de prueba', tarea=altri_tarea)
        self.client.force_authenticate(user=self.user)
        url = reverse('etiqueta-delete', kwargs={'pk': otra_etiqueta.pk})
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        self.assertTrue(Etiqueta.objects.filter(pk=otra_etiqueta.pk).exists())