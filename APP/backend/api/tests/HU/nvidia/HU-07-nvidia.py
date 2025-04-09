# /home/jesus/python/TFG/APP/backend/api/tests/HU/nvidia/HU-07-nvidia.py

from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from api.models import Tarea
from django.contrib.auth.models import User

class HU07TareaCompletadaTest(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(username='testuser', password='testpassword')
        self.tarea = Tarea.objects.create(
            titulo='Tarea de prueba',
            descripcion='Descripción de la tarea',
            estado='pendiente',
            prioridad='media',
            usuario=self.user
        )

    def test_cambiar_estado_a_completada(self):
        # Iniciar sesión
        self.client.force_authenticate(user=self.user)

        # URL para actualizar tarea
        url = reverse('tarea-update', kwargs={'pk': self.tarea.id})

        # Datos para actualizar la tarea
        data = {'estado': 'completada'}

        # Enviar solicitud PUT para actualizar la tarea
        response = self.client.put(url, data, format='json')

        # Verificar que el estado de la tarea haya cambiado a "completada"
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(Tarea.objects.get(id=self.tarea.id).estado, 'completada')