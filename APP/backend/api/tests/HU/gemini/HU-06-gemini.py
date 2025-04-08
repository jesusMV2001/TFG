# /home/jesus/python/TFG/APP/backend/api/tests/HU/gemini/HU-06-gemini.py
from rest_framework import status
from rest_framework.test import APITestCase
from django.contrib.auth.models import User
from api.models import Tarea

class EliminarTareaTests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(username='testuser', password='testpassword')
        self.token = f'{self.client.credentials().token}'
        self.client.force_authenticate(user=self.user)
        self.tarea = Tarea.objects.create(titulo='Tarea de prueba', usuario=self.user)

    def test_eliminar_tarea_existente(self):
        url = f'/api/tareas/delete/{self.tarea.id}/'
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(Tarea.objects.filter(pk=self.tarea.id).count(), 0)

    def test_eliminar_tarea_inexistente(self):
        url = '/api/tareas/delete/999/'  # ID que no existe
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_eliminar_tarea_sin_autenticacion(self):
        self.client.force_authenticate(user=None)
        url = f'/api/tareas/delete/{self.tarea.id}/'
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_eliminar_tarea_de_otro_usuario(self):
        otro_usuario = User.objects.create_user(username='otheruser', password='otherpassword')
        self.client.force_authenticate(user=otro_usuario)
        url = f'/api/tareas/delete/{self.tarea.id}/'
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)