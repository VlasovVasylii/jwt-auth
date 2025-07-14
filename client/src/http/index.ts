import axios from 'axios';
import {AuthResponse} from "../models/response/AuthResponse";

export const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const $api = axios.create({
    withCredentials: true,
    baseURL: API_URL,
});

$api.interceptors.request.use((config) => {
    if (typeof config.headers?.set === 'function') {
        config.headers.set('Authorization', `Bearer ${localStorage.getItem("token")}`);
    } else if (config.headers) {
        config.headers['Authorization'] = `Bearer ${localStorage.getItem("token")}`;
    }
    return config;
});

$api.interceptors.response.use((response) => {
    // Если в ответе есть новый accessToken, обновляем его в localStorage
    if (response.data && response.data.accessToken) {
        localStorage.setItem("token", response.data.accessToken);
    }
    return response;
}, async (error) => {
    const originalRequest = error.config;
    console.log('[AXIOS][RESPONSE][ERROR]', error);
    if (error.response && error.response.status === 401 && error.config && !error.config._isRetry) {
        originalRequest._isRetry = true;
        try {
            const response = await axios.get<AuthResponse>(`${API_URL}/refresh`, {withCredentials: true});
            localStorage.setItem("token", response.data.accessToken);
            // ЯВНО обновляем заголовок Authorization для повторного запроса
            if (originalRequest.headers) {
                if (typeof originalRequest.headers.set === 'function') {
                    originalRequest.headers.set('Authorization', `Bearer ${response.data.accessToken}`);
                } else {
                    originalRequest.headers['Authorization'] = `Bearer ${response.data.accessToken}`;
                }
            }
            return $api.request(originalRequest);
        } catch (e) {
            console.log('[AXIOS][REFRESH][ERROR]', e);
        }
    }
    throw error;
});

export default $api;