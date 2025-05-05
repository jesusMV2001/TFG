// /home/jesus/python/TFG/APP/frontend/src/components/__tests__/RF/gemini/RF-13-gemini.test.jsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import Tarea from '../../../components/Tarea';
import api from '../../../../api';

vi.mock('../../../../api');

describe('RF-13: Historial de Tarea', () => {
    it('debería mostrar el historial de cambios con fecha, hora y usuario', async () => {
        const tarea = {
            id: 1,
            titulo: 'Tarea de prueba',
            descripcion: 'Descripción de prueba',
            fecha_vencimiento: '2024-12-31',
            prioridad: 'alta',
            estado: 'pendiente',
            fecha_creacion: '2024-01-01'
        };

        const historial = [
            {
                id: 1,
                tarea: 1,
                usuario: 'usuario1',
                accion: 'Tarea creada',
                fecha_cambio: '2024-01-01T12:00:00Z'
            },
            {
                id: 2,
                tarea: 1,
                usuario: 'usuario2',
                accion: 'Prioridad modificada a media',
                fecha_cambio: '2024-01-02T14:30:00Z'
            }
        ];

        api.get.mockImplementation((url) => {
            if (url === '/api/tareas/1/historial/') {
                return Promise.resolve({ data: historial });
            }
            return Promise.reject(new Error('URL no manejada'));
        });

        render(<Tarea tarea={tarea} onDelete={() => {}} onUpdate={() => {}} onDragStart={() => {}} />);

        // Simular el click en el botón de ver detalles
        const viewDetailsButton = screen.getByRole('button', {
            name: /ver/i,
        });
        viewDetailsButton.click();

        // Esperar a que el historial se cargue y se muestre
        await waitFor(() => {
            expect(api.get).toHaveBeenCalledWith('/api/tareas/1/historial/');
            expect(screen.getByText('Historial de Cambios')).toBeVisible();
            expect(screen.getByText('Tarea creada')).toBeVisible();
            expect(screen.getByText('Prioridad modificada a media')).toBeVisible();
            expect(screen.getByText('Por: usuario1')).toBeVisible();
            expect(screen.getByText('Por: usuario2')).toBeVisible();

            const fecha1 = new Date(historial[0].fecha_cambio).toLocaleDateString();
            const hora1 = new Date(historial[0].fecha_cambio).toLocaleTimeString();

            const fecha2 = new Date(historial[1].fecha_cambio).toLocaleDateString();
            const hora2 = new Date(historial[1].fecha_cambio).toLocaleTimeString();

            expect(screen.getByText(fecha1)).toBeVisible();
            expect(screen.getByText(fecha2)).toBeVisible();

        });
    });

    it('debería mostrar "No hay historial de cambios" si el historial está vacío', async () => {
        const tarea = {
            id: 1,
            titulo: 'Tarea de prueba',
            descripcion: 'Descripción de prueba',
            fecha_vencimiento: '2024-12-31',
            prioridad: 'alta',
            estado: 'pendiente',
            fecha_creacion: '2024-01-01'
        };

        api.get.mockImplementation((url) => {
            if (url === '/api/tareas/1/historial/') {
                return Promise.resolve({ data: [] });
            }
            return Promise.reject(new Error('URL no manejada'));
        });

        render(<Tarea tarea={tarea} onDelete={() => {}} onUpdate={() => {}} onDragStart={() => {}} />);

        // Simular el click en el botón de ver detalles
        const viewDetailsButton = screen.getByRole('button', {
            name: /ver/i,
        });
        viewDetailsButton.click();

        // Esperar a que el modal se abra y el mensaje se muestre
        await waitFor(() => {
            expect(api.get).toHaveBeenCalledWith('/api/tareas/1/historial/');
            expect(screen.getByText('No hay historial de cambios.')).toBeVisible();
        });
    });
});