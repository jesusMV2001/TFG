import pytest
from django.contrib.auth.models import User
from rest_framework.test import APIClient
from rest_framework import status
from api.models import Tarea

@pytest.fixture
def api_client():
    return APIClient()

@pytest.fixture
def test_user(db):
    return User.objects.create_user(username='testuser', password='testpassword')

@pytest.fixture
def task1(db, test_user):
    return Tarea.objects.create(
        titulo='Tarea con palabra clave',
        descripcion='Esta tarea contiene la palabra clave en la descripción.',
        usuario=test_user
    )

@pytest.fixture
def task2(db, test_user):
    return Tarea.objects.create(
        titulo='Otra tarea',
        descripcion='Descripción sin la palabra clave.',
        usuario=test_user
    )

@pytest.fixture
def task3(db, test_user):
    return Tarea.objects.create(
        titulo='Tarea palabra clave en titulo',
        descripcion='Descripción diferente.',
        usuario=test_user
    )


@pytest.mark.django_db
def test_buscar_tareas_por_palabra_clave_titulo(api_client, test_user, task1, task2, task3):
    api_client.force_authenticate(user=test_user)
    response = api_client.get('/api/tareas/?search=palabra clave')

    assert response.status_code == status.HTTP_200_OK
    assert len(response.data) == 2

    titles = [task['titulo'] for task in response.data]
    assert 'Tarea con palabra clave' in titles
    assert 'Tarea palabra clave en titulo' in titles
    assert 'Otra tarea' not in titles


@pytest.mark.django_db
def test_buscar_tareas_por_palabra_clave_descripcion(api_client, test_user, task1, task2, task3):
    api_client.force_authenticate(user=test_user)
    response = api_client.get('/api/tareas/?search=contiene la palabra clave')

    assert response.status_code == status.HTTP_200_OK
    assert len(response.data) == 1

    titles = [task['titulo'] for task in response.data]
    assert 'Tarea con palabra clave' in titles
    assert 'Otra tarea' not in titles
    assert 'Tarea palabra clave en titulo' not in titles

@pytest.mark.django_db
def test_buscar_tareas_sin_resultados(api_client, test_user, task1, task2):
    api_client.force_authenticate(user=test_user)
    response = api_client.get('/api/tareas/?search=noexistenteword')

    assert response.status_code == status.HTTP_200_OK
    assert len(response.data) == 0

@pytest.mark.django_db
def test_buscar_tareas_no_autenticado(api_client, task1, task2):
    response = api_client.get('/api/tareas/?search=palabra clave')
    assert response.status_code == status.HTTP_401_UNAUTHORIZED