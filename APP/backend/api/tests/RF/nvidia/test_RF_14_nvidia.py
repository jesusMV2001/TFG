from rest_framework import status
from rest_framework.test import APITestCase, APIClient
from django.urls import reverse
from api.models import Tarea, Etiqueta, User

class TestEtiquetaCreacionAsignacion(APITestCase):

    def setUp(self):
        self.user = User.objects.create_user('john', 'john@example.com', 'password123')
        self.client = APIClient()
        self.client.force_authenticate(user=self.user)
        self.tarea = Tarea.objects.create(usuario=self.user, titulo='Tarea de Prueba')

    def test_crear_etiqueta_exitosamente(self):
        url = reverse('etiqueta-create')
        data = {'nombre': 'Etiqueta de Prueba', 'tarea': self.tarea.id}
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Etiqueta.objects.count(), 1)
        self.assertEqual(Etiqueta.objects.get().nombre, 'Etiqueta de Prueba')

    def test_asignar_etiqueta_a_tarea_existente(self):
        etiqueta = Etiqueta.objects.create(nombre='Otra Etiqueta de Prueba')
        url = reverse('etiqueta-create')
        data = {'nombre': etiqueta.nombre, 'tarea': self.tarea.id}
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Etiqueta.objects.filter(tarea=self.tarea).count(), 1)

    def test_no_crear_etiqueta_sin_tarea(self):
        url = reverse('etiqueta-create')
        data = {'nombre': 'Etiqueta de Prueba'}
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_no_crear_etiqueta_con_nombre_vacio(self):
        url = reverse('etiqueta-create')
        data = {'nombre': '', 'tarea': self.tarea.id}
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_no_crear_etiqueta_excediendo_longitud_maxima(self):
        url = reverse('etiqueta-create')
        data = {'nombre': 'a' * 51, 'tarea': self.tarea.id}
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_no_asignar_etiqueta_a_tarea_inexistente(self):
        url = reverse('etiqueta-create')
        data = {'nombre': 'Etiqueta de Prueba', 'tarea': 99999}
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_no_permiso_crear_etiqueta_para_otro_usuario(self):
        otro_usuario = User.objects.create_user('otro', 'otro@example.com', 'password123')
        otra_tarea = Tarea.objects.create(usuario=otro_usuario, titulo='Otra Tarea de Prueba')
        url = reverse('etiqueta-create')
        data = {'nombre': 'Etiqueta de Prueba', 'tarea': otra_tarea.id}
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)