// /home/jesus/python/TFG/APP/frontend/src/components/__tests__/HU/nvidia/HU-04-nvidia.test.jsx

import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Home from '../../../Home';
import api from '../../../../api';

vi.mock('../../../../api');

describe('HU-04: Ver tareas', () => {
  it('Muestra todas las tareas asociadas al usuario', async () => {
    // Mockear respuesta de API con tareas de ejemplo
    const mockTareas = [
      { id: 1, titulo: 'Tarea 1', estado: 'pendiente' },
      { id: 2, titulo: 'Tarea 2', estado: 'en_progreso' },
      { id: 3, titulo: 'Tarea 3', estado: 'completada' },
    ];
    api.get.mockResolvedValue({ data: mockTareas });

    render(
      <BrowserRouter>
        <Home />
      </BrowserRouter>
    );

    // Esperar a que se-rendericen las tareas
    await waitFor(() => screen.getByText('Tarea 1'));

    // Verificar que se muestren todas las tareas
    expect(screen.getByText('Tarea 1')).toBeInTheDocument();
    expect(screen.getByText('Tarea 2')).toBeInTheDocument();
    expect(screen.getByText('Tarea 3')).toBeInTheDocument();
  });

  it('Agrupa tareas por estado', async () => {
    // Mockear respuesta de API con tareas de ejemplo
    const mockTareas = [
      { id: 1, titulo: 'Tarea 1', estado: 'pendiente' },
      { id: 2, titulo: 'Tarea 2', estado: 'en_progreso' },
      { id: 3, titulo: 'Tarea 3', estado: 'en_progreso' },
      { id: 4, titulo: 'Tarea 4', estado: 'completada' },
    ];
    api.get.mockResolvedValue({ data: mockTareas });

    render(
      <BrowserRouter>
        <Home />
      </BrowserRouter>
    );

    // Esperar a que se-rendericen las tareas
    await waitFor(() => screen.getByText('Tarea 1'));

    // Verificar que las tareas estén agrupadas por estado
    const pendientes = screen.getByRole('heading', { name: 'Pendientes' }).closest('div');
    const enProgreso = screen.getByRole('heading', { name: 'En Progreso' }).closest('div');
    const completadas = screen.getByRole('heading', { name: 'Completadas' }).closest('div');

    expect(pendientes).toContainElement(screen.getByText('Tarea 1'));
    expect(enProgreso).toContainElements([screen.getByText('Tarea 2'), screen.getByText('Tarea 3')]);
    expect(completadas).toContainElement(screen.getByText('Tarea 4'));
  });
});