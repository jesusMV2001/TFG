// /home/jesus/python/TFG/APP/frontend/src/components/__tests__/HU/nvidia/HU-12-nvidia.test.jsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import TareaForm from '../../../TareaForm';
import api from '../../../../api';
import { BrowserRouter } from 'react-router-dom';
import { within } from '@testing-library/react';

vi.mock('../../../../api');
vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom');
    return {
        ...actual,
        useNavigate: () => vi.fn(),
    };
});

describe('HU-12: Eliminar etiquetas', () => {
    beforeEach(() => {
        // Mock de API para devolver una tarea con etiquetas
        vi.mocked(api).get.mockResolvedValue({
            data: {
                id: 1,
                titulo: 'Tarea de prueba',
                etiquetas: [
                    { id: 1, nombre: 'Etiqueta 1' },
                    { id: 2, nombre: 'Etiqueta 2' },
                ],
            },
        });
    });

    it('El usuario puede eliminar etiquetas para cada tarea', async () => {
        const { getByText, getByRole } = render(
            <BrowserRouter>
                <TareaForm onAddTarea={vi.fn()} initialData={{ id: 1 }} />
            </BrowserRouter>
        );

        // Acceder a la lista de etiquetas
        const etiquetasList = await screen.findByRole('list', { name: 'Etiquetas' });
        const { getAllByRole } = within(etiquetasList);

        // Obtener botones de eliminar
        const deleteButtons = getAllByRole('button', { name: 'Eliminar' });

        // Simular clicks en los botones de eliminar
        for (const button of deleteButtons) {
            fireEvent.click(button);
        }

        // Verificar que las etiquetas hayan desaparecido
        await waitFor(() => {
            expect(getAllByRole('listitem')).toHaveLength(0);
        });
    });

    it('El sistema debe mostrar un mensaje cuando se elimine una etiqueta de una tarea', async () => {
        vi.mocked(api).delete.mockResolvedValue({ status: 204 });

        const { getByText, getByRole } = render(
            <BrowserRouter>
                <TareaForm onAddTarea={vi.fn()} initialData={{ id: 1 }} />
            </BrowserRouter>
        );

        // Acceder a la lista de etiquetas
        const etiquetasList = await screen.findByRole('list', { name: 'Etiquetas' });
        const { getAllByRole } = within(etiquetasList);

        // Obtener botones de eliminar
        const deleteButtons = getAllByRole('button', { name: 'Eliminar' });

        // Simular click en el primer botón de eliminar
        fireEvent.click(deleteButtons[0]);

        // Esperar a que aparezca el mensaje de confirmación
        const toast = await screen.findByRole('alert');

        // Verificar el mensaje
        expect(toast).toHaveTextContent('Etiqueta eliminada exitosamente');
    });
});