// /home/jesus/python/TFG/APP/frontend/src/components/__tests__/HU/nvidia/HU-02-nvidia.test.jsx
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

describe('HU-02 - Inicio de Sesion y Autenticacion', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('debe iniciar sesion con credenciales válidas', async () => {
        // Mockear API para retornar token válido
        api.post.mockResolvedValueOnce({
            data: {
                access: 'token-acceso',
                refresh: 'token-refresco',
            },
        });

        // Renderizar componente dentro de BrowserRouter
        render(
            <BrowserRouter>
                <UsuarioForm route="/api/token/" method="login" />
            </BrowserRouter>
        );

        // Ingresar credenciales válidas
        const usernameInput = screen.getByPlaceholderText('Username');
        const passwordInput = screen.getByPlaceholderText('Password');
        const submitButton = screen.getByText('Login');

        fireEvent.change(usernameInput, { target: { value: 'usuario_valido' } });
        fireEvent.change(passwordInput, { target: { value: 'contraseña-valida' } });
        fireEvent.click(submitButton);

        // Esperar a que se guarde el token en localStorage
        await waitFor(() => expect(localStorage.setItem).toHaveBeenCalledTimes(2));

        // Verificar que se guarde el token de acceso y refresco
        expect(localStorage.setItem).toHaveBeenNthCalledWith(1, 'ACCESS_TOKEN', 'token-acceso');
        expect(localStorage.setItem).toHaveBeenNthCalledWith(2, 'REFRESH_TOKEN', 'token-refresco');
    });

    it('debe mostrar mensaje de error con credenciales incorrectas', async () => {
        // Mockear API para retornar error de credenciales incorrectas
        api.post.mockRejectedValueOnce({
            response: {
                data: {
                    error: 'Credenciales incorrectas',
                },
            },
        });

        // Renderizar componente
        render(
            <BrowserRouter>
                <UsuarioForm route="/api/token/" method="login" />
            </BrowserRouter>
        );

        // Ingresar credenciales incorrectas
        const usernameInput = screen.getByPlaceholderText('Username');
        const passwordInput = screen.getByPlaceholderText('Password');
        const submitButton = screen.getByText('Login');

        fireEvent.change(usernameInput, { target: { value: 'usuario_invalido' } });
        fireEvent.change(passwordInput, { target: { value: 'contraseña-invalida' } });
        fireEvent.click(submitButton);

        // Esperar a que aparezca el mensaje de error
        await screen.findByText('Credenciales incorrectas');

        // Verificar que se muestre el mensaje de error
        expect(screen.getByText('Credenciales incorrectas')).toBeInTheDocument();
    });

    it('debe mantener la sesión activa después de autenticar', async () => {
        // Mockear API para retornar token válido
        api.post.mockResolvedValueOnce({
            data: {
                access: 'token-acceso',
                refresh: 'token-refresco',
            },
        });

        // Renderizar componente
        render(
            <BrowserRouter>
                <UsuarioForm route="/api/token/" method="login" />
            </BrowserRouter>
        );

        // Ingresar credenciales válidas
        const usernameInput = screen.getByPlaceholderText('Username');
        const passwordInput = screen.getByPlaceholderText('Password');
        const submitButton = screen.getByText('Login');

        fireEvent.change(usernameInput, { target: { value: 'usuario_valido' } });
        fireEvent.change(passwordInput, { target: { value: 'contraseña-valida' } });
        fireEvent.click(submitButton);

        // Esperar a que se guarde el token en localStorage
        await waitFor(() => expect(localStorage.setItem).toHaveBeenCalledTimes(2));

        // Verificar que se redirige a la ruta raíz (/) después de autenticar
        expect(useNavigate().mock.calls[0][0]).toBe('/');
    });
});