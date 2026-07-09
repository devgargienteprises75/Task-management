import type { AuthState, user } from "@/types";
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

const initialState: AuthState = {
    user: null,
    token: null,
    isAuthenticated: false,
    isLoading: false,
    error: null
}

export const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        loginSuccess: (state, action: PayloadAction<{ user: user, token: string}>) => {
            state.user = action.payload.user;
            state.token = action.payload.token;
            state.isAuthenticated = true;
            state.error = null
        },
        logout: (state) => {
            state.user = null;
            state.token = null;
            state.isAuthenticated = false
        },
        setLoading: (state, action: PayloadAction<boolean>) => {
            state.isLoading = action.payload
        },
        setError: (state, action: PayloadAction<string>) => {
            state.error = action.payload;
        }
    }
})

export const { loginSuccess, logout, setLoading, setError } = authSlice.actions
export default authSlice.reducer