# /home/jesus/python/TFG/APP/backend/api/tests/HU/nvidia/HU-07-nvidia.py

from rest_framework import status
from rest_framework.test import APITestCase, APIClient
from django.urls import reverse
from api.models import Tarea, User

class HU07_MarcadoTareaCompletadaTestCase(APITestCase):

    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(username='testuser', email='test@example.com', password='strongpassword')
        self.client.force_authenticate(user=self.user)
        self.tarea = Tarea.objects.create(titulo='Tarea de prueba', descripcion='Esta es una tarea de prueba', usuario=self.user)

    def test_marcar_tarea_completada(self):
        # Verificar estado inicial de la tarea
        self.assertEqual(self.tarea.estado, 'pendiente')

        # Actualizar tarea a completada
        url = reverse('tarea-update', kwargs={'pk': self.tarea.pk})
        data = {'estado': 'completada'}
        response = self.client.patch(url, data, format='json')

        # Verificar respuesta exitosa
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        # Verificar estado de la tarea después de la actualización
        self.tarea.refresh_from_db()
        self.assertEqual(self.tarea.estado, 'completada')

    def test_reflejar_cambio_en_lista_tareas(self):
        # Actualizar tarea a completada
        url = reverse('tarea-update', kwargs={'pk': self.tarea.pk})
        data = {'estado': 'completada'}
        self.client.patch(url, data, format='json')
        self.tarea.refresh_from_db()

        # Verificar lista de tareas con la tarea actualizada
        url = reverse('tarea-list-create')
        response = self.client.get(url, format='json')

        # Verificar que la tarea aparece con estado "completada" en la lista
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['estado'], 'completada')
        self.assertEqual(response.data[0]['titulo'], self.tarea.titulo)