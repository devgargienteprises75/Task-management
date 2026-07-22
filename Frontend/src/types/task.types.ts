import type { user } from "./user.types"
import type { workspace } from "./workspace.types"

export interface task {
    _id: string;
    title: string;
    description: string;
    workspaceId: string | workspace;
    assignTo: string | user;
    assignBy: string | user;
    status: 'Todo' | 'In-progress' | 'Done';
    priority: 'High' | 'Medium' | 'Low';
    dueDate?: string;
    createAt?: string;
    updatedAt?: string;
}

export interface TaskResponse {
    task: task
}

export interface TaskState {
    task: task | null;
    allTask: task[];
    isLoading: boolean;
    error: string | null;
}