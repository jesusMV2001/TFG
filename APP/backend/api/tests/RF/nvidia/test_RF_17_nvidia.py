from rest_framework import status
from rest_framework.test import APITestCase
from django.urls import reverse
from api.models import Tarea, Comentario, User
from api.serializers import ComentarioSerializer

class TestRF17ComentarioNoVacio(APITestCase):

    def setUp(self):
        self.user = User.objects.create_user(username='testuser', email='test@email.com', password='strongpassword')
        self.tarea = Tarea.objects.create(titulo='Tarea de Prueba', usuario=self.user)
        self.comentario_vacio = {'texto': '', 'tarea': self.tarea.id}
        self.comentario_valido = {'texto': 'Comentario de prueba', 'tarea': self.tarea.id}
        self.url = reverse('comentario-list-create', kwargs={'tarea_id': self.tarea.id})

    def test_comentario_vacio(self):
        self.client.force_authenticate(user=self.user)
        response = self.client.post(self.url, self.comentario_vacio, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data['texto'][0], 'Este campo no puede ser blanco.')

    def test_comentario_valido(self):
        self.client.force_authenticate(user=self.user)
        response = self.client.post(self.url, self.comentario_valido, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Comentario.objects.count(), 1)
        self.assertEqual(Comentario.objects.get().texto, 'Comentario de prueba')

    def test_anonimous_user_cannot_post_comentario(self):
        response = self.client.post(self.url, self.comentario_valido, format='json')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)