import mongoose from "mongoose"
import { taskModel } from "../models/task.model.js"
import { userModel } from "../models/user.model.js"
import { workspaceModel } from "../models/workspace.model.js"

// Create and assign task
export async function createTaskController(req, res) {
    try {
        const { workspaceid } = req.params
        const userId = req.userId
        const { title, description, assignTo, priority, dueDate} = req.body

        if(!title || !description || !assignTo){
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
            assignTo,
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

// Fetch all tasks
export async function getTasksController(req, res) {
    try {
        const { workspaceid } = req.params
        const userId = req.userId

        const tasks = await taskModel.find({ workspaceId: workspaceid })
        

    } catch (err) {
        return res.status(400).json({
            message: "Unexpected error",
            success: false,
            err: err.message
        })
    }
}

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

        if(user.role === "user"){
            const newTask = await taskModel.findByIdAndUpdate(
                task._id,
                { $set: { status } },
                { runValidators: true, new: true }
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