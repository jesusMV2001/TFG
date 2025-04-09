// /home/jesus/python/TFG/APP/frontend/src/components/__tests__/HU/nvidia/HU-05-nvidia.test.jsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import TareaForm from '../../../TareaForm';
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

describe('HU-05: Editar tarea', () => {
    const initialData = {
        id: 1,
        titulo: 'Tarea de ejemplo',
        descripcion: 'Descripción de ejemplo',
        estado: 'pendiente',
        prioridad: 'media',
        fecha_vencimiento: '2024-03-16',
    };

    it('Editar tarea con éxito', async () => {
        // Mockear API
        const apiPatch = vi.fn(() => Promise.resolve({ status: 200 }));
        api.updateTarea = apiPatch;

        render(
            <BrowserRouter>
                <TareaForm
                    onAddTarea={vi.fn()}
                    initialData={initialData}
                    showToast={vi.fn()}
                />
            </BrowserRouter>
        );

        // Rellenar formulario
        const tituloInput = screen.getByLabelText('Título');
        fireEvent.change(tituloInput, { target: { value: 'Nuevo título' } });

        const descripcionInput = screen.getByLabelText('Descripción');
        fireEvent.change(descripcionInput, { target: { value: 'Nueva descripción' } });

        // Enviar formulario
        const guardarCambios-button = screen.getByText('Guardar Cambios');
        fireEvent.click(guardarCambios-button);

        // Esperar respuesta exitosa
        await waitFor(() => expect(apiPatch).toHaveBeenCalledTimes(1));

        // Verificar mensaje de éxito
        const successMessage = screen.getByText('Tarea actualizada exitosamente');
        expect(successMessage).toBeInTheDocument();
    });

    it('Editar tarea con error', async () => {
        // Mockear API
        const apiPatch = vi.fn(() => Promise.resolve({ status: 400, data: 'Error al actualizar' }));
        api.updateTarea = apiPatch;

        render(
            <BrowserRouter>
                <TareaForm
                    onAddTarea={vi.fn()}
                    initialData={initialData}
                    showToast={vi.fn()}
                />
            </BrowserRouter>
        );

        // Rellenar formulario
        const tituloInput = screen.getByLabelText('Título');
        fireEvent.change(tituloInput, { target: { value: 'Nuevo título' } });

        const descripcionInput = screen.getByLabelText('Descripción');
        fireEvent.change(descripcionInput, { target: { value: 'Nueva descripción' } });

        // Enviar formulario
        const guardarCambios-button = screen.getByText('Guardar Cambios');
        fireEvent.click(guardarCambios-button);

        // Esperar respuesta con error
        await waitFor(() => expect(apiPatch).toHaveBeenCalledTimes(1));

        // Verificar mensaje de error
        const errorMessage = screen.getByText('Error al actualizar');
        expect(errorMessage).toBeInTheDocument();
    });
});