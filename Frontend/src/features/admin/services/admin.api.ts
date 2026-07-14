import api from "@/config/axios"
import type { ApiResponse, AuthResponse, user } from "@/types";
import type { CreateUserPayload, UpdateUserPayload } from "@/types/admin.types";

export const adminApi = {
    getAllUser: async () => {
        const res = await api.get<ApiResponse<{allUser: user[]}>>("/auth/users");
        return res.data
    },
    addUser: async (credential: CreateUserPayload) => {
        const res = await api.post<ApiResponse<AuthResponse>>("/api/add-user", credential);
        return res.data
    },
    updateUser: async (userId: string, credential: UpdateUserPayload) => {
        const res = await api.patch(`/auth/user/${userId}`, credential);
        return res.data
    }
}