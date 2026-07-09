import { Router } from "express";
import { addUserController, createWorkspaceController, deleteWorkspaceController, editWorkspaceController, getWorkspaceController, removeUserController } from "../controller/workspace.controller.js";
import { requireAdminOrHead } from "../middleware/workspace.middleware.js";
import { workspaceValidation } from "../validation/workspace.validation.js";

const workspaceRouter = Router()

// Workspace management
workspaceRouter.post('/create', requireAdminOrHead, workspaceValidation, createWorkspaceController)
workspaceRouter.get('/get-workspaces', requireAdminOrHead, getWorkspaceController)
workspaceRouter.patch('/:workspaceid', requireAdminOrHead, editWorkspaceController)
workspaceRouter.delete('/:workspaceid', requireAdminOrHead, deleteWorkspaceController)

// User Management in Workspace
workspaceRouter.patch("/add-user/:workspaceid", requireAdminOrHead, addUserController)
workspaceRouter.patch("/remove-user/:workspaceid", requireAdminOrHead, removeUserController)

export default workspaceRouter;