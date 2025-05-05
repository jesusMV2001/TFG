import json
from datetime import date, timedelta

from django.contrib.auth.models import User
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase


class TareaCreateTests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(username='testuser', password='testpassword')
        self.client.force_authenticate(user=self.user)
        self.tarea_list_url = reverse('tarea-list-create')

    def test_crear_tarea_exito(self):
        """
        Asegura que se puede crear una tarea con datos válidos.
        """
        fecha_vencimiento = date.today() + timedelta(days=7)
        data = {
            'titulo': 'Tarea de prueba',
            'descripcion': 'Descripción de la tarea',
            'fecha_vencimiento': fecha_vencimiento.strftime('%Y-%m-%d'),
            'prioridad': 'alta',
            'estado': 'pendiente'
        }
        response = self.client.post(self.tarea_list_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['titulo'], 'Tarea de prueba')
        self.assertEqual(response.data['descripcion'], 'Descripción de la tarea')
        self.assertEqual(response.data['prioridad'], 'alta')
        self.assertEqual(response.data['estado'], 'pendiente')

    def test_crear_tarea_titulo_vacio(self):
        """
        Asegura que no se puede crear una tarea con título vacío.
        """
        fecha_vencimiento = date.today() + timedelta(days=7)
        data = {
            'titulo': '',
            'descripcion': 'Descripción de la tarea',
            'fecha_vencimiento': fecha_vencimiento.strftime('%Y-%m-%d'),
            'prioridad': 'alta',
            'estado': 'pendiente'
        }
        response = self.client.post(self.tarea_list_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('titulo', response.data)

    def test_crear_tarea_fecha_vencimiento_vacia(self):
        """
        Asegura que no se puede crear una tarea con fecha de vencimiento vacía.
        """
        data = {
            'titulo': 'Tarea de prueba',
            'descripcion': 'Descripción de la tarea',
            'fecha_vencimiento': None,
            'prioridad': 'alta',
            'estado': 'pendiente'
        }
        response = self.client.post(self.tarea_list_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('fecha_vencimiento', response.data)

    def test_crear_tarea_prioridad_vacia(self):
         """
         Asegura que se puede crear una tarea con prioridad vacía, se le asigna el valor por defecto.
         """
         fecha_vencimiento = date.today() + timedelta(days=7)
         data = {
             'titulo': 'Tarea de prueba',
             'descripcion': 'Descripción de la tarea',
             'fecha_vencimiento': fecha_vencimiento.strftime('%Y-%m-%d'),
             'prioridad': '',
             'estado': 'pendiente'
         }
         response = self.client.post(self.tarea_list_url, data, format='json')
         self.assertEqual(response.status_code, status.HTTP_201_CREATED)
         self.assertEqual(response.data['prioridad'], 'media')

    def test_crear_tarea_fecha_vencimiento_anterior(self):
        """
        Asegura que no se puede crear una tarea con fecha de vencimiento anterior a la fecha actual.
        """
        fecha_vencimiento = date.today() - timedelta(days=1)
        data = {
            'titulo': 'Tarea de prueba',
            'descripcion': 'Descripción de la tarea',
            'fecha_vencimiento': fecha_vencimiento.strftime('%Y-%m-%d'),
            'prioridad': 'alta',
            'estado': 'pendiente'
        }
        response = self.client.post(self.tarea_list_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('fecha_vencimiento', response.data)

    def test_crear_tarea_con_estado_vacio(self):
         """
         Asegura que se puede crear una tarea con estado vacío, se le asigna el valor por defecto.
         """
         fecha_vencimiento = date.today() + timedelta(days=7)
         data = {
             'titulo': 'Tarea de prueba',
             'descripcion': 'Descripción de la tarea',
             'fecha_vencimiento': fecha_vencimiento.strftime('%Y-%m-%d'),
             'prioridad': 'alta',
             'estado': ''
         }
         response = self.client.post(self.tarea_list_url, data, format='json')
         self.assertEqual(response.status_code, status.HTTP_201_CREATED)
         self.assertEqual(response.data['estado'], 'pendiente')