import { Router } from "express";
import { registerValidation } from "../validation/auth.validation.js";
import { registerController } from "../controller/auth.controller.js";

const authRouter = Router()

authRouter.post("/register", registerValidation, registerController)

export default authRouter;