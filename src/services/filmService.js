import useHttpPrivate from '../hooks/useHttpPrivate';

export const useFilmApi = () => {
    const httpPrivate = useHttpPrivate();

    const getAllFilms = async () => {
        try {
            const res = await httpPrivate.get('/film/all');
            console.log(res);

            return res.data.films;
        } catch (error) {
            console.log(error);
        }
    };

    const getAllFilmByPage = async (page, pageSize) => {
        try {
            const res = await httpPrivate.get(`/film/pageable?page=${page}&page_size=${pageSize}`);
            return res.data.films;
        } catch (error) {
            console.log(error);
        }
    };

    const getFilmById = async (filmId) => {
        try {
            const res = await httpPrivate.get(`/film/${filmId}`);
            console.log(res);
            return res.data.films;
        } catch (error) {
            console.log(error);
        }
    };

    const createFilm = async (body) => {
        try {
            const res = await httpPrivate.post(`/film/create`, body);
            if (res.status < 200 || res.status >= 300) {
                throw new Error(`API Error: ${res.status} - ${res.statusText}`);
            }
            return true;
        } catch (error) {
            console.error('Create film Error:', error.response?.data || error.message || error);
            return false;
        }
    };

    

    const updateFilmById = async (filmId, body) => {
        try {
            const res = await httpPrivate.put(`/film/update/${filmId}`, body);
            if (res.status != 200) {
                throw res.data;
            }
            return true;
        } catch (error) {
            console.log(error);
            return false;
        }
    };

    const deleteFilm = async (filmId) => {
        try {
            const res = await httpPrivate.delete(`/film/delete/${filmId}`);
            if (res.status != 200) {
                throw res.data;
            }
            return true;
        } catch (error) {
            console.log(error);
            return false;
        }
    };

    const deleteManyFilms = async (body) => {
        try {
            const res = await httpPrivate.delete('/film/delete_many', { data: body });
            if (res.status != 200) {
                throw res.data;
            }
            return true;
        } catch (error) {
            console.log(error);
            return false;
        }
    };

    const deleteAllFilms = async () => {
        try {
            const res = await httpPrivate.delete('/film/delete-all');
            if (res.status != 200) {
                throw res.data;
            }
            return true;
        } catch (error) {
            console.log(error);
            return false;
        }
    };

    let filmService = {
        getAllFilms,
        getAllFilmByPage,
        getFilmById,
        createFilm,
        updateFilmById,
        deleteFilm,
        deleteManyFilms,
        deleteAllFilms,
    };

    return filmService;
};




