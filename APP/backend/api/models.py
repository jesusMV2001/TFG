from django.db import models
from django.contrib.auth.models import User

class Tarea(models.Model):
    ESTADO_CHOICES = [
        ('pendiente', 'Pendiente'),
        ('en_progreso', 'En Progreso'),
        ('completada', 'Completada'),
    ]

    PRIORIDAD_CHOICES = [
        ('alta', 'Alta'),
        ('media', 'Media'),
        ('baja', 'Baja'),
    ]

    titulo = models.CharField(max_length=255)
    descripcion = models.TextField(blank=True, null=True)
    fecha_creacion = models.DateTimeField(auto_now_add=True)
    fecha_vencimiento = models.DateTimeField(null=True, blank=True)
    estado = models.CharField(max_length=20, choices=ESTADO_CHOICES, default='pendiente')
    prioridad = models.CharField(max_length=10, choices=PRIORIDAD_CHOICES, default='media')
    usuario = models.ForeignKey(User, on_delete=models.CASCADE, related_name='tareas')

    def __str__(self):
        return self.titulo


class Etiqueta(models.Model):
    nombre = models.CharField(max_length=50)
    tarea = models.ForeignKey(Tarea, on_delete=models.CASCADE, related_name='etiquetas', null=True, blank=True)

    def __str__(self):
        return self.nombre


class HistorialCambios(models.Model):
    tarea = models.ForeignKey(Tarea, on_delete=models.CASCADE, related_name='historial')
    accion = models.CharField(max_length=255)  # Ejemplo: "Creación", "Cambio de estado a Completada"
    fecha_cambio = models.DateTimeField(auto_now_add=True)
    usuario = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)

    def __str__(self):
        return f"{self.accion} - {self.fecha_cambio}"
