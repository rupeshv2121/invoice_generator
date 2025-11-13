import { useApi } from "./api";

export const useSubscriptionService = () => {
    const api = useApi();

    const getCurrentSubscription = async () => {
        try {
            const response = await api.get('/api/subscription/current');
            return response.data;
        } catch (error) {
            console.error('Error fetching subscription:', error);
            return null;
        }
    };

    const getSubscriptionStatus = async () => {
        try {
            const response = await api.get('/api/subscription/status');
            return response.data;
        } catch (error) {
            console.error('Error fetching subscription status:', error);
            return null;
        }
    };

    const getAllPlans = async () => {
        try {
            const response = await api.get('/api/subscription/plans');
            return response.data;
        } catch (error) {
            console.error('Error fetching plans:', error);
            return [];
        }
    };

    const createTrialSubscription = async () => {
        try {
            const response = await api.post('/api/subscription/trial');
            return response.data;
        } catch (error) {
            console.error('Error creating trial subscription:', error);
            throw error;
        }
    };

    const cancelSubscription = async () => {
        try {
            const response = await api.post('/api/subscription/cancel');
            return response.data;
        } catch (error) {
            console.error('Error cancelling subscription:', error);
            throw error;
        }
    };

    return {
        getCurrentSubscription,
        getSubscriptionStatus,
        getAllPlans,
        createTrialSubscription,
        cancelSubscription,
    };
};
