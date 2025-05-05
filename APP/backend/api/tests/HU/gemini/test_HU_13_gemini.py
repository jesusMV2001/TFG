import json
from django.contrib.auth.models import User
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from api.models import Tarea, Comentario

class CrearComentarioTests(APITestCase):
    def setUp(self):
        # Crear un usuario
        self.user = User.objects.create_user(username='testuser', password='testpassword')
        # Autenticar al usuario
        self.client.force_authenticate(user=self.user)

        # Crear una tarea para el usuario
        self.tarea = Tarea.objects.create(
            titulo='Tarea de prueba',
            descripcion='Descripción de prueba',
            usuario=self.user
        )
        self.tarea_id = self.tarea.id
        self.comentario_url = reverse('comentario-list-create', kwargs={'tarea_id': self.tarea_id})


    def test_crear_comentario_exitoso(self):
        data = {'texto': 'Este es un comentario de prueba.'}
        response = self.client.post(self.comentario_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

        self.assertEqual(Comentario.objects.count(), 1)
        comentario = Comentario.objects.first()
        self.assertEqual(comentario.texto, 'Este es un comentario de prueba.')
        self.assertEqual(comentario.usuario, self.user)
        self.assertEqual(comentario.tarea, self.tarea)
        self.assertEqual(response.data['texto'], 'Este es un comentario de prueba.')

    def test_crear_comentario_vacio(self):
        data = {'texto': ''}
        response = self.client.post(self.comentario_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('texto', response.data)

    def test_crear_comentario_tarea_no_existe(self):
        url = reverse('comentario-list-create', kwargs={'tarea_id': 999})
        data = {'texto': 'Este es un comentario de prueba.'}
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        self.assertEqual(response.data['detail'], 'Tarea no encontrada')

    def test_listar_comentarios_tarea(self):
        # Crear un comentario
        Comentario.objects.create(tarea=self.tarea, usuario=self.user, texto="Comentario inicial")
        
        # Obtener la lista de comentarios
        response = self.client.get(self.comentario_url)
        
        # Verificar que la respuesta sea exitosa
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        # Verificar que el comentario se muestre
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['texto'], "Comentario inicial")