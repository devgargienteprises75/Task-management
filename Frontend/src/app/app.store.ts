import { configureStore } from "@reduxjs/toolkit";
import authSlice from '../features/auth/auth.slice'
import adminSlice from "@/features/admin/admin.slice";
import workspaceSlice from '@/features/workspace/workspace.slice'
import taskSlice from "@/features/task/task.slice"
import layoutSlice from "./layout.slice";

export const store = configureStore({
    reducer: {
        auth: authSlice,
        admin: adminSlice,
        workspace: workspaceSlice,
        task: taskSlice,
        layout: layoutSlice,
    }
})

export type RootState = ReturnType<typeof store.getState>