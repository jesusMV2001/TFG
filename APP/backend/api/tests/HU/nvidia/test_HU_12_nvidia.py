import json
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase, APIClient
from api.models import Tarea, Etiqueta, User

class HU12EliminarEtiquetasTest(APITestCase):

    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(username='testuser', email='test@example.com', password='password123')
        self.tarea = Tarea.objects.create(titulo='Tarea de prueba', descripcion='Descripción de la tarea', usuario=self.user)
        self.etiqueta = Etiqueta.objects.create(nombre='Etiqueta de prueba', tarea=self.tarea)
        self.client.force_authenticate(user=self.user)

    def test_eliminar_etiqueta_existe(self):
        url = reverse('etiqueta-delete', kwargs={'pk': self.etiqueta.id})
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(Etiqueta.objects.filter(id=self.etiqueta.id).exists())

    def test_eliminar_etiqueta_no_existe(self):
        url = reverse('etiqueta-delete', kwargs={'pk': 9999})
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        self.assertIn('Etiqueta no encontrada', json.loads(response.content)['error'])

    def test_eliminar_etiqueta_mensaje_de_exito(self):
        url = reverse('etiqueta-delete', kwargs={'pk': self.etiqueta.id})
        response = self.client.delete(url, format='json')
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(json.loads(response.content), {"message": "Etiqueta eliminada correctamente."})

    def test_eliminar_etiqueta_sin_autenticacion(self):
        self.client.force_authenticate(user=None)
        url = reverse('etiqueta-delete', kwargs={'pk': self.etiqueta.id})
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)