from django.shortcuts import render
from django.contrib.auth.models import User
from rest_framework import generics
from .serializers import UserSerializer, TareaSerializer
from rest_framework.permissions import AllowAny, IsAuthenticated
from .models import Tarea
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
