import json
from rest_framework import status
from rest_framework.test import APITestCase
from django.contrib.auth.models import User
from api.models import Tarea

class TareaCompletadaTests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(username='testuser', password='testpassword')
        self.client.force_authenticate(user=self.user)
        self.tarea = Tarea.objects.create(titulo='Test Tarea', usuario=self.user, estado='pendiente')
        self.tarea_id = self.tarea.id

    def test_marcar_tarea_como_completada(self):
        url = f'/api/tareas/update/{self.tarea_id}/'
        data = {'estado': 'completada'}
        response = self.client.patch(url, data, format='json')

        self.assertEqual(response.status_code, status.HTTP_200_OK)

        tarea_actualizada = Tarea.objects.get(id=self.tarea_id)
        self.assertEqual(tarea_actualizada.estado, 'completada')

    def test_marcar_tarea_como_completada_refleja_en_lista(self):
        url_update = f'/api/tareas/update/{self.tarea_id}/'
        data = {'estado': 'completada'}
        self.client.patch(url_update, data, format='json')

        url_list = '/api/tareas/'
        response = self.client.get(url_list)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['estado'], 'completada')

    def test_usuario_no_autenticado_no_puede_marcar_tarea_como_completada(self):
        self.client.logout()
        url = f'/api/tareas/update/{self.tarea_id}/'
        data = {'estado': 'completada'}
        response = self.client.patch(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_marcar_tarea_como_completada_con_datos_invalidos(self):
        url = f'/api/tareas/update/{self.tarea_id}/'
        data = {'estado': 'invalido'}
        response = self.client.patch(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)