import { configureStore } from "@reduxjs/toolkit";
import authSlice from '../features/auth/auth.slice'
import  adminSlice  from "@/features/admin/admin.slice";
import workspaceSlice from '@/features/workspace/workspace.slice'

export const store = configureStore({
    reducer: {
        auth: authSlice,
        admin: adminSlice,
        workspace: workspaceSlice,
        // task: taskSlice,
    }
})

export type RootState = ReturnType<typeof store.getState>