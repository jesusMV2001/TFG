# /home/jesus/python/TFG/APP/backend/api/tests/HU/nvidia/HU-12-nvidia.py
from rest_framework import status
from rest_framework.test import APITestCase
from django.urls import reverse
from .models import Etiqueta, Tarea
from django.contrib.auth.models import User

class HU12EliminarEtiquetasTestCase(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user('testuser', 'test@example.com', 'password')
        self.tarea = Tarea.objects.create(usuario=self.user, titulo='Tarea de prueba')
        self.etiqueta = Etiqueta.objects.create(tarea=self.tarea, nombre='Etiqueta de prueba')

        # Autenticar
        self.client.force_authenticate(user=self.user)

    def test_eliminar_etiqueta(self):
        url = reverse('etiqueta-delete', args=[self.etiqueta.id])
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(Etiqueta.objects.filter(id=self.etiqueta.id).exists())

    def test_mensaje_al_eliminar_etiqueta(self):
        url = reverse('etiqueta-delete', args=[self.etiqueta.id])
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(response.data, {'message': 'Etiqueta eliminada correctamente.'})