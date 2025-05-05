# /home/jesus/python/TFG/APP/backend/api/tests/HU/mistral/test_HU_10_mistral.py

from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from django.contrib.auth.models import User
from api.models import Tarea, HistorialCambios

class HistorialActividadesTestCase(APITestCase):

    def setUp(self):
        self.user = User.objects.create_user(username='testuser', password='testpassword')
        self.client.login(username='testuser', password='testpassword')
        self.tarea = Tarea.objects.create(
            titulo='Tarea de prueba',
            descripcion='Descripción de prueba',
            estado='pendiente',
            prioridad='media',
            usuario=self.user
        )
        self.historial_url = reverse('historial-cambios', kwargs={'tarea_id': self.tarea.id})

    def test_registro_historial_creacion(self):
        # Verificar que se registra la creación de la tarea en el historial
        response = self.client.post(reverse('tarea-list-create'), {
            'titulo': 'Nueva tarea',
            'descripcion': 'Descripción de la nueva tarea',
            'estado': 'pendiente',
            'prioridad': 'media'
        })
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        tarea_id = response.data['id']
        historial = HistorialCambios.objects.filter(tarea_id=tarea_id)
        self.assertTrue(historial.exists())
        self.assertEqual(historial.first().accion, 'Creación')

    def test_registro_historial_actualizacion(self):
        # Verificar que se registra la actualización de la tarea en el historial
        response = self.client.put(reverse('tarea-update', kwargs={'pk': self.tarea.id}), {
            'titulo': 'Tarea actualizada',
            'descripcion': 'Descripción actualizada',
            'estado': 'en_progreso',
            'prioridad': 'alta'
        })
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        historial = HistorialCambios.objects.filter(tarea=self.tarea)
        self.assertTrue(historial.exists())
        self.assertIn('Estado: \'pendiente\' -> \'en_progreso\'', historial.first().accion)

    def test_acceso_historial(self):
        # Verificar que el usuario puede acceder al historial de una tarea
        response = self.client.get(self.historial_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(len(response.data) > 0)

    def test_historial_no_vacio(self):
        # Verificar que el historial no está vacío
        response = self.client.get(self.historial_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertNotEqual(len(response.data), 0)

    def test_historial_ordenado_por_fecha(self):
        # Verificar que el historial está ordenado por fecha de cambio descendente
        response = self.client.get(self.historial_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        fechas = [historial['fecha_cambio'] for historial in response.data]
        self.assertEqual(fechas, sorted(fechas, reverse=True))