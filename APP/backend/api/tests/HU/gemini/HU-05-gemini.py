# /home/jesus/python/TFG/APP/backend/api/tests/HU/gemini/HU-05-gemini.py

from rest_framework import status
from rest_framework.test import APITestCase
from django.contrib.auth.models import User
from api.models import Tarea
from datetime import datetime, timedelta
from django.utils import timezone

class EditarTareaTests(APITestCase):
    def setUp(self):
        # Crear un usuario de prueba
        self.user = User.objects.create_user(username='testuser', password='testpassword')
        # Autenticar al usuario
        self.client.force_authenticate(user=self.user)

        # Crear una tarea de prueba
        self.tarea = Tarea.objects.create(
            titulo='Tarea original',
            descripcion='Descripción original',
            fecha_vencimiento=timezone.now() + timedelta(days=7),
            prioridad='media',
            estado='pendiente',
            usuario=self.user
        )
        self.tarea_id = self.tarea.id

    def test_puede_modificar_cualquier_campo_de_una_tarea(self):
        """
        Asegura que un usuario puede modificar cualquier campo de una tarea existente.
        """
        url = f'/api/tareas/update/{self.tarea_id}/'
        data = {
            'titulo': 'Tarea modificada',
            'descripcion': 'Descripción modificada',
            'fecha_vencimiento': timezone.now() + timedelta(days=14),
            'prioridad': 'alta',
            'estado': 'completada'
        }
        response = self.client.put(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        # Verificar que la tarea ha sido actualizada en la base de datos
        tarea_actualizada = Tarea.objects.get(pk=self.tarea_id)
        self.assertEqual(tarea_actualizada.titulo, 'Tarea modificada')
        self.assertEqual(tarea_actualizada.descripcion, 'Descripción modificada')
        self.assertEqual(tarea_actualizada.prioridad, 'alta')
        self.assertEqual(tarea_actualizada.estado, 'completada')

    def test_muestra_mensaje_si_se_ha_modificado_la_tarea(self):
        """
        Asegura que la API devuelve un mensaje exitoso al modificar la tarea.
        """
        url = f'/api/tareas/update/{self.tarea_id}/'
        data = {
            'titulo': 'Tarea modificada',
            'descripcion': 'Descripción modificada',
            'fecha_vencimiento': timezone.now() + timedelta(days=14),
            'prioridad': 'alta',
            'estado': 'completada'
        }
        response = self.client.put(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_muestra_mensaje_de_error_en_caso_de_error(self):
        """
        Asegura que la API devuelve un mensaje de error adecuado en caso de error.
        """
        url = f'/api/tareas/update/{self.tarea_id}/'
        # Intentar actualizar con datos inválidos (fecha de vencimiento en el pasado)
        data = {
            'titulo': 'Tarea modificada',
            'descripcion': 'Descripción modificada',
            'fecha_vencimiento': timezone.now() - timedelta(days=14),
            'prioridad': 'alta',
            'estado': 'completada'
        }
        response = self.client.put(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)