import json
from rest_framework import status
from rest_framework.test import APITestCase
from django.contrib.auth.models import User
from api.models import Tarea

class TareaDeleteTest(APITestCase):
    def setUp(self):
        # Crear un usuario de prueba
        self.user = User.objects.create_user(username='testuser', password='testpassword')
        # Autenticar al usuario
        self.client.force_authenticate(user=self.user)

        # Crear una tarea de prueba asociada al usuario
        self.tarea = Tarea.objects.create(
            titulo='Tarea de prueba',
            descripcion='Descripción de la tarea de prueba',
            usuario=self.user
        )

    def test_eliminar_tarea_existente(self):
        """
        Asegura que una tarea existente puede ser eliminada correctamente.
        """
        url = f'/api/tareas/delete/{self.tarea.id}/'
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        # Verificar que la tarea ya no existe en la base de datos
        self.assertFalse(Tarea.objects.filter(id=self.tarea.id).exists())

    def test_eliminar_tarea_inexistente(self):
        """
        Asegura que al intentar eliminar una tarea inexistente, se devuelve un error 404.
        """
        url = '/api/tareas/delete/999/'  # ID de tarea que no existe
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_eliminar_tarea_sin_autenticar(self):
        """
        Asegura que un usuario no autenticado no puede eliminar una tarea.
        """
        self.client.logout()
        url = f'/api/tareas/delete/{self.tarea.id}/'
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_eliminar_tarea_de_otro_usuario(self):
        """
        Asegura que un usuario no puede eliminar una tarea que pertenece a otro usuario.
        """
        # Crear otro usuario
        otro_usuario = User.objects.create_user(username='otro_usuario', password='testpassword')
        # Crear una tarea asociada al otro usuario
        tarea_otro_usuario = Tarea.objects.create(
            titulo='Tarea de otro usuario',
            descripcion='Descripción de la tarea del otro usuario',
            usuario=otro_usuario
        )

        # Intentar eliminar la tarea del otro usuario
        url = f'/api/tareas/delete/{tarea_otro_usuario.id}/'
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        # Verificar que la tarea del otro usuario todavía existe
        self.assertTrue(Tarea.objects.filter(id=tarea_otro_usuario.id).exists())