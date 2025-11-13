import { useApi } from './api.js';
export const useCustomersService = () => {
    const api = useApi();
    const getCustomers = async () => {
        try {
            console.log("Fetching customers from API...");
            const response = await api.get('/api/customer');
            console.log("Response Get Customer:", response);
            console.log("Customers data:", response.data);
            console.log("Number of customers:", response.data?.customers?.length || 0);
            return response.data;
        } catch (error) {
            console.error('Error fetching Customers:', error);
            console.error('Error response:', error?.response?.data);
            return { customers: [], pagination: { page: 1, limit: 10, total: 0, totalPages: 0 } };
        }
    };


    const getCustomerById = async (customerId) => {
        try {
            const response = await api.get('/api/customer/' + customerId);
            return response.data;
        } catch (error) {
            console.error('Error fetching Customer : ', error);
            return null;
        }
    }

    const addCustomer = async (customer) => {
        try {
            console.log("Sending customer data to API:", customer);
            const response = await api.post('/api/customer', customer);
            console.log("Create Response:", response);
            console.log("Created customer data:", response.data);
            return response.data;
        } catch (error) {
            console.error("Error creating Customer:", error);
            console.error("Error response:", error?.response?.data);
            console.error("Error message:", error.message);
            throw error;
        }
    }

    const updateCustomer = async (customerId, customerData) => {
        try {
            const response = await api.patch(`/api/customer/${customerId}`, customerData);
            console.log("Update Response:", response.data);
            return response.data;
        } catch (error) {
            console.error('Error updating Customer:', error?.response?.data || error.message);
            throw error;
        }
    };


    const deleteCustomer = async (customerId) => {
        try {
            const response = await api.delete(`/api/customer/${customerId}`);
            return { success: true, message: response.data?.message };
        } catch (err) {
            // Axios errors have response.data if server responded
            if (err.response && err.response.data) {
                return { success: false, ...err.response.data };
            }
            return { success: false, error: err.message };
        }
    }

    const getCustomerStatistics = async () => {
        try {
            const response = await api.get('/api/customer/stats');
            console.log("Customer Statistics Response:", response.data);
            return response.data;
        } catch (error) {
            console.error('Error fetching customer statistics:', error);
            return null;
        }
    };

    return { getCustomers, getCustomerById, addCustomer, updateCustomer, deleteCustomer, getCustomerStatistics };
}