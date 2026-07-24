import { Router } from "express";
import { requireAdminOrHead, verifyWorkspaceOwnership, verifyWorkspaceUser } from "../middleware/workspace.middleware.js";
import { 
    createTaskController, 
    getTasksController, 
    getTaskDetailController, 
    updateTaskController, 
    deleteTaskController, 
    addCommentsController,
    getCommentsList,
    deleteCommentController,
    getAllTasksController
} from "../controller/task.controller.js";
import { verifyUser } from "../middleware/auth.middleware.js";
import { taskValidation } from "../validation/task.validation.js";

const taskRouter = Router()


// Assign new Task
taskRouter.post("/:workspaceid/create-task", requireAdminOrHead, verifyWorkspaceOwnership, taskValidation, createTaskController)

// Fetch all task of workspace
taskRouter.get("/:workspaceid/tasks", verifyUser, verifyWorkspaceUser, getTasksController)

// Fetch all task by user
taskRouter.get("/", verifyUser, getAllTasksController)

// Fetch single task detail
taskRouter.get("/:workspaceid/task-details/:taskid", verifyUser, verifyWorkspaceUser, getTaskDetailController)

// Edit or update task
taskRouter.patch("/:workspaceid/:taskid", verifyUser, verifyWorkspaceUser, updateTaskController )

// Delete task
taskRouter.delete("/:workspaceid/delete/:taskid", verifyUser, verifyWorkspaceUser, deleteTaskController)


// Comments
taskRouter.post("/:workspaceid/:taskid/comment", verifyUser, verifyWorkspaceUser, addCommentsController)
taskRouter.get("/:workspaceid/:taskid/comments-list", verifyUser, verifyWorkspaceUser, getCommentsList)
taskRouter.delete("/comments/:commentid", verifyUser, deleteCommentController)

export default taskRouter