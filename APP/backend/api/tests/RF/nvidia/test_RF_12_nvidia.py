from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase, APIClient
from django.contrib.auth.models import User
from api.models import Tarea, HistorialCambios

class TestRF12TareaHistorialCambios(APITestCase):

    def setUp(self):
        self.user = User.objects.create_user(username='testuser', email='test@example.com', password='strongpassword')
        self.client = APIClient()
        self.client.force_authenticate(user=self.user)

    def test_crear_tarea_genera_registro_creoacion(self):
        # Crear tarea
        tarea_data = {'titulo': 'Tarea de prueba', 'descripcion': 'Descripción de la tarea'}
        response = self.client.post(reverse('tarea-list-create'), tarea_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        tarea_id = response.data['id']

        # Verificar registro de creación en el historial
        historial = HistorialCambios.objects.filter(tarea_id=tarea_id)
        self.assertEqual(historial.count(), 1)
        self.assertEqual(historial[0].accion, "Creación")

    def test_editar_tarea_genera_registro_cambio(self):
        # Crear tarea
        tarea_data = {'titulo': 'Tarea de prueba', 'descripcion': 'Descripción de la tarea'}
        response = self.client.post(reverse('tarea-list-create'), tarea_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        tarea_id = response.data['id']

        # Editar tarea
        new_data = {'titulo': 'Título actualizado', 'descripcion': 'Descripción actualizada'}
        response = self.client.put(reverse('tarea-update', args=[tarea_id]), new_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        # Verificar registro de cambio en el historial
        historial = HistorialCambios.objects.filter(tarea_id=tarea_id)
        self.assertEqual(historial.count(), 2)  # 1 creación + 1 edición
        self.assertIn("Título actualizada", historial[1].accion)
        self.assertIn("Descripción actualizada", historial[1].accion)

    def test_cambiar_estado_tarea_genera_registro_cambio(self):
        # Crear tarea
        tarea_data = {'titulo': 'Tarea de prueba', 'descripcion': 'Descripción de la tarea'}
        response = self.client.post(reverse('tarea-list-create'), tarea_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        tarea_id = response.data['id']

        # Cambiar estado de la tarea
        new_data = {'estado': 'en_progreso'}
        response = self.client.patch(reverse('tarea-update', args=[tarea_id]), new_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        # Verificar registro de cambio en el historial
        historial = HistorialCambios.objects.filter(tarea_id=tarea_id)
        self.assertEqual(historial.count(), 2)  # 1 creación + 1 cambio de estado
        self.assertIn("Estado: 'pendiente' -> 'en_progreso'", historial[1].accion)