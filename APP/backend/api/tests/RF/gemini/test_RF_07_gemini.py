import json
from django.contrib.auth.models import User
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from api.models import Tarea

class TareaUpdateTests(APITestCase):
    def setUp(self):
        # Crear un usuario de prueba
        self.user = User.objects.create_user(username='testuser', password='testpassword')
        self.client.force_authenticate(user=self.user)

        # Crear una tarea de prueba asociada al usuario
        self.tarea = Tarea.objects.create(
            titulo='Tarea Original',
            descripcion='Descripción original',
            estado='pendiente',
            prioridad='media',
            usuario=self.user
        )
        self.tarea_url = reverse('tarea-update', kwargs={'pk': self.tarea.pk})

    def test_can_update_tarea_fields(self):
        # Datos actualizados para la tarea
        updated_data = {
            'titulo': 'Tarea Actualizada',
            'descripcion': 'Nueva descripción',
            'estado': 'en_progreso',
            'prioridad': 'alta',
        }

        # Realizar la petición PUT para actualizar la tarea
        response = self.client.put(
            self.tarea_url,
            data=updated_data,
            format='json'
        )

        # Verificar que la petición fue exitosa (código de estado 200 OK)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        # Refrescar la tarea desde la base de datos para obtener los valores actualizados
        self.tarea.refresh_from_db()

        # Verificar que los campos de la tarea han sido actualizados correctamente
        self.assertEqual(self.tarea.titulo, updated_data['titulo'])
        self.assertEqual(self.tarea.descripcion, updated_data['descripcion'])
        self.assertEqual(self.tarea.estado, updated_data['estado'])
        self.assertEqual(self.tarea.prioridad, updated_data['prioridad'])