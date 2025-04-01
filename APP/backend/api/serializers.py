from django.contrib.auth.models import User
from rest_framework import serializers
from .models import Tarea, Etiqueta, HistorialCambios
from datetime import date

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'password']
        extra_kwargs = {'password': {'write_only': True, 'required': True}}

    def validate_password(self, value):
        if len(value) < 8:
            raise serializers.ValidationError("La contraseña debe tener al menos 8 caracteres.")
        return value

    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user
    
class TareaSerializer(serializers.ModelSerializer):
    usuario = serializers.ReadOnlyField(source='usuario.username')  # Usuario como solo lectura

    class Meta:
        model = Tarea
        fields = [
            'id', 
            'titulo', 
            'descripcion', 
            'fecha_creacion', 
            'fecha_vencimiento', 
            'estado', 
            'prioridad', 
            'etiquetas', 
            'usuario'
        ]
    def validate_fecha_vencimiento(self, value):
        if value.date() < date.today():
            raise serializers.ValidationError("La fecha de vencimiento no puede ser menor a la fecha actual.")
        return value

class EtiquetaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Etiqueta
        fields = ['id', 'nombre', 'tarea'] 


class HistorialCambiosSerializer(serializers.ModelSerializer):
    tarea = serializers.ReadOnlyField(source='tarea.titulo')  # Muestra el título de la tarea
    usuario = serializers.ReadOnlyField(source='usuario.username')  # Usuario como solo lectura

    class Meta:
        model = HistorialCambios
        fields = [
            'id',
            'tarea',
            'accion',
            'fecha_cambio',
            'usuario'
        ]