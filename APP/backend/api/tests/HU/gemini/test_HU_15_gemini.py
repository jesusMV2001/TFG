import json
from rest_framework import status
from rest_framework.test import APITestCase
from django.contrib.auth.models import User
from api.models import Tarea, Comentario

class EliminarComentarioTest(APITestCase):
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
        
        # Crear un comentario de prueba
        self.comentario = Comentario.objects.create(
            tarea=self.tarea,
            usuario=self.user,
            texto='Comentario de prueba'
        )
        self.comentario_url = f'/api/comentarios/delete/{self.comentario.id}/'

    def test_eliminar_comentario_existente(self):
        # Eliminar el comentario
        response = self.client.delete(self.comentario_url)
        
        # Verificar que la respuesta sea 204 No Content
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        
        # Verificar que el comentario ya no exista en la base de datos
        self.assertFalse(Comentario.objects.filter(pk=self.comentario.id).exists())
    
    def test_eliminar_comentario_inexistente(self):
        # Intentar eliminar un comentario que no existe
        url_comentario_inexistente = '/api/comentarios/delete/999/'
        response = self.client.delete(url_comentario_inexistente)
        
        # Verificar que la respuesta sea 404 Not Found
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
    
    def test_eliminar_comentario_sin_autenticacion(self):
        # Desautenticar al usuario
        self.client.force_authenticate(user=None)
        
        # Intentar eliminar el comentario sin autenticación
        response = self.client.delete(self.comentario_url)
        
        # Verificar que la respuesta sea 401 Unauthorized
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_eliminar_comentario_otro_usuario(self):
        # Crear un usuario diferente
        otro_usuario = User.objects.create_user(username='otro_usuario', password='testpassword')
        self.client.force_authenticate(user=otro_usuario)
        response = self.client.delete(self.comentario_url)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
