from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from api.models import Tarea, User
from django.utils import timezone

class BusquedaTareasTests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(username='testuser', password='testpassword')
        self.client.force_authenticate(user=self.user)

        # Crear algunas tareas de prueba
        self.tarea1 = Tarea.objects.create(
            titulo='Tarea de prueba 1',
            descripcion='Esta es una descripción de prueba para la tarea 1',
            fecha_vencimiento=timezone.now(),
            usuario=self.user
        )
        self.tarea2 = Tarea.objects.create(
            titulo='Tarea de prueba 2',
            descripcion='Esta es una descripción de prueba para la tarea 2',
            fecha_vencimiento=timezone.now(),
            usuario=self.user
        )
        self.tarea3 = Tarea.objects.create(
            titulo='Otra tarea de prueba',
            descripcion='Esta es una descripción diferente',
            fecha_vencimiento=timezone.now(),
            usuario=self.user
        )

    def test_busqueda_por_titulo(self):
        url = reverse('tarea-list-create')
        response = self.client.get(url, {'search': 'prueba'})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 2)
        self.assertEqual(response.data[0]['titulo'], 'Tarea de prueba 1')
        self.assertEqual(response.data[1]['titulo'], 'Tarea de prueba 2')

    def test_busqueda_por_descripcion(self):
        url = reverse('tarea-list-create')
        response = self.client.get(url, {'search': 'descripción de prueba'})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 2)
        self.assertEqual(response.data[0]['titulo'], 'Tarea de prueba 1')
        self.assertEqual(response.data[1]['titulo'], 'Tarea de prueba 2')

    def test_busqueda_sin_resultados(self):
        url = reverse('tarea-list-create')
        response = self.client.get(url, {'search': 'inexistente'})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 0)

    def test_busqueda_sin_parametro(self):
        url = reverse('tarea-list-create')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 3)

    def test_busqueda_con_parametro_vacio(self):
        url = reverse('tarea-list-create')
        response = self.client.get(url, {'search': ''})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 3)