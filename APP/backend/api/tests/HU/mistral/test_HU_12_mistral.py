# /home/jesus/python/TFG/APP/backend/api/tests/HU/mistral/test_HU_12_mistral.py

from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from django.contrib.auth.models import User
from api.models import Tarea, Etiqueta

class EtiquetaDeleteTests(APITestCase):

    def setUp(self):
        self.user = User.objects.create_user(username='testuser', password='testpassword')
        self.tarea = Tarea.objects.create(titulo='Tarea de prueba', usuario=self.user)
        self.etiqueta = Etiqueta.objects.create(nombre='Etiqueta de prueba', tarea=self.tarea)
        self.url = reverse('etiqueta-delete', kwargs={'pk': self.etiqueta.id})
        self.client.login(username='testuser', password='testpassword')

    def test_etiqueta_delete_successful(self):
        response = self.client.delete(self.url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(Etiqueta.objects.filter(id=self.etiqueta.id).exists())

    def test_etiqueta_delete_nonexistent(self):
        nonexistent_url = reverse('etiqueta-delete', kwargs={'pk': 9999})
        response = self.client.delete(nonexistent_url)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        self.assertEqual(response.data['error'], 'Etiqueta no encontrada.')

    def test_etiqueta_delete_unauthorized(self):
        self.client.logout()
        response = self.client.delete(self.url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_etiqueta_delete_forbidden(self):
        other_user = User.objects.create_user(username='otheruser', password='otherpassword')
        other_tarea = Tarea.objects.create(titulo='Otra tarea', usuario=other_user)
        other_etiqueta = Etiqueta.objects.create(nombre='Otra etiqueta', tarea=other_tarea)
        other_url = reverse('etiqueta-delete', kwargs={'pk': other_etiqueta.id})
        response = self.client.delete(other_url)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        self.assertEqual(response.data['detail'], 'No tienes permiso para eliminar esta etiqueta.')