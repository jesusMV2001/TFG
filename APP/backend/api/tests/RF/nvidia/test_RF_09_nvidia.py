import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Tarea from '../../../Tarea';
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

describe('RF-09: Marcar tarea como completada', () => {
    const tareaMock = {
        id: 1,
        titulo: 'Tarea de ejemplo',
        estado: 'en_progreso',
        prioridad: 'media',
        fecha_vencimiento: '2024-03-16',
    };

    it('debe mostrar el botón de completar', async () => {
        render(
            <BrowserRouter>
                <Tarea tarea={tareaMock} onDelete={vi.fn()} onUpdate={vi.fn()} onDragStart={vi.fn()} />
            </BrowserRouter>
        );

        expect(screen.getByRole('button', { name: 'Completar' })).toBeInTheDocument();
    });

    it('debe actualizar el estado a "completada" al hacer click en completar', async () => {
        const updateTareaMock = vi.fn();
        render(
            <BrowserRouter>
                <Tarea tarea={tareaMock} onDelete={vi.fn()} onUpdate={updateTareaMock} onDragStart={vi.fn()} />
            </BrowserRouter>
        );

        constCOMPLETE_BUTTON = screen.getByRole('button', { name: 'Completar' });
        fireEvent.click(COMPLETE_BUTTON);

        await waitFor(() => expect(updateTareaMock).toHaveBeenCalledTimes(1));
        expect(updateTareaMock).toHaveBeenCalledWith(tareaMock.id, { estado: 'completada' });
    });

    it('debe mostrar el estado actualizado como "completada" después de completar', async () => {
        const updateTareaMock = vi.fn();
        render(
            <BrowserRouter>
                <Tarea tarea={tareaMock} onDelete={vi.fn()} onUpdate={updateTareaMock} onDragStart={vi.fn()} />
            </BrowserRouter>
        );

        const COMPLETE_BUTTON = screen.getByRole('button', { name: 'Completar' });
        fireEvent.click(COMPLETE_BUTTON);

        await waitFor(() => expect(screen.getByText('Completada')).toBeInTheDocument());
    });

    it('debe llamar a la API para actualizar la tarea con el nuevo estado', async () => {
        const apiUpdateMock = vi.fn(() => Promise.resolve({ status: 200 }));
        vi.mocked(api.put).mockImplementation(apiUpdateMock);

        const updateTareaMock = vi.fn();
        render(
            <BrowserRouter>
                <Tarea tarea={tareaMock} onDelete={vi.fn()} onUpdate={updateTareaMock} onDragStart={vi.fn()} />
            </BrowserRouter>
        );

        const COMPLETE_BUTTON = screen.getByRole('button', { name: 'Completar' });
        fireEvent.click(COMPLETE_BUTTON);

        await waitFor(() => expect(apiUpdateMock).toHaveBeenCalledTimes(1));
        expect(apiUpdateMock).toHaveBeenCalledWith(`/api/tareas/update/${tareaMock.id}/`, expect.anything());
    });
});