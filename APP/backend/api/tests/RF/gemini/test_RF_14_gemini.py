import json
from rest_framework import status
from rest_framework.test import APITestCase
from django.contrib.auth.models import User
from api.models import Tarea, Etiqueta


class EtiquetaCreateTests(APITestCase):
    def setUp(self):
        # Crear un usuario para las pruebas
        self.user = User.objects.create_user(username='testuser', password='testpassword')
        self.client.force_authenticate(user=self.user)

        # Crear una tarea para las pruebas
        self.tarea = Tarea.objects.create(
            titulo='Tarea de prueba',
            descripcion='Descripción de prueba',
            usuario=self.user
        )

    def test_create_etiqueta_success(self):
        """
        Asegura que se puede crear una etiqueta y asignarla a una tarea.
        """
        url = '/api/etiquetas/'
        data = {'nombre': 'Etiqueta Nueva', 'tarea_id': self.tarea.id}
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Etiqueta.objects.count(), 1)
        self.assertEqual(Etiqueta.objects.get().nombre, 'Etiqueta Nueva')
        self.assertEqual(Etiqueta.objects.get().tarea, self.tarea)

    def test_create_etiqueta_tarea_does_not_exist(self):
        """
        Asegura que no se puede crear una etiqueta si la tarea no existe.
        """
        url = '/api/etiquetas/'
        data = {'nombre': 'Etiqueta Nueva', 'tarea_id': 999}  # ID de tarea inexistente
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("La tarea no existe.", str(response.data))
        self.assertEqual(Etiqueta.objects.count(), 0)

    def test_create_etiqueta_duplicate_name_in_task(self):
        """
        Asegura que no se puede crear una etiqueta con el mismo nombre en la misma tarea.
        """
        Etiqueta.objects.create(nombre='Etiqueta Duplicada', tarea=self.tarea)
        url = '/api/etiquetas/'
        data = {'nombre': 'Etiqueta Duplicada', 'tarea_id': self.tarea.id}
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("Ya existe una etiqueta con este nombre en esta tarea.", str(response.data))
        self.assertEqual(Etiqueta.objects.count(), 1)

    def test_create_etiqueta_unauthenticated(self):
        """
        Asegura que solo los usuarios autenticados pueden crear etiquetas.
        """
        self.client.logout()
        url = '/api/etiquetas/'
        data = {'nombre': 'Etiqueta Nueva', 'tarea_id': self.tarea.id}
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        self.assertEqual(Etiqueta.objects.count(), 0)

    def test_get_etiquetas_for_task(self):
         """
         Asegura que se pueden obtener las etiquetas asignadas a una tarea.
         """
         etiqueta1 = Etiqueta.objects.create(nombre='Etiqueta 1', tarea=self.tarea)
         etiqueta2 = Etiqueta.objects.create(nombre='Etiqueta 2', tarea=self.tarea)
         url = f'/api/tareas/{self.tarea.id}/etiquetas/'
         response = self.client.get(url, format='json')

         self.assertEqual(response.status_code, status.HTTP_200_OK)
         self.assertEqual(len(response.data), 2)

         nombres_etiquetas = [etiqueta['nombre'] for etiqueta in response.data]
         self.assertIn(etiqueta1.nombre, nombres_etiquetas)
         self.assertIn(etiqueta2.nombre, nombres_etiquetas)

    def test_delete_etiqueta_success(self):
        """
        Asegura que se puede eliminar una etiqueta existente.
        """
        etiqueta = Etiqueta.objects.create(nombre='Etiqueta a borrar', tarea=self.tarea)
        url = f'/api/etiquetas/delete/{etiqueta.id}/'
        response = self.client.delete(url, format='json')
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(Etiqueta.objects.count(), 0)

    def test_delete_etiqueta_not_found(self):
        """
        Asegura que se devuelve un error si se intenta eliminar una etiqueta que no existe.
        """
        url = '/api/etiquetas/delete/999/'  # ID de etiqueta inexistente
        response = self.client.delete(url, format='json')
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        self.assertIn("Etiqueta no encontrada.", str(response.data))