from rest_framework import status
from rest_framework.test import APITestCase
from django.urls import reverse
from api.models import Tarea, Comentario, User
from api.serializers import ComentarioSerializer

class HU13CrearComentariosAPITestCase(APITestCase):

    def setUp(self):
        self.usuario = User.objects.create_user(username='testuser', email='test@example.com', password='strongpass')
        self.tarea = Tarea.objects.create(titulo='Tarea de prueba', usuario=self.usuario)
        self.client.force_authenticate(user=self.usuario)

    def test_crear_comentario_vacio(self):
        # Comentario vacío
        data = {'texto': ''}
        response = self.client.post(reverse('comentario-list-create', kwargs={'tarea_id': self.tarea.id}), data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_crear_comentario_exitosamente(self):
        # Comentario con texto
        data = {'texto': 'Comentario de prueba'}
        response = self.client.post(reverse('comentario-list-create', kwargs={'tarea_id': self.tarea.id}), data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Comentario.objects.count(), 1)
        self.assertEqual(Comentario.objects.first().texto, 'Comentario de prueba')

    def test_verificar_comentario_creado(self):
        # Verificar que el comentario se muestre después de crearlo
        data = {'texto': 'Comentario de prueba'}
        self.client.post(reverse('comentario-list-create', kwargs={'tarea_id': self.tarea.id}), data, format='json')
        response = self.client.get(reverse('comentario-list-create', kwargs={'tarea_id': self.tarea.id}))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        serializer = ComentarioSerializer(Comentario.objects.first(), many=False)
        self.assertEqual(response.data[0], serializer.data)

    def test_crear_comentario_sin_autenticar(self):
        # Intentar crear un comentario sin autenticar
        self.client.force_authenticate(user=None)
        data = {'texto': 'Comentario de prueba'}
        response = self.client.post(reverse('comentario-list-create', kwargs={'tarea_id': self.tarea.id}), data, format='json')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)