import { Router } from "express";
import { createWorkspaceController, deleteWorkspaceController, editWorkspaceController, getWorkspaceController } from "../controller/workspace.controller.js";
import { workspaceVerification } from "../middleware/workspace.middleware.js";

const workspaceRouter = Router()

// Workspace management
workspaceRouter.post('/create', workspaceVerification, createWorkspaceController)
workspaceRouter.get('/get-workspaces', workspaceVerification, getWorkspaceController)
workspaceRouter.patch('/:workspaceid', workspaceVerification, editWorkspaceController)
workspaceRouter.delete('/:workspaceid', workspaceVerification, deleteWorkspaceController)

export default workspaceRouter;