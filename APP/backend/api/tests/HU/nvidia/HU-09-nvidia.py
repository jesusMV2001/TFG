# /home/jesus/python/TFG/APP/backend/api/tests/HU/nvidia/HU-09-nvidia.py

import json
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase, APIClient
from .factories import TareaFactory, UserFactory

class TestHU09BusquedaDeTareas(APITestCase):
    def setUp(self):
        self.user = UserFactory()
        self.client = APIClient()
        self.client.force_authenticate(user=self.user)

        # Crear tareas para la prueba
        self.tarea1 = TareaFactory(titulo='Tarea 1 con palabras clave', descripcion='Descripción')
        self.tarea2 = TareaFactory(titulo='Otra tarea', descripcion='Descripción con palabras clave')
        self.tarea3 = TareaFactory(titulo='Tarea sincoinsidencia', descripcion='Sin coincidencia')

    def test_busqueda_tareas_palabra_clave(self):
        # URL de la API para tareas
        url = reverse('tarea-list-create')

        # Realizar petición GET con parámetro de búsqueda
        response = self.client.get(url, {'search': 'palabras clave'})

        # Verificar código de respuesta exitoso
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        # Verificar contenido de la respuesta
        content = json.loads(response.content)
        self.assertEqual(len(content), 2)  # Solo 2 tareas coinciden

        # Verificar que las tareas coincidentes están presentes
        self.assertEqual(content[0]['id'], self.tarea1.id)
        self.assertEqual(content[1]['id'], self.tarea2.id)

        # Verificar que la tarea sin coincidencia no está presente
        self.assertNotIn(self.tarea3.id, [t['id'] for t in content])