import { Router } from "express";
import { requireAdminOrHead, verifyWorkspaceOwnership, verifyWorkspaceUser } from "../middleware/workspace.middleware.js";
import { createTaskController, getTasksController, getTaskDetailController } from "../controller/task.controller.js";
import { verifyUser } from "../middleware/auth.middleware.js";

const taskRouter = Router()

// Manage Tasks

// Assign new Task
taskRouter.post("/:workspaceid/create-task", requireAdminOrHead, verifyWorkspaceOwnership, createTaskController)

// Fetch all task of workspace
taskRouter.get("/:workspaceid/tasks", verifyUser, verifyWorkspaceUser, getTasksController)

// Fetch single task detail
taskRouter.get("/:workspaceid/task-details/:taskid", verifyUser, verifyWorkspaceUser, getTaskDetailController)
export default taskRouter