import type { user } from "./user.types";

export interface AuthResponse {
    user: user;
}

// Structure of Redux slice for Authentication
export interface AuthState {
    user: user | null;
    isAuthenticated: boolean,
    isLoading: boolean,
    error: string | null
}

// Auth credentials
export interface LoginCredentials {
    email: string;
    password: string
}

export interface addUserCredentials {
    username: string,
    email: string,
    password: string
}