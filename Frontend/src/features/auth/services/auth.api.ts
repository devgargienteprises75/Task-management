import api from "@/config/axios";
import type { addUserCredentials, ApiResponse, AuthResponse, LoginCredentials } from "@/types";

export const authApi = {
    addUser: async (credential: addUserCredentials) => {
        const res = await api.post<ApiResponse<AuthResponse>>("/auth/add-user", credential)
        return res.data
    },
    login: async (credentials: LoginCredentials) => {
        const res = await api.post<ApiResponse<AuthResponse>>("/auth/login", credentials)
        return res.data;
    }
}