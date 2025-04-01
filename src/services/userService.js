import useHttpPrivate from '../hooks/useHttpPrivate';

export const useUserApi = () => {
    const httpPrivate = useHttpPrivate();

    const getAllUser = async () => {
        try {
            const res = await httpPrivate.get('/user/all');
            return res.data.users;
        } catch (error) {
            console.log(error);
        }
    };

    const getAllUserByPage = async (page, pageSize) => {
        try {
            const res = await httpPrivate.get(`/user/pageable?page=${page}&page_size=${pageSize}`);
            return res.data.users;
        } catch (error) {
            console.log(error);
        }
    };

    const getUserById = async (userId) => {
        try {
            const res = await httpPrivate.get(`/user/${userId}`);
            console.log(res);
            return res.data.users;
        } catch (error) {
            console.log(error);
        }
    };

    const createUser = async (body) => {
        try {
            const res = await httpPrivate.post(`/user/create-account`, body);
            if (res.status < 200 || res.status >= 300) {
                throw new Error(`API Error: ${res.status} - ${res.statusText}`);
            }
            return true;
        } catch (error) {
            console.error('Create User Error:', error.response?.data || error.message || error);
            return false;
        }
    };

    

    const updateUserById = async (userId, body) => {
        try {
            const res = await httpPrivate.put(`/user/update/${userId}`, body);
            if (res.status != 200) {
                throw res.data;
            }
            return true;
        } catch (error) {
            console.log(error);
            return false;
        }
    };

    const deleteUser = async (userId) => {
        try {
            const res = await httpPrivate.delete(`/user/delete/${userId}`);
            if (res.status != 200) {
                throw res.data;
            }
            return true;
        } catch (error) {
            console.log(error);
            return false;
        }
    };

    const deleteManyUsers = async (body) => {
        try {
            const res = await httpPrivate.delete('/user/delete_many', { data: body });
            if (res.status != 200) {
                throw res.data;
            }
            return true;
        } catch (error) {
            console.log(error);
            return false;
        }
    };

    const deleteAllUsers = async () => {
        try {
            const res = await httpPrivate.delete('/user/delete-all');
            if (res.status != 200) {
                throw res.data;
            }
            return true;
        } catch (error) {
            console.log(error);
            return false;
        }
    };

    let userService = {
        getAllUser,
        getAllUserByPage,
        getUserById,
        createUser,
        updateUserById,
        deleteUser,
        deleteManyUsers,
        deleteAllUsers,
    };

    return userService;
};




