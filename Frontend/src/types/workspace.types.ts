import type { user } from './user.types';

export interface workspace {
    _id: string;
    name: string;
    description?: string;
    createdBy: string | user;
    members: (string | user)[];
    status: 'active' | 'inactive';
    createdAt: string;
    updatedAt: string;
}

export interface workspaceState {
    workspace: workspace | null;
    allWorkspaces: workspace[];
    isLoading: boolean;
    error: string | null;
}