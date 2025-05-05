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

describe('HU-11: Crear y asignar etiquetas', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        render(
            <BrowserRouter>
                <TareaForm onAddTarea={vi.fn()} initialData={{ id: 1 }} />
            </BrowserRouter>
        );
    });

    it('El usuario puede asignar y crear etiquetas para cada tarea.', async () => {
        // Simular respuesta exitosa al crear etiqueta
        vi.mocked(api.post).mockResolvedValueOnce({
            data: { id: 1, nombre: 'Nueva Etiqueta', tarea_id: 1 },
        });

        // Ingresar texto en el input de nueva etiqueta
        const nuevaEtiquetaInput = screen.getByPlaceholderText('Nueva etiqueta');
        fireEvent.change(nuevaEtiquetaInput, { target: { value: 'Nueva Etiqueta' } });

        // Presionar el botón para crear la nueva etiqueta
        const crearEtiquetaButton = screen.getByText('Crear Etiqueta');
        fireEvent.click(crearEtiquetaButton);

        // Esperar a que se muestre la etiqueta recién creada
        await waitFor(() => {
            screen.getByText('Nueva Etiqueta');
        });

        // Verificar que se haya llamado al endpoint para crear la etiqueta
        expect(api.post).toHaveBeenCalledTimes(1);
        expect(api.post).toHaveBeenCalledWith('/api/etiquetas/', {
            nombre: 'Nueva Etiqueta',
            tarea_id: 1,
        });
    });

    it('El sistema debe mostrar un mensaje cuando se cree y asigne una etiqueta a una tarea.', async () => {
        // Simular respuesta exitosa al crear etiqueta
        vi.mocked(api.post).mockResolvedValueOnce({
            data: { id: 1, nombre: 'Nueva Etiqueta', tarea_id: 1 },
        });

        // Ingresar texto en el input de nueva etiqueta
        const nuevaEtiquetaInput = screen.getByPlaceholderText('Nueva etiqueta');
        fireEvent.change(nuevaEtiquetaInput, { target: { value: 'Nueva Etiqueta' } });

        // Presionar el botón para crear la nueva etiqueta
        const crearEtiquetaButton = screen.getByText('Crear Etiqueta');
        fireEvent.click(crearEtiquetaButton);

        // Esperar a que se muestre el mensaje de éxito
        await waitFor(() => {
            screen.getByText('Etiqueta creada exitosamente');
        });

        // Verificar que el mensaje esté presente en el documento
        expect(screen.getByText('Etiqueta creada exitosamente')).toBeVisible();
    });
});