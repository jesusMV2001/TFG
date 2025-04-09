// /home/jesus/python/TFG/APP/frontend/src/components/__tests__/HU/nvidia/HU-11-nvidia.test.jsx

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

describe('HU-11 - Crear y asignar etiquetas', () => {
    it('permite asignar etiquetas a una tarea', async () => {
        const etiquetaMock = { id: 1, nombre: 'Etiqueta de prueba' };
        const tareaMock = { id: 1, etiquetas: [] };

        api.post.mockResolvedValue({ data: etiquetaMock });

        render(
            <BrowserRouter>
                <TareaForm initialData={tareaMock} onAddTarea={vi.fn()} showToast={vi.fn()} />
            </BrowserRouter>
        );

        const inputNuevaEtiqueta = screen.getByPlaceholderText('Nueva etiqueta');
        const botonCrearEtiqueta = screen.getByText('Crear Etiqueta');

        fireEvent.change(inputNuevaEtiqueta, { target: { value: 'Nueva Etiqueta' } });
        fireEvent.click(botonCrearEtiqueta);

        await waitFor(() => expect(api.post).toHaveBeenCalledTimes(1));
        expect(api.post).toHaveBeenCalledWith('/api/etiquetas/', expect.objectContaining({ nombre: 'Nueva Etiqueta', tarea_id: tareaMock.id }));

        const etiquetaCreada = await screenfindByText('Nueva Etiqueta');
        expect(etiquetaCreada).toBeInTheDocument();
    });

    it('muestra un mensaje al crear y asignar una etiqueta', async () => {
        const showToastMock = vi.fn();
        const etiquetaMock = { id: 1, nombre: 'Etiqueta de prueba' };
        const tareaMock = { id: 1, etiquetas: [] };

        api.post.mockResolvedValue({ data: etiquetaMock });

        render(
            <BrowserRouter>
                <TareaForm initialData={tareaMock} onAddTarea={vi.fn()} showToast={showToastMock} />
            </BrowserRouter>
        );

        const inputNuevaEtiqueta = screen.getByPlaceholderText('Nueva etiqueta');
        const botonCrearEtiqueta = screen.getByText('Crear Etiqueta');

        fireEvent.change(inputNuevaEtiqueta, { target: { value: 'Nueva Etiqueta' } });
        fireEvent.click(botonCrearEtiqueta);

        await waitFor(() => expect(showToastMock).toHaveBeenCalledTimes(1));
        expect(showToastMock).toHaveBeenCalledWith('Etiqueta creada exitosamente', 'success');
    });
});