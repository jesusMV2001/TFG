import json
from django.contrib.auth.models import User
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from api.models import Tarea, HistorialCambios
from datetime import datetime, timedelta
from django.utils import timezone


class HistorialCambiosUsuarioFechaTest(APITestCase):
    def setUp(self):
        # Crear un usuario para las pruebas
        self.user = User.objects.create_user(username='testuser', password='testpassword')
        self.client.force_authenticate(user=self.user)

        # Crear una tarea asociada al usuario
        self.tarea = Tarea.objects.create(
            titulo='Tarea de prueba',
            descripcion='Descripción de prueba',
            usuario=self.user
        )

    def test_historial_cambios_incluye_usuario_fecha(self):
        # Crear un cambio en la tarea (por ejemplo, actualizar la descripción)
        url = reverse('tarea-update', kwargs={'pk': self.tarea.pk})
        data = {'titulo': 'Tarea de prueba', 'descripcion': 'Nueva descripción', 'estado': 'pendiente', 'prioridad': 'media', 'fecha_vencimiento': timezone.now().date()}
        response = self.client.put(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        # Obtener el historial de cambios para la tarea
        historial_url = reverse('historial-cambios', kwargs={'tarea_id': self.tarea.pk})
        historial_response = self.client.get(historial_url)
        self.assertEqual(historial_response.status_code, status.HTTP_200_OK)

        # Verificar que el historial de cambios contiene la información del usuario y la fecha/hora
        historial_data = historial_response.json()
        self.assertEqual(len(historial_data), 1)
        self.assertEqual(historial_data[0]['usuario'], self.user.username)
        self.assertIn('fecha_cambio', historial_data[0])

    def test_creacion_tarea_genera_historial_con_usuario_fecha(self):
        # Crear una nueva tarea a través de la API
        url = reverse('tarea-list-create')
        data = {'titulo': 'Nueva tarea', 'descripcion': 'Descripción nueva', 'estado': 'pendiente', 'prioridad': 'media', 'fecha_vencimiento': timezone.now().date()}
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

        # Obtener la tarea creada
        tarea_id = response.data['id']
        tarea = Tarea.objects.get(pk=tarea_id)

        # Obtener el historial de cambios para la tarea
        historial_url = reverse('historial-cambios', kwargs={'tarea_id': tarea.pk})
        historial_response = self.client.get(historial_url)
        self.assertEqual(historial_response.status_code, status.HTTP_200_OK)

        # Verificar que el historial contiene la información del usuario y la fecha/hora de creación
        historial_data = historial_response.json()
        self.assertEqual(len(historial_data), 0) # No se crea historial en la creación.

    def test_eliminar_tarea_no_genera_historial(self):
        # Eliminar la tarea existente
        url = reverse('tarea-delete', kwargs={'pk': self.tarea.pk})
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)

        # Verificar que no se ha generado un nuevo registro en el historial de cambios
        historial_url = reverse('historial-cambios', kwargs={'tarea_id': self.tarea.pk})
        historial_response = self.client.get(historial_url)
        self.assertEqual(historial_response.status_code, status.HTTP_200_OK)
        historial_data = historial_response.json()
        self.assertEqual(len(historial_data), 0)