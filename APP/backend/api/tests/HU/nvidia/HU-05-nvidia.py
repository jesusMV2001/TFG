# /home/jesus/python/TFG/APP/backend/api/tests/HU/nvidia/HU-05-nvidia.py
from django.test import TestCase, APIClient
from django.urls import reverse
from rest_framework import status
from .models import Tarea
from .serializers import TareaSerializer

class HU05EditarTareaTestCase(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.usuario = User.objects.create_user(username='testuser', password='contraseña123')
        self.client.force_authenticate(user=self.usuario)
        self.tarea = Tarea.objects.create(titulo='Tarea de ejemplo', descripcion='Descripción de ejemplo', usuario=self.usuario)

    def test_editar_tarea_con_exito(self):
        url = reverse('tarea-update', kwargs={'pk': self.tarea.pk})
        data = {'titulo': 'Nuevo título', 'descripcion': 'Nueva descripción'}
        response = self.client.patch(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(Tarea.objects.get(pk=self.tarea.pk).titulo, 'Nuevo título')

    def test_editar_tarea_con_error(self):
        url = reverse('tarea-update', kwargs={'pk': self.tarea.pk})
        data = {'titulo': '', 'descripcion': 'Nueva descripción'}  # Campo título vacío para forzar error
        response = self.client.patch(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self assertinglhsTarea.objects.get(pk=self.tarea.pk).titulo, 'Tarea de ejemplo')  # Verificar que no se actualizó