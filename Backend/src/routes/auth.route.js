import { Router } from "express";
import { addUserValidation, resetPasswordValidation } from "../validation/auth.validation.js";
import { addUserController, deleteUserController, forgetPasswordController, getMeController, getUserController, loginController, resetPasswordController, updateUserController } from "../controller/auth.controller.js";
import { verifyUser } from "../middleware/auth.middleware.js";
import { verifyAdmin } from "../middleware/admin.middleware.js";

const authRouter = Router()

// Authentication
authRouter.post("/add-user", verifyUser, addUserValidation, addUserController)
authRouter.post("/login", loginController)
authRouter.get("/get-me", verifyUser, getMeController)

// Forget Paassword routes
authRouter.post("/forget-password", forgetPasswordController)
authRouter.patch("/reset-password", resetPasswordValidation, resetPasswordController)

// User management
authRouter.get('/users', verifyUser, getUserController)
authRouter.patch('/user/:id', verifyAdmin, updateUserController)
authRouter.delete('/user/:id', verifyAdmin, deleteUserController)

export default authRouter;