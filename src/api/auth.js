import apiClient from "./api";

export const login = async (email, password) => {
    try {
        const response = await apiClient.post("/api/auth/login", { email, password });

        // Check if access_token exists
        const token = response?.data?.access_token;
        if (token) {
            // console.log("Access token received:", token);
            // Optionally store in localStorage/sessionStorage
            localStorage.setItem("access_token", token);
        } else {
            console.warn("⚠️ No access_token in response:", response.data);
        }

        return response.data;
    } catch (error) {
        console.error("❌ Error during login:", error.response?.data || error.message);
        return null;
    }
};

export const logout = () => {
    localStorage.removeItem("access_token");
}

export const register = async (name, email, password) => {
    try {
        const response = await apiClient.post("/api/auth/register", { name, email, password });

        // Check if access_token exists
        const token = response?.data?.access_token;
        if (token) {
            // console.log("✅ Access token received:", token);
            localStorage.setItem("access_token", token);
        } else {
            console.warn("⚠️ No access_token in response:", response.data);
        }

        return response.data;
    } catch (error) {
        console.error("❌ Error during registration:", error.response?.data || error.message);
        return null;
    }
};
