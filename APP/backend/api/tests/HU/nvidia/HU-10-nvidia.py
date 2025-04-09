# /home/jesus/python/TFG/APP/backend/api/tests/HU/nvidia/HU-10-nvidia.py

from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase, APIClient
from .models import Tarea, HistorialCambios
from .serializers import HistorialCambiosSerializer

class HU10HistorialActividadesTestCase(APITestCase):
    def setUp(self):
        self.user = {'username': 'usuario_prueba', 'password': 'contraseña_prueba'}
        self.client = APIClient()
        self.client.force_authenticate(**self.user)

        # Crear tarea de prueba
        self.tarea = Tarea.objects.create(
            titulo='Tarea de Ejemplo',
            descripcion='Descripción de la tarea',
            fecha_creacion='2024-03-10T14:30:00',
            fecha_vencimiento='2024-03-15T14:30:00',
            estado='pendiente',
            prioridad='alta',
            usuario_id=1
        )

        # Crear registros de historial de cambios
        HistorialCambios.objects.create(
            tarea_id=self.tarea.id,
            accion='Creación',
            fecha_cambio='2024-03-10T14:30:00',
            usuario_id=1
        )
        HistorialCambios.objects.create(
            tarea_id=self.tarea.id,
            accion='Actualización de Estado a En Progreso',
            fecha_cambio='2024-03-12T10:00:00',
            usuario_id=1
        )

    def test_obtiene_historial_cambios(self):
        url = reverse('historial-cambios', kwargs={'tarea_id': self.tarea.id})
        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)

        serializer = HistorialCambiosSerializer(HistorialCambios.objects.filter(tarea_id=self.tarea.id), many=True)
        self.assertEqual(response.data, serializer.data)

    def test_muestra_fecha_y_hora_cambios(self):
        url = reverse('historial-cambios', kwargs={'tarea_id': self.tarea.id})
        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertContains(response, '2024-03-10T14:30:00')
        self.assertContains(response, '2024-03-12T10:00:00')