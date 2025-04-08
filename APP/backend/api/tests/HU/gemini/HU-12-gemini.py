# /home/jesus/python/TFG/APP/backend/api/tests/HU/gemini/HU-12-gemini.py
from django.contrib.auth.models import User
from rest_framework import status
from rest_framework.test import APITestCase
from api.models import Tarea, Etiqueta

class EliminarEtiquetasTest(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(username='testuser', password='testpassword')
        self.client.force_authenticate(user=self.user)
        self.tarea = Tarea.objects.create(titulo='Test Tarea', usuario=self.user)
        self.etiqueta = Etiqueta.objects.create(nombre='Test Etiqueta', tarea=self.tarea)

    def test_puede_eliminar_etiquetas(self):
        url = f'/api/etiquetas/delete/{self.etiqueta.id}/'
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(Etiqueta.objects.filter(id=self.etiqueta.id).exists())

    def test_no_puede_eliminar_etiquetas_de_otra_tarea(self):
        otro_usuario = User.objects.create_user(username='otheruser', password='otherpassword')
        self.client.force_authenticate(user=otro_usuario)

        url = f'/api/etiquetas/delete/{self.etiqueta.id}/'
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_eliminar_etiqueta_inexistente_retorna_404(self):
        url = '/api/etiquetas/delete/999/'
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        self.assertEqual(response.data['error'], 'Etiqueta no encontrada.')