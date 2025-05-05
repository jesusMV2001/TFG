import json
from rest_framework import status
from rest_framework.test import APITestCase
from django.contrib.auth.models import User
from api.models import Tarea

class EditarTareaTests(APITestCase):
    def setUp(self):
        # Crear un usuario para las pruebas
        self.user = User.objects.create_user(username='testuser', password='testpassword')
        self.client.force_authenticate(user=self.user)

        # Crear una tarea inicial para el usuario
        self.tarea = Tarea.objects.create(
            titulo='Tarea Original',
            descripcion='Descripción original',
            prioridad='media',
            estado='pendiente',
            usuario=self.user
        )
        self.tarea_id = self.tarea.id

    def test_editar_tarea_exitoso(self):
        """
        Prueba la edición exitosa de una tarea existente.
        """
        url = f'/api/tareas/update/{self.tarea_id}/'
        data = {
            'titulo': 'Tarea Editada',
            'descripcion': 'Descripción editada',
            'prioridad': 'alta',
            'estado': 'en_progreso',
        }
        response = self.client.put(url, data, format='json')

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['titulo'], 'Tarea Editada')
        self.assertEqual(response.data['descripcion'], 'Descripción editada')
        self.assertEqual(response.data['prioridad'], 'alta')
        self.assertEqual(response.data['estado'], 'en_progreso')

        # Verificar que la tarea se haya actualizado en la base de datos
        tarea_actualizada = Tarea.objects.get(id=self.tarea_id)
        self.assertEqual(tarea_actualizada.titulo, 'Tarea Editada')
        self.assertEqual(tarea_actualizada.descripcion, 'Descripción editada')
        self.assertEqual(tarea_actualizada.prioridad, 'alta')
        self.assertEqual(tarea_actualizada.estado, 'en_progreso')

    def test_editar_tarea_no_existente(self):
        """
        Prueba la edición de una tarea que no existe.
        """
        url = '/api/tareas/update/999/'  # ID que no existe
        data = {
            'titulo': 'Tarea Editada',
            'descripcion': 'Descripción editada',
            'prioridad': 'alta',
            'estado': 'en_progreso',
        }
        response = self.client.put(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_editar_tarea_con_datos_invalidos(self):
        """
        Prueba la edición de una tarea con datos inválidos (ej: estado no válido).
        """
        url = f'/api/tareas/update/{self.tarea_id}/'
        data = {
            'titulo': 'Tarea Editada',
            'descripcion': 'Descripción editada',
            'prioridad': 'alta',
            'estado': 'estado_invalido',
        }
        response = self.client.put(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_editar_tarea_sin_autenticacion(self):
        """
        Prueba la edición de una tarea sin autenticación.
        """
        self.client.logout()  # Desautenticar al usuario
        url = f'/api/tareas/update/{self.tarea_id}/'
        data = {
            'titulo': 'Tarea Editada',
            'descripcion': 'Descripción editada',
            'prioridad': 'alta',
            'estado': 'en_progreso',
        }
        response = self.client.put(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_editar_tarea_fecha_vencimiento_invalida(self):
        """
        Prueba editar tarea con fecha de vencimiento en el pasado.
        """
        url = f'/api/tareas/update/{self.tarea_id}/'
        data = {
            'titulo': 'Tarea Editada',
            'descripcion': 'Descripción editada',
            'prioridad': 'alta',
            'estado': 'en_progreso',
            'fecha_vencimiento': '2020-01-01T00:00:00Z'
        }
        response = self.client.put(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)