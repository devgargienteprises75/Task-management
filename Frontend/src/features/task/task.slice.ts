import type { task, TaskState } from "@/types";
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

const initialState: TaskState = {
    task: null,
    allTask: [],
    isLoading: false,
    error: null
}

const taskSlice = createSlice({
    name: "task",
    initialState,
    reducers: {
        setTask: (state, action: PayloadAction<task>) => {
            state.task = action.payload
        },
        setAllTask: (state, action: PayloadAction<task[]>) => {
            state.allTask.push(...action.payload)
        },
        setLoading: (state, action: PayloadAction<boolean>) => {
            state.isLoading = action.payload
        },
        setError: (state, action: PayloadAction<string>) => {
            state.error = action.payload
        }
    }
})

export const { setTask, setLoading, setAllTask, setError } = taskSlice.actions
export default taskSlice.reducer