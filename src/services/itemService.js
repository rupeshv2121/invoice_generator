// Services for managing items/products
const ITEMS_STORAGE_KEY = 'invoice_generator_items';

// Get all items from localStorage
export const getAllItems = () => {
    try {
        const itemsData = localStorage.getItem(ITEMS_STORAGE_KEY);
        return itemsData ? JSON.parse(itemsData) : [];
    } catch (error) {
        console.error('Error fetching items:', error);
        return [];
    }
};

// Add a new item
export const addItem = (itemData) => {
    try {
        const items = getAllItems();
        const newItem = {
            id: Date.now(), // Simple ID generation
            ...itemData,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        items.push(newItem);
        localStorage.setItem(ITEMS_STORAGE_KEY, JSON.stringify(items));
        return { success: true, item: newItem };
    } catch (error) {
        console.error('Error adding item:', error);
        return { success: false, error: error.message };
    }
};

// Update an existing item
export const updateItem = (itemId, itemData) => {
    try {
        const items = getAllItems();
        const itemIndex = items.findIndex(item => item.id === itemId);

        if (itemIndex === -1) {
            return { success: false, error: 'Item not found' };
        }

        items[itemIndex] = {
            ...items[itemIndex],
            ...itemData,
            updatedAt: new Date().toISOString()
        };

        localStorage.setItem(ITEMS_STORAGE_KEY, JSON.stringify(items));
        return { success: true, item: items[itemIndex] };
    } catch (error) {
        console.error('Error updating item:', error);
        return { success: false, error: error.message };
    }
};

// Delete an item
export const deleteItem = (itemId) => {
    try {
        const items = getAllItems();
        const filteredItems = items.filter(item => item.id !== itemId);

        if (filteredItems.length === items.length) {
            return { success: false, error: 'Item not found' };
        }

        localStorage.setItem(ITEMS_STORAGE_KEY, JSON.stringify(filteredItems));
        return { success: true };
    } catch (error) {
        console.error('Error deleting item:', error);
        return { success: false, error: error.message };
    }
};

// Get a single item by ID
export const getItemById = (itemId) => {
    try {
        const items = getAllItems();
        const item = items.find(item => item.id === itemId);
        return item || null;
    } catch (error) {
        console.error('Error fetching item:', error);
        return null;
    }
};

// Search items by name or HSN code
export const searchItems = (searchTerm) => {
    try {
        const items = getAllItems();
        if (!searchTerm) return items;

        const lowercaseSearch = searchTerm.toLowerCase();
        return items.filter(item =>
            item.name?.toLowerCase().includes(lowercaseSearch) ||
            item.hsnCode?.toLowerCase().includes(lowercaseSearch)
        );
    } catch (error) {
        console.error('Error searching items:', error);
        return [];
    }
};

// Export items data
export const exportItems = () => {
    try {
        const items = getAllItems();
        const dataStr = JSON.stringify(items, null, 2);
        const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);

        const exportFileDefaultName = `items_export_${new Date().toISOString().split('T')[0]}.json`;

        const linkElement = document.createElement('a');
        linkElement.setAttribute('href', dataUri);
        linkElement.setAttribute('download', exportFileDefaultName);
        linkElement.click();

        return { success: true };
    } catch (error) {
        console.error('Error exporting items:', error);
        return { success: false, error: error.message };
    }
};

// Import items data
export const importItems = (jsonData) => {
    try {
        const importedItems = JSON.parse(jsonData);
        if (!Array.isArray(importedItems)) {
            throw new Error('Invalid data format. Expected an array of items.');
        }

        // Validate each item has required fields
        const validatedItems = importedItems.map((item, index) => {
            if (!item.name || !item.hsnCode) {
                throw new Error(`Item at index ${index} is missing required fields (name, hsnCode)`);
            }

            return {
                ...item,
                id: item.id || Date.now() + index, // Ensure unique ID
                createdAt: item.createdAt || new Date().toISOString(),
                updatedAt: new Date().toISOString()
            };
        });

        localStorage.setItem(ITEMS_STORAGE_KEY, JSON.stringify(validatedItems));
        return { success: true, itemsCount: validatedItems.length };
    } catch (error) {
        console.error('Error importing items:', error);
        return { success: false, error: error.message };
    }
};

// Get items statistics
export const getItemsStats = () => {
    try {
        const items = getAllItems();
        const totalItems = items.length;
        const totalPurchaseValue = items.reduce((sum, item) => sum + (parseFloat(item.purchasePrice) || 0), 0);
        const totalSellingValue = items.reduce((sum, item) => sum + (parseFloat(item.sellingPrice) || 0), 0);
        const averageMargin = totalItems > 0 ?
            items.reduce((sum, item) => {
                const purchase = parseFloat(item.purchasePrice) || 0;
                const selling = parseFloat(item.sellingPrice) || 0;
                const margin = purchase > 0 ? ((selling - purchase) / purchase) * 100 : 0;
                return sum + margin;
            }, 0) / totalItems : 0;

        return {
            totalItems,
            totalPurchaseValue,
            totalSellingValue,
            averageMargin: Math.round(averageMargin * 100) / 100
        };
    } catch (error) {
        console.error('Error calculating items stats:', error);
        return {
            totalItems: 0,
            totalPurchaseValue: 0,
            totalSellingValue: 0,
            averageMargin: 0
        };
    }
};

// Validate item data
export const validateItemData = (itemData) => {
    const errors = {};

    if (!itemData.name || itemData.name.trim() === '') {
        errors.name = 'Item name is required';
    }

    if (!itemData.hsnCode || itemData.hsnCode.trim() === '') {
        errors.hsnCode = 'HSN Code is required';
    }

    if (!itemData.purchasePrice || isNaN(itemData.purchasePrice) || parseFloat(itemData.purchasePrice) < 0) {
        errors.purchasePrice = 'Valid purchase price is required';
    }

    if (!itemData.sellingPrice || isNaN(itemData.sellingPrice) || parseFloat(itemData.sellingPrice) < 0) {
        errors.sellingPrice = 'Valid selling price is required';
    }

    return {
        isValid: Object.keys(errors).length === 0,
        errors
    };
};