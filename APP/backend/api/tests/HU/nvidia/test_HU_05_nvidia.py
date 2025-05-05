import pytest
from rest_framework import status
from rest_framework.authtoken.models import Token
from django.contrib.auth.models import User
from api.models import Tarea

@pytest.mark.django_db
class TestHU05EditarTarea:

    def setup_method(self):
        self.user = User.objects.create_user('testuser', 'test@example.com', 'testpassword')
        self.token, _ = Token.objects.get_or_create(user=self.user)
        self.tarea = Tarea.objects.create(
            titulo='Tarea de Prueba',
            descripcion='Descripción de la tarea',
            estado='pendiente',
            prioridad='media',
            usuario=self.user
        )

    def test_editar_tarea_exitosamente(self, api_client):
        api_client.credentials(HTTP_AUTHORIZATION=f'Token {self.token.key}')
        payload = {
            'titulo': 'Tarea Editada',
            'descripcion': 'Descripción actualizada',
            'estado': 'en_progreso',
            'prioridad': 'alta'
        }
        response = api_client.patch(f'/tareas/update/{self.tarea.id}/', payload, format='json')
        assert response.status_code == status.HTTP_200_OK
        edited_tarea = Tarea.objects.get(id=self.tarea.id)
        assert edited_tarea.titulo == payload['titulo']
        assert edited_tarea.descripcion == payload['descripcion']
        assert edited_tarea.estado == payload['estado']
        assert edited_tarea.prioridad == payload['prioridad']

    def test_editar_tarea_con_titulo_error(self, api_client):
        api_client.credentials(HTTP_AUTHORIZATION=f'Token {self.token.key}')
        payload = {
            'titulo': '',  # Campo vacío para simular error
            'descripcion': 'Descripción actualizada',
            'estado': 'en_progreso',
            'prioridad': 'alta'
        }
        response = api_client.patch(f'/tareas/update/{self.tarea.id}/', payload, format='json')
        assert response.status_code == status.HTTP_400_BAD_REQUEST
        assert 'titulo' in response.json()

    def test_editar_tarea_sin_autenticación(self, api_client):
        payload = {
            'titulo': 'Tarea Editada',
            'descripcion': 'Descripción actualizada',
            'estado': 'en_progreso',
            'prioridad': 'alta'
        }
        response = api_client.patch(f'/tareas/update/{self.tarea.id}/', payload, format='json')
        assert response.status_code == status.HTTP_401_UNAUTHORIZED

    def test_editar_tarea_no_existente(self, api_client):
        api_client.credentials(HTTP_AUTHORIZATION=f'Token {self.token.key}')
        payload = {
            'titulo': 'Tarea Editada',
            'descripcion': 'Descripción actualizada',
            'estado': 'en_progreso',
            'prioridad': 'alta'
        }
        response = api_client.patch('/tareas/update/99999/', payload, format='json')
        assert response.status_code == status.HTTP_404_NOT_FOUND