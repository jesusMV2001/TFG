import json
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase, APIClient
from api.models import Tarea, Etiqueta
from api.serializers import EtiquetaSerializer

class HU11CrearAsignarEtiquetasTestCase(APITestCase):

    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user('testuser', 'test@example.com', 'password123')
        self.client.force_authenticate(user=self.user)
        self.tarea = Tarea.objects.create(titulo='Tarea de Prueba', descripcion='Descripción de la tarea', usuario=self.user)

    def test_crear_etiqueta(self):
        """
        El usuario puede asignar y crear etiquetas para cada tarea.
        """
        url = reverse('etiqueta-create')
        data = {'nombre': 'Etiqueta de Prueba', 'tarea': self.tarea.id}
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Etiqueta.objects.count(), 1)
        self.assertEqual(Etiqueta.objects.get().nombre, 'Etiqueta de Prueba')
        self.assertEqual(Etiqueta.objects.get().tarea, self.tarea)

    def test_mostrar_mensaje_al_crear_etiqueta(self):
        """
        El sistema debe mostrar un mensaje cuando se cree y asigne una etiqueta a una tarea.
        """
        url = reverse('etiqueta-create')
        data = {'nombre': 'Etiqueta de Prueba', 'tarea': self.tarea.id}
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertIn('message', response.data)
        self.assertEqual(response.data['message'], 'Etiqueta creada y asignada correctamente.')

    def test_no_permite_crear_etiqueta_sin_tarea(self):
        """
        No se puede crear una etiqueta sin asignarla a una tarea.
        """
        url = reverse('etiqueta-create')
        data = {'nombre': 'Etiqueta de Prueba'}
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(Etiqueta.objects.count(), 0)

    def test_no_permite_crear_etiqueta_con_nombre_vacio(self):
        """
        No se puede crear una etiqueta con un nombre vacío.
        """
        url = reverse('etiqueta-create')
        data = {'nombre': '', 'tarea': self.tarea.id}
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(Etiqueta.objects.count(), 0)

    def test_no_permite_crear_etiqueta_con_nombre_repetido(self):
        """
        No se puede crear una etiqueta con un nombre que ya existe para la misma tarea.
        """
        Etiqueta.objects.create(nombre='Etiqueta de Prueba', tarea=self.tarea)
        url = reverse('etiqueta-create')
        data = {'nombre': 'Etiqueta de Prueba', 'tarea': self.tarea.id}
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(Etiqueta.objects.count(), 1)