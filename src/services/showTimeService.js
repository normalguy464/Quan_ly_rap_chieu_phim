import useHttpPrivate from '../hooks/useHttpPrivate';

export const useShowTimeApi = () => {
    const httpPrivate = useHttpPrivate();

    const getAllShowtimes = async () => {
        try {
            const res = await httpPrivate.get('/showtimes/all');
            return res.data.showtimes;
        } catch (error) {
            console.log(error);
        }
    };

    const getShowtimesByPage = async (page, pageSize) => {
        try {
            const res = await httpPrivate.get(`/showtimes/pageable?page=${page}&page_size=${pageSize}`);
            return res.data.showtimes;
        } catch (error) {
            console.log(error);
        }
    };

    const getAvailableDates = async () => {
        try {
            const res = await httpPrivate.get('/showtimes/available-dates');
            return res.data.dates;
        } catch (error) {
            console.log(error);
        }
    };

    const getAvailableTimes = async () => {
        try {
            const res = await httpPrivate.get('/showtimes/available-times');
            return res.data.times;
        } catch (error) {
            console.log(error);
        }
    };

    const getShowtimeSeats = async (showtimeId) => {
        try {
            const res = await httpPrivate.get(`/showtimes/${showtimeId}/seats`);
            return res.data.seats;
        } catch (error) {
            console.log(error);
        }
    };

    const getShowtimeById = async (showtimeId) => {
        try {
            const res = await httpPrivate.get(`/showtimes/${showtimeId}`);
            return res.data.showtime;
        } catch (error) {
            console.log(error);
        }
    };

    const createShowtime = async (body) => {
        try {
            const res = await httpPrivate.post('/showtimes/create', body);
            if (res.status < 200 || res.status >= 300) {
                throw new Error(`API Error: ${res.status} - ${res.statusText}`);
            }
            return true;
        } catch (error) {
            console.error('Create Showtime Error:', error.response?.data || error.message || error);
            return false;
        }
    };

    const updateShowtimeById = async (showtimeId, body) => {
        try {
            const res = await httpPrivate.put(`/showtimes/${showtimeId}`, body);
            if (res.status != 200) {
                throw res.data;
            }
            return true;
        } catch (error) {
            console.log(error);
            return false;
        }
    };

    const deleteShowtime = async (showtimeId) => {
        try {
            const res = await httpPrivate.delete(`/showtimes/${showtimeId}`);
            if (res.status != 200) {
                throw res.data;
            }
            return true;
        } catch (error) {
            console.log(error);
            return false;
        }
    };

    const deleteManyShowtimes = async (body) => {
        try {
            const res = await httpPrivate.delete('/showtimes/delete-many', { data: body });
            if (res.status != 200) {
                throw res.data;
            }
            return true;
        } catch (error) {
            console.log(error);
            return false;
        }
    };

    const searchShowtimes = async (body) => {
        try {
            const res = await httpPrivate.post('/showtimes/search', body);
            return res.data.showtimes;
        } catch (error) {
            console.log(error);
        }
    };

    let showTimeService = {
        getAllShowtimes,
        getShowtimesByPage,
        getAvailableDates,
        getAvailableTimes,
        getShowtimeSeats,
        getShowtimeById,
        createShowtime,
        updateShowtimeById,
        deleteShowtime,
        deleteManyShowtimes,
        searchShowtimes,
    };

    return showTimeService;
};
