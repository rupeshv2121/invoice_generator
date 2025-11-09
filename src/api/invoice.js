import { useApi } from './api.js';
export const useInvoiceService = () => {
    const api = useApi();
    const getInvoices = async () => {
        try {
            const response = await api.get('/api/invoice');
            console.log("Response data : ", response.data)
            return response.data.invoices;
        } catch (error) {
            console.error('Error fetching invoices : ', error);
            return [];
        }
    };
    const getInvoiceById = async (invoiceId) => {
        try {
            const response = await api.get('/api/invoice/' + invoiceId);
            return response.data;
        } catch (error) {
            console.error('Error fetching invoice : ', error);
            return null;
        }
    };

    const createInvoice = async (invoice) => {
        try {
            const response = await api.post('/api/invoice', invoice);
            console.log("Create Response : ", response)
            return response.data;
        } catch (error) {
            console.error('Error creating invoice : ', error);
            // Return detailed error information from backend
            const errorMessage = error.response?.data?.details
                ? JSON.stringify(error.response.data.details, null, 2)
                : error.response?.data?.error
                    ? error.response.data.error
                    : error.message;
            return { success: false, error: errorMessage };
        }
    }

    const updateInvoice = async (invoice) => {
        try {
            const payload = {
                name: invoice.name,
                description: invoice.description,
                hsnCode: invoice.hsnCode,
                unit: invoice.unit,
                purchasePrice: parseFloat(invoice.purchasePrice),
                sellingPrice: parseFloat(invoice.sellingPrice),
                cgstRate: parseFloat(invoice.cgstRate || 0),
                sgstRate: parseFloat(invoice.sgstRate || 0),
                igstRate: parseFloat(invoice.igstRate || 0),
            };

            console.log("Update Payload : ", payload)

            const invoiceId = invoice.id || invoice._id;
            if (!invoiceId) throw new Error("Invoice ID missing for update");

            const response = await api.patch(`/api/invoice/${invoiceId}`, payload);
            console.log("Update Response:", response.data);

            return response.data;
        } catch (error) {
            console.error('Error updating invoice:', error);
            return { success: false, error: error.message };
        }
    };


    const deleteInvoice = async (invoiceId) => {
        try {
            const response = await api.delete(`/api/invoice/${invoiceId}`);
            return { success: true, message: response.data?.message };
        } catch (err) {
            // Axios errors have response.data if server responded
            if (err.response && err.response.data) {
                return { success: false, ...err.response.data };
            }
            return { success: false, error: err.message };
        }
    }

    // const invoicesStats = async () => {
    //     try {
    //         const response = await api.get('/api/invoice/stats');
    //         return response.data;
    //     }
    //     catch (error) {
    //         console.error('Error fetching invoices stats : ', error)
    //     }
    // }

    return { getInvoices, getInvoiceById, createInvoice, updateInvoice, deleteInvoice };
}