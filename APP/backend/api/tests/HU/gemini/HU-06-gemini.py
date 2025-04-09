# /home/jesus/python/TFG/APP/backend/api/tests/HU/gemini/HU-06-gemini.py
from rest_framework import status
from rest_framework.test import APITestCase
from django.contrib.auth.models import User
from api.models import Tarea

class EliminarTareaTest(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(username='testuser', password='testpassword')
        self.tarea = Tarea.objects.create(titulo='Test Tarea', usuario=self.user)
        self.client.force_authenticate(user=self.user)
        self.delete_url = f'/api/tareas/delete/{self.tarea.id}/'

    def test_eliminar_tarea_exitosamente(self):
        response = self.client.delete(self.delete_url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(Tarea.objects.filter(pk=self.tarea.id).exists())

    def test_eliminar_tarea_no_existente(self):
        url_tarea_no_existente = '/api/tareas/delete/999/'
        response = self.client.delete(url_tarea_no_existente)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_eliminar_tarea_sin_autenticacion(self):
        self.client.force_authenticate(user=None)
        response = self.client.delete(self.delete_url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_eliminar_tarea_de_otro_usuario(self):
        otro_usuario = User.objects.create_user(username='otro_usuario', password='testpassword')
        self.client.force_authenticate(user=otro_usuario)
        response = self.client.delete(self.delete_url)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)