import json
from django.contrib.auth.models import User
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from api.models import Tarea


class VerTareasTests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(username='testuser', password='testpassword')
        self.client.force_authenticate(user=self.user)
        
        # Crear algunas tareas de prueba asociadas al usuario
        Tarea.objects.create(
            titulo='Tarea 1',
            descripcion='Descripción de la tarea 1',
            estado='pendiente',
            prioridad='alta',
            usuario=self.user
        )
        Tarea.objects.create(
            titulo='Tarea 2',
            descripcion='Descripción de la tarea 2',
            estado='en_progreso',
            prioridad='media',
            usuario=self.user
        )
        Tarea.objects.create(
            titulo='Tarea 3',
            descripcion='Descripción de la tarea 3',
            estado='completada',
            prioridad='baja',
            usuario=self.user
        )
        # Crear una tarea para otro usuario para verificar que no se muestre
        otro_usuario = User.objects.create_user(username='otheruser', password='otherpassword')
        Tarea.objects.create(
            titulo='Tarea de otro usuario',
            descripcion='Descripción de la tarea de otro usuario',
            estado='pendiente',
            prioridad='alta',
            usuario=otro_usuario
        )

    def test_listar_tareas_autenticado(self):
        """
        Asegura que un usuario autenticado puede listar sus tareas.
        """
        url = reverse('tarea-list-create')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        # Verificar que solo se devuelvan las tareas del usuario autenticado
        tareas = json.loads(response.content)
        self.assertEqual(len(tareas), 3)  # Solo las tareas del usuario actual
        for tarea in tareas:
            self.assertEqual(tarea['usuario'], 'testuser')

    def test_tareas_ordenadas_por_prioridad_y_fecha_vencimiento(self):
            """
            Asegura que las tareas se ordenan correctamente por prioridad y fecha de vencimiento.
            """
            # Crear tareas con diferentes prioridades y fechas de vencimiento
            Tarea.objects.create(
                titulo='Tarea Prioridad Media, Vencimiento Futuro',
                descripcion='Descripción',
                estado='pendiente',
                prioridad='media',
                fecha_vencimiento='2024-12-31T00:00:00Z',
                usuario=self.user
            )
            Tarea.objects.create(
                titulo='Tarea Prioridad Alta, Vencimiento Futuro',
                descripcion='Descripción',
                estado='pendiente',
                prioridad='alta',
                fecha_vencimiento='2024-12-31T00:00:00Z',
                usuario=self.user
            )
            Tarea.objects.create(
                titulo='Tarea Prioridad Baja, Vencimiento Futuro',
                descripcion='Descripción',
                estado='pendiente',
                prioridad='baja',
                fecha_vencimiento='2024-12-31T00:00:00Z',
                usuario=self.user
            )
            Tarea.objects.create(
                titulo='Tarea Prioridad Media, Vencimiento Cercano',
                descripcion='Descripción',
                estado='pendiente',
                prioridad='media',
                fecha_vencimiento='2024-01-01T00:00:00Z',
                usuario=self.user
            )

            url = reverse('tarea-list-create')
            response = self.client.get(url)
            self.assertEqual(response.status_code, status.HTTP_200_OK)

            tareas = json.loads(response.content)

            # Verificar el orden esperado basado en la prioridad y la fecha de vencimiento.
            prioridades = [tarea['prioridad'] for tarea in tareas]
            titulos = [tarea['titulo'] for tarea in tareas]
            
            expected_order = ['Tarea Prioridad Alta, Vencimiento Futuro', 'Tarea 1', 'Tarea Prioridad Media, Vencimiento Cercano', 'Tarea Prioridad Media, Vencimiento Futuro', 'Tarea 2', 'Tarea Prioridad Baja, Vencimiento Futuro', 'Tarea 3']
            self.assertEqual(titulos, expected_order)