import pytest
from django.contrib.auth.models import User
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APIClient
from rest_framework_simplejwt.tokens import RefreshToken

@pytest.fixture
def api_client():
    return APIClient()

@pytest.fixture
def create_user():
    def _create_user(username, password):
        return User.objects.create_user(username=username, password=password)
    return _create_user

@pytest.mark.django_db
def test_login_successful(api_client, create_user):
    """
    Test para verificar el inicio de sesión exitoso.
    """
    user = create_user('testuser', 'testpassword')
    url = reverse('token_obtain_pair')
    data = {'username': 'testuser', 'password': 'testpassword'}
    response = api_client.post(url, data, format='json')
    assert response.status_code == status.HTTP_200_OK
    assert 'access' in response.data
    assert 'refresh' in response.data

@pytest.mark.django_db
def test_login_incorrect_credentials(api_client):
    """
    Test para verificar el inicio de sesión fallido debido a credenciales incorrectas.
    """
    url = reverse('token_obtain_pair')
    data = {'username': 'wronguser', 'password': 'wrongpassword'}
    response = api_client.post(url, data, format='json')
    assert response.status_code == status.HTTP_401_UNAUTHORIZED

@pytest.mark.django_db
def test_refresh_token(api_client, create_user):
    """
    Test para verificar la actualización del token.
    """
    user = create_user('testuser', 'testpassword')
    refresh = RefreshToken.for_user(user)
    url = reverse('token_refresh')
    data = {'refresh': str(refresh)}
    response = api_client.post(url, data, format='json')
    assert response.status_code == status.HTTP_200_OK
    assert 'access' in response.data

@pytest.mark.django_db
def test_logout(api_client, create_user):
    """
    Test para verificar el cierre de sesión.
    Nota: JWT no tiene un concepto nativo de cierre de sesión. Este test solo verifica
    que al eliminar el token del lado del cliente, el acceso a las rutas protegidas se deniega.
    """
    user = create_user('testuser', 'testpassword')
    refresh = RefreshToken.for_user(user)
    access_token = refresh.access_token

    api_client.credentials(HTTP_AUTHORIZATION=f'Bearer {access_token}')
    url = reverse('tarea-list-create')  # Una ruta protegida
    response = api_client.get(url)
    assert response.status_code == status.HTTP_200_OK # El token es valido aun

    # Simulate client-side token deletion (no server-side action)
    api_client.credentials(HTTP_AUTHORIZATION=None)
    response = api_client.get(url)
    assert response.status_code == status.HTTP_401_UNAUTHORIZED  # Acceso denegado sin token