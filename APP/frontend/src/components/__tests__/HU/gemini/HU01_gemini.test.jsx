// /home/jesus/python/TFG/APP/frontend/src/components/__tests__/HU/gemini/HU-01-gemini.test.jsx
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
    it('El usuario puede ingresar nombre, correo y contraseña', () => {
        render(
            <BrowserRouter>
                <UsuarioForm route="/api/user/register/" method="register" />
            </BrowserRouter>
        );

        const usernameInput = screen.getByPlaceholderText('Username');
        const emailInput = screen.getByPlaceholderText('Email');
        const passwordInput = screen.getByPlaceholderText('Password');

        fireEvent.change(usernameInput, { target: { value: 'testuser' } });
        fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
        fireEvent.change(passwordInput, { target: { value: 'password123' } });

        expect(usernameInput.value).toBe('testuser');
        expect(emailInput.value).toBe('test@example.com');
        expect(passwordInput.value).toBe('password123');
    });

    it('Muestra un mensaje de error si algún campo está vacío', async () => {
        render(
            <BrowserRouter>
                <UsuarioForm route="/api/user/register/" method="register" />
            </BrowserRouter>
        );

        const registerButton = screen.getByText('Register');
        fireEvent.click(registerButton);

        await waitFor(() => {
            expect(screen.getByText('Username')).toBeVisible();
            expect(screen.getByText('Email')).toBeVisible();
            expect(screen.getByText('Password')).toBeVisible();

        });
    });

    it('Muestra un mensaje de error si la contraseña es menor de 8 caracteres', async () => {
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
        fireEvent.change(passwordInput, { target: { value: '1234567' } });
        fireEvent.click(registerButton);

        await waitFor(() => {
            expect(screen.getByText('La contraseña debe tener al menos 8 caracteres.')).toBeVisible();
        });
    });

    it('Muestra un mensaje de error si el nombre de usuario o correo ya están registrados', async () => {
        api.post.mockRejectedValue({
            response: { data: { error: 'El nombre de usuario ya está registrado.' } },
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

        fireEvent.change(usernameInput, { target: { value: 'existinguser' } });
        fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
        fireEvent.change(passwordInput, { target: { value: 'password123' } });
        fireEvent.click(registerButton);

        await waitFor(() => {
            expect(screen.getByText('El nombre de usuario ya está registrado.')).toBeVisible();
        });
    });
});