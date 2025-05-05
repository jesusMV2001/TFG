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
    beforeEach(() => {
        render(
            <BrowserRouter>
                <UsuarioForm route="/api/user/register/" method="register" />
            </BrowserRouter>
        );
    });

    it('HU-01 - CA01: Puede ingresar un nombre, correo y contraseña', () => {
        const usernameInput = screen.getByPlaceholderText('Username');
        const emailInput = screen.getByPlaceholderText('Email');
        const passwordInput = screen.getByPlaceholderText('Password');

        fireEvent.change(usernameInput, { target: { value: 'nuevo_usuario' } });
        fireEvent.change(emailInput, { target: { value: 'nuevo@email.com' } });
        fireEvent.change(passwordInput, { target: { value: 'ContraseñaSegura123' } });

        expect(usernameInput).toHaveValue('nuevo_usuario');
        expect(emailInput).toHaveValue('nuevo@email.com');
        expect(passwordInput).toHaveValue('ContraseñaSegura123');
    });

    it('HU-01 - CA02: Ningún campo debe estar vacío', async () => {
        const submitButton = screen.getByText('Register');
        fireEvent.click(submitButton);

        await waitFor(() => {
            const errorMessages = screen.getAllByText('Campo obligatorio');
            expect(errorMessages).toHaveLength(3);
        });
    });

    it('HU-01 - CA03: La contraseña debe tener un mínimo de 8 caracteres', async () => {
        const passwordInput = screen.getByPlaceholderText('Password');
        fireEvent.change(passwordInput, { target: { value: 'Corta' } });

        const submitButton = screen.getByText('Register');
        fireEvent.click(submitButton);

        await waitFor(() => {
            const errorMessage = screen.getByText('La contraseña debe tener al menos 8 caracteres.');
            expect(errorMessage).toBeInTheDocument();
        });
    });

    it('HU-01 - CA04: Se muestra un mensaje de error si el correo o nombre ya está registrado', async () => {
        // Mockear la API para simular un error de registro duplicado
        vi.mocked(api.post).mockRejectedValueOnce({
            response: {
                data: { error: 'Correo o nombre de usuario ya registrado' },
            },
        });

        const usernameInput = screen.getByPlaceholderText('Username');
        const emailInput = screen.getByPlaceholderText('Email');
        const passwordInput = screen.getByPlaceholderText('Password');

        fireEvent.change(usernameInput, { target: { value: 'usuario_existente' } });
        fireEvent.change(emailInput, { target: { value: 'existente@email.com' } });
        fireEvent.change(passwordInput, { target: { value: 'Segura12345' } });

        const submitButton = screen.getByText('Register');
        fireEvent.click(submitButton);

        await waitFor(() => {
            const errorMessage = screen.getByText('Correo o nombre de usuario ya registrado');
            expect(errorMessage).toBeInTheDocument();
        });
    });

    it('HU-01 - CA05: Se muestra un mensaje de error si la contraseña es menor de 8 caracteres', async () => {
        const passwordInput = screen.getByPlaceholderText('Password');
        fireEvent.change(passwordInput, { target: { value: 'Corta' } });

        const submitButton = screen.getByText('Register');
        fireEvent.click(submitButton);

        await waitFor(() => {
            const errorMessage = screen.getByText('La contraseña debe tener al menos 8 caracteres.');
            expect(errorMessage).toBeInTheDocument();
        });
    });
});