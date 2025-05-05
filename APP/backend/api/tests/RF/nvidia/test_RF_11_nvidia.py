class TareaListCreate(generics.ListCreateAPIView):
    # ...

    def get_queryset(self):
        user = self.request.user
        search_query = self.request.GET.get('search')
        if search_query:
            return Tarea.objects.filter(usuario=user).filter(
                models.Q(titulo__icontains=search_query) | models.Q(descripcion__icontains=search_query)
            ).order_by(
                models.Case(
                    models.When(prioridad='alta', then=0),
                    models.When(prioridad='media', then=1),
                    models.When(prioridad='baja', then=2),
                    default=3,
                    output_field=models.IntegerField()
                ),
                'fecha_vencimiento'
            )
        else:
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