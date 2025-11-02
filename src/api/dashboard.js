import { useApi } from './api.js';

export const useDashboardService = () => {
    const api = useApi();

    const getDashboardStats = async () => {
        try {
            const response = await api.get('/api/dashboard/stats');
            return response.data;
        } catch (error) {
            console.error('Error fetching dashboard stats:', error);
            return null;
        }
    };

    const getRecentInvoices = async (limit = 5) => {
        try {
            const response = await api.get(`/api/invoice?limit=${limit}&sort=createdAt:desc`);
            return response.data.invoices || [];
        } catch (error) {
            console.error('Error fetching recent invoices:', error);
            return [];
        }
    };

    const getOverdueInvoices = async () => {
        try {
            const response = await api.get('/api/dashboard/overdue');
            return response.data.invoices || [];
        } catch (error) {
            console.error('Error fetching overdue invoices:', error);
            return [];
        }
    };

    return {
        getDashboardStats,
        getRecentInvoices,
        getOverdueInvoices
    };
};
