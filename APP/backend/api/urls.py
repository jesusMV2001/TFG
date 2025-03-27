from django.urls import path
from . import views

urlpatterns = [
    path('tareas/', views.TareaListCreate.as_view(), name='tarea-list-create'),
    path('tareas/delete/<int:pk>/', views.TareaDelete.as_view(), name='tarea-delete'),   
]