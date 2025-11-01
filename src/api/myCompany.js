import { useApi } from "./api";

export const useMyCompanyService = () => {
    const api = useApi();

    const getMyCompany = async () => {
        try {
            const response = await api.get('/api/company');
            console.log("Response Get My Company RAW: ", response);
            console.log("Response Get My Company DATA: ", response.data);
            return response.data;
        } catch (error) {
            console.error('Error fetching My Company:', error);
            console.error('Error details:', error.response?.data);
            return null;
        }
    };

    const createCompany = async (companyData) => {
        try {
            const response = await api.post('/api/company', companyData);
            return response.data;
        } catch (error) {
            console.error('Error creating company:', error);
            throw error;
        }
    };

    const updateCompany = async (id, companyData) => {
        try {
            const response = await api.patch(`/api/company/${id}`, companyData);
            return response.data;
        } catch (error) {
            console.error('Error updating company:', error);
            throw error;
        }
    };

    return { getMyCompany, createCompany, updateCompany };
};
