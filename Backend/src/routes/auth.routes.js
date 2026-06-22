import { Router } from "express";
import { addUserValidation, resetPasswordValidation } from "../validation/auth.validation.js";
import { addUserController, forgetPasswordController, getUserController, loginController, resetPasswordController } from "../controller/auth.controller.js";
import { veriifyUser } from "../middleware/auth.middleware.js";

const authRouter = Router()

// Authentication
authRouter.post("/add-user", veriifyUser, addUserValidation, addUserController)
authRouter.post("/login", loginController)

// Forget Paassword routes
authRouter.post("/forget-password", forgetPasswordController)
authRouter.patch("/reset-password", resetPasswordValidation, resetPasswordController)

authRouter.get('/users', veriifyUser, getUserController)
export default authRouter;