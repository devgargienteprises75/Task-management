import api from "@/config/axios";
import type { ApiResponse, AuthResponse, LoginCredentials } from "@/types";

export const authApi = {
    login: async (credentials: LoginCredentials) => {
        const res = await api.post<ApiResponse<AuthResponse>>("/auth/login", credentials)
        if(res.data.token){
            localStorage.setItem("token", res.data.token)
        }
        return res.data;
    },
    getMe: async () => {
        const res = await api.get<ApiResponse<AuthResponse>>("/auth/get-me")
        return res.data
    },
    logout: async () => {
        const res = await api.post<ApiResponse<string>>("/auth/logout");
        localStorage.removeItem("token")
        return res.data
    },
    editUser: async (id: string, username: string) => {
        const res = await api.patch<ApiResponse<AuthResponse>>(`/auth/edit/user/${id}`, { username })
        return res.data
    }
}