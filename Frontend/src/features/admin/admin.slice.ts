import type { user } from "@/types";
import type { AdminState } from "@/types/admin.types";
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

const initialState: AdminState = {
    users: [],
    isLoading: false,
    error: null
}

export const adminSlice = createSlice({
    name: "admin",
    initialState,
    reducers: {
        setUser: (state, action: PayloadAction<user[]>) => {
            state.users = action.payload
        },
        addUserToList: (state, action: PayloadAction<user>) => {
            state.users.push(action.payload)
        },
        updateUserInList: (state, action: PayloadAction<user>) => {
            const index = state.users.findIndex(u => u._id === action.payload._id);
            if(index !== -1) state.users[index] = action.payload
        },
        setAdminLoading: (state, action: PayloadAction<boolean>) => {
            state.isLoading = action.payload
        }
    }
})

export const { setUser, addUserToList, updateUserInList, setAdminLoading } = adminSlice.actions
export default adminSlice.reducer