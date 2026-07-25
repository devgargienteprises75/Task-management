import type { task, TaskState, UpdatedTask } from "@/types";
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
            state.allTask = action.payload
        },
        setUpdateTask: (state, action: PayloadAction<UpdatedTask>) => {
            const index = state.allTask.findIndex(t => String(t._id) === String(action.payload._id))
            if(index !== -1) state.allTask[index] = {...state.allTask[index], ...action.payload}
        },
        setLoading: (state, action: PayloadAction<boolean>) => {
            state.isLoading = action.payload
        },
        setError: (state, action: PayloadAction<string>) => {
            state.error = action.payload
        }
    }
})

export const { setTask, setLoading, setAllTask, setError, setUpdateTask } = taskSlice.actions
export default taskSlice.reducer