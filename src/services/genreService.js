import useHttpPrivate from '../hooks/useHttpPrivate';

export const useGenreApi = () => {
    const httpPrivate = useHttpPrivate();

    const getAllGenres = async () => {
        try {
            const res = await httpPrivate.get('/genre/all');
            return res.data.genres;
        } catch (error) {
            console.log(error);
        }
    };

    const getGenresByPage = async (page, pageSize) => {
        try {
            const res = await httpPrivate.get(`/genre/pageable?page=${page}&page_size=${pageSize}`);
            return res.data.genres;
        } catch (error) {
            console.log(error);
        }
    };

    const getGenreById = async (genreId) => {
        try {
            const res = await httpPrivate.get(`/genre/${genreId}`);
            return res.data.genre;
        } catch (error) {
            console.log(error);
        }
    };

    const searchGenres = async (body) => {
        try {
            const res = await httpPrivate.post('/genre/search', body);
            return res.data.genres;
        } catch (error) {
            console.log(error);
        }
    };

    const createGenre = async (body) => {
        try {
            const res = await httpPrivate.post('/genre/create', body);
            if (res.status < 200 || res.status >= 300) {
                throw new Error(`API Error: ${res.status} - ${res.statusText}`);
            }
            return true;
        } catch (error) {
            console.error('Create Genre Error:', error.response?.data || error.message || error);
            return false;
        }
    };

    const updateGenreById = async (genreId, body) => {
        try {
            const res = await httpPrivate.put(`/genre/update/${genreId}`, body);
            if (res.status != 200) {
                throw res.data;
            }
            return true;
        } catch (error) {
            console.log(error);
            return false;
        }
    };

    const deleteGenre = async (genreId) => {
        try {
            const res = await httpPrivate.delete(`/genre/delete/${genreId}`);
            if (res.status != 200) {
                throw res.data;
            }
            return true;
        } catch (error) {
            console.log(error);
            return false;
        }
    };

    const deleteManyGenres = async (body) => {
        try {
            const res = await httpPrivate.delete('/genre/delete-many', { data: body });
            if (res.status != 200) {
                throw res.data;
            }
            return true;
        } catch (error) {
            console.log(error);
            return false;
        }
    };

    const deleteAllGenres = async () => {
        try {
            const res = await httpPrivate.delete('/genre/delete-all');
            if (res.status != 200) {
                throw res.data;
            }
            return true;
        } catch (error) {
            console.log(error);
            return false;
        }
    };

    let genreService = {
        getAllGenres,
        getGenresByPage,
        getGenreById,
        searchGenres,
        createGenre,
        updateGenreById,
        deleteGenre,
        deleteManyGenres,
        deleteAllGenres,
    };

    return genreService;
};
