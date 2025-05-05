import json
from rest_framework import status
from rest_framework.test import APITestCase
from django.contrib.auth.models import User
from api.models import Tarea, Etiqueta
from rest_framework_simplejwt.tokens import RefreshToken


class EtiquetaTests(APITestCase):

    def setUp(self):
        # Crear un usuario de prueba
        self.user = User.objects.create_user(username='testuser', password='testpassword')
        self.token = RefreshToken.for_user(self.user)
        self.access_token = str(self.token.access_token)
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.access_token}')

        # Crear una tarea de prueba
        self.tarea = Tarea.objects.create(
            titulo='Tarea de prueba',
            descripcion='Descripción de la tarea',
            usuario=self.user
        )
        self.etiqueta_data = {
            'nombre': 'Etiqueta de prueba',
            'tarea_id': self.tarea.id
        }

    def test_crear_etiqueta(self):
        url = '/api/etiquetas/'
        response = self.client.post(url, self.etiqueta_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Etiqueta.objects.count(), 1)
        self.assertEqual(Etiqueta.objects.get().nombre, 'Etiqueta de prueba')
        self.assertEqual(Etiqueta.objects.get().tarea, self.tarea)

    def test_crear_etiqueta_tarea_no_existe(self):
        url = '/api/etiquetas/'
        data = {'nombre': 'Etiqueta de prueba', 'tarea_id': 999}
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("La tarea no existe.", str(response.data))

    def test_crear_etiqueta_nombre_duplicado(self):
        # Crear una etiqueta inicial
        Etiqueta.objects.create(nombre='EtiquetaDuplicada', tarea=self.tarea)
        
        url = '/api/etiquetas/'
        data = {'nombre': 'EtiquetaDuplicada', 'tarea_id': self.tarea.id}
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("Ya existe una etiqueta con este nombre en esta tarea.", str(response.data))

    def test_listar_etiquetas_de_tarea(self):
        # Crear algunas etiquetas para la tarea
        Etiqueta.objects.create(nombre='Etiqueta1', tarea=self.tarea)
        Etiqueta.objects.create(nombre='Etiqueta2', tarea=self.tarea)

        url = f'/api/tareas/{self.tarea.id}/etiquetas/'
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 2)

    def test_eliminar_etiqueta(self):
        # Crear una etiqueta
        etiqueta = Etiqueta.objects.create(nombre='EtiquetaAEliminar', tarea=self.tarea)

        url = f'/api/etiquetas/delete/{etiqueta.id}/'
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(Etiqueta.objects.count(), 0)

    def test_eliminar_etiqueta_no_existe(self):
        url = '/api/etiquetas/delete/999/'
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        self.assertIn("Etiqueta no encontrada.", str(response.data))