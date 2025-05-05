from django.urls import reverse
from rest_framework.test import APITestCase
from rest_framework import status
from django.contrib.auth.models import User
from api.models import Tarea

class HU04MistralTestCase(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(username='testuser', password='testpassword')
        self.client.login(username='testuser', password='testpassword')

        self.tarea1 = Tarea.objects.create(
            titulo='Tarea 1',
            descripcion='Descripción de la tarea 1',
            estado='pendiente',
            prioridad='alta',
            usuario=self.user
        )
        self.tarea2 = Tarea.objects.create(
            titulo='Tarea 2',
            descripcion='Descripción de la tarea 2',
            estado='en_progreso',
            prioridad='media',
            usuario=self.user
        )
        self.tarea3 = Tarea.objects.create(
            titulo='Tarea 3',
            descripcion='Descripción de la tarea 3',
            estado='completada',
            prioridad='baja',
            usuario=self.user
        )

    def test_list_all_tasks(self):
        response = self.client.get(reverse('tarea-list-create'))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 3)

    def test_tasks_grouped_by_status(self):
        response = self.client.get(reverse('tarea-list-create'))
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        tasks = response.data
        pendiente_tasks = [task for task in tasks if task['estado'] == 'pendiente']
        en_progreso_tasks = [task for task in tasks if task['estado'] == 'en_progreso']
        completada_tasks = [task for task in tasks if task['estado'] == 'completada']

        self.assertEqual(len(pendiente_tasks), 1)
        self.assertEqual(len(en_progreso_tasks), 1)
        self.assertEqual(len(completada_tasks), 1)

    def test_tasks_order_by_priority(self):
        response = self.client.get(reverse('tarea-list-create'))
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        tasks = response.data
        self.assertEqual(tasks[0]['prioridad'], 'alta')
        self.assertEqual(tasks[1]['prioridad'], 'media')
        self.assertEqual(tasks[2]['prioridad'], 'baja')