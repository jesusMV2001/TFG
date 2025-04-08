// /home/jesus/python/TFG/APP/frontend/src/components/__tests__/HU/gemini/HU-10-gemini.test.jsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Tarea from '../../../Tarea';
import api from '../../../../api';

vi.mock('../../../../api');

describe('HU-10: Historial de Actividades', () => {
    const tarea = {
        id: 1,
        titulo: 'Tarea de prueba',
        descripcion: 'Descripción de prueba',
        estado: 'pendiente',
        prioridad: 'media',
        fecha_vencimiento: '2024-12-31',
        fecha_creacion: '2024-01-01'
    };

    const historial = [
        {
            id: 1,
            tarea: 1,
            usuario: 'usuario1',
            fecha_cambio: '2024-01-02',
            accion: 'Tarea creada'
        },
        {
            id: 2,
            tarea: 1,
            usuario: 'usuario2',
            fecha_cambio: '2024-01-03',
            accion: 'Estado modificado a en progreso'
        }
    ];

    it('Debería mostrar el botón para ver detalles de la tarea', () => {
        render(<Tarea tarea={tarea} onDelete={() => {}} onUpdate={() => {}} onDragStart={() => {}} />);
        const verDetallesButton = screen.getByText(/Ver detalles/i);
        expect(verDetallesButton).toBeInTheDocument();
    });

    it('Debería llamar a la API para obtener el historial cuando se hace clic en el botón de ver detalles', async () => {
        api.get.mockResolvedValue({ data: historial });
        render(<Tarea tarea={tarea} onDelete={() => {}} onUpdate={() => {}} onDragStart={() => {}} />);
        const verDetallesButton = screen.getByText(/Ver detalles/i);
        fireEvent.click(verDetallesButton);

        await waitFor(() => {
            expect(api.get).toHaveBeenCalledWith(`/api/tareas/${tarea.id}/historial/`);
        });
    });

    it('Debería mostrar el historial de actividades en el modal de detalles', async () => {
        api.get.mockResolvedValue({ data: historial });
        render(<Tarea tarea={tarea} onDelete={() => {}} onUpdate={() => {}} onDragStart={() => {}} />);
        const verDetallesButton = screen.getByText(/Ver detalles/i);
        fireEvent.click(verDetallesButton);

        await waitFor(() => {
            expect(screen.getByText(/Historial de Cambios/i)).toBeVisible();
            expect(screen.getByText(/Tarea creada/i)).toBeInTheDocument();
            expect(screen.getByText(/Estado modificado a en progreso/i)).toBeInTheDocument();
        });
    });

    it('Debería mostrar un mensaje si no hay historial de actividades', async () => {
         api.get.mockResolvedValue({ data: [] });
         render(<Tarea tarea={tarea} onDelete={() => {}} onUpdate={() => {}} onDragStart={() => {}} />);
         const verDetallesButton = screen.getByText(/Ver detalles/i);
         fireEvent.click(verDetallesButton);

         await waitFor(() => {
            expect(screen.getByText(/No hay historial de cambios./i)).toBeVisible();
         });
     });
});