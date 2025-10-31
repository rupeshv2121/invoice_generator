import { useApi } from './api.js';
export const useItemService = () => {
    const api = useApi();
    const getItems = async () => {
        try {
            const response = await api.get('/api/item');
            // console.log("Response data : ", response.data)
            return response.data.items;
        } catch (error) {
            console.error('Error fetching items : ', error);
            return [];
        }
    };


    const getItemById = async (itemId) => {
        try {
            const response = await api.get('/api/item/' + itemId);
            return response.data;
        } catch (error) {
            console.error('Error fetching item : ', error);
            return null;
        }
    }

    const createItem = async (item) => {
        try {
            const response = await api.post('/api/item', item);
            console.log("Create Response : ", response)
            return response.data;
        } catch (error) {
            console.error('Error creating item : ', error);
            return { success: false, error: error.message };
        }
    }

    const updateItem = async (item) => {
        try {
            const payload = {
                name: item.name,
                description: item.description,
                hsnCode: item.hsnCode,
                unit: item.unit,
                purchasePrice: parseFloat(item.purchasePrice),
                sellingPrice: parseFloat(item.sellingPrice),
                cgstRate: parseFloat(item.cgstRate || 0),
                sgstRate: parseFloat(item.sgstRate || 0),
                igstRate: parseFloat(item.igstRate || 0),
            };

            console.log("Update Payload : ", payload)

            const itemId = item.id || item._id;
            if (!itemId) throw new Error("Item ID missing for update");

            const response = await api.patch(`/api/item/${itemId}`, payload);
            console.log("Update Response:", response.data);

            return response.data;
        } catch (error) {
            console.error('Error updating item:', error);
            return { success: false, error: error.message };
        }
    };


    const deleteItem = async (itemId) => {
        try {
            const response = await api.delete(`/api/item/${itemId}`);
            return { success: true, message: response.data?.message };
        } catch (err) {
            // Axios errors have response.data if server responded
            if (err.response && err.response.data) {
                return { success: false, ...err.response.data };
            }
            return { success: false, error: err.message };
        }
    }

    const itemsStats = async () => {
        try {
            const response = await api.get('/api/item/stats');
            console.log("Items stats response : ", response.data)
            return response.data;
        }
        catch (error) {
            console.error('Error fetching items stats : ', error)
        }
    }

    return { getItems, getItemById, createItem, updateItem, deleteItem, itemsStats };
}