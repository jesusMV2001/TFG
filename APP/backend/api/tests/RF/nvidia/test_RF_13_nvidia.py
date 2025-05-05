from django.test import TestCase, Client
from django.urls import reverse
from rest_framework import status
from .models import Tarea, HistorialCambios, User
from datetime import datetime

class TestRF13HistorialCambios(TestCase):

    def setUp(self):
        self.client = Client()
        self.user = User.objects.create_superuser('testuser', 'testemail@domain.com', 'password')
        self.client.force_login(self.user)
        self.tarea = Tarea.objects.create(
            titulo='Tarea de Prueba',
            descripcion='Descripción de la tarea de prueba',
            usuario=self.user
        )

    def test_historial_cambios_fecha_hora(self):
        # Actualizar la tarea para generar un historial de cambios
        data = {'titulo': 'Tarea de Prueba Actualizada'}
        response = self.client.patch(reverse('tarea-update', kwargs={'pk': self.tarea.pk}), data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        # Verificar que el historial de cambios tenga la fecha y hora de la acción
        historial_cambios = HistorialCambios.objects.filter(tarea=self.tarea).latest('fecha_cambio')
        self.assertIsNotNone(historial_cambios.fecha_cambio)

    def test_historial_cambios_usuario(self):
        # Actualizar la tarea para generar un historial de cambios
        data = {'titulo': 'Tarea de Prueba Actualizada'}
        response = self.client.patch(reverse('tarea-update', kwargs={'pk': self.tarea.pk}), data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        # Verificar que el historial de cambios tenga el usuário que realizó la modificación
        historial_cambios = HistorialCambios.objects.filter(tarea=self.tarea).latest('fecha_cambio')
        self.assertEqual(historial_cambios.usuario, self.user)

    def test_historial_cambios_multiple_acciones(self):
        # Realizar varias acciones para generar múltiples registros en el historial de cambios
        acciones = [
            {'titulo': 'Tarea de Prueba Actualizada 1'},
            {'descripcion': 'Nueva descripción de la tarea de prueba'},
            {'estado': 'en_progreso'}
        ]

        for accion in acciones:
            response = self.client.patch(reverse('tarea-update', kwargs={'pk': self.tarea.pk}), accion, format='json')
            self.assertEqual(response.status_code, status.HTTP_200_OK)

        # Verificar que el historial de cambios tenga todos los registros
        historial_cambios = HistorialCambios.objects.filter(tarea=self.tarea).order_by('fecha_cambio')
        self.assertEqual(len(historial_cambios), len(acciones))

        # Verificar que cada registro tenga la fecha y hora de la acción y el usuário correcto
        for registro in historial_cambios:
            self.assertIsNotNone(registro.fecha_cambio)
            self.assertEqual(registro.usuario, self.user)