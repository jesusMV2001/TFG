import json
from django.contrib.auth.models import User
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from api.models import Tarea

class TareaListTest(APITestCase):
    def setUp(self):
        # Crear un usuario de prueba
        self.user = User.objects.create_user(username='testuser', password='testpassword')
        
        # Autenticar al usuario
        self.client.login(username='testuser', password='testpassword')

        # Crear algunas tareas de prueba asociadas al usuario
        self.tarea1 = Tarea.objects.create(
            titulo='Tarea 1',
            descripcion='Descripción de la tarea 1',
            prioridad='alta',
            usuario=self.user
        )
        self.tarea2 = Tarea.objects.create(
            titulo='Tarea 2',
            descripcion='Descripción de la tarea 2',
            prioridad='media',
            usuario=self.user
        )
        # Crear una tarea para otro usuario para verificar que no se devuelve
        self.other_user = User.objects.create_user(username='otheruser', password='otherpassword')
        self.tarea3 = Tarea.objects.create(
            titulo='Tarea 3 - Otro Usuario',
            descripcion='Descripción de la tarea 3',
            prioridad='baja',
            usuario=self.other_user
        )

    def test_listar_tareas_usuario_autenticado(self):
        # Obtener la URL para listar tareas
        url = reverse('tarea-list-create')
        
        # Realizar la petición GET
        response = self.client.get(url)

        # Verificar que la petición fue exitosa
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        # Convertir la respuesta JSON a un diccionario de Python
        tareas = json.loads(response.content)

        # Verificar que se devuelvan las tareas correctas y la cantidad correcta
        self.assertEqual(len(tareas), 2)

        # Verificar que los datos de las tareas sean correctos
        self.assertEqual(tareas[0]['titulo'], 'Tarea 1')
        self.assertEqual(tareas[1]['titulo'], 'Tarea 2')

        # Verificar que el usuario de la tarea sea el usuario autenticado
        self.assertEqual(tareas[0]['usuario'], 'testuser')
        self.assertEqual(tareas[1]['usuario'], 'testuser')

    def test_listar_tareas_usuario_no_autenticado(self):
        # Cerrar la sesión para simular un usuario no autenticado
        self.client.logout()

        # Obtener la URL para listar tareas
        url = reverse('tarea-list-create')
        
        # Realizar la petición GET
        response = self.client.get(url)

        # Verificar que se requiere autenticación
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)