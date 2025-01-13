import axios from "axios";

axios.interceptors.request.use((config) => {
    if (localStorage) {
        const token = localStorage.getItem('AUTH_TK');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
    }

    return config;
})

export const axiosInstance = axios;