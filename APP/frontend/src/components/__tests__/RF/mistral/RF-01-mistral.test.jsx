// /home/jesus/python/TFG/APP/frontend/src/components/__tests__/RF/mistral/RF-01-mistral.test.jsx
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

describe('RF-01: Registro de usuario', () => {
    it('debe mostrar el formulario de registro', () => {
        render(
            <BrowserRouter>
                <UsuarioForm route="/api/user/register/" method="register" />
            </BrowserRouter>
        );

        expect(screen.getByPlaceholderText('Username')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Email')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
        expect(screen.getByText('Register')).toBeInTheDocument();
    });

    it('debe mostrar un error si la contraseña tiene menos de 8 caracteres', async () => {
        render(
            <BrowserRouter>
                <UsuarioForm route="/api/user/register/" method="register" />
            </BrowserRouter>
        );

        fireEvent.change(screen.getByPlaceholderText('Username'), { target: { value: 'testuser' } });
        fireEvent.change(screen.getByPlaceholderText('Email'), { target: { value: 'test@example.com' } });
        fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: '12345' } });
        fireEvent.click(screen.getByText('Register'));

        await waitFor(() => {
            expect(screen.getByText('La contraseña debe tener al menos 8 caracteres.')).toBeInTheDocument();
        });
    });

    it('debe registrar al usuario con éxito y redirigir a la página principal', async () => {
        api.post.mockResolvedValueOnce({ data: { access: 'fake_access_token', refresh: 'fake_refresh_token' } });

        render(
            <BrowserRouter>
                <UsuarioForm route="/api/user/register/" method="register" />
            </BrowserRouter>
        );

        fireEvent.change(screen.getByPlaceholderText('Username'), { target: { value: 'testuser' } });
        fireEvent.change(screen.getByPlaceholderText('Email'), { target: { value: 'test@example.com' } });
        fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: '12345678' } });
        fireEvent.click(screen.getByText('Register'));

        await waitFor(() => {
            expect(api.post).toHaveBeenCalledWith('/api/user/register/', {
                username: 'testuser',
                email: 'test@example.com',
                password: '12345678',
            });
            expect(localStorage.getItem('access_token')).toBe('fake_access_token');
            expect(localStorage.getItem('refresh_token')).toBe('fake_refresh_token');
            // Check if navigate was called
            expect(vi.mocked(useNavigate).mock.calls[0][0]).toBe('/');
        });
    });

    it('debe mostrar un error si el registro falla', async () => {
        api.post.mockRejectedValueOnce({ response: { data: { error: 'Error en el registro' } } });

        render(
            <BrowserRouter>
                <UsuarioForm route="/api/user/register/" method="register" />
            </BrowserRouter>
        );

        fireEvent.change(screen.getByPlaceholderText('Username'), { target: { value: 'testuser' } });
        fireEvent.change(screen.getByPlaceholderText('Email'), { target: { value: 'test@example.com' } });
        fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: '12345678' } });
        fireEvent.click(screen.getByText('Register'));

        await waitFor(() => {
            expect(screen.getByText('Error en el registro')).toBeInTheDocument();
        });
    });
});