import axios from 'axios';
import Cookies from 'js-cookie';

axios.defaults.withCredentials = true;  // Permite el envío de cookies en las solicitudes

axios.interceptors.request.use(
    async (config) => {
        let token = Cookies.get('access_token');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

axios.interceptors.response.use(
    (response) => {
        return response;
    },
    async (error) => {
        const originalRequest = error.config;
        if (error.response.status === 403 && !originalRequest._retry) {
            originalRequest._retry = true;
            try {
                const response = await axios.post('http://localhost:5000/api/refresh-token', {}, { withCredentials: true });
                const token = response.data.access_token;
                Cookies.set('access_token', token);
                axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
                return axios(originalRequest);
            } catch (err) {
                return Promise.reject(err);
            }
        }
        return Promise.reject(error);
    }
);

export default axios;
