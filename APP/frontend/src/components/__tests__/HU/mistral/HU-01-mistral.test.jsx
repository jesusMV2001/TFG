```javascript
// /home/jesus/python/TFG/APP/frontend/src/components/__tests__/HU/mistral/HU-01-mistral.test.jsx
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
    it('El usuario puede ingresar un nombre, correo y contraseña', async () => {
        render(<UsuarioForm route="/api/user/register/" method="register" />, { wrapper: BrowserRouter });

        const usernameInput = screen.getByPlaceholderText('Username');
        const emailInput = screen.getByPlaceholderText('Email');
        const passwordInput = screen.getByPlaceholderText('Password');
        const submitButton = screen.getByText('Register');

        fireEvent.change(usernameInput, { target: { value: 'testuser' } });
        fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
        fireEvent.change(passwordInput, { target: { value: 'password123' } });

        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(api.post).toHaveBeenCalledWith('/api/user/register/', {
                username: 'testuser',
                email: 'test@example.com',
                password: 'password123',
            });
        });
    });

    it('Ningún campo debe estar vacío', async () => {
        render(<UsuarioForm route="/api/user/register/" method="register" />, { wrapper: BrowserRouter });

        const submitButton = screen.getByText('Register');

        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(screen.getByText('Todos los campos son obligatorios.')).toBeInTheDocument();
        });
    });

    it('La contraseña debe tener un mínimo de 8 caracteres', async () => {
        render(<UsuarioForm route="/api/user/register/" method="register" />, { wrapper: BrowserRouter });

        const usernameInput = screen.getByPlaceholderText('Username');
        const emailInput = screen.getByPlaceholderText('Email');
        const passwordInput = screen.getByPlaceholderText('Password');
        const submitButton = screen.getByText('Register');

        fireEvent.change(usernameInput, { target: { value: 'testuser' } });
        fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
        fireEvent.change(passwordInput, { target: { value: 'short' } });

        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(screen.getByText('La contraseña debe tener al menos 8 caracteres.')).toBeInTheDocument();
        });
    });

    it('Se muestra un mensaje de error si el correo o nombre ya está registrado', async () => {
        api.post.mockRejectedValueOnce({
            response: {
                data: {
                    error: 'El nombre de usuario ya está registrado.',
                },
            },
        });

        render(<UsuarioForm route="/api/user/register/" method="register" />, { wrapper: BrowserRouter });

        const usernameInput = screen.getByPlaceholderText('Username');
        const emailInput = screen.getByPlaceholderText('Email');
        const passwordInput = screen.getByPlaceholderText('Password');
        const submitButton = screen.getByText('Register');

        fireEvent.change(usernameInput, { target: { value: 'existinguser' } });
        fireEvent.change(emailInput, { target: { value: 'existing@example.com' } });
        fireEvent.change(passwordInput, { target: { value: 'password123' } });

        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(screen.getByText('El nombre de usuario ya está registrado.')).toBeInTheDocument();
        });
    });

    it('Se muestra un mensaje de error si la contraseña es menor de 8 caracteres', async () => {
        render(<UsuarioForm route="/api/user/register/" method="register" />, { wrapper: BrowserRouter });

        const usernameInput = screen.getByPlaceholderText('Username');
        const emailInput = screen.getByPlaceholderText('Email');
        const passwordInput = screen.getByPlaceholderText('Password');
        const submitButton = screen.getByText('Register');

        fireEvent.change(usernameInput, { target: { value: 'testuser' } });
        fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
        fireEvent.change(passwordInput, { target: { value: 'short' } });

        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(screen.getByText('La contraseña debe tener al menos 8 caracteres.')).toBeInTheDocument();
        });
    });
});
```
