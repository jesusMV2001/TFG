import { useState } from 'react';
import api from '../api';
import { ACCESS_TOKEN, REFRESH_TOKEN } from '../constants';
import { useNavigate, Link } from 'react-router-dom';

/**
 * Componente de formulario para login y registro de usuarios
 * 
 * @param {Object} props - Propiedades del componente
 * @param {string} props.route - Ruta de la API para login/registro
 * @param {('login'|'register')} props.method - Método que determina si es login o registro
 * @returns {JSX.Element}
 */
function UsuarioForm({ route, method }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const name = method === 'login' ? 'Login' : 'Register';

    /**
     * Maneja el envío del formulario de login/registro
     * 
     * @param {Event} e - Evento del formulario
     * @returns {Promise<void>}
     */
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (method === 'register' && password.length < 8) {
            setError('La contraseña debe tener al menos 8 caracteres.');
            return;
        }

        try {
            const payload = { username, password };
            if (method === 'register') {
                payload.email = email;
            }

            const res = await api.post(route, payload);
            if (method === 'login') {
                localStorage.setItem(ACCESS_TOKEN, res.data.access);
                localStorage.setItem(REFRESH_TOKEN, res.data.refresh);
            }
            navigate('/');
        } catch (error) {
            if (error.response && error.response.data.error) {
                setError(error.response.data.error);
            } else {
                setError('Usuario o contraseña incorrectos.');
            }
            console.error(error);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-bold text-gray-900">
                        {name}
                    </h2>
                </div>
                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="rounded-md shadow-sm space-y-4">
                        {error && (
                            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
                                {error}
                            </div>
                        )}

                        <div>
                            <input
                                type="text"
                                required
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                placeholder="Username"
                                className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>

                        {method === 'register' && (
                            <div>
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="Email"
                                    className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                        )}

                        <div>
                            <input
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Password"
                                className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>
                    </div>


                    <div className="flex flex-col gap-4">
                        <button
                            type="submit"
                            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
                        >
                            {name}
                        </button>

                        <div className="text-sm text-center">
                            {method === 'login' ? (
                                <p className="text-gray-600">
                                    ¿No tienes una cuenta?{' '}
                                    <Link
                                        to="/register"
                                        className="font-medium text-blue-600 hover:text-blue-500"
                                    >
                                        Regístrate aquí
                                    </Link>
                                </p>
                            ) : (
                                <p className="text-gray-600">
                                    ¿Ya tienes una cuenta?{' '}
                                    <Link
                                        to="/login"
                                        className="font-medium text-blue-600 hover:text-blue-500"
                                    >
                                        Inicia sesión
                                    </Link>
                                </p>
                            )}
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default UsuarioForm;