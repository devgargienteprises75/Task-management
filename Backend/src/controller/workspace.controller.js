import { userModel } from "../models/user.model.js"
import { workspaceModel } from "../models/workspace.model.js"

export async function createWorkspaceController(req, res) {
    const userId = req.userId
    const { name, description, members } = req.body

    const user = await userModel.findById(userId)
    if(!user){
        return res.status(404).json({
            message: "Unauthorized user",
            success: false,
            err: "Unauthorized user"
        })
    }

    if(user.role != "admin" && user.role != "head"){
        return res.status(403).json({
            message: "Only admin and heads are able to create workspaces",
            success: false,
            err: "Only admin and heads are able to create workspaces"
        })
    }

    const workspace = await workspaceModel.create({
        name,
        description,
        members,
        createdBy: user._id
    })

    res.status(200).json({
        message: "Workspace created successfully",
        success: true,
        workspace
    })
}

export async function getWorkspaceController(req, res) {
    const userId = req.userId

    const user = await userModel.findById(userId)
    if(!user){
        return res.status(401).json({
            message: "Unauthorized user",
            success: false,
            err: "Unauthorized user"
        })
    }

    if(user.role != "admin" && user.role != "head"){
        return res.status(403).json({
            message: "Only admin and heads can access this path",
            success: false,
            err: "Only admin and heads can access this path"
        })
    }

    const workspaces = await workspaceModel.find()

    res.status(200).json({
        message: "Fetched workspaces successfully",
        success: true,
        workspaces
    })
}

export async function editWorkspaceController(req, res) {
    try {
        const { workspaceid } = req.params
        const { newName, newDescription, newMemberList } = req.body
    
        const workspace = await workspaceModel.findById(workspaceid)
    
        if(!workspace){
            return res.status(404).json({
                message: "Workspace not found",
                success: false,
                err: "Workspace not found"
            })
        }
    
        const updatedWorkspace = {}
    
        if(newName != undefined){
            updatedWorkspace.name = newName
        }
        if(newDescription != undefined){
            updatedWorkspace.description = newDescription
        }
        if(newMemberList != undefined){
            updatedWorkspace.members = newMemberList
        }
    
        const newWorkspace = await workspaceModel.findByIdAndUpdate(
            workspace._id,
            { $set: updatedWorkspace},
            { runValidators: true, returnDocument: 'after'}
        )

        return res.status(200).json({
            message: "Workspace updated successfully",
            success: true,
            newWorkspace
        })
        
    } catch (err) {
        return res.status(400).json({
            message: "Failed to update workspace",
            success: false,
            err: err.message
        })
    }
}

export async function deleteWorkspaceController(req, res) {
    const { workspaceid } = req.params

    const workspace = await workspaceModel.findById(workspaceid)

    if(!workspace){
        return res.status(404).json({
            message: "Workspace not found",
            success: false,
            err: "Workspace not found"
        })
    }

    await workspaceModel.findByIdAndDelete(
        workspace._id
    )

    res.status(200).json({
        message: "Workspace deleted successfully",
        success: true
    })
}