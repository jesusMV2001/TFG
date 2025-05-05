# /home/jesus/python/TFG/APP/backend/api/tests/HU/mistral/test_HU_13_mistral.py

from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from django.contrib.auth.models import User
from api.models import Tarea, Comentario

class ComentarioTestCase(APITestCase):

    def setUp(self):
        self.user = User.objects.create_user(username='testuser', password='testpassword')
        self.tarea = Tarea.objects.create(titulo='Tarea de prueba', usuario=self.user)
        self.client.login(username='testuser', password='testpassword')
        self.url = reverse('comentario-list-create', kwargs={'tarea_id': self.tarea.id})

    def test_crear_comentario_valido(self):
        data = {'texto': 'Este es un comentario de prueba'}
        response = self.client.post(self.url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Comentario.objects.count(), 1)
        self.assertEqual(Comentario.objects.get().texto, 'Este es un comentario de prueba')

    def test_crear_comentario_vacio(self):
        data = {'texto': ''}
        response = self.client.post(self.url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(Comentario.objects.count(), 0)
        self.assertIn('texto', response.data)

    def test_mostrar_comentario_creado(self):
        comentario = Comentario.objects.create(texto='Comentario de prueba', tarea=self.tarea, usuario=self.user)
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn(comentario.texto, [comentario['texto'] for comentario in response.data])

    def test_mensaje_error_comentario_vacio(self):
        data = {'texto': ''}
        response = self.client.post(self.url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('texto', response.data)
        self.assertEqual(response.data['texto'][0], 'Este campo no puede estar en blanco.')