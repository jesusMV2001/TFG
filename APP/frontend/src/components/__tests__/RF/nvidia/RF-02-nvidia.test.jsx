// /home/jesus/python/TFG/APP/frontend/src/components/__tests__/RF/nvidia/RF-02-nvidia.test.jsx
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

describe('RF-02: Validación de correo electrónico no registrado', () => {
    it('Muestra error cuando se intenta registrar un correo electrónico existente', async () => {
        // Mockear API para simular un correo electrónico existente
        vi.mocked(api.post).mockRejectedValueOnce({
            response: {
                data: {
                    error: 'Este correo electrónico ya está registrado.',
                },
            },
        });

        render(
            <BrowserRouter>
                <UsuarioForm route="/api/user/register/" method="register" />
            </BrowserRouter>
        );

        // Rellenar formulário con datos de registro
        const emailInput = screen.getByPlaceholderText('Email');
        const usernameInput = screen.getByPlaceholderText('Username');
        const passwordInput = screen.getByPlaceholderText('Password');

        fireEvent.change(emailInput, { target: { value: 'existente@example.com' } });
        fireEvent.change(usernameInput, { target: { value: 'usuarioExistente' } });
        fireEvent.change(passwordInput, { target: { value: 'contraseñaSegura' } });

        // Enviar formulario
        const submitButton = screen.getByText('Register');
        fireEvent.click(submitButton);

        // Esperar a que aparzca el mensaje de error
        await waitFor(() => {
            const errorMessage = screen.getByText('Este correo electrónico ya está registrado.');
            expect(errorMessage).toBeInTheDocument();
        });
    });

    it('No muestra error cuando se intenta registrar un correo electrónico no existente', async () => {
        // Mockear API para simular un correo electrónico no existente
        vi.mocked(api.post).mockResolvedValueOnce({
            data: {
                message: 'Usuario registrado exitosamente.',
            },
        });

        render(
            <BrowserRouter>
                <UsuarioForm route="/api/user/register/" method="register" />
            </BrowserRouter>
        );

        // Rellenar formulário con datos de registro
        const emailInput = screen.getByPlaceholderText('Email');
        const usernameInput = screen.getByPlaceholderText('Username');
        const passwordInput = screen.getByPlaceholderText('Password');

        fireEvent.change(emailInput, { target: { value: 'nuevo@example.com' } });
        fireEvent.change(usernameInput, { target: { value: 'nuevoUsuario' } });
        fireEvent.change(passwordInput, { target: { value: 'contraseñaSegura' } });

        // Enviar formulario
        const submitButton = screen.getByText('Register');
        fireEvent.click(submitButton);

        // Verificar que no aparezca mensaje de error
        await waitFor(() => {
            expect(screen.queryByText('Este correo electrónico ya está registrado.')).not.toBeInTheDocument();
        });
    });
});