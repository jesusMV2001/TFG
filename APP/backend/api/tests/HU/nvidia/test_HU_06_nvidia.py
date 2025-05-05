from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase, APIClient
from api.models import Tarea
from django.contrib.auth.models import User

class HU06EliminarTareaTests(APITestCase):

    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user('john', 'john@example.com', 'password')
        self.client.force_authenticate(user=self.user)
        self.tarea = Tarea.objects.create(titulo='Tarea de prueba', descripcion='Descripcion de prueba', usuario=self.user)

    def test_eliminar_tarea_existe(self):
        # Verificar que la tarea exista antes de eliminar
        self.assertIsNotNone(Tarea.objects.get(id=self.tarea.id))

        # Eliminar la tarea
        url = reverse('tarea-delete', kwargs={'pk': self.tarea.id})
        response = self.client.delete(url)

        # Verificar respuesta exitosa
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)

        # Verificar que la tarea ya no exista
        with self.assertRaises(Tarea.DoesNotExist):
            Tarea.objects.get(id=self.tarea.id)

    def test_eliminar_tarea_inexistente(self):
        # Intentar eliminar una tarea inexistente
        url = reverse('tarea-delete', kwargs={'pk': 9999})
        response = self.client.delete(url)

        # Verificar respuesta de error
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_eliminar_tarea_sin_autenticacion(self):
        # Desautenticar al usuario
        self.client.force_authenticate(user=None)

        # Intentar eliminar una tarea sin autenticacion
        url = reverse('tarea-delete', kwargs={'pk': self.tarea.id})
        response = self.client.delete(url)

        # Verificar respuesta de error de autenticacion
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_eliminar_tarea_no_propia(self):
        # Crear otro usuario y otra tarea
        otro_usuario = User.objects.create_user('otro', 'otro@example.com', 'password')
        otra_tarea = Tarea.objects.create(titulo='Otra tarea de prueba', descripcion='Otra descripcion de prueba', usuario=otro_usuario)

        # Intentar eliminar la tarea del otro usuario
        url = reverse('tarea-delete', kwargs={'pk': otra_tarea.id})
        response = self.client.delete(url)

        # Verificar respuesta de error de permisos
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)