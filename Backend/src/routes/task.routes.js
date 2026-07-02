import { Router } from "express";
import { requireAdminOrHead, verifyWorkspaceOwnership } from "../middleware/workspace.middleware.js";
import { createTaskController } from "../controller/task.controller.js";

const taskRouter = Router()

// Manage Tasks
taskRouter.post("/:workspaceid/create-task", requireAdminOrHead, verifyWorkspaceOwnership, createTaskController)



export default taskRouter