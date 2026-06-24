import { Router } from "express";
import { addUserController, createWorkspaceController, deleteWorkspaceController, editWorkspaceController, getWorkspaceController, removeUserController } from "../controller/workspace.controller.js";
import { workspaceVerification } from "../middleware/workspace.middleware.js";

const workspaceRouter = Router()

// Workspace management
workspaceRouter.post('/create', workspaceVerification, createWorkspaceController)
workspaceRouter.get('/get-workspaces', workspaceVerification, getWorkspaceController)
workspaceRouter.patch('/:workspaceid', workspaceVerification, editWorkspaceController)
workspaceRouter.delete('/:workspaceid', workspaceVerification, deleteWorkspaceController)

// User Management in Workspace
workspaceRouter.patch("/add-user/:workspaceid", workspaceVerification, addUserController)
workspaceRouter.patch("/remove-user/:workspaceid", workspaceVerification, removeUserController)

export default workspaceRouter;