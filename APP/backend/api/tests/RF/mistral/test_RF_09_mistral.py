# /home/jesus/python/TFG/APP/backend/api/tests/RF/mistral/test_RF_09_mistral.py

from django.contrib.auth.models import User
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from api.models import Tarea

class TareaCompletadaTest(APITestCase):

    def setUp(self):
        self.user = User.objects.create_user(username='testuser', password='testpassword')
        self.tarea = Tarea.objects.create(
            titulo='Tarea de prueba',
            descripcion='Descripción de la tarea de prueba',
            estado='pendiente',
            prioridad='media',
            usuario=self.user
        )
        self.client.login(username='testuser', password='testpassword')

    def test_marcar_tarea_como_completada(self):
        url = reverse('tarea-update', kwargs={'pk': self.tarea.id})
        data = {
            'estado': 'completada'
        }
        response = self.client.put(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        # Verificar que el estado de la tarea se ha actualizado a 'completada'
        self.tarea.refresh_from_db()
        self.assertEqual(self.tarea.estado, 'completada')

    def test_marcar_tarea_como_completada_sin_autenticacion(self):
        self.client.logout()
        url = reverse('tarea-update', kwargs={'pk': self.tarea.id})
        data = {
            'estado': 'completada'
        }
        response = self.client.put(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_marcar_tarea_como_completada_usuario_incorrecto(self):
        otro_usuario = User.objects.create_user(username='otrotestuser', password='otropassword')
        self.client.login(username='otrotestuser', password='otropassword')
        url = reverse('tarea-update', kwargs={'pk': self.tarea.id})
        data = {
            'estado': 'completada'
        }
        response = self.client.put(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_marcar_tarea_como_completada_tarea_no_existente(self):
        url = reverse('tarea-update', kwargs={'pk': 9999})
        data = {
            'estado': 'completada'
        }
        response = self.client.put(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)