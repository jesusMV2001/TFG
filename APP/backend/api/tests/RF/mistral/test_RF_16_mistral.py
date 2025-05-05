from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from django.contrib.auth.models import User
from api.models import Tarea, Comentario

class ComentarioTests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(username='testuser', password='testpassword')
        self.tarea = Tarea.objects.create(titulo='Tarea de prueba', usuario=self.user)
        self.client.force_authenticate(user=self.user)

    def test_create_comentario(self):
        url = reverse('comentario-list-create', kwargs={'tarea_id': self.tarea.id})
        data = {'texto': 'Este es un comentario de prueba'}
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Comentario.objects.count(), 1)
        self.assertEqual(Comentario.objects.get().texto, 'Este es un comentario de prueba')

    def test_edit_comentario(self):
        comentario = Comentario.objects.create(texto='Comentario original', tarea=self.tarea, usuario=self.user)
        url = reverse('comentario-update', kwargs={'pk': comentario.id})
        data = {'texto': 'Comentario editado'}
        response = self.client.put(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        comentario.refresh_from_db()
        self.assertEqual(comentario.texto, 'Comentario editado')

    def test_edit_comentario_unauthorized(self):
        other_user = User.objects.create_user(username='otheruser', password='otherpassword')
        comentario = Comentario.objects.create(texto='Comentario original', tarea=self.tarea, usuario=other_user)
        url = reverse('comentario-update', kwargs={'pk': comentario.id})
        data = {'texto': 'Comentario editado'}
        response = self.client.put(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_delete_comentario(self):
        comentario = Comentario.objects.create(texto='Comentario a eliminar', tarea=self.tarea, usuario=self.user)
        url = reverse('comentario-delete', kwargs={'pk': comentario.id})
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(Comentario.objects.count(), 0)

    def test_delete_comentario_unauthorized(self):
        other_user = User.objects.create_user(username='otheruser', password='otherpassword')
        comentario = Comentario.objects.create(texto='Comentario a eliminar', tarea=self.tarea, usuario=other_user)
        url = reverse('comentario-delete', kwargs={'pk': comentario.id})
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)