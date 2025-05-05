from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from django.contrib.auth.models import User
from api.models import Tarea

class TestMarcadoTareasCompletadas(APITestCase):

    def setUp(self):
        self.user = User.objects.create_user(username='testuser', password='testpassword')
        self.client.login(username='testuser', password='testpassword')
        self.tarea = Tarea.objects.create(
            titulo='Tarea de prueba',
            descripcion='Descripción de la tarea de prueba',
            usuario=self.user,
            estado='pendiente',
            prioridad='media'
        )

    def test_marcar_tarea_como_completada(self):
        url = reverse('tarea-update', kwargs={'pk': self.tarea.id})
        data = {
            'estado': 'completada'
        }
        response = self.client.patch(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        self.tarea.refresh_from_db()
        self.assertEqual(self.tarea.estado, 'completada')

    def test_reflejar_estado_en_lista_de_tareas(self):
        url = reverse('tarea-update', kwargs={'pk': self.tarea.id})
        data = {
            'estado': 'completada'
        }
        self.client.patch(url, data, format='json')

        list_url = reverse('tarea-list-create')
        response = self.client.get(list_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        tareas = response.data
        tarea_completada = next((t for t in tareas if t['id'] == self.tarea.id), None)
        self.assertIsNotNone(tarea_completada)
        self.assertEqual(tarea_completada['estado'], 'completada')