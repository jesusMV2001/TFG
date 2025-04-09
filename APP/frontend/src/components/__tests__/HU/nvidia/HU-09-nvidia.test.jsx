// /home/jesus/python/TFG/APP/frontend/src/components/__tests__/HU/nvidia/HU-09-nvidia.test.jsx

import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Home from '../../../Home';
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

describe('HU-09: Busqueda de Tareas', () => {
    it('mostrar solo tareas con palabra clave en título o descripción', async () => {
        // Mockear respuesta de API con tareas
        const tareas = [
            { id: 1, titulo: 'Tarea 1 con palabras clave', descripcion: 'Descripción' },
            { id: 2, titulo: 'Otra tarea', descripcion: 'Descripción con palabras clave' },
            { id: 3, titulo: 'Tarea sincoinsidencia', descripcion: 'Sin coincidencia' },
        ];
        vi.mocked(api.get).mockResolvedValueOnce({ data: tareas });

        // Renderizar componente Home
        render(<BrowserRouter><Home /></BrowserRouter>);

        // Esperar a que se carguen las tareas
        await waitFor(() => screen.getByText('Tarea 1 con palabras clave'));

        // Ingresar palabra clave en la búsqueda
        const searchInput = screen.getByPlaceholderText('Buscar tareas...');
        fireEvent.change(searchInput, { target: { value: 'palabras clave' } });

        // Esperar a que se filtre el listado de tareas
        await waitFor(() => screen.getByText('Tarea 1 con palabras clave'));
        await waitFor(() => screen.getByText('Otra tarea'));

        // Verificar que se muestra solo las tareas con la palabra clave
        expect(screen.queryByText('Tarea sincoinsidencia')).not.toBeInTheDocument();
    });
});