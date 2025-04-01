from django.shortcuts import render
from django.contrib.auth.models import User
from rest_framework import generics
from .serializers import UserSerializer, TareaSerializer, HistorialCambiosSerializer
from rest_framework.permissions import AllowAny, IsAuthenticated
from .models import Tarea, HistorialCambios
from django.db import models
from rest_framework.response import Response
from rest_framework import status


class TareaListCreate(generics.ListCreateAPIView):
    serializer_class = TareaSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        user = self.request.user
        # Ordenar por prioridad (alta, media, baja) y luego por fecha de vencimiento ascendente
        return Tarea.objects.filter(usuario=user).order_by(
            models.Case(
                models.When(prioridad='alta', then=0),
                models.When(prioridad='media', then=1),
                models.When(prioridad='baja', then=2),
                default=3,
                output_field=models.IntegerField()
            ),
            'fecha_vencimiento'
        )
    
    def perform_create(self, serializer):
        if serializer.is_valid():
            serializer.save(usuario=self.request.user)
        else:
            print(serializer.errors)
            
class TareaDelete(generics.DestroyAPIView):
    serializer_class = TareaSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        user = self.request.user
        return Tarea.objects.filter(usuario=user)

class TareaUpdate(generics.UpdateAPIView):
    serializer_class = TareaSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return Tarea.objects.filter(usuario=user)

    def perform_update(self, serializer):
        # Obtener la tarea antes de actualizar
        tarea_anterior = self.get_object()
        usuario = self.request.user

        # Guardar los cambios en la tarea
        tarea_actualizada = serializer.save()

        # Comparar los campos para registrar los cambios
        cambios = []
        if tarea_anterior.titulo != tarea_actualizada.titulo:
            cambios.append(f"Título: '{tarea_anterior.titulo}' -> '{tarea_actualizada.titulo}'")
        if tarea_anterior.descripcion != tarea_actualizada.descripcion:
            cambios.append(f"Descripción actualizada")
        if tarea_anterior.estado != tarea_actualizada.estado:
            cambios.append(f"Estado: '{tarea_anterior.estado}' -> '{tarea_actualizada.estado}'")
        if tarea_anterior.prioridad != tarea_actualizada.prioridad:
            cambios.append(f"Prioridad: '{tarea_anterior.prioridad}' -> '{tarea_actualizada.prioridad}'")
        if tarea_anterior.fecha_vencimiento != tarea_actualizada.fecha_vencimiento:
            cambios.append(f"Fecha de vencimiento: '{tarea_anterior.fecha_vencimiento}' -> '{tarea_actualizada.fecha_vencimiento}'")

        # Registrar el historial de cambios
        if cambios:
            HistorialCambios.objects.create(
                tarea=tarea_actualizada,
                accion="; ".join(cambios),
                usuario=usuario
            )

class UserCreateView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]

    def create(self, request, *args, **kwargs):
        username = request.data.get('username')
        email = request.data.get('email')
        password = request.data.get('password')

        # Verificar si algún campo está vacío
        if not username or not email or not password:
            return Response(
                {"error": "Todos los campos son obligatorios."},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Verificar si el nombre de usuario ya existe
        if User.objects.filter(username=username).exists():
            return Response(
                {"error": "El nombre de usuario ya está registrado."},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Verificar si el correo electrónico ya existe
        if User.objects.filter(email=email).exists():
            return Response(
                {"error": "El correo electrónico ya está registrado."},
                status=status.HTTP_400_BAD_REQUEST
            )

        return super().create(request, *args, **kwargs)

class HistorialCambiosList(generics.ListAPIView):
    serializer_class = HistorialCambiosSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        tarea_id = self.kwargs['tarea_id']
        d = HistorialCambios.objects.filter(tarea_id=tarea_id).order_by('-fecha_cambio')
        print(d)
        return d