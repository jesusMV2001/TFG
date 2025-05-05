import json
from rest_framework import status
from rest_framework.test import APITestCase
from django.contrib.auth.models import User
from api.models import Tarea, Comentario


class TestComentarioNoVacio(APITestCase):
    def setUp(self):
        # Crear un usuario de prueba
        self.user = User.objects.create_user(username='testuser', password='testpassword')
        # Autenticar al usuario
        self.client.force_authenticate(user=self.user)

        # Crear una tarea de prueba
        self.tarea = Tarea.objects.create(
            titulo='Tarea de prueba',
            descripcion='Descripción de prueba',
            usuario=self.user
        )
        self.comentario_url = f'/api/tareas/{self.tarea.id}/comentarios/'

    def test_crear_comentario_vacio(self):
        # Intentar crear un comentario con texto vacío
        data = {'texto': ''}
        response = self.client.post(self.comentario_url, data, format='json')

        # Verificar que la respuesta sea un error 400
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        
        # Verificar que el mensaje de error sea el correcto
        self.assertIn('texto', response.data)
        self.assertEqual(response.data['texto'][0], 'Este campo no puede estar en blanco.')

    def test_crear_comentario_con_espacios_vacios(self):
            # Intentar crear un comentario con solo espacios en blanco
            data = {'texto': '   '}
            response = self.client.post(self.comentario_url, data, format='json')

            # Verificar que la respuesta sea un error 400
            self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

            # Verificar que el mensaje de error sea el correcto
            self.assertIn('texto', response.data)
            self.assertEqual(response.data['texto'][0], 'Este campo no puede estar en blanco.')