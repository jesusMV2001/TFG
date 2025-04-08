# /home/jesus/python/TFG/APP/backend/api/tests/HU/gemini/HU-13-gemini.py
from rest_framework import status
from rest_framework.test import APITestCase
from django.contrib.auth.models import User
from api.models import Tarea, Comentario

class ComentarioTests(APITestCase):
    def setUp(self):
        # Crear un usuario de prueba
        self.user = User.objects.create_user(username='testuser', password='testpassword')
        # Crear una tarea de prueba asociada al usuario
        self.tarea = Tarea.objects.create(titulo='Tarea de prueba', usuario=self.user)
        # Autenticar al usuario para las pruebas
        self.client.force_authenticate(user=self.user)

    def test_crear_comentario_exitoso(self):
        """
        Prueba para verificar la creación exitosa de un comentario.
        """
        url = f'/api/tareas/{self.tarea.id}/comentarios/'
        data = {'texto': 'Este es un comentario de prueba'}
        response = self.client.post(url, data, format='json')

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Comentario.objects.count(), 1)
        self.assertEqual(Comentario.objects.get().texto, 'Este es un comentario de prueba')
        self.assertEqual(Comentario.objects.get().tarea, self.tarea)
        self.assertEqual(Comentario.objects.get().usuario, self.user)

    def test_crear_comentario_tarea_no_existe(self):
        """
        Prueba para verificar que no se puede crear un comentario en una tarea que no existe.
        """
        url = '/api/tareas/999/comentarios/'  # ID de tarea que no existe
        data = {'texto': 'Este es un comentario de prueba'}
        response = self.client.post(url, data, format='json')

        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        self.assertEqual(Comentario.objects.count(), 0)

    def test_crear_comentario_texto_vacio(self):
        """
        Prueba para verificar que no se puede crear un comentario con texto vacío.
        """
        url = f'/api/tareas/{self.tarea.id}/comentarios/'
        data = {'texto': ''}
        response = self.client.post(url, data, format='json')

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(Comentario.objects.count(), 0)