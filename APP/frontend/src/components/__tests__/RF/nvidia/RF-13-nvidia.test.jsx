// /home/jesus/python/TFG/APP/frontend/src/components/__tests__/RF/nvidia/RF-13-nvidia.test.jsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Tarea from '../../../Tarea';
import ModalTarea from '../../../ModalTarea';
import ComentariosList from '../../../ComentariosList';
import api from '../../../../api';

vi.mock('../../../../api');

describe('RF-13 - Historial de modificaciones', () => {
  const tarea = {
    id: 1,
    titulo: 'Tarea de prueba',
    fecha_creacion: '2024-03-16T14:30:00',
    estado: 'pendiente',
    prioridad: 'media',
    fecha_vencimiento: '2024-03-20T14:30:00',
    descripcion: 'Descripcion de la tarea',
    historial: [
      {
        id: 1,
        accion: 'Creación de tarea',
        usuario: 'Juan Pérez',
        fecha_cambio: '2024-03-16T14:30:00',
      },
      {
        id: 2,
        accion: 'Actualización de estado',
        usuario: 'María García',
        fecha_cambio: '2024-03-17T10:00:00',
      },
    ],
  };

  const historiaCambio = {
    id: 3,
    accion: 'Actualización de prioridad',
    usuario: 'Juan Pérez',
    fecha_cambio: '2024-03-18T12:00:00',
  };

  vi.mocked(api.get).mockImplementation((url) => {
    if (url.includes('/api/tareas/')) {
      return Promise.resolve({ data: tarea});
    }
    if (url.includes('/api/tareas/historial/')) {
      return Promise.resolve({ data: [historiaCambio] });
    }
    return Promise.resolve({});
  });

  it('Muestra la fecha y hora de la acción', async () => {
    render(
      <BrowserRouter>
        <Tarea tarea={tarea} onDelete={vi.fn()} onUpdate={vi.fn()} onDragStart={vi.fn()} />
      </BrowserRouter>
    );

    // Abrir modal para ver detalles de la tarea
    fireEvent.click(screen.getByText('Ver detalles'));

    await waitFor(() => screen.getByText('Historial de Cambios'));

    tarea.historial.forEach((cambio) => {
      expect(screen.getByText(new Date(cambio.fecha_cambio).toLocaleString())).toBeInTheDocument();
    });
  });

  it('Muestra el usuario que realizó la modificación', async () => {
    render(
      <BrowserRouter>
        <Tarea tarea={tarea} onDelete={vi.fn()} onUpdate={vi.fn()} onDragStart={vi.fn()} />
      </BrowserRouter>
    );

    // Abrir modal para ver detalles de la tarea
    fireEvent.click(screen.getByText('Ver detalles'));

    await waitFor(() => screen.getByText('Historial de Cambios'));

    tarea.historial.forEach((cambio) => {
      expect(screen.getByText(cambio.usuario)).toBeInTheDocument();
    });
  });

  it('Muestra la acción realizada', async () => {
    render(
      <BrowserRouter>
        <Tarea tarea={tarea} onDelete={vi.fn()} onUpdate={vi.fn()} onDragStart={vi.fn()} />
      </BrowserRouter>
    );

    // Abrir modal para ver detalles de la tarea
    fireEvent.click(screen.getByText('Ver detalles'));

    await waitFor(() => screen.getByText('Historial de Cambios'));

    tarea.historial.forEach((cambio) => {
      expect(screen.getByText(cambio.accion)).toBeInTheDocument();
    });
  });

  it('Actualiza el historial después de una nueva modificación', async () => {
    render(
      <BrowserRouter>
        <Tarea tarea={tarea} onDelete={vi.fn()} onUpdate={vi.fn()} onDragStart={vi.fn()} />
      </BrowserRouter>
    );

    // Abrir modal para ver detalles de la tarea
    fireEvent.click(screen.getByText('Ver detalles'));

    await waitFor(() => screen.getByText('Historial de Cambios'));

    // Simular una nueva modificación
    vi.mocked(api.get).mockImplementation((url) => {
      if (url.includes('/api/tareas/historial/')) {
        return Promise.resolve({ data: [historiaCambio, ...tarea.historial] });
      }
      return Promise.resolve({});
    });

    // Refrescar el historial
    fireEvent.click(screen.getByText('Refrescar'));

    await waitFor(() => screen.getByText(historiaCambio.accion));

    expect(screen.getByText(new Date(historiaCambio.fecha_cambio).toLocaleString())).toBeInTheDocument();
    expect(screen.getByText(historiaCambio.usuario)).toBeInTheDocument();
    expect(screen.getByText(historiaCambio.accion)).toBeInTheDocument();
  });
});