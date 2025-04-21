import useHttpPrivate from '../hooks/useHttpPrivate';

export const useRoomApi = () => {
    const httpPrivate = useHttpPrivate();

    const getAllRooms = async () => {
        try {
            const res = await httpPrivate.get('/rooms');
            return res.data.rooms;
        } catch (error) {
            console.error('Error fetching all rooms:', error);
        }
    };

    const getRoomsByCinemaId = async (cinemaId) => {
        try {
            const res = await httpPrivate.get(`/rooms/by-cinema-id/${cinemaId}`);
            return res.data.rooms;
        } catch (error) {
            console.error(`Error fetching rooms for cinema ID ${cinemaId}:`, error);
        }
    };

    const getRoomById = async (roomId) => {
        try {
            const res = await httpPrivate.get(`/rooms/${roomId}`);
            return res.data.room;
        } catch (error) {
            console.error(`Error fetching room with ID ${roomId}:`, error);
        }
    };

    const createRoom = async (cinemaId, body) => {
        try {
            const res = await httpPrivate.post(`/rooms/create/${cinemaId}`, body);
            if (res.status < 200 || res.status >= 300) {
                throw new Error(`API Error: ${res.status} - ${res.statusText}`);
            }
            return true;
        } catch (error) {
            console.error('Error creating room:', error.response?.data || error.message || error);
            return false;
        }
    };

    const updateRoomById = async (roomId, body) => {
        try {
            const res = await httpPrivate.put(`/rooms/update/${roomId}`, body);
            if (res.status !== 200) {
                throw new Error(`API Error: ${res.status} - ${res.statusText}`);
            }
            return true;
        } catch (error) {
            console.error(`Error updating room with ID ${roomId}:`, error.response?.data || error.message || error);
            return false;
        }
    };

    const deleteRoom = async (roomId) => {
        try {
            const res = await httpPrivate.delete(`/rooms/delete/${roomId}`);
            if (res.status !== 200) {
                throw new Error(`API Error: ${res.status} - ${res.statusText}`);
            }
            return true;
        } catch (error) {
            console.error(`Error deleting room with ID ${roomId}:`, error.response?.data || error.message || error);
            return false;
        }
    };

    const deleteManyRooms = async (body) => {
        try {
            const res = await httpPrivate.delete('/rooms/delete_many', { data: body });
            if (res.status !== 200) {
                throw new Error(`API Error: ${res.status} - ${res.statusText}`);
            }
            return true;
        } catch (error) {
            console.error('Error deleting multiple rooms:', error.response?.data || error.message || error);
            return false;
        }
    };

    const deleteAllRooms = async () => {
        try {
            const res = await httpPrivate.delete('/rooms/delete-all');
            if (res.status !== 200) {
                throw new Error(`API Error: ${res.status} - ${res.statusText}`);
            }
            return true;
        } catch (error) {
            console.error('Error deleting all rooms:', error.response?.data || error.message || error);
            return false;
        }
    };

    let roomService = {
        getAllRooms,
        getRoomsByCinemaId,
        getRoomById,
        createRoom,
        updateRoomById,
        deleteRoom,
        deleteManyRooms,
        deleteAllRooms,
    };

    return roomService;
};