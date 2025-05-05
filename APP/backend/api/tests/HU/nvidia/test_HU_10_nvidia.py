from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase, APIClient
from django.contrib.auth.models import User
from api.models import Tarea, HistorialCambios

class HU10_Test(APITestCase):

    def setUp(self):
        self.user = User.objects.create_user(username='testuser', email='test@email.com', password='password123')
        self.client = APIClient()
        self.client.force_authenticate(user=self.user)
        self.tarea = Tarea.objects.create(titulo='Tarea de Prueba', descripcion='Descripción de la tarea', usuario=self.user)

    def test_historial_cambios_registro(self):
        # Realizar cambio en la tarea para generar un registro en el historial
        self.tarea.estado = 'en_progreso'
        self.tarea.save()

        # Verificar que se ha creado un registro en el historial de cambios
        historial_cambios = HistorialCambios.objects.filter(tarea=self.tarea)
        self.assertEqual(len(historial_cambios), 1)

    def test_historial_cambios_detalle(self):
        # Realizar cambio en la tarea para generar un registro en el historial
        self.tarea.estado = 'en_progreso'
        self.tarea.save()

        # Obtener el registro de cambio
        historial_cambio = HistorialCambios.objects.get(tarea=self.tarea)

        # Verificar los detalles del registro
        self.assertEqual(historial_cambio.tarea, self.tarea)
        self.assertEqual(historial_cambio.usuario, self.user)

    def test_api_historial_cambios_list(self):
        # Realizar cambio en la tarea para generar un registro en el historial
        self.tarea.estado = 'en_progreso'
        self.tarea.save()

        # Realizar petición GET al API para obtener el historial de cambios
        url = reverse('historial-cambios', kwargs={'tarea_id': self.tarea.id})
        response = self.client.get(url)

        # Verificar que la respuesta es satisfactoria y contiene el registro
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)

    def test_api_historial_cambios_detalle(self):
        # Realizar cambio en la tarea para generar un registro en el historial
        self.tarea.estado = 'en_progreso'
        self.tarea.save()

        # Obtener el registro de cambio
        historial_cambio = HistorialCambios.objects.get(tarea=self.tarea)

        # Realizar petición GET al API para obtener el detalle del registro
        url = reverse('historial-cambios', kwargs={'tarea_id': self.tarea.id})
        response = self.client.get(url)

        # Verificar que la respuesta es satisfactoria y contiene los detalles correctos
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data[0]['id'], historial_cambio.id)
        self.assertEqual(response.data[0]['usuario'], self.user.username)