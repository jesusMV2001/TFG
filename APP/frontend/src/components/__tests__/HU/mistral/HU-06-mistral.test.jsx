// /home/jesus/python/TFG/APP/frontend/src/components/__tests__/HU/mistral/HU-06-mistral.test.jsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Home from '../../../../pages/Home';
import api from '../../../../api';
import { BrowserRouter } from 'react-router-dom';

vi.mock('../../../../api');
vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom');
    return {
        ...actual,
        useNavigate: () => vi.fn(),
    };
});

describe('HU-06: Eliminar tarea', () => {
    it('debe eliminar una tarea y mostrar un mensaje de éxito', async () => {
        api.delete.mockResolvedValueOnce({ status: 204 });

        render(
            <BrowserRouter>
                <Home />
            </BrowserRouter>
        );

        // Simula la existencia de una tarea en la lista
        const tarea = {
            id: 1,
            titulo: 'Tarea de prueba',
            descripcion: 'Descripción de la tarea de prueba',
            estado: 'pendiente',
            prioridad: 'media',
            fecha_vencimiento: '2023-12-31',
        };

        // Renderiza la tarea en la lista
        const tareaElement = screen.getByText('Tarea de prueba');
        expect(tareaElement).toBeInTheDocument();

        // Simula la eliminación de la tarea
        const deleteButton = screen.getByText('Eliminar');
        fireEvent.click(deleteButton);

        // Espera a que el mensaje de éxito aparezca
        await waitFor(() => {
            const successMessage = screen.getByText('Tarea eliminada exitosamente');
            expect(successMessage).toBeInTheDocument();
        });

        // Verifica que la tarea ha sido eliminada de la lista
        expect(screen.queryByText('Tarea de prueba')).not.toBeInTheDocument();
    });

    it('debe mostrar un mensaje de error si falla la eliminación de la tarea', async () => {
        api.delete.mockRejectedValueOnce({ response: { data: { error: 'Error al eliminar la tarea' } } });

        render(
            <BrowserRouter>
                <Home />
            </BrowserRouter>
        );

        // Simula la existencia de una tarea en la lista
        const tarea = {
            id: 1,
            titulo: 'Tarea de prueba',
            descripcion: 'Descripción de la tarea de prueba',
            estado: 'pendiente',
            prioridad: 'media',
            fecha_vencimiento: '2023-12-31',
        };

        // Renderiza la tarea en la lista
        const tareaElement = screen.getByText('Tarea de prueba');
        expect(tareaElement).toBeInTheDocument();

        // Simula la eliminación de la tarea
        const deleteButton = screen.getByText('Eliminar');
        fireEvent.click(deleteButton);

        // Espera a que el mensaje de error aparezca
        await waitFor(() => {
            const errorMessage = screen.getByText('Error al eliminar la tarea');
            expect(errorMessage).toBeInTheDocument();
        });
    });
});