import { Router } from "express";
import { registerValidation, resetPasswordValidation } from "../validation/auth.validation.js";
import { loginController, registerController, resetPasswordController } from "../controller/auth.controller.js";

const authRouter = Router()

authRouter.post("/register", registerValidation, registerController)
authRouter.post("/login", loginController)
authRouter.post("/reset-password", resetPasswordController)
export default authRouter;