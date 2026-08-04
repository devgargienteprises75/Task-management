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
    updateTask: async (updatedTaskDetails: UpdatedTask) => {
        const res = await api.patch<ApiResponse<TaskResponse>>(`tasks/${updatedTaskDetails.workspaceId}/${updatedTaskDetails._id}`, updatedTaskDetails)
        return res.data
    },
    deleteTask: async (workspaceId: string | workspace, taskId: string) => {
        const workspaceID = typeof workspaceId === 'object' ? workspaceId._id : workspaceId;
        const res = await api.delete<ApiResponse<TaskResponse>>(`tasks/${workspaceID}/${taskId}`)
        return res.data
    }
}