import pytest
from django.urls import reverse
from rest_framework import status
from api.models import Tarea
from api.models import User
from api.serializers import TareaSerializer

@pytest.mark.django_db
class TestHU08:
    def test_ordenar_tareas_por_prioridad(self, api_client, usuario_autenticado, tareas_varias_prioridades):
        url = reverse('tarea-list-create')
        response = api_client.get(url, format='json')
        assert response.status_code == status.HTTP_200_OK

        # Verificar que las tareas estén ordenadas por prioridad (alta, media, baja)
        expected_order = ['alta', 'media', 'baja']
        for i, tarea in enumerate(response.data):
            assert tarea['prioridad'] == expected_order[i]

    def test_ordenar_tareas_por_fecha_vencimiento(self, api_client, usuario_autenticado, tareas_varias_fechas_vencimiento):
        url = reverse('tarea-list-create')
        response = api_client.get(url, format='json', data={'ordering': 'fecha_vencimiento'})
        assert response.status_code == status.HTTP_200_OK

        # Verificar que las tareas estén ordenadas por fecha de vencimiento ascendente
        fechas_vencimiento = [tarea['fecha_vencimiento'] for tarea in response.data]
        assert fechas_vencimiento == sorted(fechas_vencimiento)

    def test_ordenar_tareas_por_prioridad_y_fecha_vencimiento(self, api_client, usuario_autenticado, tareas_varias_prioridades_fechas_vencimiento):
        url = reverse('tarea-list-create')
        response = api_client.get(url, format='json', data={'ordering': 'prioridad,fecha_vencimiento'})
        assert response.status_code == status.HTTP_200_OK

        # Verificar que las tareas estén ordenadas por prioridad (alta, media, baja) y luego por fecha de vencimiento ascendente
        tareas_ordenadas = Tarea.objects.order_by(
            Tarea._meta.get_field('prioridad'),
            Tarea._meta.get_field('fecha_vencimiento')
        ).values('prioridad', 'fecha_vencimiento')
        assert list(tareas_ordenadas) == [dict(tarea) for tarea in response.data]

# Fijtures
@pytest.fixture
def usuario_autenticado(api_client):
    user = User.objects.create_user(username='test', email='test@example.com', password='testpass')
    api_client.force_authenticate(user=user)
    return user

@pytest.fixture
def tareas_varias_prioridades(usuario_autenticado):
    Tarea.objects.bulk_create([
        Tarea(titulo='Tarea Alta', prioridad='alta', usuario=usuario_autenticado),
        Tarea(titulo='Tarea Media', prioridad='media', usuario=usuario_autenticado),
        Tarea(titulo='Tarea Baja', prioridad='baja', usuario=usuario_autenticado),
    ])

@pytest.fixture
def tareas_varias_fechas_vencimiento(usuario_autenticado):
    from datetime import datetime, timedelta
    Tarea.objects.bulk_create([
        Tarea(titulo='Tarea Hoy', fecha_vencimiento=datetime.now(), usuario=usuario_autenticado),
        Tarea(titulo='Tarea Mañana', fecha_vencimiento=datetime.now() + timedelta(days=1), usuario=usuario_autenticado),
        Tarea(titulo='Tarea Semana que Viene', fecha_vencimiento=datetime.now() + timedelta(weeks=1), usuario=usuario_autenticado),
    ])

@pytest.fixture
def tareas_varias_prioridades_fechas_vencimiento(usuario_autenticado):
    from datetime import datetime, timedelta
    Tarea.objects.bulk_create([
        Tarea(titulo='Tarea Alta Hoy', prioridad='alta', fecha_vencimiento=datetime.now(), usuario=usuario_autenticado),
        Tarea(titulo='Tarea Media Mañana', prioridad='media', fecha_vencimiento=datetime.now() + timedelta(days=1), usuario=usuario_autenticado),
        Tarea(titulo='Tarea Baja Semana que Viene', prioridad='baja', fecha_vencimiento=datetime.now() + timedelta(weeks=1), usuario=usuario_autenticado),
    ])