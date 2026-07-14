import type { user } from "./user.types";

export interface CreateUserPayload {
    username: string;
    email: string;
    role: 'admin' | 'head' | 'user';
    password? : string
}

export interface UpdateUserPayload {
    newRole: 'admin' | 'head' | 'user';
    currentActiveStatus?: boolean
}

export interface AdminState {
    users: user[];
    isLoading: boolean;
    error: string | null
}