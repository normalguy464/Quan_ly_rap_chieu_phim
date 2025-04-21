import { getCookie } from '../helper/cookie';
import axios from '../services/customize_axios';

const API_DOMAIN = 'http://127.0.0.1:8000/';

export const get = async (path) => {
    const response = await axios.get(API_DOMAIN + path);
    const result = response.data;
    return result;
};

//fake api login
export const getUser = async (options) => {
    const response = await axios.post(API_DOMAIN + 'user/login/', options);
    const result = response.data;
    return result;
};

export const registerUser = async (options) => {
    const response = await axios.post(API_DOMAIN + 'user/register/', options);
    console.log(response);
    const result = response.data;
    return result;
};

export const getStore = async (path) => {
    try {
        const token = getCookie('token');
        const response = await axios.get(API_DOMAIN + path, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error in getStore:', error);
    }
};

export const post = async (path, options) => {
    const token = getCookie('token');
    const response = await axios.post(
        API_DOMAIN + path, // Thay URL_API_ENDPOINT bằng URL thực tế của API
        options,
        {
            headers: {
                Authorization: `Bearer ${token}`, // Đảm bảo `token` là JWT token hợp lệ
                'Content-Type': 'application/json',
            },
        },
    );
    const result = await response.data;
    return result;
};

export const del = async (path) => {
    const response = await axios.delete(API_DOMAIN + path);
    const result = await response.data;
    return result;
};

// export const oldPatch = async (path, options) => {
//     const response = await fetch(API_DOMAIN + path, {
//         method: 'PATCH',
//         headers: {
//             Accept: 'application/json',
//             'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(options),
//     });
//     const result = await response.json();
//     return result;
// };

export const put = async (path) => {
    const response = await axios.put(API_DOMAIN + path);
    const result = await response.data;
    return result;
};
