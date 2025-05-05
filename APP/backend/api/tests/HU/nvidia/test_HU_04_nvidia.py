import pytest
from django.urls import reverse
from rest_framework import status
from api.models import Tarea
from api.serializers import TareaSerializer

@pytest.mark.django_db
class TestHU04:
    def test_listar_tareas_asociadas_al_usuario(self, api_client, usuario_autenticado):
        # Crear tareas para el usuario autenticado
        Tarea.objects.create(titulo="Tarea 1", usuario=usuario_autenticado, estado="pendiente")
        Tarea.objects.create(titulo="Tarea 2", usuario=usuario_autenticado, estado="en_progreso")
        Tarea.objects.create(titulo="Tarea 3", usuario=usuario_autenticado, estado="completada")

        # Crear tarea para otro usuario (no debe aparecer en la lista)
        otro_usuario = usuario_autenticado.__class__.objects.create_user("otro_usuario", "otro@email.com", "password123")
        Tarea.objects.create(titulo="Tarea 4", usuario=otro_usuario, estado="pendiente")

        # Realizar petición GET a la lista de tareas
        url = reverse("tarea-list-create")
        response = api_client.get(url)

        # Comprobar que se devuelven todas las tareas del usuario autenticado
        assert response.status_code == status.HTTP_200_OK
        expected_ids = [tarea.id for tarea in Tarea.objects.filter(usuario=usuario_autenticado)]
        assert [tarea["id"] for tarea in response.data] == expected_ids

    def test_cada_tarea_esta_agrupada_según_su_estado(self, api_client, usuario_autenticado):
        # Crear tareas con diferentes estados
        Tarea.objects.create(titulo="Tarea 1", usuario=usuario_autenticado, estado="pendiente")
        Tarea.objects.create(titulo="Tarea 2", usuario=usuario_autenticado, estado="en_progreso")
        Tarea.objects.create(titulo="Tarea 3", usuario=usuario_autenticado, estado="completada")
        Tarea.objects.create(titulo="Tarea 4", usuario=usuario_autenticado, estado="pendiente")
        Tarea.objects.create(titulo="Tarea 5", usuario=usuario_autenticado, estado="en_progreso")

        # Realizar petición GET a la lista de tareas
        url = reverse("tarea-list-create")
        response = api_client.get(url)

        # Comprobar que las tareas están ordenadas por estado y fecha de vencimiento
        assert response.status_code == status.HTTP_200_OK
        tareas_response = response.data
        estados = [tarea["estado"] for tarea in tareas_response]
        assert estados == ["alta"] * 0 + ["media"] * 0 + ["baja"] * 0 + ["pendiente"] * 2 + ["en_progreso"] * 2 + ["completada"] * 1
        # Comprobar que las tareas con el mismo estado están ordenadas por fecha de vencimiento
        tareas_pendientes = [tarea for tarea in tareas_response if tarea["estado"] == "pendiente"]
        assert tareas_pendientes == sorted(tareas_pendientes, key=lambda x: x["fecha_vencimiento"] or '')
        tareas_en_progreso = [tarea for tarea in tareas_response if tarea["estado"] == "en_progreso"]
        assert tareas_en_progreso == sorted(tareas_en_progreso, key=lambda x: x["fecha_vencimiento"] or '')