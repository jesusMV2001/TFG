import pytest
from django.core.exceptions import ValidationError
from rest_framework import status
from rest_framework.test import APIClient
from .models import User
from .serializers import UserSerializer

@pytest.mark.django_db
def test_registro_usuario_correo_existente():
    # Crea un usuario con un correo electrónico
    usuario_existente = User.objects.create_user(
        username='testuser',
        email='test@example.com',
        password='password123'
    )

    # Intenta registrar un nuevo usuario con el mismo correo electrónico
    cliente = APIClient()
    datos_registro = {
        'username': 'nuevousuario',
        'email': 'test@example.com',
        'password': 'password123'
    }
    respuesta = cliente.post('/api/user/register/', datos_registro, format='json')

    # Verifica que la respuesta sea un error 400 (Bad Request)
    assert respuesta.status_code == status.HTTP_400_BAD_REQUEST

    # Verifica que el error sea debido a la duplicidad del correo electrónico
    assert 'email' in respuesta.data
    assert 'Este correo electrónico ya está registrado.' in respuesta.data['email'][0]

@pytest.mark.django_db
def test_registro_usuario_correo_disponible():
    # Intenta registrar un nuevo usuario con un correo electrónico disponible
    cliente = APIClient()
    datos_registro = {
        'username': 'nuevousuario',
        'email': 'nuevo@example.com',
        'password': 'password123'
    }
    respuesta = cliente.post('/api/user/register/', datos_registro, format='json')

    # Verifica que la respuesta sea un éxito (200 o 201)
    assert respuesta.status_code in (status.HTTP_200_OK, status.HTTP_201_CREATED)

    # Verifica que el usuario haya sido creado correctamente
    usuario_creado = User.objects.get(username='nuevousuario')
    serializer = UserSerializer(usuario_creado)
    assert respuesta.data == serializer.data