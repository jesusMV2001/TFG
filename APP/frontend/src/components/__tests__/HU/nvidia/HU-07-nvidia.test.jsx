// /home/jesus/python/TFG/APP/frontend/src/components/__tests__/HU/nvidia/HU-07-nvidia.test.jsx

import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Home from '../../../../Home';
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

describe('HU-07 - Marcado de Tareas Completadas', () => {
    it('cambia el estado de la tarea a "completada" al marcarla como completada', async () => {
        // Mockear API para obtener tareas y actualizar estado
        const tarea = { id: 1, titulo: 'Tarea de prueba', estado: 'pendiente' };
        const tareas = [tarea];
        api.get.mockResolvedValueOnce({ data: tareas });
        api.put.mockResolvedValueOnce({ status: 200 });

        // Renderizar componente Home
        render(
            <BrowserRouter>
                <Home />
            </BrowserRouter>
        );

        // Esperar a que se carguen las tareas
        await waitFor(() => screen.getByText(tarea.titulo));

        // Simular clic en boton de completar tarea
        const completarBoton = screen.getByRole('button', { name: 'Completar' });
        fireEvent.click(completarBoton);

        // Verificar que el estado de la tarea haya cambiar a "completada"
        await waitFor(() => screen.getByText('Completada'));
        expect(screen.getByText('Completada')).toBeInTheDocument();
    });
});