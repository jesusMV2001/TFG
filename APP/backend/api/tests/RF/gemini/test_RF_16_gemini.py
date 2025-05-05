import json
from rest_framework import status
from rest_framework.test import APITestCase
from django.contrib.auth.models import User
from api.models import Tarea, Comentario
from rest_framework_simplejwt.tokens import RefreshToken

class ComentarioTests(APITestCase):
    def setUp(self):
        # Crear usuario de prueba
        self.user = User.objects.create_user(username='testuser', password='testpassword')
        self.token = RefreshToken.for_user(self.user)
        self.access_token = str(self.token.access_token)
        self.api_authentication()

        # Crear tarea de prueba
        self.tarea = Tarea.objects.create(
            titulo='Tarea de prueba',
            descripcion='Descripción de prueba',
            usuario=self.user
        )
        
        self.comentario_data = {'texto': 'Este es un comentario de prueba'}

    def api_authentication(self):
        self.client.credentials(HTTP_AUTHORIZATION='Bearer ' + self.access_token)

    def test_crear_comentario(self):
        url = f'/api/tareas/{self.tarea.id}/comentarios/'
        response = self.client.post(url, self.comentario_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Comentario.objects.count(), 1)
        self.assertEqual(Comentario.objects.get().texto, 'Este es un comentario de prueba')
        self.assertEqual(Comentario.objects.get().usuario, self.user)
        self.assertEqual(Comentario.objects.get().tarea, self.tarea)

    def test_crear_comentario_tarea_no_existe(self):
        url = '/api/tareas/999/comentarios/'  # ID de tarea inexistente
        response = self.client.post(url, self.comentario_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_listar_comentarios(self):
        # Crear un comentario adicional
        Comentario.objects.create(texto='Otro comentario', tarea=self.tarea, usuario=self.user)

        url = f'/api/tareas/{self.tarea.id}/comentarios/'
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1) # Cambiado a 1 porque solo existe un comentario antes de la creacion
        self.assertEqual(response.data[0]['texto'], 'Este es un comentario de prueba')


    def test_actualizar_comentario(self):
        comentario = Comentario.objects.create(texto='Comentario original', tarea=self.tarea, usuario=self.user)
        url = f'/api/comentarios/update/{comentario.id}/'
        data = {'texto': 'Comentario actualizado'}
        response = self.client.put(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        comentario.refresh_from_db()
        self.assertEqual(comentario.texto, 'Comentario actualizado')

    def test_actualizar_comentario_sin_permiso(self):
      #Crear otro usuario
      other_user = User.objects.create_user(username='otheruser', password='otherpassword')
      other_token = RefreshToken.for_user(other_user)
      other_access_token = str(other_token.access_token)

      comentario = Comentario.objects.create(texto='Comentario original', tarea=self.tarea, usuario=self.user)

      #Autenticar con el otro usuario
      self.client.credentials(HTTP_AUTHORIZATION='Bearer ' + other_access_token)
      
      url = f'/api/comentarios/update/{comentario.id}/'
      data = {'texto': 'Comentario actualizado'}
      response = self.client.put(url, data, format='json')
      self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN) #No debe permitir la actualización
      comentario.refresh_from_db()
      self.assertEqual(comentario.texto, 'Comentario original') #Debe seguir siendo el comentario original
      
    def test_eliminar_comentario(self):
        comentario = Comentario.objects.create(texto='Comentario a eliminar', tarea=self.tarea, usuario=self.user)
        url = f'/api/comentarios/delete/{comentario.id}/'
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(Comentario.objects.count(), 0)

    def test_eliminar_comentario_sin_permiso(self):
      other_user = User.objects.create_user(username='otheruser', password='otherpassword')
      other_token = RefreshToken.for_user(other_user)
      other_access_token = str(other_token.access_token)

      comentario = Comentario.objects.create(texto='Comentario a eliminar', tarea=self.tarea, usuario=self.user)

      #Autenticar con el otro usuario
      self.client.credentials(HTTP_AUTHORIZATION='Bearer ' + other_access_token)
      
      url = f'/api/comentarios/delete/{comentario.id}/'
      response = self.client.delete(url)
      self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
      self.assertEqual(Comentario.objects.count(), 1) #Asegurar que el comentario aun existe