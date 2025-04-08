# /home/jesus/python/TFG/APP/backend/api/tests/HU/gemini/HU-14-gemini.py
from rest_framework import status
from rest_framework.test import APITestCase
from django.contrib.auth.models import User
from api.models import Tarea, Comentario

class EditarComentarioTests(APITestCase):
    def setUp(self):
        # Crear un usuario
        self.user = User.objects.create_user(username='testuser', password='testpassword')
        # Autenticar al usuario
        self.client.force_authenticate(user=self.user)

        # Crear una tarea
        self.tarea = Tarea.objects.create(
            titulo='Tarea de prueba',
            descripcion='Descripción de prueba',
            usuario=self.user
        )

        # Crear un comentario asociado a la tarea
        self.comentario = Comentario.objects.create(
            tarea=self.tarea,
            usuario=self.user,
            texto='Comentario original'
        )

    def test_editar_comentario_exitoso(self):
        url = f'/api/comentarios/update/{self.comentario.id}/'
        data = {'texto': 'Comentario editado'}
        response = self.client.put(url, data, format='json')

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.comentario.refresh_from_db()
        self.assertEqual(self.comentario.texto, 'Comentario editado')

    def test_editar_comentario_vacio(self):
        url = f'/api/comentarios/update/{self.comentario.id}/'
        data = {'texto': ''}
        response = self.client.put(url, data, format='json')

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_editar_comentario_no_existente(self):
        url = '/api/comentarios/update/999/'  # ID que no existe
        data = {'texto': 'Comentario editado'}
        response = self.client.put(url, data, format='json')

        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_editar_comentario_otro_usuario(self):
        # Crear otro usuario
        otro_usuario = User.objects.create_user(username='otro_usuario', password='testpassword')
        self.client.force_authenticate(user=otro_usuario)

        url = f'/api/comentarios/update/{self.comentario.id}/'
        data = {'texto': 'Comentario editado'}
        response = self.client.put(url, data, format='json')

        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)