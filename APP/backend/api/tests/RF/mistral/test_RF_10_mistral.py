import pytest
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APIClient
from django.contrib.auth.models import User
from api.models import Tarea
from datetime import datetime, timedelta

@pytest.fixture
def api_client():
    return APIClient()

@pytest.fixture
def user(db):
    return User.objects.create_user(username='testuser', password='testpassword')

@pytest.fixture
def authenticated_client(user, api_client):
    api_client.force_authenticate(user=user)
    return api_client

@pytest.fixture
def create_tareas(user):
    Tarea.objects.create(
        titulo='Tarea 1',
        descripcion='Descripción de la tarea 1',
        fecha_vencimiento=datetime.now() + timedelta(days=1),
        estado='pendiente',
        prioridad='alta',
        usuario=user
    )
    Tarea.objects.create(
        titulo='Tarea 2',
        descripcion='Descripción de la tarea 2',
        fecha_vencimiento=datetime.now() + timedelta(days=2),
        estado='pendiente',
        prioridad='media',
        usuario=user
    )
    Tarea.objects.create(
        titulo='Tarea 3',
        descripcion='Descripción de la tarea 3',
        fecha_vencimiento=datetime.now() + timedelta(days=3),
        estado='pendiente',
        prioridad='baja',
        usuario=user
    )

@pytest.mark.django_db
def test_ordenar_tareas_por_prioridad(authenticated_client, create_tareas):
    response = authenticated_client.get(reverse('tarea-list-create'))
    assert response.status_code == status.HTTP_200_OK
    tareas = response.data
    assert tareas[0]['prioridad'] == 'alta'
    assert tareas[1]['prioridad'] == 'media'
    assert tareas[2]['prioridad'] == 'baja'

@pytest.mark.django_db
def test_ordenar_tareas_por_fecha_vencimiento(authenticated_client, create_tareas):
    response = authenticated_client.get(reverse('tarea-list-create'))
    assert response.status_code == status.HTTP_200_OK
    tareas = response.data
    assert tareas[0]['fecha_vencimiento'] < tareas[1]['fecha_vencimiento'] < tareas[2]['fecha_vencimiento']