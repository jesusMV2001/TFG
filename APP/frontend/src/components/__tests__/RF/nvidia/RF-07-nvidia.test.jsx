// /home/jesus/python/TFG/APP/frontend/src/components/__tests__/RF/nvidia/RF-07-nvidia.test.jsx
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

describe('RF-07: Edición de tarea existente', () => {
    const initialData = {
        id: 1,
        titulo: 'Título original',
        descripcion: 'Descripción original',
        estado: 'pendiente',
        prioridad: 'media',
        fecha_vencimiento: '2024-03-16',
        etiquetas: [{ id: 1, nombre: 'Etiqueta 1' }]
    };

    it('debe mostrar los datos iniciales en el formulario', async () => {
        render(
            <BrowserRouter>
                <TareaForm onAddTarea={vi.fn()} initialData={initialData} />
            </BrowserRouter>
        );

        await waitFor(() => {
            expect(screen.getByDisplayValue(initialData.titulo)).toBeDefined();
            expect(screen.getByDisplayValue(initialData.descripcion)).toBeDefined();
            expect(screen.getByDisplayValue(initialData.estado)).toBeDefined();
            expect(screen.getByDisplayValue(initialData.prioridad)).toBeDefined();
            expect(screen.getByDisplayValue(initialData.fecha_vencimiento)).toBeDefined();
            expect(screen.getByText(initialData.etiquetas[0].nombre)).toBeDefined();
        });
    });

    it('debe permitir editar el título de la tarea', async () => {
        render(
            <BrowserRouter>
                <TareaForm onAddTarea={vi.fn()} initialData={initialData} />
            </BrowserRouter>
        );

        const tituloInput = screen.getByDisplayValue(initialData.titulo);
        const nuevoTitulo = 'Título nuevo';

        fireEvent.change(tituloInput, { target: { value: nuevoTitulo } });

        await waitFor(() => {
            expect(tituloInput).toHaveValue(nuevoTitulo);
        });
    });

    it('debe permitir editar la descripción de la tarea', async () => {
        render(
            <BrowserRouter>
                <TareaForm onAddTarea={vi.fn()} initialData={initialData} />
            </BrowserRouter>
        );

        const descripcionInput = screen.getByDisplayValue(initialData.descripcion);
        const nuevaDescripcion = 'Descripción nueva';

        fireEvent.change(descripcionInput, { target: { value: nuevaDescripcion } });

        await waitFor(() => {
            expect(descripcionInput).toHaveValue(nuevaDescripcion);
        });
    });

    it('debe permitir cambiar el estado de la tarea', async () => {
        render(
            <BrowserRouter>
                <TareaForm onAddTarea={vi.fn()} initialData={initialData} />
            </BrowserRouter>
        );

        const estadoSelect = screen.getByDisplayValue(initialData.estado);
        const nuevoEstado = 'en_progreso';

        fireEvent.change(estadoSelect, { target: { value: nuevoEstado } });

        await waitFor(() => {
            expect(estadoSelect).toHaveValue(nuevoEstado);
        });
    });

    it('debe permitir cambiar la prioridad de la tarea', async () => {
        render(
            <BrowserRouter>
                <TareaForm onAddTarea={vi.fn()} initialData={initialData} />
            </BrowserRouter>
        );

        const prioridadSelect = screen.getByDisplayValue(initialData.prioridad);
        const nuevaPrioridad = 'alta';

        fireEvent.change(prioridadSelect, { target: { value: nuevaPrioridad } });

        await waitFor(() => {
            expect(prioridadSelect).toHaveValue(nuevaPrioridad);
        });
    });

    it('debe permitir cambiar la fecha de vencimiento de la tarea', async () => {
        render(
            <BrowserRouter>
                <TareaForm onAddTarea={vi.fn()} initialData={initialData} />
            </BrowserRouter>
        );

        const fechaVencimientoInput = screen.getByDisplayValue(initialData.fecha_vencimiento);
        const nuevaFechaVencimiento = '2024-04-16';

        fireEvent.change(fechaVencimientoInput, { target: { value: nuevaFechaVencimiento } });

        await waitFor(() => {
            expect(fechaVencimientoInput).toHaveValue(nuevaFechaVencimiento);
        });
    });

    it('debe llamar a la función onAddTarea con los datos actualizados al guardar cambios', async () => {
        const onAddTarea = vi.fn();
        const nuevoTitulo = 'Título nuevo';
        const nuevaDescripcion = 'Descripción nueva';
        const nuevoEstado = 'en_progreso';
        const nuevaPrioridad = 'alta';
        const nuevaFechaVencimiento = '2024-04-16';

        render(
            <BrowserRouter>
                <TareaForm onAddTarea={onAddTarea} initialData={initialData} />
            </BrowserRouter>
        );

        const tituloInput = screen.getByDisplayValue(initialData.titulo);
        const descripcionInput = screen.getByDisplayValue(initialData.descripcion);
        const estadoSelect = screen.getByDisplayValue(initialData.estado);
        const prioridadSelect = screen.getByDisplayValue(initialData.prioridad);
        const fechaVencimientoInput = screen.getByDisplayValue(initialData.fecha_vencimiento);
        const guardarCambiosButton = screen.getByText('Guardar Cambios');

        fireEvent.change(tituloInput, { target: { value: nuevoTitulo } });
        fireEvent.change(descripcionInput, { target: { value: nuevaDescripcion } });
        fireEvent.change(estadoSelect, { target: { value: nuevoEstado } });
        fireEvent.change(prioridadSelect, { target: { value: nuevaPrioridad } });
        fireEvent.change(fechaVencimientoInput, { target: { value: nuevaFechaVencimiento } });
        fireEvent.click(guardarCambiosButton);

        await waitFor(() => {
            expect(onAddTarea).toHaveBeenCalledTimes(1);
            expect(onAddTarea).toHaveBeenCalledWith({
                titulo: nuevoTitulo,
                descripcion: nuevaDescripcion,
                estado: nuevoEstado,
                prioridad: nuevaPrioridad,
                fecha_vencimiento: nuevaFechaVencimiento,
                etiquetas: initialData.etiquetas
            });
        });
    });
});