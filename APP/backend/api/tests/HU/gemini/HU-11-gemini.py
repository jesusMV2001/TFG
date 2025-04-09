# /home/jesus/python/TFG/APP/backend/api/tests/HU/gemini/HU-11-gemini.py
from rest_framework import status
from rest_framework.test import APITestCase
from django.contrib.auth.models import User
from api.models import Tarea, Etiqueta

class EtiquetaTests(APITestCase):
    def setUp(self):
        # Crear un usuario de prueba
        self.user = User.objects.create_user(username='testuser', password='testpassword')
        # Autenticar al usuario
        self.client.force_authenticate(user=self.user)

        # Crear una tarea de prueba
        self.tarea = Tarea.objects.create(
            titulo='Tarea de prueba',
            descripcion='Descripción de la tarea',
            usuario=self.user
        )

    def test_crear_etiqueta(self):
        """
        Asegura que se puede crear una etiqueta asociada a una tarea.
        """
        url = '/api/etiquetas/'
        data = {'nombre': 'Etiqueta de prueba', 'tarea_id': self.tarea.id}
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Etiqueta.objects.count(), 1)
        self.assertEqual(Etiqueta.objects.get().nombre, 'Etiqueta de prueba')
        self.assertEqual(Etiqueta.objects.get().tarea, self.tarea)

    def test_crear_etiqueta_misma_tarea_mismo_nombre_error(self):
        """
        Asegura que no se puede crear una etiqueta con el mismo nombre en la misma tarea.
        """
        Etiqueta.objects.create(nombre='EtiquetaDuplicada', tarea=self.tarea)
        url = '/api/etiquetas/'
        data = {'nombre': 'EtiquetaDuplicada', 'tarea_id': self.tarea.id}
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_eliminar_etiqueta(self):
        """
        Asegura que se puede eliminar una etiqueta existente.
        """
        etiqueta = Etiqueta.objects.create(nombre='Etiqueta a eliminar', tarea=self.tarea)
        url = f'/api/etiquetas/delete/{etiqueta.id}/'
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(Etiqueta.objects.count(), 0)

    def test_listar_etiquetas_por_tarea(self):
        """
        Asegura que se pueden listar las etiquetas asociadas a una tarea.
        """
        etiqueta1 = Etiqueta.objects.create(nombre='Etiqueta 1', tarea=self.tarea)
        etiqueta2 = Etiqueta.objects.create(nombre='Etiqueta 2', tarea=self.tarea)
        url = f'/api/etiquetas/?tarea_id={self.tarea.id}'
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 2)
        self.assertEqual(response.data[0]['nombre'], etiqueta1.nombre)
        self.assertEqual(response.data[1]['nombre'], etiqueta2.nombre)