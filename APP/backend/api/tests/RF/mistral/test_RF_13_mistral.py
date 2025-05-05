# /home/jesus/python/TFG/APP/backend/api/tests/RF/mistral/test_RF_13_mistral.py

from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from django.contrib.auth.models import User
from api.models import Tarea, HistorialCambios
from datetime import datetime

class HistorialCambiosTestCase(APITestCase):

    def setUp(self):
        # Crear un usuario de prueba
        self.user = User.objects.create_user(username='testuser', password='testpassword')
        self.client.force_authenticate(user=self.user)

        # Crear una tarea de prueba
        self.tarea = Tarea.objects.create(
            titulo='Tarea de prueba',
            descripcion='Descripción de la tarea de prueba',
            fecha_vencimiento=datetime(2023, 12, 31, 23, 59, 59),
            estado='pendiente',
            prioridad='media',
            usuario=self.user
        )

    def test_historial_cambios_registro(self):
        # Actualizar la tarea para generar un cambio
        response = self.client.patch(
            reverse('tarea-update', kwargs={'pk': self.tarea.pk}),
            {'estado': 'completada'},
            format='json'
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        # Verificar que se haya creado un registro en el historial de cambios
        historial = HistorialCambios.objects.filter(tarea=self.tarea).first()
        self.assertIsNotNone(historial)
        self.assertEqual(historial.accion, "Estado: 'pendiente' -> 'completada'")
        self.assertEqual(historial.usuario, self.user)
        self.assertIsNotNone(historial.fecha_cambio)

    def test_historial_cambios_fecha_hora(self):
        # Actualizar la tarea para generar un cambio
        response = self.client.patch(
            reverse('tarea-update', kwargs={'pk': self.tarea.pk}),
            {'titulo': 'Tarea actualizada'},
            format='json'
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        # Verificar que la fecha y hora del cambio sean correctas
        historial = HistorialCambios.objects.filter(tarea=self.tarea).first()
        self.assertIsNotNone(historial)
        self.assertIsNotNone(historial.fecha_cambio)
        self.assertLessEqual(historial.fecha_cambio, datetime.now())

    def test_historial_cambios_usuario(self):
        # Actualizar la tarea para generar un cambio
        response = self.client.patch(
            reverse('tarea-update', kwargs={'pk': self.tarea.pk}),
            {'prioridad': 'alta'},
            format='json'
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        # Verificar que el usuario que realizó el cambio sea correcto
        historial = HistorialCambios.objects.filter(tarea=self.tarea).first()
        self.assertIsNotNone(historial)
        self.assertEqual(historial.usuario, self.user)