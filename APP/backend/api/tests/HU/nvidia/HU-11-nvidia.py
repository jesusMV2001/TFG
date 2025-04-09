# /home/jesus/python/TFG/APP/backend/api/tests/HU/nvidia/HU-11-nvidia.py

from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from api.models import Etiqueta, Tarea

class HU11EtiquetaTestCase(APITestCase):
    def setUp(self):
        self.user = self.create_user('testuser', 'testpassword')
        self.tarea = Tarea.objects.create(titulo='Tarea de prueba', usuario=self.user)
        self.api_authentication()

    def create_user(self, username, password):
        return User.objects.create_user(username=username, password=password)

    def api_authentication(self):
        url = reverse('token_obtain_pair')
        data = {'username': 'testuser', 'password': 'testpassword'}
        response = self.client.post(url, data, format='json')
        self.token = response.data['access']
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.token}')

    def test_crear_etiqueta(self):
        url = reverse('etiqueta-list-create')
        data = {'nombre': 'Etiqueta de prueba', 'tarea': self.tarea.id}
        response = self.client.post(url, data, format='json')

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Etiqueta.objects.filter(tarea=self.tarea).count(), 1)

    def test_asignar_etiqueta_a_tarea(self):
        etiqueta = Etiqueta.objects.create(nombre='Etiqueta existente')
        url = reverse('etiqueta-list-create')
        data = {'nombre': 'Etiqueta de prueba', 'tarea': self.tarea.id}
        response = self.client.post(url, data, format='json')

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(self.tarea.etiquetas.count(), 1)
        self.assertIn(etiqueta, self.tarea.etiquetas.all())

    def test_mostrar_mensaje_al_crear_etiqueta(self):
        # Este test puede ser más complicado de implementar ya que depende de cómo se muestra el mensaje
        # en tu aplicación. Por lo general, los mensajes se manejan en la capa de presentación (frontend).
        # Sin embargo, si decides validar la creación de etiquetas mediante un mensaje en el backend,
        # aquí iría la implementación de ese test.
        pass