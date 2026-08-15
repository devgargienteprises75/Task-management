import { Router } from "express";
import { addUserValidation, resetPasswordValidation } from "../validation/auth.validation.js";
import { addUserController, deleteUserController, editUserController, forgetPasswordController, getMeController, getUserController, loginController, logoutController, resetPasswordController, updateUserController } from "../controller/auth.controller.js";
import { verifyUser } from "../middleware/auth.middleware.js";
import { verifyAdmin } from "../middleware/admin.middleware.js";

const authRouter = Router()

// Authentication
authRouter.post("/add-user", verifyUser, addUserValidation, addUserController)
authRouter.post("/login", loginController)
authRouter.get("/get-me", verifyUser, getMeController)
authRouter.post("/logout", verifyUser, logoutController)

// Forget Paassword routes
authRouter.post("/forget-password", forgetPasswordController)
authRouter.patch("/reset-password", resetPasswordValidation, resetPasswordController)

// User management
authRouter.get('/users', verifyUser, getUserController)
authRouter.patch('/user/:id', verifyAdmin, updateUserController)
authRouter.delete('/user/:id', verifyAdmin, deleteUserController)
authRouter.patch('/edit/user/:id', verifyUser, editUserController)

export default authRouter;