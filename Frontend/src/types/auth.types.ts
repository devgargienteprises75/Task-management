import type { user } from "./user.types";

export interface AuthResponse {
    user: user;
    token: string;
}

// Structure of Redux slice for Authentication
export interface AuthState {
    user: user | null;
    token: string | null,
    isAuthenticated: boolean,
    isLoading: boolean,
    error: string | null
}

// Auth credentials
export interface LoginCredentials {
    email: string;
    password: string
}

export interface RegisterCredentials {
    username: string,
    email: string,
    password: string
}