# /home/jesus/python/TFG/APP/backend/api/tests/HU/nvidia/HU-14-nvidia.py

from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from api.models import Comentario, Tarea
from django.contrib.auth.models import User

class HU14EditarComentariosTestCase(APITestCase):
    def setUp(self):
        self.user = User.objects.create_superuser('admin', 'admin@admin.com', 'admin')
        self.tarea = Tarea.objects.create(
            titulo='Tarea de prueba',
            descripcion='Descripción de la tarea',
            fecha_vencimiento='2024-03-16',
            estado='pendiente',
            prioridad='alta',
            usuario=self.user
        )
        self.comentario = Comentario.objects.create(
            texto='Comentario original',
            usuario=self.user,
            tarea=self.tarea
        )
        self.url = reverse('comentario-update', kwargs={'pk': self.comentario.id})

    def test_editar_comentario(self):
        self.client.force_authenticate(user=self.user)
        data = {'texto': 'Comentario editado'}
        response = self.client.put(self.url, data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.comentario.refresh_from_db()
        self.assertEqual(self.comentario.texto, 'Comentario editado')

    def test_comentario_no_vacio(self):
        self.client.force_authenticate(user=self.user)
        data = {'texto': ''}
        response = self.client.put(self.url, data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('texto', response.data)

    def test_mensaje_exito(self):
        self.client.force_authenticate(user=self.user)
        data = {'texto': 'Comentario editado'}
        response = self.client.put(self.url, data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data, {'detail': 'Comentario actualizado exitosamente'})

    def test_mensaje_error(self):
        self.client.force_authenticate(user=self.user)
        data = {'texto': ''}
        response = self.client.put(self.url, data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('Error al actualizar el comentario', response.data)