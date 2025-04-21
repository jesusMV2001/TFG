// /home/jesus/python/TFG/APP/frontend/src/components/__tests__/HU/nvidia/HU-01-nvidia.test.jsx

import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import UsuarioForm from '../../../UsuarioForm';
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

describe('HU-01: Registro de Usuarios', () => {
  it('Campo vacío: nombre de usuario', async () => {
    render(
      <BrowserRouter>
        <UsuarioForm route="/api/user/register/" method="register" />
      </BrowserRouter>
    );

    const submitButton = screen.getByRole('button', { name: 'Register' });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Este campo es obligatorio')).toBeInTheDocument();
    });
  });

  it('Campo vacío: correo electrónico', async () => {
    render(
      <BrowserRouter>
        <UsuarioForm route="/api/user/register/" method="register" />
      </BrowserRouter>
    );

    const usernameInput = screen.getByPlaceholderText('Username');
    fireEvent.change(usernameInput, { target: { value: 'testuser' } });

    const submitButton = screen.getByRole('button', { name: 'Register' });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Este campo es obligatorio')).toBeInTheDocument();
    });
  });

  it('Campo vacío: contraseña', async () => {
    render(
      <BrowserRouter>
        <UsuarioForm route="/api/user/register/" method="register" />
      </BrowserRouter>
    );

    const usernameInput = screen.getByPlaceholderText('Username');
    fireEvent.change(usernameInput, { target: { value: 'testuser' } });

    const emailInput = screen.getByPlaceholderText('Email');
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });

    const submitButton = screen.getByRole('button', { name: 'Register' });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Este campo es obligatorio')).toBeInTheDocument();
    });
  });

  it('Contraseña con menos de 8 caracteres', async () => {
    render(
      <BrowserRouter>
        <UsuarioForm route="/api/user/register/" method="register" />
      </BrowserRouter>
    );

    const usernameInput = screen.getByPlaceholderText('Username');
    fireEvent.change(usernameInput, { target: { value: 'testuser' } });

    const emailInput = screen.getByPlaceholderText('Email');
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });

    const passwordInput = screen.getByPlaceholderText('Password');
    fireEvent.change(passwordInput, { target: { value: 'short' } });

    const submitButton = screen.getByRole('button', { name: 'Register' });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('La contraseña debe tener al menos 8 caracteres.')).toBeInTheDocument();
    });
  });

  it('Correo electrónico ya registrado', async () => {
    vi.mocked(api.post).mockRejectedValueOnce({
      response: {
        data: { error: 'El correo electrónico ya está registrado.' },
      },
    });

    render(
      <BrowserRouter>
        <UsuarioForm route="/api/user/register/" method="register" />
      </BrowserRouter>
    );

    const usernameInput = screen.getByPlaceholderText('Username');
    fireEvent.change(usernameInput, { target: { value: 'testuser' } });

    const emailInput = screen.getByPlaceholderText('Email');
    fireEvent.change(emailInput, { target: { value: 'existing@example.com' } });

    const passwordInput = screen.getByPlaceholderText('Password');
    fireEvent.change(passwordInput, { target: { value: 'longpassword' } });

    const submitButton = screen.getByRole('button', { name: 'Register' });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('El correo electrónico ya está registrado.')).toBeInTheDocument();
    });
  });

  it('Nombre de usuario ya registrado', async () => {
    vi.mocked(api.post).mockRejectedValueOnce({
      response: {
        data: { error: 'El nombre de usuario ya está registrado.' },
      },
    });

    render(
      <BrowserRouter>
        <UsuarioForm route="/api/user/register/" method="register" />
      </BrowserRouter>
    );

    const usernameInput = screen.getByPlaceholderText('Username');
    fireEvent.change(usernameInput, { target: { value: 'existinguser' } });

    const emailInput = screen.getByPlaceholderText('Email');
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });

    const passwordInput = screen.getByPlaceholderText('Password');
    fireEvent.change(passwordInput, { target: { value: 'longpassword' } });

    const submitButton = screen.getByRole('button', { name: 'Register' });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('El nombre de usuario ya está registrado.')).toBeInTheDocument();
    });
  });
});