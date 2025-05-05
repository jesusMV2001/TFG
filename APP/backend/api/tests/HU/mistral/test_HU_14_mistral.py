# /home/jesus/python/TFG/APP/backend/api/tests/HU/mistral/test_HU_14_mistral.py

from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from django.contrib.auth.models import User
from api.models import Comentario, Tarea

class EditarComentariosTestCase(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(username='testuser', password='testpassword')
        self.tarea = Tarea.objects.create(titulo='Tarea de prueba', usuario=self.user)
        self.comentario = Comentario.objects.create(tarea=self.tarea, usuario=self.user, texto='Comentario de prueba')
        self.client.force_authenticate(user=self.user)

    def test_editar_comentario_exitoso(self):
        url = reverse('comentario-update', kwargs={'pk': self.comentario.id})
        data = {'texto': 'Comentario editado'}
        response = self.client.put(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.comentario.refresh_from_db()
        self.assertEqual(self.comentario.texto, 'Comentario editado')
        self.assertEqual(response.data['detail'], 'Comentario actualizado correctamente.')

    def test_editar_comentario_vacio(self):
        url = reverse('comentario-update', kwargs={'pk': self.comentario.id})
        data = {'texto': ''}
        response = self.client.put(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data['detail'], 'El comentario no puede estar vacío.')

    def test_editar_comentario_no_permitido(self):
        another_user = User.objects.create_user(username='anotheruser', password='anotherpassword')
        url = reverse('comentario-update', kwargs={'pk': self.comentario.id})
        data = {'texto': 'Comentario editado'}
        self.client.force_authenticate(user=another_user)
        response = self.client.put(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        self.assertEqual(response.data['detail'], 'No tienes permiso para editar este comentario')

    def test_editar_comentario_no_existente(self):
        url = reverse('comentario-update', kwargs={'pk': 9999})
        data = {'texto': 'Comentario editado'}
        response = self.client.put(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        self.assertEqual(response.data['detail'], 'Not found.')