import axios from 'axios';
import { ACCESS_TOKEN } from './constants';

/**
 * Instancia de axios configurada para la API
 * Incluye la URL base y el interceptor para el token de autenticación
 * 
 * @type {import('axios').AxiosInstance}
 */
const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
});

/**
 * Interceptor que añade el token de autenticación a las peticiones
 * Si existe un token en localStorage, lo añade al header Authorization
 * 
 * @param {import('axios').AxiosRequestConfig} config - Configuración de la petición
 * @returns {import('axios').AxiosRequestConfig} Configuración modificada
 */
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem(ACCESS_TOKEN);
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

export default api;