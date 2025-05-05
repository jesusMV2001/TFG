import json
from rest_framework import status
from rest_framework.test import APITestCase
from django.contrib.auth.models import User
from api.models import Tarea, Etiqueta
from rest_framework_simplejwt.tokens import RefreshToken

class EliminarEtiquetaDeTareaTest(APITestCase):
    def setUp(self):
        # Crear usuario
        self.user = User.objects.create_user(username='testuser', password='testpassword')
        self.refresh = RefreshToken.for_user(self.user)
        self.token = str(self.refresh.access_token)
        self.client.credentials(HTTP_AUTHORIZATION='Bearer ' + self.token)

        # Crear tarea
        self.tarea = Tarea.objects.create(titulo='Tarea de prueba', usuario=self.user)

        # Crear etiqueta asociada a la tarea
        self.etiqueta = Etiqueta.objects.create(nombre='Etiqueta de prueba', tarea=self.tarea)

    def test_eliminar_etiqueta_existente_de_tarea(self):
        url = f'/api/etiquetas/delete/{self.etiqueta.id}/'
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(Etiqueta.objects.filter(id=self.etiqueta.id).exists())

    def test_eliminar_etiqueta_inexistente(self):
        url = '/api/etiquetas/delete/999/'  # ID que no existe
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_eliminar_etiqueta_sin_autenticacion(self):
        self.client.credentials()
        url = f'/api/etiquetas/delete/{self.etiqueta.id}/'
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_eliminar_etiqueta_de_otra_tarea_no_permitido(self):
        # Crear otro usuario
        otro_usuario = User.objects.create_user(username='otro_usuario', password='testpassword')
        # Crear otra tarea asociada al otro usuario
        otra_tarea = Tarea.objects.create(titulo='Otra tarea', usuario=otro_usuario)
        # Crear una etiqueta asociada a la otra tarea.
        otra_etiqueta = Etiqueta.objects.create(nombre="Etiqueta de otra tarea", tarea=otra_tarea)

        url = f'/api/etiquetas/delete/{otra_etiqueta.id}/'
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(Etiqueta.objects.filter(id=otra_etiqueta.id).exists())

    def test_eliminar_etiqueta_con_tarea_inexistente(self):
        # Eliminar la tarea asociada a la etiqueta
        self.tarea.delete()

        url = f'/api/etiquetas/delete/{self.etiqueta.id}/'
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT) #Deberia borrarla porque el on delete es cascade

    def test_eliminar_etiqueta_con_tarea_a_null(self):
        url = f'/api/etiquetas/delete/{self.etiqueta.id}/'
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(Etiqueta.objects.filter(id=self.etiqueta.id).exists())