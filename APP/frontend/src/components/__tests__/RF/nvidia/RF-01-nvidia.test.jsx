// /home/jesus/python/TFG/APP/frontend/src/components/__tests__/RF/nvidia/RF-01-nvidia.test.jsx
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
    beforeEach(() => {
        render(
            <BrowserRouter>
                <UsuarioForm route="/api/user/register/" method="register" />
            </BrowserRouter>
        );
    });

    it('Debería mostrar el formulario de registro con los campos requeridos', () => {
        expect(screen.getByPlaceholderText('Username')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Email')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Register' })).toBeInTheDocument();
    });

    it('No debería permitir el registro con campos vacíos', async () => {
        const submitButton = screen.getByRole('button', { name: 'Register' });
        fireEvent.click(submitButton);
        await waitFor(() => expect(screen.getByText('La contraseña debe tener al menos 8 caracteres.')).toBeInTheDocument());
        expect(api.post).not.toHaveBeenCalled();
    });

    it('No debería permitir el registro con contraseña menor a 8 caracteres', async () => {
        const passwordInput = screen.getByPlaceholderText('Password');
        const submitButton = screen.getByRole('button', { name: 'Register' });
        fireEvent.update(passwordInput, '-short');
        fireEvent.click(submitButton);
        await waitFor(() => expect(screen.getByText('La contraseña debe tener al menos 8 caracteres.')).toBeInTheDocument());
        expect(api.post).not.toHaveBeenCalled();
    });

    it('Debería enviar una solicitud de registro válida al servidor al completar correctamente el formulario', async () => {
        const usernameInput = screen.getByPlaceholderText('Username');
        const emailInput = screen.getByPlaceholderText('Email');
        const passwordInput = screen.getByPlaceholderText('Password');
        const submitButton = screen.getByRole('button', { name: 'Register' });

        const mockResponse = { access: 'mock-access-token', refresh: 'mock-refresh-token' };
        vi.mocked(api.post).mockResolvedValue({ data: mockResponse, status: 201 });

        fireEvent.update(usernameInput, 'test-user');
        fireEvent.update(emailInput, 'test@example.com');
        fireEvent.update(passwordInput, 'password1234');
        fireEvent.click(submitButton);

        await waitFor(() => expect(api.post).toHaveBeenCalledTimes(1));
        expect(api.post).toHaveBeenCalledWith('/api/user/register/', {
            username: 'test-user',
            email: 'test@example.com',
            password: 'password1234',
        });
        expect(localStorage.setItem).toHaveBeenCalledTimes(2);
        expect(localStorage.setItem).toHaveBeenNthCalledWith(1, 'access', mockResponse.access);
        expect(localStorage.setItem).toHaveBeenNthCalledWith(2, 'refresh', mockResponse.refresh);
    });
});