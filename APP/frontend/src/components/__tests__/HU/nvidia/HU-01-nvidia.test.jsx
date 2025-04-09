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

describe('HU-01 - Registro de Usuarios', () => {
    it('Los campos de nombre, correo y contraseña están presentes', () => {
        render(
            <BrowserRouter>
                <UsuarioForm route="/api/user/register/" method="register" />
            </BrowserRouter>
        );

        expect(screen.getByPlaceholderText('Username')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Email')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
    });

    it('No permite registrar con campos vacíos', async () => {
        render(
            <BrowserRouter>
                <UsuarioForm route="/api/user/register/" method="register" />
            </BrowserRouter>
        );

        const submitButton = screen.getByRole('button', { name: 'Register' });

        await waitFor(() => fireEvent.click(submitButton));

        expect(await screen.findByText('Todos los campos son obligatorios.')).toBeInTheDocument();
    });

    it('La contraseña debe tener un mínimo de 8 caracteres', async () => {
        render(
            <BrowserRouter>
                <UsuarioForm route="/api/user/register/" method="register" />
            </BrowserRouter>
        );

        const passwordInput = screen.getByPlaceholderText('Password');
        const submitButton = screen.getByRole('button', { name: 'Register' });

        fireEvent.change(passwordInput, { target: { value: 'short' } });
        await waitFor(() => fireEvent.click(submitButton));

        expect(await screen.findByText('La contraseña debe tener al menos 8 caracteres.')).toBeInTheDocument();
    });

    it('Muestra un mensaje de error si el correo o nombre ya está registrado', async () => {
        vi.mocked(api.post).mockRejectedValueOnce({
            response: {
                data: {
                    detail: 'El nombre de usuario ya está registrado.',
                },
            },
        });

        render(
            <BrowserRouter>
                <UsuarioForm route="/api/user/register/" method="register" />
            </BrowserRouter>
        );

        const usernameInput = screen.getByPlaceholderText('Username');
        const emailInput = screen.getByPlaceholderText('Email');
        const passwordInput = screen.getByPlaceholderText('Password');
        const submitButton = screen.getByRole('button', { name: 'Register' });

        fireEvent.change(usernameInput, { target: { value: 'existinguser' } });
        fireEvent.change(emailInput, { target: { value: 'existing@example.com' } });
        fireEvent.change(passwordInput, { target: { value: 'longenoughpassword' } });

        await waitFor(() => fireEvent.click(submitButton));

        expect(await screen.findByText('El nombre de usuario ya está registrado.')).toBeInTheDocument();
    });
});