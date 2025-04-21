import axios from 'axios';

const httpRequest = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
});

export const httpRequestPrivate = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
});

export default httpRequest;
