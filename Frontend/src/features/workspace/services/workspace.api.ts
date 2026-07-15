import api from "@/config/axios"
import type { workspace } from "@/types"

export const workspaceApi = {
    createWorkspace: async (workspaceDetail: workspace) => {
        const res = await api.post("/workspace/create", workspaceDetail)
        return res.data
    },
    getWorkspaces: async () => {
        const res = await api.get("/workspace/get-workspaces")
        return res.data
    }
}