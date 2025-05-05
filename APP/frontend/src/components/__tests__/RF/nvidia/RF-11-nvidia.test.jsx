// /home/jesus/python/TFG/APP/frontend/src/components/__tests__/RF/nvidia/RF-11-nvidia.test.jsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Home from '../../../Home';
import api from '../../../../api';

vi.mock('../../../../api');

describe('RF-11: Buscador de Tareas', () => {
    beforeEach(() => {
        // Mockear la API para retornar tareas de ejemplo
        vi.mocked(api.get).mockImplementation((url) => {
            if (url === '/api/tareas/') {
                return Promise.resolve({
                    data: [
                        { id: 1, titulo: 'Tarea Importante', descripcion: 'Esta es una tarea muy importante' },
                        { id: 2, titulo: 'Otra Tarea', descripcion: 'Esta es otra tarea con "Importante" en la descripción: Important' },
                        { id: 3, titulo: 'Tarea Sin Coincidencia', descripcion: 'No hay coincidencia here' }
                    ]
                });
            }
            return Promise.resolve({ data: [] });
        });
    });

    it('debe mostrar todas las tareas cuando no hay búsqueda', async () => {
        render(<Home />);
        await waitFor(() => expect(screen.getByText('Lista de Tareas')).toBeInTheDocument());

        const tareaElements = await screen.findAllByRole('listitem');
        expect(tareaElements).toHaveLength(3); // Esperamos 3 tareas
    });

    it('debe filtrar tareas por título al buscar una palabra clave', async () => {
        render(<Home />);
        await waitFor(() => expect(screen.getByText('Lista de Tareas')).toBeInTheDocument());

        const busquedaInput = await screen.getByPlaceholderText('Buscar tareas...');
        fireEvent.change(busquedaInput, { target: { value: 'Importante' } });
        fireEvent.blur(busquedaInput); // Blur para activar el filtrado

        const tareaElements = await screen.findAllByRole('listitem');
        expect(tareaElements).toHaveLength(1); // Solo la primera tarea debe coincidir
        expect(screen.getByText('Tarea Importante')).toBeInTheDocument();
    });

    it('debe filtrar tareas por descripción al buscar una palabra clave', async () => {
        render(<Home />);
        await waitFor(() => expect(screen.getByText('Lista de Tareas')).toBeInTheDocument());

        const busquedaInput = await screen.getByPlaceholderText('Buscar tareas...');
        fireEvent.change(busquedaInput, { target: { value: 'Importante' } });
        fireEvent.blur(busquedaInput); // Blur para activar el filtrado

        const tareaElements = await screen.findAllByRole('listitem');
        expect(tareaElements).toHaveLength(2); // Dos tareas deben coincidir
        expect(screen.getByText('Tarea Importante')).toBeInTheDocument();
        expect(screen.getByText('Otra Tarea')).toBeInTheDocument();
    });

    it('debe mostrar un listado vacío cuando la búsqueda no encuentra coincidencias', async () => {
        render(<Home />);
        await waitFor(() => expect(screen.getByText('Lista de Tareas')).toBeInTheDocument());

        const busquedaInput = await screen.getByPlaceholderText('Buscar tareas...');
        fireEvent.change(busquedaInput, { target: { value: 'NoExisteNinguna' } });
        fireEvent.blur(busquedaInput); // Blur para activar el filtrado

        const tareaElements = await screen.queryAllByRole('listitem');
        expect(tareaElements).toHaveLength(0); // Ninguna tarea debe coincidir
    });
});