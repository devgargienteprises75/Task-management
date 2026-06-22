import { Router } from "express";
import { addUserValidation, resetPasswordValidation } from "../validation/auth.validation.js";
import { addUserController, forgetPasswordController, loginController, resetPasswordController } from "../controller/auth.controller.js";

const authRouter = Router()

authRouter.post("/add-user", addUserValidation, addUserController)
authRouter.post("/login", loginController)
authRouter.post("/forget-password", forgetPasswordController)
authRouter.patch("/reset-password", resetPasswordValidation, resetPasswordController)

export default authRouter;