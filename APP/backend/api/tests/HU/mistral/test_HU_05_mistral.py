from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from rest_framework.test import APIClient
from django.contrib.auth.models import User
from api.models import Tarea
from datetime import datetime

class TareaUpdateTestCase(APITestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(username='testuser', password='testpassword')
        self.client.force_authenticate(user=self.user)
        self.tarea = Tarea.objects.create(
            titulo='Tarea de prueba',
            descripcion='Descripción de prueba',
            fecha_vencimiento=datetime(2023, 12, 31),
            estado='pendiente',
            prioridad='media',
            usuario=self.user
        )
        self.url = reverse('tarea-update', kwargs={'pk': self.tarea.pk})

    def test_update_tarea(self):
        data = {
            'titulo': 'Tarea actualizada',
            'descripcion': 'Descripción actualizada',
            'fecha_vencimiento': '2023-11-30T00:00:00Z',
            'estado': 'en_progreso',
            'prioridad': 'alta'
        }
        response = self.client.put(self.url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.tarea.refresh_from_db()
        self.assertEqual(self.tarea.titulo, 'Tarea actualizada')
        self.assertEqual(self.tarea.descripcion, 'Descripción actualizada')
        self.assertEqual(self.tarea.fecha_vencimiento.strftime('%Y-%m-%d'), '2023-11-30')
        self.assertEqual(self.tarea.estado, 'en_progreso')
        self.assertEqual(self.tarea.prioridad, 'alta')

    def test_update_tarea_invalid_data(self):
        data = {
            'titulo': '',
            'descripcion': 'Descripción actualizada',
            'fecha_vencimiento': '2023-11-30T00:00:00Z',
            'estado': 'en_progreso',
            'prioridad': 'alta'
        }
        response = self.client.put(self.url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_update_tarea_nonexistent(self):
        url = reverse('tarea-update', kwargs={'pk': 999})
        data = {
            'titulo': 'Tarea actualizada',
            'descripcion': 'Descripción actualizada',
            'fecha_vencimiento': '2023-11-30T00:00:00Z',
            'estado': 'en_progreso',
            'prioridad': 'alta'
        }
        response = self.client.put(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)