import axios from "axios";
import { useAuth } from "../context/AuthContext";

export const useApi = () => {
    const { token } = useAuth();

    const apiClient = axios.create({
        baseURL: import.meta.env.VITE_API_URL || "http://localhost:3001",
        headers: { "Content-Type": "application/json", ...(token && { Authorization: `Bearer ${token}` }), },
    });

    // Dynamically attach token
    apiClient.interceptors.request.use(
        (config) => {
            if (token) config.headers.Authorization = `Bearer ${token}`;
            return config;
        },
        (error) => Promise.reject(error)
    );

    return apiClient;
};
