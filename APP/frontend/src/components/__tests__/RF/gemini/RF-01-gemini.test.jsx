// /home/jesus/python/TFG/APP/frontend/src/components/__tests__/RF/gemini/RF-01-gemini.test.jsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import UsuarioForm from '../../../UsuarioForm';
import api from '../../../../api';
import { BrowserRouter, useNavigate } from 'react-router-dom';

vi.mock('../../../../api');

describe('RF-01: Registro de usuario', () => {
  it('Debería permitir registrar un usuario con email, nombre de usuario y contraseña', async () => {
    const mockNavigate = vi.fn();
    vi.mock('react-router-dom', async () => {
      const actual = await vi.importActual('react-router-dom');
      return {
        ...actual,
        useNavigate: () => mockNavigate,
      };
    });

    api.post.mockResolvedValue({ data: { access: 'mockAccessToken', refresh: 'mockRefreshToken' } });

    render(
      <BrowserRouter>
        <UsuarioForm route="/api/user/register/" method="register" />
      </BrowserRouter>
    );

    const usernameInput = screen.getByPlaceholderText('Username');
    const emailInput = screen.getByPlaceholderText('Email');
    const passwordInput = screen.getByPlaceholderText('Password');
    const registerButton = screen.getByText('Register');

    fireEvent.change(usernameInput, { target: { value: 'testuser' } });
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'securePassword' } });
    fireEvent.click(registerButton);

    await waitFor(() => {
      expect(api.post).toHaveBeenCalledWith('/api/user/register/', {
        username: 'testuser',
        email: 'test@example.com',
        password: 'securePassword',
      });
    });

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/');
    });
  });

  it('Debería mostrar un error si la contraseña es demasiado corta', async () => {
    const mockNavigate = vi.fn();
    vi.mock('react-router-dom', async () => {
      const actual = await vi.importActual('react-router-dom');
      return {
        ...actual,
        useNavigate: () => mockNavigate,
      };
    });
    render(
      <BrowserRouter>
        <UsuarioForm route="/api/user/register/" method="register" />
      </BrowserRouter>
    );

    const usernameInput = screen.getByPlaceholderText('Username');
    const emailInput = screen.getByPlaceholderText('Email');
    const passwordInput = screen.getByPlaceholderText('Password');
    const registerButton = screen.getByText('Register');

    fireEvent.change(usernameInput, { target: { value: 'testuser' } });
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'short' } });
    fireEvent.click(registerButton);

    await waitFor(() => {
      expect(screen.getByText('La contraseña debe tener al menos 8 caracteres.')).toBeVisible();
    });

    expect(api.post).not.toHaveBeenCalled();
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it('Debería mostrar un error si el registro falla debido a un error del servidor', async () => {
    const mockNavigate = vi.fn();
    vi.mock('react-router-dom', async () => {
      const actual = await vi.importActual('react-router-dom');
      return {
        ...actual,
        useNavigate: () => mockNavigate,
      };
    });
    api.post.mockRejectedValue({ response: { data: { error: 'Registration failed' } } });

    render(
      <BrowserRouter>
        <UsuarioForm route="/api/user/register/" method="register" />
      </BrowserRouter>
    );

    const usernameInput = screen.getByPlaceholderText('Username');
    const emailInput = screen.getByPlaceholderText('Email');
    const passwordInput = screen.getByPlaceholderText('Password');
    const registerButton = screen.getByText('Register');

    fireEvent.change(usernameInput, { target: { value: 'testuser' } });
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'securePassword' } });
    fireEvent.click(registerButton);

    await waitFor(() => {
      expect(screen.getByText('Registration failed')).toBeVisible();
    });

    expect(mockNavigate).not.toHaveBeenCalled();
  });
});