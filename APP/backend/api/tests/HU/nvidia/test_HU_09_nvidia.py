class TareaListCreate(generics.ListCreateAPIView):
    ...

    def get_queryset(self):
        buscar = self.request.query_params.get('buscar')
        if buscar:
            return Tarea.objects.filter(usuario=self.request.user, titulo__icontains=buscar) | Tarea.objects.filter(usuario=self.request.user, descripcion__icontains=buscar)
        return Tarea.objects.filter(usuario=self.request.user)