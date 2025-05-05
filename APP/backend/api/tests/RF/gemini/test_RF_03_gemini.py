import pytest
from django.urls import reverse
from rest_framework import status
from django.contrib.auth.models import User
from rest_framework.test import APIClient


@pytest.fixture
def api_client():
    return APIClient()


@pytest.mark.django_db
def test_register_user_short_password(api_client):
    """
    Test para verificar que el registro de usuario falla si la contraseña tiene menos de 8 caracteres.
    """
    url = reverse('register')
    data = {
        'username': 'testuser',
        'email': 'test@example.com',
        'password': 'short'
    }
    response = api_client.post(url, data, format='json')
    assert response.status_code == status.HTTP_400_BAD_REQUEST
    assert 'password' in response.data
    assert response.data['password'][0] == 'La contraseña debe tener al menos 8 caracteres.'


@pytest.mark.django_db
def test_register_user_valid_password(api_client):
    """
    Test para verificar que el registro de usuario se realiza correctamente con una contraseña válida.
    """
    url = reverse('register')
    data = {
        'username': 'testuser2',
        'email': 'test2@example.com',
        'password': 'verystrongpassword'
    }
    response = api_client.post(url, data, format='json')
    assert response.status_code == status.HTTP_201_CREATED
    assert User.objects.filter(username='testuser2').exists()