// /home/jesus/python/TFG/APP/frontend/src/components/__tests__/HU/nvidia/HU-04-nvidia.test.jsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Home from '../../../../pages/Home';
import api from '../../../../api';
import { BrowserRouter } from 'react-router-dom';
import ProtectedRoute from '../../../ProtectedRoute';

vi.mock('../../../../api');
vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom');
    return {
        ...actual,
        useNavigate: () => vi.fn(),
    };
});

describe('HU-04: Ver tareas', () => {
    beforeEach(() => {
        // Mockear la respuesta de la API con tareas de muestra
        const tareas = [
            { id: 1, titulo: 'Tarea 1', estado: 'pendiente' },
            { id: 2, titulo: 'Tarea 2', estado: 'en_progreso' },
            { id: 3, titulo: 'Tarea 3', estado: 'completada' },
            { id: 4, titulo: 'Tarea 4', estado: 'pendiente' },
            { id: 5, titre: 'Tarea 5', estado: 'en_progreso' },
        ];
        vi.mocked(api.get).mockResolvedValue({ data: tareas });
    });

    it('Muestra todas las tareas asociadas al usuario', async () => {
        render(
            <BrowserRouter>
                <ProtectedRoute>
                    <Home />
                </ProtectedRoute>
            </BrowserRouter>
        );

        await waitFor(() => {
            const tareaListComponentes = screen.getAllByRole('listitem');
            expect(tareaListComponentes).toHaveLength(5);
        });

        // Verificar que cada tarea se muestre
        const titulosTareas = await screen.findAllByRole('heading', { level: 3 });
        expect(titulosTareas.map((titulo) => titulo.textContent)).toEqual([
            'Tarea 1',
            'Tarea 2',
            'Tarea 3',
            'Tarea 4',
            'Tarea 5',
        ]);
    });

    it('Agrupa tareas por estado', async () => {
        render(
            <BrowserRouter>
                <ProtectedRoute>
                    <Home />
                </ProtectedRoute>
            </BrowserRouter>
        );

        await waitFor(() => {
            // Seleccionar columnas por estado
            const columnasEstado = screen.getAllByRole('region');

            // Verificar tareas en cada columna
            expect(columnasEstado[0]).toContainElement( screen.findByText('Tarea 1'));
            expect(columnasEstado[0]).toContainElement( screen.findByText('Tarea 4'));
            expect(columnasEstado[1]).toContainElement( screen.findByText('Tarea 2'));
            expect(columnasEstado[1]).toContainElement( screen.findByText('Tarea 5'));
            expect(columnasEstado[2]).toContainElement( screen.findByText('Tarea 3'));
        });
    });
});