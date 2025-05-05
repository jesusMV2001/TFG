import json
from django.contrib.auth.models import User
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from api.models import Tarea, HistorialCambios

class HistorialCambiosTests(APITestCase):
    def setUp(self):
        # Crear un usuario de prueba
        self.user = User.objects.create_user(username='testuser', password='testpassword')
        self.client.force_authenticate(user=self.user)

        # Crear una tarea de prueba
        self.tarea = Tarea.objects.create(
            titulo='Tarea de prueba',
            descripcion='Descripción de la tarea de prueba',
            usuario=self.user
        )

    def test_ver_historial_cambios(self):
        # Crear algunos cambios en el historial
        HistorialCambios.objects.create(
            tarea=self.tarea,
            accion='Tarea creada',
            usuario=self.user
        )
        HistorialCambios.objects.create(
            tarea=self.tarea,
            accion='Estado cambiado a "En Progreso"',
            usuario=self.user
        )

        # Obtener el historial de cambios para la tarea
        url = reverse('historial-cambios', kwargs={'tarea_id': self.tarea.id})
        response = self.client.get(url)

        # Verificar que la respuesta sea exitosa
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        # Verificar que se devuelvan los cambios en el historial
        self.assertEqual(len(response.data), 2)

        # Verificar que los datos del historial sean correctos
        self.assertEqual(response.data[0]['tarea'], 'Tarea de prueba')
        self.assertEqual(response.data[0]['accion'], 'Estado cambiado a "En Progreso"')
        self.assertEqual(response.data[0]['usuario'], 'testuser')

    def test_ver_historial_cambios_tarea_no_existe(self):
        # Intentar obtener el historial de cambios para una tarea que no existe
        url = reverse('historial-cambios', kwargs={'tarea_id': 999})
        response = self.client.get(url)

        # Verificar que la respuesta sea exitosa (devuelve una lista vacía)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 0)

    def test_creacion_historial_al_actualizar_tarea(self):
        # Crear una tarea de prueba
        tarea = Tarea.objects.create(
            titulo='Tarea inicial',
            descripcion='Descripcion inicial',
            usuario=self.user
        )
        # Actualizar la tarea
        url = reverse('tarea-update', kwargs={'pk': tarea.id})
        data = {
            'titulo': 'Tarea modificada',
            'descripcion': 'Descripcion modificada',
            'estado': 'completada',
            'prioridad': 'alta',
            'usuario': self.user.id
        }
        response = self.client.put(url, data, format='json')

        # Verificar que la respuesta sea exitosa
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        # Verificar que se haya creado un registro en el historial de cambios
        historial = HistorialCambios.objects.filter(tarea=tarea)
        self.assertEqual(historial.count(), 1)

        #Verificar los cambios registrados
        self.assertTrue("Título: 'Tarea inicial' -> 'Tarea modificada'" in historial.first().accion)
        self.assertTrue("Descripción actualizada" in historial.first().accion)
        self.assertTrue("Estado: 'pendiente' -> 'completada'" in historial.first().accion)
        self.assertTrue("Prioridad: 'media' -> 'alta'" in historial.first().accion)

    def test_no_creacion_historial_si_no_hay_cambios(self):
        # Crear una tarea de prueba
        tarea = Tarea.objects.create(
            titulo='Tarea inicial',
            descripcion='Descripcion inicial',
            usuario=self.user
        )

        # Actualizar la tarea con los mismos datos
        url = reverse('tarea-update', kwargs={'pk': tarea.id})
        data = {
            'titulo': 'Tarea inicial',
            'descripcion': 'Descripcion inicial',
            'estado': 'pendiente',
            'prioridad': 'media',
            'usuario': self.user.id
        }
        response = self.client.put(url, data, format='json')

        # Verificar que la respuesta sea exitosa
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        # Verificar que no se haya creado un registro en el historial de cambios
        historial = HistorialCambios.objects.filter(tarea=tarea)
        self.assertEqual(historial.count(), 0)