import pytest
from django.contrib.auth.models import User
from rest_framework.test import APIClient
from rest_framework import status
from api.models import Tarea
from datetime import datetime, timedelta
from django.utils import timezone

@pytest.fixture
def api_client():
    return APIClient()

@pytest.fixture
def create_user():
    def _create_user(username, password):
        return User.objects.create_user(username=username, password=password)
    return _create_user

@pytest.fixture
def create_tarea():
    def _create_tarea(usuario, titulo, prioridad, fecha_vencimiento=None):
        return Tarea.objects.create(usuario=usuario, titulo=titulo, prioridad=prioridad, fecha_vencimiento=fecha_vencimiento)
    return _create_tarea

@pytest.mark.django_db
def test_tareas_ordenadas_por_prioridad(api_client, create_user, create_tarea):
    user = create_user('testuser', 'testpassword')
    api_client.force_authenticate(user=user)

    tarea_alta = create_tarea(user, 'Tarea Alta Prioridad', 'alta')
    tarea_baja = create_tarea(user, 'Tarea Baja Prioridad', 'baja')
    tarea_media = create_tarea(user, 'Tarea Media Prioridad', 'media')

    response = api_client.get('/api/tareas/')
    assert response.status_code == status.HTTP_200_OK

    data = response.json()
    assert len(data) == 3
    assert data[0]['titulo'] == 'Tarea Alta Prioridad'
    assert data[1]['titulo'] == 'Tarea Media Prioridad'
    assert data[2]['titulo'] == 'Tarea Baja Prioridad'

@pytest.mark.django_db
def test_tareas_ordenadas_por_fecha_vencimiento(api_client, create_user, create_tarea):
    user = create_user('testuser2', 'testpassword')
    api_client.force_authenticate(user=user)

    fecha_hoy = timezone.now()
    fecha_manana = fecha_hoy + timedelta(days=1)
    fecha_pasado_manana = fecha_hoy + timedelta(days=2)

    tarea_manana = create_tarea(user, 'Tarea Manana', 'media', fecha_vencimiento=fecha_manana)
    tarea_hoy = create_tarea(user, 'Tarea Hoy', 'media', fecha_vencimiento=fecha_hoy)
    tarea_pasado = create_tarea(user, 'Tarea Pasado Manana', 'media', fecha_vencimiento=fecha_pasado_manana)

    response = api_client.get('/api/tareas/')
    assert response.status_code == status.HTTP_200_OK

    data = response.json()
    assert len(data) == 3
    assert data[0]['titulo'] == 'Tarea Hoy'
    assert data[1]['titulo'] == 'Tarea Manana'
    assert data[2]['titulo'] == 'Tarea Pasado Manana'

@pytest.mark.django_db
def test_tareas_ordenadas_por_prioridad_y_fecha_vencimiento(api_client, create_user, create_tarea):
    user = create_user('testuser3', 'testpassword')
    api_client.force_authenticate(user=user)

    fecha_hoy = timezone.now()
    fecha_manana = fecha_hoy + timedelta(days=1)

    tarea_alta_hoy = create_tarea(user, 'Tarea Alta Hoy', 'alta', fecha_vencimiento=fecha_hoy)
    tarea_alta_manana = create_tarea(user, 'Tarea Alta Manana', 'alta', fecha_vencimiento=fecha_manana)
    tarea_baja_hoy = create_tarea(user, 'Tarea Baja Hoy', 'baja', fecha_vencimiento=fecha_hoy)
    tarea_media_manana = create_tarea(user, 'Tarea Media Manana', 'media', fecha_vencimiento=fecha_manana)

    response = api_client.get('/api/tareas/')
    assert response.status_code == status.HTTP_200_OK

    data = response.json()
    assert len(data) == 4
    assert data[0]['titulo'] == 'Tarea Alta Hoy'
    assert data[1]['titulo'] == 'Tarea Alta Manana'
    assert data[2]['titulo'] == 'Tarea Media Manana'
    assert data[3]['titulo'] == 'Tarea Baja Hoy'