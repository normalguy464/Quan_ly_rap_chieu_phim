import useHttpPrivate from '../hooks/useHttpPrivate';

export const usePromotionApi = () => {
    const httpPrivate = useHttpPrivate();

    const getAllPromotion = async () => {
        try {
            const res = await httpPrivate.get('/promotion/all');
            console.log(res.data);
            return res.data.promotions;
        } catch (error) {
            console.log(error);
        }
    };

    const getAllPromotionByPage = async (page, pageSize) => {
        try {
            const res = await httpPrivate.get(`/promotion/pageable?page=${page}&page_size=${pageSize}`);
            return res.data.promotions;
        } catch (error) {
            console.log(error);
        }
    };

    const getPromotionById = async (promotionId) => {
        try {
            const res = await httpPrivate.get(`/promotion/${promotionId}`);
            console.log(res);
            return res.data.promotions;
        } catch (error) {
            console.log(error);
        }
    };

    const createPromotion = async (body) => {
        try {
            const res = await httpPrivate.post(`/promotion/create`, body);
            if (res.status < 200 || res.status >= 300) {
                throw new Error(`API Error: ${res.status} - ${res.statusText}`);
            }
            return true;
        } catch (error) {
            console.error('Create promotion Error:', error.response?.data || error.message || error);
            return false;
        }
    };

    

    const updatePromotionById = async (promotionId, body) => {
        try {
            const res = await httpPrivate.put(`/promotion/update/${promotionId}`, body);
            if (res.status != 200) {
                throw res.data;
            }
            return true;
        } catch (error) {
            console.log(error);
            return false;
        }
    };

    const deletePromotion = async (promotionId) => {
        try {
            const res = await httpPrivate.delete(`/promotion/delete/${promotionId}`);
            if (res.status != 200) {
                throw res.data;
            }
            return true;
        } catch (error) {
            console.log(error);
            return false;
        }
    };

    const deleteManyPromotions = async (body) => {
        try {
            const res = await httpPrivate.delete('/promotion/delete_many', { data: body });
            if (res.status != 200) {
                throw res.data;
            }
            return true;
        } catch (error) {
            console.log(error);
            return false;
        }
    };

    const deleteAllPromotions = async () => {
        try {
            const res = await httpPrivate.delete('/promotion/delete-all');
            if (res.status != 200) {
                throw res.data;
            }
            return true;
        } catch (error) {
            console.log(error);
            return false;
        }
    };

    let promotionService = {
        getAllPromotion,
        getAllPromotionByPage,
        getPromotionById,
        createPromotion,
        updatePromotionById,
        deletePromotion,
        deleteManyPromotions,
        deleteAllPromotions,
    };

    return promotionService;
};




