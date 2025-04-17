from django.shortcuts import render
from django.contrib.auth.models import User
from rest_framework import generics, serializers
from .serializers import ComentarioSerializer, UserSerializer, TareaSerializer, HistorialCambiosSerializer, EtiquetaSerializer
from rest_framework.permissions import AllowAny, IsAuthenticated
from .models import Comentario, Tarea, HistorialCambios, Etiqueta
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
        return HistorialCambios.objects.filter(tarea_id=tarea_id).order_by('-fecha_cambio')
    
class EtiquetaList(generics.ListAPIView):
    serializer_class = EtiquetaSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        # Devuelve las etiquetas asociadas a una tarea específica
        tarea_id = self.kwargs['tarea_id']
        if tarea_id:
            return Etiqueta.objects.filter(tarea_id=tarea_id)
        return Etiqueta.objects.none()    

class EtiquetaCreate(generics.CreateAPIView):
    serializer_class = EtiquetaSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        # Asocia la etiqueta a una tarea específica
        tarea_id = self.request.data.get('tarea_id')
        nombre = self.request.data.get('nombre')

        # Verificar si la tarea existe
        try:
            tarea = Tarea.objects.get(id=tarea_id)
        except Tarea.DoesNotExist:
            raise serializers.ValidationError({"error": "La tarea no existe."})

        # Verificar si ya existe una etiqueta con el mismo nombre en la tarea
        if Etiqueta.objects.filter(tarea=tarea, nombre=nombre).exists():
            raise serializers.ValidationError({"error": "Ya existe una etiqueta con este nombre en esta tarea."})

        # Crear la etiqueta si no existe
        serializer.save(tarea=tarea)
        
class EtiquetaDelete(generics.DestroyAPIView):
    serializer_class = EtiquetaSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # Devuelve las etiquetas asociadas a una tarea específica
        tarea_id = self.request.query_params.get('tarea_id')
        if tarea_id:
            return Etiqueta.objects.filter(tarea_id=tarea_id)
        return Etiqueta.objects.none()

    def delete(self, request, *args, **kwargs):
        etiqueta_id = kwargs.get('pk')
        try:
            etiqueta = Etiqueta.objects.get(id=etiqueta_id)
            etiqueta.delete()
            return Response({"message": "Etiqueta eliminada correctamente."}, status=status.HTTP_204_NO_CONTENT)
        except Etiqueta.DoesNotExist:
            return Response({"error": "Etiqueta no encontrada."}, status=status.HTTP_404_NOT_FOUND)
        
class ComentarioListCreate(generics.ListCreateAPIView):
    serializer_class = ComentarioSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        tarea_id = self.kwargs['tarea_id']
        return Comentario.objects.filter(tarea_id=tarea_id)

    def create(self, request, *args, **kwargs):
        try:
            tarea_id = self.kwargs['tarea_id']
            # Asegurarse de que la tarea existe
            tarea = Tarea.objects.get(id=tarea_id)
            
            # Crear el comentario
            serializer = self.get_serializer(data={'texto': request.data['texto'], 'tarea': tarea_id})
            serializer.is_valid(raise_exception=True)
            self.perform_create(serializer)
            
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        except Tarea.DoesNotExist:
            return Response(
                {'detail': 'Tarea no encontrada'},
                status=status.HTTP_404_NOT_FOUND
            )
        except Exception as e:
            return Response(
                {'detail': str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )

    def perform_create(self, serializer):
        serializer.save(usuario=self.request.user)
        
class ComentarioDelete(generics.DestroyAPIView):
    serializer_class = ComentarioSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Comentario.objects.filter(usuario=self.request.user)

    def destroy(self, request, *args, **kwargs):
        try:
            comentario = self.get_object()
            if comentario.usuario != request.user:
                return Response(
                    {'detail': 'No tienes permiso para eliminar este comentario'},
                    status=status.HTTP_403_FORBIDDEN
                )
            comentario.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except Exception as e:
            return Response(
                {'detail': str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )
            
class ComentarioUpdate(generics.UpdateAPIView):
    serializer_class = ComentarioSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Comentario.objects.filter(usuario=self.request.user)

    def update(self, request, *args, **kwargs):
        try:
            comentario = self.get_object()
            if comentario.usuario != request.user:
                return Response(
                    {'detail': 'No tienes permiso para editar este comentario'},
                    status=status.HTTP_403_FORBIDDEN
                )
            return super().update(request, *args, **kwargs)
        except Exception as e:
            return Response(
                {'detail': str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )