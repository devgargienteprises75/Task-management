import { Router } from "express";
import { requireAdminOrHead, verifyWorkspaceOwnership, verifyWorkspaceUser } from "../middleware/workspace.middleware.js";
import { createTaskController, getTasksController } from "../controller/task.controller.js";
import { verifyUser } from "../middleware/auth.middleware.js";

const taskRouter = Router()

// Manage Tasks
taskRouter.post(
    "/:workspaceid/create-task", 
    requireAdminOrHead, 
    verifyWorkspaceOwnership, 
    createTaskController
)
taskRouter.get("/:workspaceid/tasks", verifyUser, verifyWorkspaceUser, getTasksController)


export default taskRouter