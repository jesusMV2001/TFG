// /home/jesus/python/TFG/APP/frontend/src/components/__tests__/HU/mistral/HU-10-mistral.test.jsx
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

describe('HU-10: Historial de Actividades', () => {
    const tareaMock = {
        id: 1,
        titulo: 'Tarea de prueba',
        descripcion: 'Descripción de la tarea',
        estado: 'pendiente',
        prioridad: 'media',
        fecha_vencimiento: '2023-12-31',
    };

    it('debe mostrar el historial de cambios al hacer clic en "Ver detalles"', async () => {
        api.get.mockResolvedValue({ data: [] });

        render(
            <BrowserRouter>
                <Tarea tarea={tareaMock} onDelete={() => {}} onUpdate={() => {}} onDragStart={() => {}} />
            </BrowserRouter>
        );

        fireEvent.click(screen.getByText('Ver detalles'));

        await waitFor(() => {
            expect(screen.getByText('Historial de Cambios')).toBeInTheDocument();
        });
    });

    it('debe mostrar los cambios en el historial si existen', async () => {
        const historialMock = [
            { id: 1, accion: 'Tarea creada', usuario: 'Usuario1', fecha_cambio: '2023-10-01T00:00:00Z' },
            { id: 2, accion: 'Tarea actualizada', usuario: 'Usuario2', fecha_cambio: '2023-10-02T00:00:00Z' },
        ];

        api.get.mockResolvedValue({ data: historialMock });

        render(
            <BrowserRouter>
                <Tarea tarea={tareaMock} onDelete={() => {}} onUpdate={() => {}} onDragStart={() => {}} />
            </BrowserRouter>
        );

        fireEvent.click(screen.getByText('Ver detalles'));

        await waitFor(() => {
            expect(screen.getByText('Tarea creada')).toBeInTheDocument();
            expect(screen.getByText('Tarea actualizada')).toBeInTheDocument();
        });
    });

    it('debe mostrar un mensaje si no hay historial de cambios', async () => {
        api.get.mockResolvedValue({ data: [] });

        render(
            <BrowserRouter>
                <Tarea tarea={tareaMock} onDelete={() => {}} onUpdate={() => {}} onDragStart={() => {}} />
            </BrowserRouter>
        );

        fireEvent.click(screen.getByText('Ver detalles'));

        await waitFor(() => {
            expect(screen.getByText('No hay historial de cambios.')).toBeInTheDocument();
        });
    });
});