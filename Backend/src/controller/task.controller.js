import { taskModel } from "../models/task.model.js"
import { userModel } from "../models/user.model.js"
import { workspaceModel } from "../models/workspace.model.js"

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