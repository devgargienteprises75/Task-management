import type { task } from "./task.types";
import type { user } from "./user.types";

export interface comment {
    _id: string;
    taskId: string | task;
    user: string | user;
    text: string;
    createAt: string;
    updatedAt: string;
}