import type { AuthState, user } from "@/types";
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

const initialState: AuthState = {
    user: null,
    isAuthenticated: false,
    isLoading: false,
    error: null
}

export const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        loginSuccess: (state, action: PayloadAction<user>) => {
            state.user = action.payload;
            state.isAuthenticated = true;
            state.error = null
        },
        logout: (state) => {
            state.user = null;
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