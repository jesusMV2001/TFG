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
    def _create_task(user, titulo, descripcion):
        return Tarea.objects.create(usuario=user, titulo=titulo, descripcion=descripcion)
    return _create_task

@pytest.mark.django_db
def test_buscar_tareas_por_titulo(api_client, create_user, create_task):
    user = create_user("testuser", "testpassword")
    api_client.force_authenticate(user=user)
    
    tarea1 = create_task(user, "Tarea con palabra clave", "Descripción tarea1")
    tarea2 = create_task(user, "Otra tarea", "Descripción con palabra clave")
    
    response = api_client.get("/api/tareas/?search=palabra clave")
    
    assert response.status_code == status.HTTP_200_OK
    assert len(response.data) == 1
    assert response.data[0]["titulo"] == "Tarea con palabra clave"

@pytest.mark.django_db
def test_buscar_tareas_por_descripcion(api_client, create_user, create_task):
    user = create_user("testuser", "testpassword")
    api_client.force_authenticate(user=user)
    
    tarea1 = create_task(user, "Tarea1", "Descripción con palabra clave")
    tarea2 = create_task(user, "Otra tarea", "Descripción tarea2")
    
    response = api_client.get("/api/tareas/?search=palabra clave")
    
    assert response.status_code == status.HTTP_200_OK
    assert len(response.data) == 1
    assert response.data[0]["descripcion"] == "Descripción con palabra clave"

@pytest.mark.django_db
def test_buscar_tareas_sin_resultados(api_client, create_user, create_task):
    user = create_user("testuser", "testpassword")
    api_client.force_authenticate(user=user)
    
    tarea1 = create_task(user, "Tarea1", "Descripción tarea1")
    tarea2 = create_task(user, "Otra tarea", "Descripción tarea2")
    
    response = api_client.get("/api/tareas/?search=inexistente")
    
    assert response.status_code == status.HTTP_200_OK
    assert len(response.data) == 0

@pytest.mark.django_db
def test_buscar_tareas_multiple_resultados(api_client, create_user, create_task):
    user = create_user("testuser", "testpassword")
    api_client.force_authenticate(user=user)
    
    tarea1 = create_task(user, "Tarea con clave", "Descripción tarea1")
    tarea2 = create_task(user, "Otra tarea con clave", "Descripción con clave")
    tarea3 = create_task(user, "Tarea3", "Descripción tarea3")
    
    response = api_client.get("/api/tareas/?search=clave")
    
    assert response.status_code == status.HTTP_200_OK
    assert len(response.data) == 2
    
@pytest.mark.django_db
def test_buscar_tareas_no_autenticado(api_client):
    response = api_client.get("/api/tareas/?search=clave")
    assert response.status_code == status.HTTP_401_UNAUTHORIZED