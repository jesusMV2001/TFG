// /home/jesus/python/TFG/APP/frontend/src/components/__tests__/HU/nvidia/HU-10-nvidia.test.jsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Tarea from '../../../Tarea';
import ModalTarea from '../../../ModalTarea';
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

const tareaMock = {
    id: 1,
    titulo: "Tarea de Prueba",
    descripcion: "Esta es una tarea de prueba",
    estado: "pendiente",
    prioridad: "media",
    fecha_vencimiento: "2024-03-20",
    historial: [
        {
            id: 1,
            accion: "Creada",
            fecha_cambio: "2024-03-15",
            usuario: "Usuario de Prueba"
        },
        {
            id: 2,
            accion: "Actualizada",
            fecha_cambio: "2024-03-16",
            usuario: "Usuario de Prueba"
        }
    ]
};

describe('HU-10 - Historial de Actividades', () => {
    it('Muestra el botón para ver detalles de la tarea', async () => {
        render(
            <BrowserRouter>
                <Tarea tarea={tareaMock} onDelete={vi.fn()} onUpdate={vi.fn()} onDragStart={vi.fn()} />
            </BrowserRouter>
        );

        const detalleButton = await screen.findByRole('button', { name: 'Ver Detalles' });

        expect(detalleButton).toBeInTheDocument();
    });

    it('Abre el modal con el historial de cambios al clicar en "Ver Detalles"', async () => {
        render(
            <BrowserRouter>
                <Tarea tarea={tareaMock} onDelete={vi.fn()} onUpdate={vi.fn()} onDragStart={vi.fn()} />
            </BrowserRouter>
        );

        const detalleButton = await screen.findByRole('button', { name: 'Ver Detalles' });
        fireEvent.click(detalleButton);

        const modal = await screen.findByComponent(ModalTarea);
        expect(modal).toBeInTheDocument();
    });

    it('Muestra el historial de cambios en el modal', async () => {
        vi.mocked(api.get).mockResolvedValueOnce({ data: tareaMock.historial });

        render(
            <BrowserRouter>
                <Tarea tarea={tareaMock} onDelete={vi.fn()} onUpdate={vi.fn()} onDragStart={vi.fn()} />
            </BrowserRouter>
        );

        const detalleButton = await screen.findByRole('button', { name: 'Ver Detalles' });
        fireEvent.click(detalleButton);

        const historialList = await screen.findByRole('list');
        expect(historialList).toBeInTheDocument();

        const historialItems = await screen.findAllByRole('listitem');
        expect(historialItems).toHaveLength(tareaMock.historial.length);
    });

    it('Muestra la acción, fecha y usuario para cada cambio en el historial', async () => {
        vi.mocked(api.get).mockResolvedValueOnce({ data: tareaMock.historial });

        render(
            <BrowserRouter>
                <Tarea tarea={tareaMock} onDelete={vi.fn()} onUpdate={vi.fn()} onDragStart={vi.fn()} />
            </BrowserRouter>
        );

        const detalleButton = await screen.findByRole('button', { name: 'Ver Detalles' });
        fireEvent.click(detalleButton);

        const historialItems = await screen.findAllByRole('listitem');
        historialItems.forEach((item, index) => {
            const accion = screen.getByText(tareaMock.historial[index].accion, { selector: 'p' });
            const fecha = screen.getByText(tareaMock.historial[index].fecha_cambio, { selector: 'span' });
            const usuario = screen.getByText(tareaMock.historial[index].usuario, { selector: 'p' });

            expect(accion).toBeInTheDocument();
            expect(fecha).toBeInTheDocument();
            expect(usuario).toBeInTheDocument();
        });
    });
});