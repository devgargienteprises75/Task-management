import { Router } from "express";
import { registerValidation, resetPasswordValidation } from "../validation/auth.validation.js";
import { forgetPasswordController, loginController, registerController, resetPasswordController } from "../controller/auth.controller.js";

const authRouter = Router()

authRouter.post("/register", registerValidation, registerController)
authRouter.post("/login", loginController)
authRouter.post("/forget-password", forgetPasswordController)
authRouter.patch("/reset-password", resetPasswordValidation, resetPasswordController)

export default authRouter;