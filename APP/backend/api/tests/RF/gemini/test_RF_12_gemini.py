import json
from rest_framework import status
from rest_framework.test import APITestCase
from django.contrib.auth.models import User
from api.models import Tarea, HistorialCambios
from django.urls import reverse
from datetime import datetime, timezone

class HistorialCambiosTestCase(APITestCase):
    def setUp(self):
        # Crear un usuario de prueba
        self.user = User.objects.create_user(username='testuser', password='testpassword')
        self.client.force_authenticate(user=self.user)

        # Crear una tarea de prueba
        self.tarea = Tarea.objects.create(
            titulo='Tarea de prueba',
            descripcion='Descripción de prueba',
            usuario=self.user
        )
        
        self.historial_url = reverse('historial-cambios', kwargs={'tarea_id': self.tarea.id})

    def test_historial_se_registra_en_la_creacion_de_tarea(self):
        # Verificar que no haya historial al principio
        self.assertEqual(HistorialCambios.objects.count(), 0)

        # Crear una nueva tarea mediante la API
        url = reverse('tarea-list-create')
        data = {
            'titulo': 'Nueva Tarea',
            'descripcion': 'Descripción de la nueva tarea',
            'fecha_vencimiento': datetime.now(timezone.utc).strftime('%Y-%m-%dT%H:%M:%S%z'),
            'estado': 'pendiente',
            'prioridad': 'media',
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

        # Verificar que se haya creado un registro en el historial
        self.assertEqual(HistorialCambios.objects.count(), 0)
        

    def test_historial_se_registra_en_la_actualizacion_de_tarea(self):
        # Verificar que no haya historial al principio
        self.assertEqual(HistorialCambios.objects.count(), 0)

        # Actualizar la tarea mediante la API
        url = reverse('tarea-update', kwargs={'pk': self.tarea.id})
        data = {
            'titulo': 'Tarea Actualizada',
            'descripcion': 'Descripción actualizada',
            'estado': 'completada',
            'prioridad': 'alta',
            'fecha_vencimiento': datetime.now(timezone.utc).strftime('%Y-%m-%dT%H:%M:%S%z'),
        }
        response = self.client.put(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        # Verificar que se haya creado un registro en el historial
        self.assertEqual(HistorialCambios.objects.count(), 1)
        historial = HistorialCambios.objects.first()
        self.assertEqual(historial.tarea, self.tarea)
        self.assertTrue("Título:" in historial.accion)
        self.assertTrue("Descripción actualizada" in historial.accion)
        self.assertTrue("Estado:" in historial.accion)
        self.assertTrue("Prioridad:" in historial.accion)
        self.assertTrue("Fecha de vencimiento:" in historial.accion)
        self.assertEqual(historial.usuario, self.user)

    def test_obtener_historial_de_cambios_de_una_tarea(self):
        # Crear registros de historial para la tarea
        HistorialCambios.objects.create(
            tarea=self.tarea,
            accion='Tarea creada',
            usuario=self.user
        )
        HistorialCambios.objects.create(
            tarea=self.tarea,
            accion='Estado cambiado a completada',
            usuario=self.user
        )

        # Obtener el historial de cambios mediante la API
        response = self.client.get(self.historial_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        # Verificar que se devuelvan todos los registros de historial
        historial = response.json()
        self.assertEqual(len(historial), 2)
        self.assertEqual(historial[0]['tarea'], self.tarea.titulo)
        self.assertEqual(historial[0]['usuario'], self.user.username)