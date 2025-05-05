// /home/jesus/python/TFG/APP/frontend/src/components/__tests__/RF/mistral/RF-13-mistral.test.jsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
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

describe('Historial de Cambios', () => {
    const mockTarea = {
        id: 1,
        titulo: 'Tarea de prueba',
        descripcion: 'Descripción de prueba',
        estado: 'pendiente',
        prioridad: 'media',
        fecha_vencimiento: '2023-12-31',
        fecha_creacion: '2023-10-01',
    };

    const mockHistorial = [
        {
            id: 1,
            accion: 'Creación de tarea',
            usuario: 'usuario1',
            fecha_cambio: '2023-10-01T10:00:00Z',
        },
        {
            id: 2,
            accion: 'Modificación de prioridad',
            usuario: 'usuario2',
            fecha_cambio: '2023-10-02T11:00:00Z',
        },
    ];

    it('Muestra el historial de cambios con fecha, hora y usuario', async () => {
        api.get.mockResolvedValueOnce({ data: mockHistorial });

        render(
            <BrowserRouter>
                <Tarea tarea={mockTarea} />
            </BrowserRouter>
        );

        // Abrir el modal de detalles de la tarea
        const viewDetailsButton = screen.getByRole('button', { name: /ver detalles/i });
        viewDetailsButton.click();

        // Esperar a que el historial se cargue
        await waitFor(() => {
            expect(screen.getByText('Historial de Cambios')).toBeInTheDocument();
        });

        // Verificar que se muestre el historial correctamente
        expect(screen.getByText('Creación de tarea')).toBeInTheDocument();
        expect(screen.getByText('Por: usuario1')).toBeInTheDocument();
        expect(screen.getByText('1 de octubre de 2023, 10:00:00')).toBeInTheDocument();

        expect(screen.getByText('Modificación de prioridad')).toBeInTheDocument();
        expect(screen.getByText('Por: usuario2')).toBeInTheDocument();
        expect(screen.getByText('2 de octubre de 2023, 11:00:00')).toBeInTheDocument();
    });

    it('Muestra un mensaje si no hay historial de cambios', async () => {
        api.get.mockResolvedValueOnce({ data: [] });

        render(
            <BrowserRouter>
                <Tarea tarea={mockTarea} />
            </BrowserRouter>
        );

        // Abrir el modal de detalles de la tarea
        const viewDetailsButton = screen.getByRole('button', { name: /ver detalles/i });
        viewDetailsButton.click();

        // Esperar a que el historial se cargue
        await waitFor(() => {
            expect(screen.getByText('Historial de Cambios')).toBeInTheDocument();
        });

        // Verificar que se muestre el mensaje de no hay historial de cambios
        expect(screen.getByText('No hay historial de cambios.')).toBeInTheDocument();
    });
});