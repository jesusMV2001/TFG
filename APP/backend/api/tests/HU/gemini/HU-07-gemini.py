# /home/jesus/python/TFG/APP/backend/api/tests/HU/gemini/HU-07-gemini.py
from django.contrib.auth.models import User
from rest_framework import status
from rest_framework.test import APITestCase
from api.models import Tarea

class HUTareaCompletadaTest(APITestCase):
    def setUp(self):
        # Crear un usuario de prueba
        self.user = User.objects.create_user(username='testuser', password='testpassword')
        # Autenticar al usuario
        self.client.force_authenticate(user=self.user)

        # Crear una tarea de prueba
        self.tarea = Tarea.objects.create(
            titulo='Tarea de prueba',
            estado='pendiente',
            prioridad='media',
            usuario=self.user
        )

    def test_marcar_tarea_completada(self):
        # Datos para actualizar la tarea a completada
        data = {'estado': 'completada'}

        # Realizar la petición PUT para actualizar la tarea
        url = f'/api/tareas/update/{self.tarea.pk}/'
        response = self.client.put(url, data, format='json')

        # Verificar que la petición fue exitosa (código 200)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        # Obtener la tarea actualizada de la base de datos
        tarea_actualizada = Tarea.objects.get(pk=self.tarea.pk)

        # Verificar que el estado de la tarea se actualizó a 'completada'
        self.assertEqual(tarea_actualizada.estado, 'completada')