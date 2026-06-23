import { Router } from "express";
import { createWorkspaceController } from "../controller/workspace.controller.js";
import { verifyUser } from "../middleware/auth.middleware.js";

const workspaceRouter = Router()

workspaceRouter.post('/create', verifyUser, createWorkspaceController)

export default workspaceRouter;