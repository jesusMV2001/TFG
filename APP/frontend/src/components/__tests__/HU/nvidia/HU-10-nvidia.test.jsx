// /home/jesus/python/TFG/APP/frontend/src/components/__tests__/HU/nvidia/HU-10-nvidia.test.jsx

import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Tarea from '../../../Tarea';
import ModalTarea from '../../../ModalTarea';
import ComentariosList from '../../../ComentariosList';
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

describe('HU-10 - Historial de Actividades', () => {
    const tarea = {
        id: 1,
        titulo: 'Tarea de Ejemplo',
        descripcion: 'Descripción de la tarea',
        fecha_creacion: '2024-03-10T14:30:00',
        fecha_vencimiento: '2024-03-15T14:30:00',
        estado: 'pendiente',
        prioridad: 'alta',
        usuario: 'usuario_prueba',
        historial: [
            { id: 1, accion: 'Creación', fecha_cambio: '2024-03-10T14:30:00', usuario: 'usuario_prueba' },
            { id: 2, accion: 'Actualización de Estado a En Progreso', fecha_cambio: '2024-03-12T10:00:00', usuario: 'usuario_prueba' },
        ],
    };

    const renderComponent = () => {
        return render(
            <BrowserRouter>
                <Tarea tarea={tarea} onDelete={vi.fn()} onDragStart={vi.fn()} onUpdate={vi.fn()} />
            </BrowserRouter>
        );
    };

    it('Muestra el botón para ver detalles de la tarea', () => {
        renderComponent();
        expect(screen.getByRole('button', { name: 'Ver Detalles' })).toBeInTheDocument();
    });

    it('Muestra el historial de cambios al clicar en "Ver Detalles"', async () => {
        renderComponent();

        const detallesButton = await screen.findByRole('button', { name: 'Ver Detalles' });
        fireEvent.click(detallesButton);

        await waitFor(() => {
            expect(screen.getByText('Historial de Cambios')).toBeInTheDocument();
            expect(screen.getByText(tarea.historial[0].accion)).toBeInTheDocument();
            expect(screen.getByText(tarea.historial[1].accion)).toBeInTheDocument();
        });
    });

    it('Muestra la fecha y hora de cada cambio en el historial', async () => {
        renderComponent();

        const detallesButton = await screen.findByRole('button', { name: 'Ver Detalles' });
        fireEvent.click(detallesButton);

        await waitFor(() => {
            expect(screen.getByText('2024-03-10 14:30:00')).toBeInTheDocument();
            expect(screen.getByText('2024-03-12 10:00:00')).toBeInTheDocument();
        });
    });
});