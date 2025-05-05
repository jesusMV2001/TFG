import pytest
from django.contrib.auth.models import User
from rest_framework.test import APIClient
from datetime import date, timedelta
from api.models import Tarea

@pytest.fixture
def api_client():
    return APIClient()

@pytest.fixture
def create_user():
    def make_user(username='testuser', password='testpassword'):
        return User.objects.create_user(username=username, password=password)
    return make_user

@pytest.fixture
def authenticate_user(api_client, create_user):
    def do_authenticate(username='testuser', password='testpassword'):
        user = create_user(username, password)
        response = api_client.post('/api/token/', {'username': username, 'password': password})
        api_client.credentials(HTTP_AUTHORIZATION=f"Bearer {response.data['access']}")
        return user
    return do_authenticate


@pytest.mark.django_db
def test_create_tarea_valid_data(api_client, authenticate_user):
    user = authenticate_user()
    future_date = date.today() + timedelta(days=7)
    payload = {
        'titulo': 'Test Tarea',
        'fecha_vencimiento': future_date.strftime('%Y-%m-%d'),
        'prioridad': 'alta',
    }
    response = api_client.post('/api/tareas/', payload)
    assert response.status_code == 201
    assert Tarea.objects.count() == 1
    tarea = Tarea.objects.first()
    assert tarea.titulo == 'Test Tarea'
    assert tarea.fecha_vencimiento.date() == future_date
    assert tarea.prioridad == 'alta'
    assert tarea.usuario == user

@pytest.mark.django_db
def test_create_tarea_missing_titulo(api_client, authenticate_user):
    authenticate_user()
    future_date = date.today() + timedelta(days=7)
    payload = {
        'fecha_vencimiento': future_date.strftime('%Y-%m-%d'),
        'prioridad': 'alta',
    }
    response = api_client.post('/api/tareas/', payload)
    assert response.status_code == 400
    assert 'titulo' in response.data

@pytest.mark.django_db
def test_create_tarea_missing_fecha_vencimiento(api_client, authenticate_user):
    authenticate_user()
    payload = {
        'titulo': 'Test Tarea',
        'prioridad': 'alta',
    }
    response = api_client.post('/api/tareas/', payload)
    assert response.status_code == 400
    assert 'fecha_vencimiento' in response.data

@pytest.mark.django_db
def test_create_tarea_missing_prioridad(api_client, authenticate_user):
    authenticate_user()
    future_date = date.today() + timedelta(days=7)
    payload = {
        'titulo': 'Test Tarea',
        'fecha_vencimiento': future_date.strftime('%Y-%m-%d'),
    }
    response = api_client.post('/api/tareas/', payload)
    assert response.status_code == 201  # Debe usar el valor por defecto

@pytest.mark.django_db
def test_create_tarea_invalid_prioridad(api_client, authenticate_user):
    authenticate_user()
    future_date = date.today() + timedelta(days=7)
    payload = {
        'titulo': 'Test Tarea',
        'fecha_vencimiento': future_date.strftime('%Y-%m-%d'),
        'prioridad': 'invalida',
    }
    response = api_client.post('/api/tareas/', payload)
    assert response.status_code == 400
    assert 'prioridad' in response.data

@pytest.mark.django_db
def test_create_tarea_past_fecha_vencimiento(api_client, authenticate_user):
    authenticate_user()
    past_date = date.today() - timedelta(days=1)
    payload = {
        'titulo': 'Test Tarea',
        'fecha_vencimiento': past_date.strftime('%Y-%m-%d'),
        'prioridad': 'alta',
    }
    response = api_client.post('/api/tareas/', payload)
    assert response.status_code == 400
    assert 'fecha_vencimiento' in response.data

@pytest.mark.django_db
def test_create_tarea_future_fecha_vencimiento_format(api_client, authenticate_user):
    authenticate_user()
    future_date = date.today() + timedelta(days=7)
    payload = {
        'titulo': 'Test Tarea',
        'fecha_vencimiento': future_date.strftime('%m/%d/%Y'),  # Incorrect format
        'prioridad': 'alta',
    }
    response = api_client.post('/api/tareas/', payload)
    assert response.status_code == 400
    assert 'fecha_vencimiento' in response.data