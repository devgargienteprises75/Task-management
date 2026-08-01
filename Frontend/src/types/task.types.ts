import type { user } from "./user.types"
import type { workspace } from "./workspace.types"

export interface task {
    _id?: string;
    title: string;
    description: string;
    workspaceId: string | workspace;
    assignTo: (string | user)[];
    assignBy: string | user;
    status: 'Todo' | 'In-progress' | 'Done';
    priority: 'High' | 'Medium' | 'Low';
    dueDate: string;
    createAt?: string;
    updatedAt?: string;
}

export interface TaskResponse {
    newTask: task
}

export interface TaskState {
    task: task | null;
    allTask: task[];
    isLoading: boolean;
    error: string | null;
}

export interface UpdatedTask {
    _id?: string;
    newTitle?: string;
    newDescription?: string;
    workspaceId?: string | workspace;
    assignTo?: (string | user)[];
    status?: 'Todo' | 'In-progress' | 'Done';
    priority?: 'High' | 'Medium' | 'Low';
    dueDate?: string;
}