// /home/jesus/python/TFG/APP/frontend/src/components/__tests__/RF/gemini/RF-04-gemini.test.jsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import UsuarioForm from '../../../UsuarioForm';
import api from '../../../../api';
import { BrowserRouter, useNavigate } from 'react-router-dom';
import Home from '../../../../pages/Home';

vi.mock('../../../../api');

describe('RF-04: Inicio y cierre de sesión', () => {
  it('permite al usuario iniciar sesión correctamente', async () => {
    const mockNavigate = vi.fn();
    vi.mock('react-router-dom', async () => {
      const actual = await vi.importActual('react-router-dom');
      return {
        ...actual,
        useNavigate: () => mockNavigate,
      };
    });
    api.post.mockResolvedValue({ data: { access: 'fake_access_token', refresh: 'fake_refresh_token' } });

    render(
      <BrowserRouter>
        <UsuarioForm route="/api/token/" method="login" />
      </BrowserRouter>
    );

    const usernameInput = screen.getByPlaceholderText('Username');
    const passwordInput = screen.getByPlaceholderText('Password');
    const loginButton = screen.getByText('Login');

    fireEvent.change(usernameInput, { target: { value: 'testuser' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(loginButton);

    await waitFor(() => {
      expect(api.post).toHaveBeenCalledWith('/api/token/', { username: 'testuser', password: 'password123' });
      expect(localStorage.setItem).toHaveBeenCalledWith('access_token', 'fake_access_token');
      expect(localStorage.setItem).toHaveBeenCalledWith('refresh_token', 'fake_refresh_token');
      expect(mockNavigate).toHaveBeenCalledWith('/');
    });
  });

  it('muestra un error si las credenciales de inicio de sesión son incorrectas', async () => {
    api.post.mockRejectedValue({ response: { data: { error: 'Credenciales inválidas' } } });

    render(
      <BrowserRouter>
        <UsuarioForm route="/api/token/" method="login" />
      </BrowserRouter>
    );

    const usernameInput = screen.getByPlaceholderText('Username');
    const passwordInput = screen.getByPlaceholderText('Password');
    const loginButton = screen.getByText('Login');

    fireEvent.change(usernameInput, { target: { value: 'wronguser' } });
    fireEvent.change(passwordInput, { target: { value: 'wrongpassword' } });
    fireEvent.click(loginButton);

    await waitFor(() => {
      expect(screen.getByText('Credenciales inválidas')).toBeVisible();
    });
  });

  it('permite al usuario cerrar sesión correctamente', () => {
    localStorage.setItem('access_token', 'test_access_token');
    localStorage.setItem('refresh_token', 'test_refresh_token');

    const mockNavigate = vi.fn();
    vi.mock('react-router-dom', async () => {
      const actual = await vi.importActual('react-router-dom');
      return {
        ...actual,
        useNavigate: () => mockNavigate,
        Navigate: ({to}) => <div>Navigate to: {to}</div>,
      };
    });

    render(
      <BrowserRouter>
          <Home />
      </BrowserRouter>
    );

    const logoutButton = screen.getByText('Cerrar Sesión');
    fireEvent.click(logoutButton);

    expect(localStorage.clear).toHaveBeenCalled();
  });
});