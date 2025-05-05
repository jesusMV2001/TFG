# /home/jesus/python/TFG/APP/backend/api/tests/RF/mistral/test_RF_17_mistral.py

from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from api.models import Comentario, Tarea, User

class ComentarioVacioTestCase(APITestCase):

    def setUp(self):
        self.user = User.objects.create_user(username='testuser', password='testpassword')
        self.tarea = Tarea.objects.create(
            titulo='Tarea de prueba',
            usuario=self.user
        )
        self.url = reverse('comentario-list-create', kwargs={'tarea_id': self.tarea.id})

    def test_comentario_vacio(self):
        self.client.force_authenticate(user=self.user)
        data = {
            'texto': ''
        }
        response = self.client.post(self.url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('texto', response.data)
        self.assertEqual(response.data['texto'][0], "Este campo no puede estar vacío.")

    def test_comentario_valido(self):
        self.client.force_authenticate(user=self.user)
        data = {
            'texto': 'Este es un comentario válido'
        }
        response = self.client.post(self.url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Comentario.objects.count(), 1)
        self.assertEqual(Comentario.objects.get().texto, 'Este es un comentario válido')