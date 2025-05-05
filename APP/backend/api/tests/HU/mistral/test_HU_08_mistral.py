from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from api.models import Tarea, User
from django.utils import timezone

class OrdenarTareasTestCase(APITestCase):
    def setUp(self):
        # Crear un usuario de prueba
        self.user = User.objects.create_user(username='testuser', password='testpassword')
        self.client.login(username='testuser', password='testpassword')

        # Crear tareas de prueba
        self.tarea1 = Tarea.objects.create(
            titulo='Tarea 1',
            descripcion='Descripción de la tarea 1',
            fecha_vencimiento=timezone.now() + timezone.timedelta(days=10),
            estado='pendiente',
            prioridad='alta',
            usuario=self.user
        )
        self.tarea2 = Tarea.objects.create(
            titulo='Tarea 2',
            descripcion='Descripción de la tarea 2',
            fecha_vencimiento=timezone.now() + timezone.timedelta(days=5),
            estado='pendiente',
            prioridad='media',
            usuario=self.user
        )
        self.tarea3 = Tarea.objects.create(
            titulo='Tarea 3',
            descripcion='Descripción de la tarea 3',
            fecha_vencimiento=timezone.now() + timezone.timedelta(days=2),
            estado='pendiente',
            prioridad='baja',
            usuario=self.user
        )

    def test_ordenar_por_prioridad(self):
        response = self.client.get(reverse('tarea-list-create'))
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        tareas = response.data
        self.assertEqual(tareas[0]['id'], self.tarea1.id)
        self.assertEqual(tareas[1]['id'], self.tarea2.id)
        self.assertEqual(tareas[2]['id'], self.tarea3.id)

    def test_ordenar_por_fecha_vencimiento(self):
        response = self.client.get(reverse('tarea-list-create'))
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        tareas = response.data
        self.assertEqual(tareas[0]['id'], self.tarea3.id)
        self.assertEqual(tareas[1]['id'], self.tarea2.id)
        self.assertEqual(tareas[2]['id'], self.tarea1.id)