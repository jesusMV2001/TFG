// /home/jesus/python/TFG/APP/frontend/src/components/__tests__/HU/nvidia/HU-13-nvidia.test.jsx

import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ComentariosList from '../../../ComentariosList';
import api from '../../../../api';
import { BrowserRouter } from 'react-router-dom';
import { rest } from 'msw';
import { setupServer } from 'msw/node';

const server = setupServer(
  rest.post('/api/tareas/:tareaId/comentarios/', (req, res, ctx) => {
    return res(ctx.status(201), ctx.json({ id: 1, texto: 'Nuevo comentario' }));
  }),
  rest.get('/api/tareas/:tareaId/comentarios/', (req, res, ctx) => {
    return res(ctx.status(200), ctx.json([{ id: 1, texto: 'Comentario existente' }]));
  })
);

vi.mock('../../../../api', () => ({ ...api, post: server.post, get: server.get }));
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useParams: () => ({ tareaId: 1 }),
    useNavigate: () => vi.fn(),
  };
});

describe('HU-13: Crear comentarios', () => {
  it('Cada tarea debe contar con un espacio para que los usuarios anadan comentarios.', async () => {
    render(
      <BrowserRouter>
        <ComentariosList tareaId={1} onClose={vi.fn()} />
      </BrowserRouter>
    );

    await screen.findByPlaceholderText('Escribe un comentario...');
  });

  it('El comentario no debe estar vacio', async () => {
    render(
      <BrowserRouter>
        <ComentariosList tareaId={1} onClose={vi.fn()} />
      </BrowserRouter>
    );

    const textarea = await screen.findByPlaceholderText('Escribe un comentario...');
    const enviarBtn = await screen.findByText('Comentar');

    fireEvent.change(textarea, { target: { value: '' } });
    fireEvent.click(enviarBtn);

    await screen.findByText('El comentario no puede estar vacío');
  });

  it('El sistema debe mostrar el comentario cuando se cree', async () => {
    render(
      <BrowserRouter>
        <ComentariosList tareaId={1} onClose={vi.fn()} />
      </BrowserRouter>
    );

    const textarea = await screen.findByPlaceholderText('Escribe un comentario...');
    const enviarBtn = await screen.findByText('Comentar');

    fireEvent.change(textarea, { target: { value: 'Nuevo comentario' } });
    fireEvent.click(enviarBtn);

    await waitFor(() => screen.findByText('Nuevo comentario'));
  });

  it('El sistema debe mostrar un mensaje de error cuando el comentario este vacio', async () => {
    render(
      <BrowserRouter>
        <ComentariosList tareaId={1} onClose={vi.fn()} />
      </BrowserRouter>
    );

    const enviarBtn = await screen.findByText('Comentar');

    fireEvent.click(enviarBtn);

    await screen.findByText('El comentario no puede estar vacío');
  });
});