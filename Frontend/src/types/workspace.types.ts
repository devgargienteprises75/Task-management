import type { user } from './user.types';

export interface workspace {
    _id: string;
    name: string;
    description?: string;
    createdBy: string;
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

export interface UpdateWorkspace {
    workspaceId: string | user;
    newName: string;
    newDescription: string;
    newMemberList: (string | user)[]
}