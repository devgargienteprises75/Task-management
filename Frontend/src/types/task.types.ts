import type { user } from "./user.types"
import type { workspace } from "./workspace.types"

export interface task {
    _id: string;
    title: string;
    description: string;
    workspaceId: string | workspace;
    assignTo: string | user;
    assignBy: string | user;
    status: 'Pending' | 'Completed' | 'Hold';
    priority: 'High' | 'Medium' | 'Low';
    dueDate?: string;
    createAt: string;
    updatedAt: string;
}