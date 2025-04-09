# /home/jesus/python/TFG/APP/backend/api/tests/HU/gemini/HU-12-gemini.py
from django.contrib.auth.models import User
from rest_framework import status
from rest_framework.test import APITestCase
from api.models import Tarea, Etiqueta
from rest_framework_simplejwt.tokens import RefreshToken

class EliminarEtiquetasTests(APITestCase):
    def setUp(self):
        # Crear un usuario de prueba
        self.user = User.objects.create_user(username='testuser', password='testpassword')
        self.refresh = RefreshToken.for_user(self.user)
        self.access_token = str(self.refresh.access_token)
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.access_token}')

        # Crear una tarea de prueba
        self.tarea = Tarea.objects.create(titulo='Tarea de prueba', usuario=self.user)

        # Crear una etiqueta de prueba asociada a la tarea
        self.etiqueta = Etiqueta.objects.create(nombre='Etiqueta de prueba', tarea=self.tarea)

    def test_eliminar_etiqueta_exitosamente(self):
        # Eliminar la etiqueta
        url = f'/api/etiquetas/delete/{self.etiqueta.id}/'
        response = self.client.delete(url)

        # Verificar que la respuesta tenga el código de estado correcto (204 No Content)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)

        # Verificar que la etiqueta ya no existe en la base de datos
        self.assertFalse(Etiqueta.objects.filter(id=self.etiqueta.id).exists())

    def test_eliminar_etiqueta_no_existente(self):
        # Intentar eliminar una etiqueta que no existe
        url = '/api/etiquetas/delete/999/'  # ID que no existe
        response = self.client.delete(url)

        # Verificar que la respuesta tenga el código de estado correcto (404 Not Found)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

        # Verificar que la respuesta contenga un mensaje de error
        self.assertEqual(response.data['error'], 'Etiqueta no encontrada.')

    def test_eliminar_etiqueta_sin_autenticacion(self):
        # Eliminar las credenciales de autenticación
        self.client.credentials()

        # Intentar eliminar la etiqueta sin autenticación
        url = f'/api/etiquetas/delete/{self.etiqueta.id}/'
        response = self.client.delete(url)

        # Verificar que la respuesta tenga el código de estado correcto (401 Unauthorized)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)