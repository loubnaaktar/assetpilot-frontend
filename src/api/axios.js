import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:8080/api/',
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
                console.log("400 - Bad Request");
                break;

            case 401:
                console.log("401 - Unauthorized");

                localStorage.clear();

                window.location.href = "/login";
                break;

            case 403:
                console.log("403 - Forbidden");

                window.location.href = "/acces-refuse";
                break;

            case 404:
                console.log("404 - Not Found");
                break;

            case 500:
                console.log("500 - Internal Server Error");
                break;

            default:
                console.log("Une erreur est survenue");
        }

        return Promise.reject(error);
    }
);


export default api;