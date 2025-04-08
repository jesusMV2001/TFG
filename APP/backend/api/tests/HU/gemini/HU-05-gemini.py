# /home/jesus/python/TFG/APP/backend/api/tests/HU/gemini/HU-05-gemini.py
from rest_framework import status
from rest_framework.test import APITestCase
from django.contrib.auth.models import User
from api.models import Tarea
from datetime import datetime

class EditarTareaTest(APITestCase):
    def setUp(self):
        # Crear un usuario de prueba
        self.user = User.objects.create_user(username='testuser', password='testpassword')
        # Autenticar al usuario
        self.client.force_authenticate(user=self.user)

        # Crear una tarea de prueba
        self.tarea = Tarea.objects.create(
            titulo='Tarea original',
            descripcion='Descripción original',
            fecha_vencimiento=datetime.now(),
            estado='pendiente',
            prioridad='media',
            usuario=self.user
        )
        self.tarea_id = self.tarea.id

    def test_editar_tarea_exitoso(self):
        # Datos para la actualización
        data = {
            'titulo': 'Tarea editada',
            'descripcion': 'Descripción editada',
            'fecha_vencimiento': datetime.now().isoformat(),
            'estado': 'en_progreso',
            'prioridad': 'alta'
        }

        # Realizar la petición PUT para actualizar la tarea
        response = self.client.put(f'/api/tareas/update/{self.tarea_id}/', data, format='json')

        # Verificar que la respuesta sea exitosa (código 200)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        # Verificar que la tarea se haya actualizado en la base de datos
        tarea_actualizada = Tarea.objects.get(pk=self.tarea_id)
        self.assertEqual(tarea_actualizada.titulo, 'Tarea editada')
        self.assertEqual(tarea_actualizada.descripcion, 'Descripción editada')
        self.assertEqual(tarea_actualizada.estado, 'en_progreso')
        self.assertEqual(tarea_actualizada.prioridad, 'alta')

    def test_editar_tarea_con_datos_invalidos(self):
        # Datos inválidos para la actualización (fecha de vencimiento en el pasado)
        data = {
            'titulo': 'Tarea editada',
            'descripcion': 'Descripción editada',
            'fecha_vencimiento': '2020-01-01T00:00:00',
            'estado': 'en_progreso',
            'prioridad': 'alta'
        }

        # Realizar la petición PUT para actualizar la tarea
        response = self.client.put(f'/api/tareas/update/{self.tarea_id}/', data, format='json')

        # Verificar que la respuesta sea de error (código 400)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_editar_tarea_sin_autenticacion(self):
        # Desautenticar al usuario
        self.client.force_authenticate(user=None)

        # Datos para la actualización
        data = {
            'titulo': 'Tarea editada',
            'descripcion': 'Descripción editada',
            'fecha_vencimiento': datetime.now().isoformat(),
            'estado': 'en_progreso',
            'prioridad': 'alta'
        }

        # Realizar la petición PUT para actualizar la tarea
        response = self.client.put(f'/api/tareas/update/{self.tarea_id}/', data, format='json')

        # Verificar que la respuesta sea de error (código 401)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_editar_tarea_no_existente(self):
        # Datos para la actualización
        data = {
            'titulo': 'Tarea editada',
            'descripcion': 'Descripción editada',
            'fecha_vencimiento': datetime.now().isoformat(),
            'estado': 'en_progreso',
            'prioridad': 'alta'
        }

        # Realizar la petición PUT para actualizar una tarea que no existe
        response = self.client.put('/api/tareas/update/999/', data, format='json')

        # Verificar que la respuesta sea de error (código 404)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)