# /home/jesus/python/TFG/APP/backend/api/tests/RF/mistral/test_RF_15_mistral.py

from django.contrib.auth.models import User
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase, APIClient
from api.models import Tarea, Etiqueta

class EtiquetaDeleteTest(APITestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(username='testuser', password='testpassword')
        self.client.force_authenticate(user=self.user)

        self.tarea = Tarea.objects.create(
            titulo='Tarea de prueba',
            descripcion='Descripción de prueba',
            estado='pendiente',
            prioridad='media',
            usuario=self.user
        )

        self.etiqueta = Etiqueta.objects.create(
            nombre='Etiqueta de prueba',
            tarea=self.tarea
        )

    def test_delete_etiqueta(self):
        url = reverse('etiqueta-delete', kwargs={'pk': self.etiqueta.id})
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(Etiqueta.objects.filter(id=self.etiqueta.id).exists())

    def test_delete_etiqueta_not_found(self):
        non_existent_id = 9999
        url = reverse('etiqueta-delete', kwargs={'pk': non_existent_id})
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_delete_etiqueta_unauthenticated(self):
        self.client.logout()
        url = reverse('etiqueta-delete', kwargs={'pk': self.etiqueta.id})
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_delete_etiqueta_from_another_user(self):
        another_user = User.objects.create_user(username='anotheruser', password='anotherpassword')
        another_tarea = Tarea.objects.create(
            titulo='Otra tarea de prueba',
            descripcion='Otra descripción de prueba',
            estado='pendiente',
            prioridad='media',
            usuario=another_user
        )
        another_etiqueta = Etiqueta.objects.create(
            nombre='Otra etiqueta de prueba',
            tarea=another_tarea
        )
        url = reverse('etiqueta-delete', kwargs={'pk': another_etiqueta.id})
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)