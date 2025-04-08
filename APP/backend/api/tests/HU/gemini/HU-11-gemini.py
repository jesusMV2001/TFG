# /home/jesus/python/TFG/APP/backend/api/tests/HU/gemini/HU-11-gemini.py
from rest_framework import status
from rest_framework.test import APITestCase
from django.contrib.auth.models import User
from api.models import Tarea, Etiqueta

class EtiquetaTests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(username='testuser', password='testpassword')
        self.tarea = Tarea.objects.create(titulo='Test Tarea', usuario=self.user)
        self.client.force_authenticate(user=self.user)
        self.etiqueta_data = {'nombre': 'Test Etiqueta', 'tarea_id': self.tarea.id}
        self.etiqueta_url = '/api/etiquetas/'

    def test_puede_crear_etiqueta(self):
        response = self.client.post(self.etiqueta_url, self.etiqueta_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Etiqueta.objects.count(), 1)
        self.assertEqual(Etiqueta.objects.get().nombre, 'Test Etiqueta')
        self.assertEqual(Etiqueta.objects.get().tarea, self.tarea)

    def test_no_puede_crear_etiqueta_sin_autenticacion(self):
        self.client.logout()
        response = self.client.post(self.etiqueta_url, self.etiqueta_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_no_puede_crear_etiqueta_con_tarea_inexistente(self):
        data = {'nombre': 'Test Etiqueta', 'tarea_id': 999}
        response = self.client.post(self.etiqueta_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("La tarea no existe.", str(response.data))

    def test_no_puede_crear_etiqueta_duplicada(self):
        Etiqueta.objects.create(nombre='Test Etiqueta', tarea=self.tarea)
        response = self.client.post(self.etiqueta_url, self.etiqueta_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("Ya existe una etiqueta con este nombre en esta tarea.", str(response.data))

    def test_puede_eliminar_etiqueta(self):
        etiqueta = Etiqueta.objects.create(nombre='Test Etiqueta', tarea=self.tarea)
        delete_url = f'/api/etiquetas/delete/{etiqueta.id}/'
        response = self.client.delete(delete_url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(Etiqueta.objects.count(), 0)

    def test_no_puede_eliminar_etiqueta_inexistente(self):
        delete_url = '/api/etiquetas/delete/999/'
        response = self.client.delete(delete_url)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        self.assertIn("Etiqueta no encontrada.", str(response.data))