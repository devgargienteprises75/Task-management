import api from "@/config/axios"
import type { ApiResponse, task, TaskResponse, UpdatedTask, workspace } from "@/types"

export const taskApi = {
    createTask: async (workspaceId: string, taskDetails: task) => {
        const res = await api.post<ApiResponse<TaskResponse>>(`/tasks/${workspaceId}/create-task`, taskDetails);
        return res.data
    },
    getTasks: async (workspaceId: string) => {
        const res = await api.get(`tasks/${workspaceId}/tasks`)
        return res.data
    },
    getAllTasks: async () => {
        const res = await api.get("tasks")
        return res.data
    },
    updateTask: async (workspaceId: workspace['_id'] ,updatedTaskDetails: UpdatedTask) => {
        const res = await api.patch<ApiResponse<TaskResponse>>(`tasks/${workspaceId}/${updatedTaskDetails._id}`, updatedTaskDetails)
        return res.data
    }
}