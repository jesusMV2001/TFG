// /home/jesus/python/TFG/APP/frontend/src/components/__tests__/HU/nvidia/HU-12-nvidia.test.jsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import TareaForm from '../../../TareaForm';
import api from '../../../../api';

vi.mock('../../../../api');

describe('HU-12: Eliminar etiquetas', () => {
    beforeEach(() => {
        // Mockear API para devolver una tarea con etiquetas
        api.get.mockResolvedValueOnce({
            data: {
                id: 1,
                titulo: 'Tarea de Prueba',
                etiquetas: [
                    { id: 1, nombre: 'Etiqueta 1' },
                    { id: 2, nombre: 'Etiqueta 2' }
                ]
            }
        });

        // Mockear la eliminación de etiquetas
        api.delete.mockResolvedValueOnce({ status: 204 });
    });

    it('El usuario puede eliminar etiquetas para cada tarea.', async () => {
        render(<TareaForm initialData={{ id: 1 }} />);

        // Esperar a que se carguen las etiquetas
        await waitFor(() => screen.getByText('Etiqueta 1'));
        await waitFor(() => screen.getByText('Etiqueta 2'));

        // Encontrar el botón para eliminar la primera etiqueta
        const eliminarEtiquetaBtn = screen.getAllByText('Eliminar')[0];

        // Simular el clic en el botón de eliminar
        fireEvent.click(eliminarEtiquetaBtn);

        // Verificar que la etiqueta ya no esté visible
        await waitFor(() => expect(screen.queryByText('Etiqueta 1')).not.toBeInTheDocument());
    });

    it('El sistema debe mostrar un mensaje cuando se elimine una etiqueta de una tarea.', async () => {
        render(<TareaForm initialData={{ id: 1 }} />);

        // Esperar a que se carguen las etiquetas
        await waitFor(() => screen.getByText('Etiqueta 1'));
        await waitFor(() => screen.getByText('Etiqueta 2'));

        // Encontrar el botón para eliminar la primera etiqueta
        const eliminarEtiquetaBtn = screen.getAllByText('Eliminar')[0];

        // Simular el clic en el botón de eliminar
        fireEvent.click(eliminarEtiquetaBtn);

        // Verificar que se muestre el mensaje de éxito
        await waitFor(() => expect(screen.getByText('Etiqueta eliminada exitosamente')).toBeInTheDocument());
    });
});