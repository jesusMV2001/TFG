# /home/jesus/python/TFG/APP/backend/api/tests/HU/gemini/HU-09-gemini.py
from django.test import TestCase
from django.contrib.auth.models import User
from rest_framework.test import APIClient
from rest_framework import status
from api.models import Tarea

class BusquedaTareasTest(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(username='testuser', password='testpassword')
        self.client.force_authenticate(user=self.user)

        self.tarea1 = Tarea.objects.create(
            titulo='Tarea con palabra clave',
            descripcion='Esta tarea tiene la palabra clave en la descripción',
            usuario=self.user
        )
        self.tarea2 = Tarea.objects.create(
            titulo='Otra tarea',
            descripcion='Descripción sin la palabra clave',
            usuario=self.user
        )
        self.tarea3 = Tarea.objects.create(
            titulo='Tarea diferente con palabra clave',
            descripcion='Más descripción con la palabra clave',
            usuario=self.user
        )

    def test_busqueda_por_palabra_clave(self):
        response = self.client.get('/api/tareas/?search=palabra clave')  # Asume que tienes un filtro de búsqueda
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        data = response.json()
        self.assertEqual(len(data), 3) # Ajustar segun filtro implementado en el backend