import api from "@/config/axios";
import type { ApiResponse, AuthResponse, LoginCredentials } from "@/types";

export const authApi = {
    login: async (credentials: LoginCredentials) => {
        const res = await api.post<ApiResponse<AuthResponse>>("/auth/login", credentials)
        return res.data;
    }
}