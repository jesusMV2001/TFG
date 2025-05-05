from rest_framework import status
from rest_framework.test import APITestCase, APIClient
from django.urls import reverse
from django.contrib.auth.models import User
from .models import Tarea

class TestRF07EditarTarea(APITestCase):

    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user('testuser', 'test@example.com', 'password123')
        self.client.force_authenticate(user=self.user)
        self.tarea = Tarea.objects.create(
            titulo='Tarea de prueba',
            descripcion='Esta es una tarea de prueba',
            estado='pendiente',
            prioridad='media',
            usuario=self.user
        )

    def test_editar_tarea(self):
        url = reverse('tarea-update', kwargs={'pk': self.tarea.id})
        data = {
            'titulo': 'Tarea de prueba editada',
            'descripcion': 'Esta es una tarea de prueba editada',
            'estado': 'en_progreso',
            'prioridad': 'alta'
        }
        response = self.client.put(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.tarea.refresh_from_db()
        self.assertEqual(self.tarea.titulo, 'Tarea de prueba editada')
        self.assertEqual(self.tarea.descripcion, 'Esta es una tarea de prueba editada')
        self.assertEqual(self.tarea.estado, 'en_progreso')
        self.assertEqual(self.tarea.prioridad, 'alta')

    def test_editar_tarea_sin_permiso(self):
        otro_user = User.objects.create_user('otrouser', 'otro@example.com', 'password123')
        tarea_otro_user = Tarea.objects.create(
            titulo='Tarea de otro usuario',
            usuario=otro_user
        )
        url = reverse('tarea-update', kwargs={'pk': tarea_otro_user.id})
        data = {
            'titulo': 'Tarea de otro usuario editada'
        }
        response = self.client.put(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_editar_tarea_inexistente(self):
        url = reverse('tarea-update', kwargs={'pk': 9999})
        data = {
            'titulo': 'Tarea inexistente editada'
        }
        response = self.client.put(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_editar_tarea_sin_autenticar(self):
        self.client.force_authenticate(user=None)
        url = reverse('tarea-update', kwargs={'pk': self.tarea.id})
        data = {
            'titulo': 'Tarea de prueba editada'
        }
        response = self.client.put(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)