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
        return res.status(400).json({
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
        success: false,
        workspace
    })
}