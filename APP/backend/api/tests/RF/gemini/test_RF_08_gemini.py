import pytest
from rest_framework import status
from rest_framework.test import APIClient
from django.contrib.auth.models import User
from api.models import Tarea

@pytest.fixture
def api_client():
    return APIClient()

@pytest.fixture
def create_user():
    def _create_user(username, password):
        return User.objects.create_user(username=username, password=password)
    return _create_user

@pytest.fixture
def create_task():
    def _create_task(user, titulo="Tarea de prueba", descripcion="Descripción de prueba"):
        return Tarea.objects.create(usuario=user, titulo=titulo, descripcion=descripcion)
    return _create_task

@pytest.mark.django_db
def test_eliminar_tarea_existente(api_client, create_user, create_task):
    user = create_user("testuser", "testpassword")
    api_client.force_authenticate(user=user)
    tarea = create_task(user)
    
    url = f'/api/tareas/delete/{tarea.id}/'
    response = api_client.delete(url)
    
    assert response.status_code == status.HTTP_204_NO_CONTENT
    assert Tarea.objects.filter(id=tarea.id).exists() is False

@pytest.mark.django_db
def test_eliminar_tarea_inexistente(api_client, create_user):
    user = create_user("testuser", "testpassword")
    api_client.force_authenticate(user=user)
    
    url = '/api/tareas/delete/999/'  # ID que no existe
    response = api_client.delete(url)
    
    assert response.status_code == status.HTTP_404_NOT_FOUND

@pytest.mark.django_db
def test_eliminar_tarea_sin_autenticacion(api_client, create_user, create_task):
    user = create_user("testuser", "testpassword")
    tarea = create_task(user)
    
    url = f'/api/tareas/delete/{tarea.id}/'
    response = api_client.delete(url)
    
    assert response.status_code == status.HTTP_401_UNAUTHORIZED

@pytest.mark.django_db
def test_eliminar_tarea_otro_usuario(api_client, create_user, create_task):
    user1 = create_user("user1", "testpassword")
    user2 = create_user("user2", "testpassword")
    api_client.force_authenticate(user=user2)
    tarea = create_task(user1)
    
    url = f'/api/tareas/delete/{tarea.id}/'
    response = api_client.delete(url)
    
    assert response.status_code == status.HTTP_404_NOT_FOUND
    assert Tarea.objects.filter(id=tarea.id).exists() is True