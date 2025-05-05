from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase, APIClient
from django.contrib.auth.models import User
from .models import Tarea, Comentario

class TestComentarioCreationEdicion(APITestCase):

    def setUp(self):
        # Crear un usuario
        self.user = User.objects.create_superuser('john_doe', 'johndoe@example.com', 'password')

        # Autenticar al usuario
        self.client = APIClient()
        self.client.force_authenticate(user=self.user)

        # Crear una tarea
        self.tarea = Tarea.objects.create(
            titulo='Tarea de prueba',
            descripcion='Descripción de la tarea',
            fecha_vencimiento=None,
            estado='pendiente',
            prioridad='media',
            usuario=self.user
        )

    def test_crear_comentario(self):
        # Datos para el comentario
        data = {'texto': 'Comentario de prueba', 'tarea': self.tarea.id}

        # Enviar la solicitud
        response = self.client.post(reverse('comentario-list-create', kwargs={'tarea_id': self.tarea.id}), data, format='json')

        # Verificar el resultado
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Comentario.objects.count(), 1)
        self.assertEqual(Comentario.objects.get().texto, 'Comentario de prueba')

    def test_editar_comentario(self):
        # Crear un comentario
        comentario = Comentario.objects.create(
            texto='Comentario de prueba',
            tarea=self.tarea,
            usuario=self.user
        )

        # Datos para editar el comentario
        data = {'id': comentario.id, 'texto': 'Comentario editado', 'fecha_creacion': comentario.fecha_creacion, 'usuario': self.user.id, 'tarea': self.tarea.id}

        # Enviar la solicitud
        response = self.client.put(reverse('comentario-update', kwargs={'pk': comentario.id}), data, format='json')

        # Verificar el resultado
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(Comentario.objects.count(), 1)
        self.assertEqual(Comentario.objects.get().texto, 'Comentario editado')

    def test_no_permiso_editar_comentario(self):
        # Crear un usuario distinto
        otro_user = User.objects.create_user('otro_user', 'otro_user@example.com', 'password')

        # Crear un comentario con el otro usuario
        comentario = Comentario.objects.create(
            texto='Comentario de prueba',
            tarea=self.tarea,
            usuario=otro_user
        )

        # Autenticar con el usuario original
        self.client.force_authenticate(user=self.user)

        # Datos para editar el comentario
        data = {'id': comentario.id, 'texto': 'Comentario editado', 'fecha_creacion': comentario.fecha_creacion, 'usuario': otro_user.id, 'tarea': self.tarea.id}

        # Enviar la solicitud
        response = self.client.put(reverse('comentario-update', kwargs={'pk': comentario.id}), data, format='json')

        # Verificar el resultado
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_eliminar_comentario(self):
        # Crear un comentario
        comentario = Comentario.objects.create(
            texto='Comentario de prueba',
            tarea=self.tarea,
            usuario=self.user
        )

        # Enviar la solicitud
        response = self.client.delete(reverse('comentario-delete', kwargs={'pk': comentario.id}))

        # Verificar el resultado
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(Comentario.objects.count(), 0)

    def test_no_permiso_eliminar_comentario(self):
        # Crear un usuario distinto
        otro_user = User.objects.create_user('otro_user', 'otro_user@example.com', 'password')

        # Crear un comentario con el otro usuario
        comentario = Comentario.objects.create(
            texto='Comentario de prueba',
            tarea=self.tarea,
            usuario=otro_user
        )

        # Autenticar con el usuario original
        self.client.force_authenticate(user=self.user)

        # Enviar la solicitud
        response = self.client.delete(reverse('comentario-delete', kwargs={'pk': comentario.id}))

        # Verificar el resultado
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)