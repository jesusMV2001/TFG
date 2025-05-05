import json
from rest_framework import status
from rest_framework.test import APITestCase
from django.contrib.auth.models import User
from api.models import Tarea

class RF09Tests(APITestCase):
    def setUp(self):
        # Crear un usuario de prueba
        self.user = User.objects.create_user(username='testuser', password='testpassword')
        self.client.force_authenticate(user=self.user)

        # Crear una tarea de prueba
        self.tarea = Tarea.objects.create(
            titulo='Tarea de prueba',
            descripcion='Descripción de la tarea de prueba',
            usuario=self.user
        )
        self.tarea_url = f'/api/tareas/update/{self.tarea.id}/'
        
    def test_marcar_tarea_como_completada(self):
        """
        Prueba que una tarea pueda ser marcada como completada y que su estado se actualice correctamente.
        """
        data = {
            'titulo': self.tarea.titulo,
            'descripcion': self.tarea.descripcion,
            'estado': 'completada',
            'prioridad': self.tarea.prioridad
        }
        
        response = self.client.patch(self.tarea_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        # Verificar que la tarea se haya actualizado en la base de datos
        tarea_actualizada = Tarea.objects.get(id=self.tarea.id)
        self.assertEqual(tarea_actualizada.estado, 'completada')

    def test_marcar_tarea_como_completada_sin_autenticacion(self):
        """
        Prueba que un usuario no autenticado no pueda marcar una tarea como completada.
        """
        self.client.logout()
        data = {
            'titulo': self.tarea.titulo,
            'descripcion': self.tarea.descripcion,
            'estado': 'completada',
            'prioridad': self.tarea.prioridad
        }
        
        response = self.client.patch(self.tarea_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_marcar_tarea_como_completada_con_datos_invalidos(self):
        """
        Prueba que no se pueda marcar una tarea como completada con datos inválidos.
        """

        data = {
            'titulo': self.tarea.titulo,
            'descripcion': self.tarea.descripcion,
            'estado': 'invalido',
            'prioridad': self.tarea.prioridad
        }
        response = self.client.patch(self.tarea_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)