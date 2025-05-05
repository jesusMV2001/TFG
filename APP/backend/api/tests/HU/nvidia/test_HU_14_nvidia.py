import pytest
from rest_framework import status
from rest_framework.test import APIClient
from django.urls import reverse
from api.models import Comentario, Tarea, User

@pytest.mark.django_db
class TestHU14EditarComentario:
    def setup_method(self):
        self.client = APIClient()
        self.user = User.objects.create_user('john_doe', 'john@example.com', 'password123')
        self.client.force_authenticate(user=self.user)
        self.tarea = Tarea.objects.create(titulo='Tarea de ejemplo', usuario=self.user)
        self.comentario = Comentario.objects.create(texto='Comentario de ejemplo', tarea=self.tarea, usuario=self.user)

    def test_editar_comentario_exitosamente(self):
        url = reverse('comentario-update', kwargs={'pk': self.comentario.pk})
        data = {'texto': 'Comentario editado con éxito'}
        response = self.client.put(url, data, format='json')
        assert response.status_code == status.HTTP_200_OK
        assert Comentario.objects.get(pk=self.comentario.pk).texto == data['texto']

    def test_comentario_no_vacio(self):
        url = reverse('comentario-update', kwargs={'pk': self.comentario.pk})
        data = {'texto': ''}
        response = self.client.put(url, data, format='json')
        assert response.status_code == status.HTTP_400_BAD_REQUEST
        assert 'texto' in response.json()

    def test_mensaje_exito_al_editar_comentario(self):
        url = reverse('comentario-update', kwargs={'pk': self.comentario.pk})
        data = {'texto': 'Comentario editado con éxito'}
        response = self.client.put(url, data, format='json')
        assert 'detail' in response.json()
        assert response.json()['detail'] == 'Comentario actualizado con éxito.'

    def test_mensaje_error_comentario_vacio(self):
        url = reverse('comentario-update', kwargs={'pk': self.comentario.pk})
        data = {'texto': ''}
        response = self.client.put(url, data, format='json')
        assert 'texto' in response.json()
        assert response.json()['texto'][0] == 'Este campo no puede ser en blanco.'

    def test_usuario_no_autorizado(self):
        otro_usuario = User.objects.create_user('other_user', 'other@example.com', 'password123')
        self.client.force_authenticate(user=otro_usuario)
        url = reverse('comentario-update', kwargs={'pk': self.comentario.pk})
        data = {'texto': 'Intento de edición no autorizado'}
        response = self.client.put(url, data, format='json')
        assert response.status_code == status.HTTP_403_FORBIDDEN