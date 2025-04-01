from django.urls import path
from . import views

urlpatterns = [
    path('tareas/', views.TareaListCreate.as_view(), name='tarea-list-create'),
    path('tareas/delete/<int:pk>/', views.TareaDelete.as_view(), name='tarea-delete'),
    path('tareas/update/<int:pk>/', views.TareaUpdate.as_view(), name='tarea-update'),
    path('tareas/<int:tarea_id>/historial/', views.HistorialCambiosList.as_view(), name='historial-cambios'),
    path('etiquetas/', views.EtiquetaListCreate.as_view(), name='etiqueta-list-create'),
    path('etiquetas/delete/<int:pk>/', views.EtiquetaDelete.as_view(), name='etiqueta-delete'),
]