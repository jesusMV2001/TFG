# /home/jesus/python/TFG/APP/backend/api/tests/RF/mistral/test_RF_12_mistral.py

from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase, APIClient
from django.contrib.auth.models import User
from api.models import Tarea, HistorialCambios

class TestRF12HistorialCambios(APITestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(username='testuser', password='testpassword')
        self.client.force_authenticate(user=self.user)
        self.tarea = Tarea.objects.create(
            titulo='Tarea de prueba',
            descripcion='Descripción de prueba',
            estado='pendiente',
            prioridad='media',
            usuario=self.user
        )
        self.historial_url = reverse('historial-cambios', kwargs={'tarea_id': self.tarea.id})

    def test_creacion_tarea_registra_historial(self):
        # Verificar que se ha creado un registro en HistorialCambios al crear una tarea
        historial = HistorialCambios.objects.filter(tarea=self.tarea).first()
        self.assertIsNotNone(historial)
        self.assertEqual(historial.accion, "Creación")

    def test_edicion_tarea_registra_historial(self):
        # Editar la tarea
        updated_data = {
            'titulo': 'Tarea editada',
            'descripcion': 'Descripción editada',
            'estado': 'en_progreso',
            'prioridad': 'alta',
        }
        response = self.client.put(reverse('tarea-update', kwargs={'pk': self.tarea.id}), updated_data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        # Verificar que se ha creado un registro en HistorialCambios al editar una tarea
        historial = HistorialCambios.objects.filter(tarea=self.tarea).last()
        self.assertIsNotNone(historial)
        self.assertIn("Título: 'Tarea de prueba' -> 'Tarea editada'", historial.accion)
        self.assertIn("Descripción actualizada", historial.accion)
        self.assertIn("Estado: 'pendiente' -> 'en_progreso'", historial.accion)
        self.assertIn("Prioridad: 'media' -> 'alta'", historial.accion)

    def test_cambio_estado_tarea_registra_historial(self):
        # Cambiar el estado de la tarea
        updated_data = {
            'estado': 'completada',
        }
        response = self.client.patch(reverse('tarea-update', kwargs={'pk': self.tarea.id}), updated_data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        # Verificar que se ha creado un registro en HistorialCambios al cambiar el estado de una tarea
        historial = HistorialCambios.objects.filter(tarea=self.tarea).last()
        self.assertIsNotNone(historial)
        self.assertIn("Estado: 'pendiente' -> 'completada'", historial.accion)

    def test_obtener_historial_tarea(self):
        # Obtener el historial de cambios de una tarea
        response = self.client.get(self.historial_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(len(response.data) > 0)

        # Verificar que el historial contiene la información esperada
        historial = response.data[0]
        self.assertEqual(historial['tarea'], self.tarea.titulo)
        self.assertEqual(historial['accion'], "Creación")
        self.assertEqual(historial['usuario'], self.user.username)