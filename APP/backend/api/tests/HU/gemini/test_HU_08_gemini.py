import pytest
from django.urls import reverse
from rest_framework import status
from api.models import Tarea
from django.contrib.auth.models import User
from datetime import datetime, timedelta
from django.utils import timezone

@pytest.mark.django_db
class TestOrdenarTareas:

    def setup_method(self):
        # Crear un usuario de prueba
        self.user = User.objects.create_user(username='testuser', password='testpassword')

        # Crear algunas tareas de prueba con diferentes prioridades y fechas de vencimiento
        self.tarea_alta_reciente = Tarea.objects.create(
            titulo='Tarea Alta Reciente',
            prioridad='alta',
            fecha_vencimiento=timezone.now() + timedelta(days=1),
            usuario=self.user
        )
        self.tarea_media_antigua = Tarea.objects.create(
            titulo='Tarea Media Antigua',
            prioridad='media',
            fecha_vencimiento=timezone.now() - timedelta(days=1),
            usuario=self.user
        )
        self.tarea_baja_futura = Tarea.objects.create(
            titulo='Tarea Baja Futura',
            prioridad='baja',
            fecha_vencimiento=timezone.now() + timedelta(days=7),
            usuario=self.user
        )
        self.tarea_alta_antigua = Tarea.objects.create(
            titulo='Tarea Alta Antigua',
            prioridad='alta',
            fecha_vencimiento=timezone.now() - timedelta(days=2),
            usuario=self.user
        )

        self.client.force_authenticate(user=self.user)
    
    @pytest.fixture
    def api_client(self):
        from rest_framework.test import APIClient
        return APIClient()

    @pytest.fixture
    def client(self, api_client):
        return api_client

    def test_ordenar_tareas_prioridad_fecha_vencimiento(self, client):
        """
        Verifica que las tareas se ordenen correctamente por prioridad (alta, media, baja)
        y luego por fecha de vencimiento ascendente.
        """
        url = reverse('tarea-list-create')
        response = client.get(url)

        assert response.status_code == status.HTTP_200_OK
        data = response.json()

        # Extraer títulos para verificar el orden
        titulos = [tarea['titulo'] for tarea in data]

        # El orden esperado es:
        # 1. Tareas de prioridad alta, ordenadas por fecha de vencimiento (más antigua primero)
        # 2. Tareas de prioridad media, ordenadas por fecha de vencimiento (más antigua primero)
        # 3. Tareas de prioridad baja, ordenadas por fecha de vencimiento (más antigua primero)
        
        expected_order = [
            self.tarea_alta_antigua.titulo,
            self.tarea_alta_reciente.titulo,
            self.tarea_media_antigua.titulo,
            self.tarea_baja_futura.titulo,
        ]
        assert titulos == expected_order