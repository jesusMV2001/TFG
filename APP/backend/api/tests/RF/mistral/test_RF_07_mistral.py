import pytest
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APIClient
from django.contrib.auth.models import User
from api.models import Tarea

@pytest.mark.django_db
def test_edit_tarea():
    client = APIClient()
    user = User.objects.create_user(username='testuser', password='testpassword')
    tarea = Tarea.objects.create(
        titulo='Tarea de prueba',
        descripcion='Descripción de prueba',
        estado='pendiente',
        prioridad='media',
        usuario=user
    )

    client.login(username='testuser', password='testpassword')

    url = reverse('tarea-update', kwargs={'pk': tarea.pk})
    updated_data = {
        'titulo': 'Tarea actualizada',
        'descripcion': 'Descripción actualizada',
        'estado': 'completada',
        'prioridad': 'alta',
        'fecha_vencimiento': '2023-12-31T23:59:59Z'
    }

    response = client.put(url, updated_data, format='json')
    assert response.status_code == status.HTTP_200_OK

    tarea.refresh_from_db()
    assert tarea.titulo == 'Tarea actualizada'
    assert tarea.descripcion == 'Descripción actualizada'
    assert tarea.estado == 'completada'
    assert tarea.prioridad == 'alta'
    assert tarea.fecha_vencimiento.strftime('%Y-%m-%dT%H:%M:%SZ') == '2023-12-31T23:59:59Z'

@pytest.mark.django_db
def test_edit_tarea_invalid_data():
    client = APIClient()
    user = User.objects.create_user(username='testuser', password='testpassword')
    tarea = Tarea.objects.create(
        titulo='Tarea de prueba',
        descripcion='Descripción de prueba',
        estado='pendiente',
        prioridad='media',
        usuario=user
    )

    client.login(username='testuser', password='testpassword')

    url = reverse('tarea-update', kwargs={'pk': tarea.pk})
    invalid_data = {
        'titulo': '',
        'descripcion': '',
        'estado': 'invalid_state',
        'prioridad': 'invalid_priority',
        'fecha_vencimiento': 'invalid_date'
    }

    response = client.put(url, invalid_data, format='json')
    assert response.status_code == status.HTTP_400_BAD_REQUEST

    tarea.refresh_from_db()
    assert tarea.titulo == 'Tarea de prueba'
    assert tarea.descripcion == 'Descripción de prueba'
    assert tarea.estado == 'pendiente'
    assert tarea.prioridad == 'media'

@pytest.mark.django_db
def test_edit_tarea_unauthorized():
    client = APIClient()
    user = User.objects.create_user(username='testuser', password='testpassword')
    tarea = Tarea.objects.create(
        titulo='Tarea de prueba',
        descripcion='Descripción de prueba',
        estado='pendiente',
        prioridad='media',
        usuario=user
    )

    url = reverse('tarea-update', kwargs={'pk': tarea.pk})
    updated_data = {
        'titulo': 'Tarea actualizada',
        'descripcion': 'Descripción actualizada',
        'estado': 'completada',
        'prioridad': 'alta',
        'fecha_vencimiento': '2023-12-31T23:59:59Z'
    }

    response = client.put(url, updated_data, format='json')
    assert response.status_code == status.HTTP_401_UNAUTHORIZED

@pytest.mark.django_db
def test_edit_tarea_forbidden():
    client = APIClient()
    user = User.objects.create_user(username='testuser', password='testpassword')
    another_user = User.objects.create_user(username='anotheruser', password='anotherpassword')
    tarea = Tarea.objects.create(
        titulo='Tarea de prueba',
        descripcion='Descripción de prueba',
        estado='pendiente',
        prioridad='media',
        usuario=user
    )

    client.login(username='anotheruser', password='anotherpassword')

    url = reverse('tarea-update', kwargs={'pk': tarea.pk})
    updated_data = {
        'titulo': 'Tarea actualizada',
        'descripcion': 'Descripción actualizada',
        'estado': 'completada',
        'prioridad': 'alta',
        'fecha_vencimiento': '2023-12-31T23:59:59Z'
    }

    response = client.put(url, updated_data, format='json')
    assert response.status_code == status.HTTP_403_FORBIDDEN

@pytest.mark.django_db
def test_edit_tarea_not_found():
    client = APIClient()
    user = User.objects.create_user(username='testuser', password='testpassword')
    client.login(username='testuser', password='testpassword')

    url = reverse('tarea-update', kwargs={'pk': 9999})
    updated_data = {
        'titulo': 'Tarea actualizada',
        'descripcion': 'Descripción actualizada',
        'estado': 'completada',
        'prioridad': 'alta',
        'fecha_vencimiento': '2023-12-31T23:59:59Z'
    }

    response = client.put(url, updated_data, format='json')
    assert response.status_code == status.HTTP_404_NOT_FOUND