import json
from rest_framework import status
from rest_framework.test import APITestCase
from django.contrib.auth.models import User
from api.models import Tarea, Etiqueta

class EliminarEtiquetaTest(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(username='testuser', password='testpassword')
        self.tarea = Tarea.objects.create(titulo='Tarea de prueba', usuario=self.user)
        self.etiqueta = Etiqueta.objects.create(nombre='Etiqueta de prueba', tarea=self.tarea)
        self.client.force_authenticate(user=self.user)

    def test_eliminar_etiqueta_existente(self):
        url = f'/api/etiquetas/delete/{self.etiqueta.id}/'
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(Etiqueta.objects.filter(id=self.etiqueta.id).exists())

    def test_eliminar_etiqueta_inexistente(self):
         url = '/api/etiquetas/delete/999/'  # ID que no existe
         response = self.client.delete(url)
         self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_eliminar_etiqueta_sin_autenticar(self):
        self.client.logout()
        url = f'/api/etiquetas/delete/{self.etiqueta.id}/'
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_eliminar_etiqueta_de_otra_tarea(self):
        otro_usuario = User.objects.create_user(username='otro_usuario', password='testpassword')
        otra_tarea = Tarea.objects.create(titulo='Otra tarea', usuario=otro_usuario)
        otra_etiqueta = Etiqueta.objects.create(nombre='Otra etiqueta', tarea=otra_tarea)

        url = f'/api/etiquetas/delete/{otra_etiqueta.id}/'
        response = self.client.delete(url)

        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        self.assertTrue(Etiqueta.objects.filter(id=otra_etiqueta.id).exists())

    def test_eliminar_etiqueta_con_tarea_especifica_incorrecta(self):
        url = f'/api/etiquetas/delete/{self.etiqueta.id}/?tarea_id=999'
        response = self.client.delete(url)

        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        self.assertTrue(Etiqueta.objects.filter(id=self.etiqueta.id).exists())