// /home/jesus/python/TFG/APP/frontend/src/components/__tests__/RF/nvidia/RF-03-nvidia.test.jsx
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

describe('RF-03 - Validación de contraseña de mínimo 8 caracteres', () => {
    it('debe mostrar un error si la contraseña tiene menos de 8 caracteres durante el registro', async () => {
        // Ruta de registro
        const registerRoute = '/register';
        
        // Renderizar el formulario de registro
        render(
            <BrowserRouter initialEntries={[registerRoute]}>
                <UsuarioForm route="/api/user/register/" method="register" />
            </BrowserRouter>
        );

        // Seleccionar el campo de contraseña
        const passwordInput = screen.getByPlaceholderText('Password');
        
        // Introducir una contraseña con menos de 8 caracteres
        fireEvent.change(passwordInput, { target: { value: 'short' } });
        
        // Seleccionar el botón de submit
        const submitButton = screen.getByText('Register');
        
        // Simular el envío del formulario
        fireEvent.click(submitButton);
        
        // Esperar a que aparezca el mensaje de error
        await waitFor(() => screen.getByText('La contraseña debe tener al menos 8 caracteres.'));
        
        // Verificar que el mensaje de error esté presente
        expect(screen.getByText('La contraseña debe tener al menos 8 caracteres.')).toBeInTheDocument();
    });

    it('no debe mostrar un error si la contraseña tiene 8 caracteres o más durante el registro', async () => {
        // Ruta de registro
        const registerRoute = '/register';
        
        // Renderizar el formulario de registro
        render(
            <BrowserRouter initialEntries={[registerRoute]}>
                <UsuarioForm route="/api/user/register/" method="register" />
            </BrowserRouter>
        );

        // Seleccionar el campo de contraseña
        const passwordInput = screen.getByPlaceholderText('Password');
        
        // Introducir una contraseña con 8 caracteres o más
        fireEvent.change(passwordInput, { target: { value: 'longerThan8' } });
        
        // Seleccionar el botón de submit
        const submitButton = screen.getByText('Register');
        
        // Simular el envío del formulario
        fireEvent.click(submitButton);
        
        // Esperar un poco para asegurarse de que no aparezca el mensaje de error
        await new Promise(resolve => setTimeout(resolve, 100));
        
        // Verificar que el mensaje de error no esté presente
        expect(screen.queryByText('La contraseña debe tener al menos 8 caracteres.')).not.toBeInTheDocument();
    });

    it('no debe validar la longitud de la contraseña durante el inicio de sesión', async () => {
        // Ruta de login
        const loginRoute = '/login';
        
        // Renderizar el formulario de login
        render(
            <BrowserRouter initialEntries={[loginRoute]}>
                <UsuarioForm route="/api/token/" method="login" />
            </BrowserRouter>
        );

        // Seleccionar el campo de contraseña
        const passwordInput = screen.getByPlaceholderText('Password');
        
        // Introducir una contraseña con menos de 8 caracteres
        fireEvent.change(passwordInput, { target: { value: 'short' } });
        
        // Seleccionar el botón de submit
        const submitButton = screen.getByText('Login');
        
        // Simular el envío del formulario
        fireEvent.click(submitButton);
        
        // Esperar un poco para asegurarse de que no aparezca el mensaje de error específico de longitud
        await new Promise(resolve => setTimeout(resolve, 100));
        
        // Verificar que el mensaje de error de longitud no esté presente
        expect(screen.queryByText('La contraseña debe tener al menos 8 caracteres.')).not.toBeInTheDocument();
    });
});