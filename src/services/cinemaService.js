import useHttpPrivate from '../hooks/useHttpPrivate';

export const useCinemaApi = () => {
    const httpPrivate = useHttpPrivate();

    const getAllCinema = async () => {
        try {
            const res = await httpPrivate.get('/cinema/all');
            return res.data.cinemas;
        } catch (error) {
            console.log(error);
        }
    };

    const getAllCinemaByPage = async (page, pageSize) => {
        try {
            const res = await httpPrivate.get(`/cinema/pageable?page=${page}&page_size=${pageSize}`);
            return res.cinemas;
        } catch (error) {
            console.log(error);
        }
    };

    const getCinemaById = async (cinemaId) => {
        try {
            const res = await httpPrivate.get(`/cinema/${cinemaId}`);
            console.log(res);
            return res.cinemas;
        } catch (error) {
            console.log(error);
        }
    };

    const createCinema = async (body) => {
        try {
            const res = await httpPrivate.post(`/cinema/create`, body);
            if (res.status < 200 || res.status >= 300) {
                throw new Error(`API Error: ${res.status} - ${res.statusText}`);
            }
            return true;
        } catch (error) {
            console.error('Create cinema Error:', error.response?.data || error.message || error);
            return false;
        }
    };

    

    const updateCinemaById = async (cinemaId, body) => {
        try {
            const res = await httpPrivate.put(`/cinema/update/${cinemaId}`, body);
            if (res.status != 200) {
                throw res.data;
            }
            return true;
        } catch (error) {
            console.log(error);
            return false;
        }
    };

    const deleteCinema = async (cinemaId) => {
        try {
            const res = await httpPrivate.delete(`/cinema/delete/${cinemaId}`);
            if (res.status != 200) {
                throw res.data;
            }
            return true;
        } catch (error) {
            console.log(error);
            return false;
        }
    };

    const deleteManyCinemas = async (body) => {
        try {
            const res = await httpPrivate.delete('/cinema/delete_many', { data: body });
            if (res.status != 200) {
                throw res.data;
            }
            return true;
        } catch (error) {
            console.log(error);
            return false;
        }
    };

    const deleteAllCinemas = async () => {
        try {
            const res = await httpPrivate.delete('/cinema/delete-all');
            if (res.status != 200) {
                throw res.data;
            }
            return true;
        } catch (error) {
            console.log(error);
            return false;
        }
    };

    let cinemaService = {
        getAllCinema,
        getAllCinemaByPage,
        getCinemaById,
        createCinema,
        updateCinemaById,
        deleteCinema,
        deleteManyCinemas,
        deleteAllCinemas,
    };

    return cinemaService;
};




