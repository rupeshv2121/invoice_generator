import apiClient from "./api";

export const getItems = async () => {
    try {
        const response = await apiClient.get('/api/item')
        return response.data;
    } catch (error) {
        console.error('Error fetching items : ', error);
        return [];
    }
}

export const getItemById = async (itemId) => {
    try {
        const response = await apiClient.get('/api/item/' + itemId);
        return response.data;
    } catch (error) {
        console.error('Error fetching item : ', error);
        return null;
    }
}

export const createItem = async (item) => {
    try {
        const response = await apiClient.post('/api/item', item);
        return response.data;
    } catch (error) {
        console.error('Error creating item : ', error);
        return { success: false, error: error.message };
    }
}

export const updateItem = async (item) => {
    try {
        const response = await apiClient.patch('/api/item/' + item.id, item);
        return response.data;
    } catch (error) {
        console.error('Error updating item : ', error);
        return { success: false, error: error.message }
    }
}

export const deleteItem = async (itemId) => {
    try {
        const response = await apiClient.delete('/api/item/' + itemId);
        return response.data;
    } catch (error) {
        console.error('Error deleting item : ', error);
        return { success: false, error: error.message }
    }
}