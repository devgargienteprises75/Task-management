import mongoose from "mongoose"
import { taskModel } from "../models/task.model.js"
import { userModel } from "../models/user.model.js"
import { workspaceModel } from "../models/workspace.model.js"
import commentModel from "../models/comment.model.js"

// Create and assign task
export async function createTaskController(req, res) {
    try {
        const { workspaceid } = req.params
        const userId = req.userId
        const { title, description, assignTo, priority, dueDate} = req.body

        const assignToId = assignTo.map((id) => {
            return new mongoose.Types.ObjectId(id)
        })
        console.log(assignToId);
        
        if(!title || !description || !assignToId){
            return res.status(400).json({
                message: "Required missing fields",
                success: false,
                err: "Missing fields"
            })
        }

        let parsedDueDate;

        if(dueDate != undefined && dueDate != null && dueDate != ""){
            const dueDateRegex = /^\d{4}-\d{2}-\d{2}$/;

            if(!dueDateRegex.test(dueDate)){
                return res.status(400).json({
                    message: "dueDate must be in YYYY-MM-DD format",
                    success: false,
                    err: "Invalid dueDate format"
                })
            }

            const [year, month, day] = dueDate.split("-").map(Number)
            parsedDueDate = new Date(year, month - 1, day)

            const isRealDate = 
                parsedDueDate.getFullYear() === year &&
                parsedDueDate.getMonth() === month - 1 &&
                parsedDueDate.getDate() === day

            if(!isRealDate){
                return res.status(400).json({
                    message: "Invalid dueDate",
                    success: false,
                    err: "invalid dueDate"
                })
            }
        }

        const task = await taskModel.create({
            title,
            description,
            workspaceId: workspaceid,
            assignTo: assignToId,
            assignBy: userId,
            priority,
            dueDate: parsedDueDate
        })

        return res.status(201).json({
            message: "Task assigned successfully",
            success: true
        })

    } catch (err) {
        return res.status(400).json({
            message: "Unexpected error",
            success: false,
            err: err.message
        })
    }
}

// Fetch all tasks of user
export async function getAllTasksController(req, res){
    try {
        const userId = req.userId

        const tasks = await taskModel.find({ assignTo: userId })
        if(!tasks){
            return res.status(404).json({
                message: "No tasks found for this user",
                success: false,
                err: "No task found for this user"
            })
        }

        return res.status(200).json({
            message: "Task fetched successfully",
            success: true,
            tasks
        })
    } catch (err) {
        return res.status(400).json({
            message: "Unexpected error",
            success: false,
            err: err.message
        })
    }
}

// Fetch all tasks
export async function getTasksController(req, res) {
    try {
        const { workspaceid } = req.params
        const userId = req.userId

        const tasks = await taskModel.find({ workspaceId: workspaceid })
        
        return res.status(200).json({
            message: "Fetched tasks successfully",
            success: true,
            tasks
        })

    } catch (err) {
        return res.status(400).json({
            message: "Unexpected error",
            success: false,
            err: err.message
        })
    }
}

// Fetch 

// Fetch task detail
export async function getTaskDetailController(req, res) {
    try {
        const { workspaceid, taskid } = req.params;

        if(!taskid){
            return res.status(400).json({
                message: "Missing task Id",
                success: false,
                err: "Missing task Id"
            })
        }

        const task = await taskModel.findById(taskid)
        if(!task){
            return res.status(404).json({
                message: "Task not found",
                success: false,
                err: "Task not found"
            })
        }

        return res.status(200).json({
            message: "Task detail fetched successfully",
            success: true,
            task
        })
        
    } catch (err) {
        return res.status(400).json({
            message: "Unexpected error",
            success: false,
            err: err.message
        })
    }
}

// Update Task
export async function updateTaskController(req, res){
    try {
        const userId = req.userId
        const { workspaceid, taskid } = req.params
        const { newTitle, newDescription, assignTo, status, priority, dueDate } = req.body
        const assignToId = assignTo ? new mongoose.Types.ObjectId(assignTo) : undefined

        if(!userId){
            return res.status(400).json({
                message: "User Id missing",
                success: false,
                err: "User Id missing"
            })
        }
    
        const user = await userModel.findById(userId)   
        if(!user){
            return res.status(404).json({
                message: "User not found",
                success: false,
                err: "User not found"
            })
        }
        
        const workspace = await workspaceModel.findById(workspaceid)
        const task = await taskModel.findById(taskid)

        if(!task){
            return res.status(404).json({
                message: "Task not found",
                success: false,
                err: "Task not found"
            })
        }

        if(user.role === "user" || user.role === "head"){
            const newTask = await taskModel.findByIdAndUpdate(
                task._id,
                { $set: { status } },
                { runValidators: true, returnDocument: 'after' }
            )

            return res.status(200).json({
                message: "Status updated successfully",
                success: true,
                newTask
            })
        }

        if(user.role === "admin" || user.role === "head"){
            const newTask = await taskModel.findByIdAndUpdate(
                task._id,
                { $set: {
                    title: newTitle || task.title,
                    description: newDescription || task.description,
                    assignTo: assignToId || task.assignTo,
                    priority: priority || task.priority,
                    dueDate: dueDate || task.dueDate
                }},
                {
                    runValidators: true,
                    returnDocument: 'after'
                }
            )

            return res.status(200).json({
                message: "Task updated successfully",
                success: true,
                newTask
            })
        }

    } catch (err) {
        return res.status(400).json({
            message: "Unexpected error",
            success: false,
            err: err.message
        })
    }
}

// Delete Task
export async function deleteTaskController(req, res) {
    try {
        const { workspaceid, taskid } = req.params
        const userId = req.userId

        const task = await taskModel.findById(taskid)
        if(!task){
            return res.status(404).json({
                message: "Task not found",
                success: false,
                err: "Task not found"
            })
        }

        const user = await userModel.findById(userId)

        if(user.role === "user" || (user.role === "head" && task.assignTo.equals(user._id))){
            return res.status(400).json({
                message: "AssignedTo user cannot access to delete tasks",
                success: false,
                err: "AssignedTo user cannot access to delete tasks"
            })
        }

        if(!task.assignBy.equals(userId)){
            return res.status(400).json({
                message: "Task only deleted by assigned head",
                success: false,
                err: "Task only deleted by assigned head"
            })
        }

        await taskModel.findByIdAndDelete(task._id)

        return res.status(200).json({
            message: "Task deleted successfully",
            success: true
        })

    } catch (err) {
        return res.status(400)({
            message: "Unexpected error",
            success: false,
            err: err.message
        })
    }
}

// Add Comments
export async function addCommentsController(req, res) {
    try {
        const userId = req.userId
        const { taskid, workspaceid } = req.params
        const { text } = req.body
    
        if(!taskid){
            return res.status(400).json({
                message: "Task Id Missing",
                success: false,
                err: "Task Id Missing"
            })
        }
    
        const task = await taskModel.findById(taskid)
        if(!task){
            return res.status(404).json({
                message: "Task not found",
                success: false,
                err: "Task not found"
            })
        }

        if(task.workspaceId.toString() !== workspaceid){
            return res.status(403).json({
                message: "Task not from the selected workspace",
                success: false,
                err: "Task not from the selected workspace"
            })
        }
    
        const user = await userModel.findById(userId)
        if(!user){
            return res.status(404).json({
                message: "User not found",
                success: false,
                err: "User not found"
            })
        }

        if(!text){
            return res.status(400).json({
                message: "Text is required",
                success: false,
                err: "Text is required"
            })
        }
    
        const comment = await commentModel.create({
            taskId: task._id,
            user: user._id,
            text
        })

        return res.status(200).json({
            message: "Add comment successfully",
            success: true,
            comment
        })

    } catch (err) {
        return res.status(400).json({
            message: "Unexpected error",
            success: false,
            err: err.message
        })
    }
}

// Get all comment list
export async function getCommentsList(req, res) {
    try {
        const userId = req.userId
        const { taskid, workspaceid } = req.params

        const task = await taskModel.findById(taskid)
        if(!task){
            return res.status(404).json({
                message: "Task not found",
                success: false,
                err: "Task not found"
            })
        }

        if(task.workspaceId.toString() !== workspaceid){
            return res.status(403).json({
                message: "Task not from the selected workspace",
                success: false,
                err: "Task not from the selected workspace"
            })
        }

        const allComments = await commentModel.find({
            workspaceId: workspaceid,
            taskId: taskid
        })

        return res.status(200).json({
            message: "All comments fetched successfully",
            success: true,
            allComments
        })

    } catch (err) {
        return res.status(400).json({
            message: "Unexpected error",
            success: false,
            err: err.message
        })
    }
}

// Delete comment
export async function deleteCommentController(req, res) {
    try {
        const userId = req.userId
        const { commentid } = req.params

        const comment = await commentModel.findById(commentid)
        if(!comment){
            return res.status(404).json({
                message: "Comment not found",
                success: false,
                err: "Comment not found"
            })
        }

        const user = await userModel.findById(userId)
        if(!user){
            return res.status(404).json({
                message: "User not found",
                success: false,
                err: "User not found"
            })
        }

        if(user.role === "user" || user.role === "head"){
            if(!comment.user.equals(user._id)){
                return res.status(403).json({
                    message: "User can delete only their comment",
                    success: false,
                    err: "User can delete only their comment"
                })
            }
        }

        const deletedComment = await commentModel.findByIdAndDelete(commentid)
        
        return res.status(200).json({
            message: "Comment deleted successfully",
            success: true,
            deletedComment
        })

    } catch (err) {
        return res.status(400).json({
            message: "Unexpected error",
            success: false,
            err: err.message
        })
    }
}