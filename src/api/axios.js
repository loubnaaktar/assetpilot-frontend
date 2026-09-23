import axios from 'axios';

const api = axios.create({
    baseURL: '/api/',
    headers: {
        'Content-Type': 'application/json'
    }
});

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');

        if (token && token !== 'undefined' && token !== 'null') {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error) => Promise.reject(error)
);
api.interceptors.response.use(
    (response) => {
        return response;
    },

    (error) => {

        const status = error.response?.status;

        switch (status) {

            case 400:
                break;

            case 401:
                localStorage.clear();

                window.location.href = "/login";
                break;

            case 403:
                window.location.href = "/acces-refuse";
                break;

            case 404:
                break;

            case 500:
                break;

            default:
                break;
        }

        return Promise.reject(error);
    }
);


export default api;