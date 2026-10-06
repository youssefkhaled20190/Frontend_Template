import axios from 'axios';
import store from '../Redux/store';

import { APP_CONFIG } from '../config';

const axiosInstance = axios.create({
    baseURL: APP_CONFIG.apiBaseUrl,
});

axiosInstance.interceptors.request.use(
    (config) => {
        const state = store.getState();
        const token = state?.auth?.token;
        const lang = state?.language?.lang || 'en';

        // Set Language Header for Backend Localization
        config.headers['Accept-Language'] = lang;

        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default axiosInstance;
