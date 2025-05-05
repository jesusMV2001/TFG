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

const tareaInitial = {
    id: 1,
    titulo: 'Tarea inicial',
    descripcion: 'Descripción inicial',
    estado: 'pendiente',
    prioridad: 'media',
    fecha_vencimiento: '2024-03-16',
    etiquetas: []
};

describe('HU-05: Editar tarea', () => {
    it('Permite modificar campos y guardar cambios con éxito', async () => {
        // Mockear API para retornar éxito al actualizar tarea
        vi.mocked(api.put).mockResolvedValueOnce({ status: 200, data: { message: 'Tarea actualizada' } });

        // Renderizar componente con datos iniciales de tarea
        render(
            <BrowserRouter>
                <TareaForm onAddTarea={vi.fn()} initialData={tareaInitial} />
            </BrowserRouter>
        );

        // Simular cambios en los campos
        const tituloInput = screen.getByLabelText('Título');
        const descripcionInput = screen.getByLabelText('Descripción');
        const estadoSelect = screen.getByLabelText('Estado');
        const prioridadSelect = screen.getByLabelText('Prioridad');
        const fechaVencimientoInput = screen.getByLabelText('Fecha de Vencimiento');

        fireEvent.change(tituloInput, { target: { value: 'Título modificado' } });
        fireEvent.change(descripcionInput, { target: { value: 'Descripción modificada' } });
        fireEvent.change(estadoSelect, { target: { value: 'en_progreso' } });
        fireEvent.change(prioridadSelect, { target: { value: 'alta' } });
        fireEvent.change(fechaVencimientoInput, { target: { value: '2024-04-16' } });

        // Simular envío del formulario
        const guardarButton = screen.getByRole('button', { name: 'Guardar Cambios' });
        fireEvent.click(guardarButton);

        // Esperar y verificar mensaje de éxito
        await waitFor(() => screen.getByText('Tarea actualizada'));
        expect(screen.getByText('Tarea actualizada')).toBeInTheDocument();
    });

    it('Muestra mensaje de error al fallar la actualización', async () => {
        // Mockear API para retornar error al actualizar tarea
        vi.mocked(api.put).mockRejectedValueOnce({ response: { status: 400, data: { error: 'Error al actualizar' } } });

        // Renderizar componente con datos iniciales de tarea
        render(
            <BrowserRouter>
                <TareaForm onAddTarea={vi.fn()} initialData={tareaInitial} />
            </BrowserRouter>
        );

        // Simular cambios en los campos
        const tituloInput = screen.getByLabelText('Título');
        fireEvent.change(tituloInput, { target: { value: 'Título modificado' } });

        // Simular envío del formulario
        const guardarButton = screen.getByRole('button', { name: 'Guardar Cambios' });
        fireEvent.click(guardarButton);

        // Esperar y verificar mensaje de error
        await waitFor(() => screen.getByText('Error al actualizar'));
        expect(screen.getByText('Error al actualizar')).toBeInTheDocument();
    });
});