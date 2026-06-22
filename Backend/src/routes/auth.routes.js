import { Router } from "express";
import { addUserValidation, resetPasswordValidation } from "../validation/auth.validation.js";
import { addUserController, forgetPasswordController, getUserController, loginController, resetPasswordController, updateUserController } from "../controller/auth.controller.js";
import { verifyUser } from "../middleware/auth.middleware.js";
import { verifyAdmin } from "../middleware/admin.middleware.js";

const authRouter = Router()

// Authentication
authRouter.post("/add-user", verifyUser, addUserValidation, addUserController)
authRouter.post("/login", loginController)

// Forget Paassword routes
authRouter.post("/forget-password", forgetPasswordController)
authRouter.patch("/reset-password", resetPasswordValidation, resetPasswordController)

// User management
authRouter.get('/users', verifyAdmin, getUserController)
authRouter.patch('/users/:id', verifyAdmin, updateUserController)


export default authRouter;