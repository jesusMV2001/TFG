from django.urls import path
from . import views

urlpatterns = [
    path('tareas/', views.TareaListCreate.as_view(), name='tarea-list-create'),
    path('tareas/delete/<int:pk>/', views.TareaDelete.as_view(), name='tarea-delete'),
    path('tareas/update/<int:pk>/', views.TareaUpdate.as_view(), name='tarea-update'),
    path('tareas/<int:tarea_id>/historial/', views.HistorialCambiosList.as_view(), name='historial-cambios'),
    path('etiquetas/', views.EtiquetaCreate.as_view(), name='etiqueta-create'),
    path('tareas/<int:tarea_id>/etiquetas/', views.EtiquetaList.as_view(), name='etiqueta-list'),
    path('etiquetas/delete/<int:pk>/', views.EtiquetaDelete.as_view(), name='etiqueta-delete'),
    path('tareas/<int:tarea_id>/comentarios/', views.ComentarioListCreate.as_view(), name='comentario-list-create'),
    path('comentarios/delete/<int:pk>/', views.ComentarioDelete.as_view(), name='comentario-delete'),
    path('comentarios/update/<int:pk>/', views.ComentarioUpdate.as_view(), name='comentario-update'),
]