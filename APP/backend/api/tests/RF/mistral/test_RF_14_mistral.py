# /home/jesus/python/TFG/APP/backend/api/tests/RF/mistral/test_RF_14_mistral.py

from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from django.contrib.auth.models import User
from api.models import Tarea, Etiqueta

class EtiquetaTestCase(APITestCase):

    def setUp(self):
        self.user = User.objects.create_user(username='testuser', password='testpassword')
        self.tarea = Tarea.objects.create(titulo='Tarea de prueba', usuario=self.user)
        self.client.force_authenticate(user=self.user)

    def test_create_etiqueta(self):
        url = reverse('etiqueta-create')
        data = {
            'nombre': 'Etiqueta de prueba',
            'tarea_id': self.tarea.id
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Etiqueta.objects.count(), 1)
        self.assertEqual(Etiqueta.objects.get().nombre, 'Etiqueta de prueba')
        self.assertEqual(Etiqueta.objects.get().tarea, self.tarea)

    def test_create_etiqueta_with_existing_name(self):
        Etiqueta.objects.create(nombre='Etiqueta existente', tarea=self.tarea)
        url = reverse('etiqueta-create')
        data = {
            'nombre': 'Etiqueta existente',
            'tarea_id': self.tarea.id
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(Etiqueta.objects.count(), 1)

    def test_create_etiqueta_with_invalid_tarea_id(self):
        url = reverse('etiqueta-create')
        data = {
            'nombre': 'Etiqueta de prueba',
            'tarea_id': 999
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(Etiqueta.objects.count(), 0)

    def test_assign_etiqueta_to_tarea(self):
        etiqueta = Etiqueta.objects.create(nombre='Etiqueta existente', tarea=None)
        url = reverse('etiqueta-create')
        data = {
            'nombre': etiqueta.nombre,
            'tarea_id': self.tarea.id
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        etiqueta.refresh_from_db()
        self.assertEqual(etiqueta.tarea, self.tarea)

    def test_create_etiqueta_without_name(self):
        url = reverse('etiqueta-create')
        data = {
            'nombre': '',
            'tarea_id': self.tarea.id
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(Etiqueta.objects.count(), 0)

    def test_create_etiqueta_without_tarea_id(self):
        url = reverse('etiqueta-create')
        data = {
            'nombre': 'Etiqueta de prueba',
            'tarea_id': None
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(Etiqueta.objects.count(), 0)