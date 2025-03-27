from django.shortcuts import render
from django.contrib.auth.models import User
from rest_framework import generics
from .serializers import UserSerializer, TareaSerializer
from rest_framework.permissions import AllowAny, IsAuthenticated
from .models import Tarea
from rest_framework.response import Response
from rest_framework import status


class TareaListCreate(generics.ListCreateAPIView):
    serializer_class = TareaSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        user = self.request.user
        return Tarea.objects.filter(usuario=user)
    
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

class UserCreateView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]

    def create(self, request, *args, **kwargs):
        username = request.data.get('username')
        email = request.data.get('email')

        if User.objects.filter(username=username).exists():
            return Response(
                {"error": "El nombre de usuario ya está registrado."},
                status=status.HTTP_400_BAD_REQUEST
            )

        if User.objects.filter(email=email).exists():
            return Response(
                {"error": "El correo electrónico ya está registrado."},
                status=status.HTTP_400_BAD_REQUEST
            )

        return super().create(request, *args, **kwargs)
