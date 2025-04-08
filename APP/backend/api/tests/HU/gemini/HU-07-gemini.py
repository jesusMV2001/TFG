# /home/jesus/python/TFG/APP/backend/api/tests/HU/gemini/HU-07-gemini.py
from rest_framework import status
from rest_framework.test import APITestCase
from django.contrib.auth.models import User
from api.models import Tarea
from rest_framework_simplejwt.tokens import RefreshToken

class MarcarTareaCompletadaTests(APITestCase):
    def setUp(self):
        # Crear un usuario de prueba
        self.user = User.objects.create_user(username='testuser', password='testpassword')

        # Obtener token JWT para el usuario
        refresh = RefreshToken.for_user(self.user)
        self.access_token = str(refresh.access_token)
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.access_token}')

        # Crear una tarea de prueba asociada al usuario
        self.tarea = Tarea.objects.create(
            titulo='Tarea de prueba',
            descripcion='Descripción de la tarea',
            estado='pendiente',
            prioridad='media',
            usuario=self.user
        )

    def test_marcar_tarea_como_completada(self):
        # Datos para actualizar la tarea a estado 'completada'
        data = {'estado': 'completada'}

        # URL para actualizar la tarea
        url = f'/api/tareas/update/{self.tarea.id}/'

        # Realizar la petición PUT para actualizar la tarea
        response = self.client.put(url, data, format='json')

        # Verificar que la petición fue exitosa (código de estado 200)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        # Refrescar la tarea desde la base de datos para obtener el estado actualizado
        self.tarea.refresh_from_db()

        # Verificar que el estado de la tarea se actualizó correctamente a 'completada'
        self.assertEqual(self.tarea.estado, 'completada')