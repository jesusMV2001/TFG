// /home/jesus/python/TFG/APP/frontend/src/components/__tests__/HU/nvidia/HU-06-nvidia.test.jsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Tarea from '../../../Tarea';
import api from '../../../../api';
import { BrowserRouter } from 'react-router-dom';
import { within } from '@testing-library/dom';

vi.mock('../../../../api');
vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom');
    return {
        ...actual,
        useNavigate: () => vi.fn(),
    };
});

describe('HU-06: Eliminar tarea', () => {
    const tareaMock = {
        id: 1,
        titulo: 'Tarea de prueba',
        descripcion: 'Descripción de la tarea de prueba',
        estado: 'pendiente',
        prioridad: 'media',
        fecha_vencimiento: '2024-03-16',
    };

    it('debe desaparecer de la lista al eliminar la tarea', async () => {
        // Mockear la API para eliminar la tarea con éxito
        api.delete.mockResolvedValueOnce({ status: 204 });

        render(
            <BrowserRouter>
                <Tarea tarea={tareaMock} onDelete={vi.fn()} onUpdate={vi.fn()} onDragStart={vi.fn()} />
            </BrowserRouter>
        );

        // Encontrar el botón de eliminar tarea
        const eliminarBtn = screen.getByRole('button', { name: /eliminar/i });
        expect(eliminarBtn).toBeInTheDocument();

        // Simular clic en el botón de eliminar
        fireEvent.click(eliminarBtn);

        // Esperar a que la tarea desaparezca de la lista
        await waitFor(() => expect(screen.queryByText(tareaMock.titulo)).not.toBeInTheDocument());
    });

    it('debe mostrar un mensaje si se ha borrado la tarea con éxito', async () => {
        // Mockear la API para eliminar la tarea con éxito
        api.delete.mockResolvedValueOnce({ status: 204, data: { message: 'Tarea eliminada con éxito' } });

        render(
            <BrowserRouter>
                <Tarea tarea={tareaMock} onDelete={vi.fn()} onUpdate={vi.fn()} onDragStart={vi.fn()} />
            </BrowserRouter>
        );

        // Encontrar el botón de eliminar tarea
        const eliminarBtn = screen.getByRole('button', { name: /eliminar/i });
        expect(eliminarBtn).toBeInTheDocument();

        // Simular clic en el botón de eliminar
        fireEvent.click(eliminarBtn);

        // Esperar a que aparezca el mensaje de éxito
        await waitFor(() => expect(screen.getByText('Tarea eliminada con éxito')).toBeInTheDocument());
    });

    it('debe mostrar un mensaje de error en caso de fallo al eliminar la tarea', async () => {
        // Mockear la API para eliminar la tarea con error
        api.delete.mockRejectedValueOnce({ response: { status: 500, data: { error: 'Error al eliminar la tarea' } } });

        render(
            <BrowserRouter>
                <Tarea tarea={tareaMock} onDelete={vi.fn()} onUpdate={vi.fn()} onDragStart={vi.fn()} />
            </BrowserRouter>
        );

        // Encontrar el botón de eliminar tarea
        const eliminarBtn = screen.getByRole('button', { name: /eliminar/i });
        expect(eliminarBtn).toBeInTheDocument();

        // Simular clic en el botón de eliminar
        fireEvent.click(eliminarBtn);

        // Esperar a que aparezca el mensaje de error
        await waitFor(() => expect(screen.getByText('Error al eliminar la tarea')).toBeInTheDocument());
    });
});