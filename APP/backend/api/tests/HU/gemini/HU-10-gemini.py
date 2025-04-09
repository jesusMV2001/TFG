# /home/jesus/python/TFG/APP/backend/api/tests/HU/gemini/HU-10-gemini.py
from django.contrib.auth.models import User
from rest_framework import status
from rest_framework.test import APITestCase
from api.models import Tarea, HistorialCambios
from rest_framework_simplejwt.tokens import RefreshToken
from django.urls import reverse

class HistorialCambiosTests(APITestCase):
    def setUp(self):
        # Crear un usuario de prueba
        self.user = User.objects.create_user(username='testuser', password='testpassword')
        self.user2 = User.objects.create_user(username='testuser2', password='testpassword')

        # Obtener token JWT para el usuario
        refresh = RefreshToken.for_user(self.user)
        self.access_token = str(refresh.access_token)

        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.access_token}')

        # Crear una tarea de prueba asociada al usuario
        self.tarea = Tarea.objects.create(
            titulo='Tarea de prueba',
            descripcion='Descripción de la tarea',
            usuario=self.user
        )
        self.tarea2 = Tarea.objects.create(
            titulo='Tarea de prueba2',
            descripcion='Descripción de la tarea',
            usuario=self.user2
        )

        # Crear historial de cambios de prueba para la tarea
        self.historial1 = HistorialCambios.objects.create(
            tarea=self.tarea,
            accion='Tarea creada',
            usuario=self.user
        )
        self.historial2 = HistorialCambios.objects.create(
            tarea=self.tarea,
            accion='Tarea actualizada',
            usuario=self.user
        )

    def test_obtener_historial_cambios(self):
        """
        Asegura que se puede obtener el historial de cambios de una tarea específica.
        """
        url = reverse('historial-cambios', kwargs={'tarea_id': self.tarea.id})
        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 2)  # Verifica que se retornen dos elementos del historial
        self.assertEqual(response.data[0]['accion'], 'Tarea actualizada')  # Verifica el contenido del primer elemento
        self.assertEqual(response.data[1]['accion'], 'Tarea creada')
    
    def test_obtener_historial_cambios_tarea_otro_usuario(self):
        """
        Asegura que no se puede obtener el historial de cambios de una tarea específica de otro usuario.
        """
        url = reverse('historial-cambios', kwargs={'tarea_id': self.tarea2.id})
        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 0)  # Verifica que no se retornen elementos del historial

    def test_historial_cambios_ordenado_por_fecha(self):
        """
        Asegura que el historial de cambios se devuelve ordenado por fecha de cambio descendente.
        """
        url = reverse('historial-cambios', kwargs={'tarea_id': self.tarea.id})
        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data[0]['accion'], 'Tarea actualizada')
        self.assertEqual(response.data[1]['accion'], 'Tarea creada')