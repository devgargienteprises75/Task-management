import mongoose from "mongoose";
import { userModel } from "../models/user.model.js";
import { workspaceModel } from "../models/workspace.model.js";

export async function createWorkspaceController(req, res) {
    try {
        const { name, description, members } = req.body

        if (!name) {
            return res.status(400).json({
                message: "Workspace name is required",
                success: false,
                err: "Workspace name is required"
            })
        }

        // Validate members if provided
        let verifiedMembers = [];
        if (members) {
            if (!Array.isArray(members)) {
                return res.status(400).json({
                    message: "Members must be an array of user IDs",
                    success: false,
                    err: "Members must be an array of user IDs"
                })
            }

            // Verify they are valid ObjectIds
            for (const memberId of members) {
                if (!mongoose.Types.ObjectId.isValid(memberId)) {
                    return res.status(400).json({
                        message: `Invalid member user ID format: ${memberId}`,
                        success: false,
                        err: "Invalid ObjectId format"
                    })
                }
            }

            // Remove duplicates from the input array
            verifiedMembers = [...new Set(members)];

            // Verify that all users actually exist in the database
            const existingUsersCount = await userModel.countDocuments({ _id: { $in: verifiedMembers } });
            if (existingUsersCount !== verifiedMembers.length) {
                return res.status(400).json({
                    message: "One or more member user IDs do not exist",
                    success: false,
                    err: "User not found"
                })
            }
        }

        // Check if workspace name is already taken to avoid duplicate key crash (11000)
        const existingWorkspace = await workspaceModel.findOne({ name });
        if (existingWorkspace) {
            return res.status(400).json({
                message: "Workspace name already exists",
                success: false,
                err: "Workspace name already exists"
            })
        }

        const workspace = await workspaceModel.create({
            name,
            description,
            members: verifiedMembers,
            createdBy: req.userId
        })

        const populatedWorkspace = await workspaceModel.findById(workspace._id)
            .populate("members", "username email role")
            .populate("createdBy", "username email role");

        res.status(200).json({
            message: "Workspace created successfully",
            success: true,
            workspace: populatedWorkspace
        })
    } catch (err) {
        return res.status(500).json({
            message: "Failed to create workspace",
            success: false,
            err: err.message
        })
    }
}

export async function getWorkspaceController(req, res) {
    try {
        // Redundant role checks removed since workspaceVerification middleware handles authentication & role checks
        const workspaces = await workspaceModel.find()
            .populate("members", "username email role")
            .populate("createdBy", "username email role");

        res.status(200).json({
            message: "Fetched workspaces successfully",
            success: true,
            workspaces
        })
    } catch (err) {
        return res.status(500).json({
            message: "Failed to fetch workspaces",
            success: false,
            err: err.message
        })
    }
}

export async function editWorkspaceController(req, res) {
    try {
        const { workspaceid } = req.params
        const { newName, newDescription, newMemberList } = req.body

        if (!mongoose.Types.ObjectId.isValid(workspaceid)) {
            return res.status(400).json({
                message: "Invalid workspace ID format",
                success: false,
                err: "Invalid workspace ID format"
            })
        }

        const workspace = await workspaceModel.findById(workspaceid)

        if (!workspace) {
            return res.status(404).json({
                message: "Workspace not found",
                success: false,
                err: "Workspace not found"
            })
        }

        const updatedWorkspace = {}

        if (newName !== undefined) {
            // Check if another workspace already uses the new name
            const existingWorkspace = await workspaceModel.findOne({ name: newName, _id: { $ne: workspaceid } });
            if (existingWorkspace) {
                return res.status(400).json({
                    message: "Workspace name already exists",
                    success: false,
                    err: "Workspace name already exists"
                })
            }
            updatedWorkspace.name = newName
        }
        if (newDescription !== undefined) {
            updatedWorkspace.description = newDescription
        }
        if (newMemberList !== undefined) {
            if (!Array.isArray(newMemberList)) {
                return res.status(400).json({
                    message: "Member list must be an array of user IDs",
                    success: false,
                    err: "Member list must be an array"
                })
            }

            // Verify they are valid ObjectIds
            for (const memberId of newMemberList) {
                if (!mongoose.Types.ObjectId.isValid(memberId)) {
                    return res.status(400).json({
                        message: `Invalid member user ID format: ${memberId}`,
                        success: false,
                        err: "Invalid ObjectId format"
                    })
                }
            }

            // Remove duplicates
            const uniqueMemberList = [...new Set(newMemberList)];

            // Verify they exist in DB
            const existingUsersCount = await userModel.countDocuments({ _id: { $in: uniqueMemberList } });
            if (existingUsersCount !== uniqueMemberList.length) {
                return res.status(400).json({
                    message: "One or more member user IDs do not exist",
                    success: false,
                    err: "User not found"
                })
            }

            updatedWorkspace.members = uniqueMemberList
        }

        const newWorkspace = await workspaceModel.findByIdAndUpdate(
            workspace._id,
            { $set: updatedWorkspace },
            { runValidators: true, returnDocument: 'after' }
        )
            .populate("members", "username email role")
            .populate("createdBy", "username email role");

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
    try {
        const { workspaceid } = req.params

        if (!mongoose.Types.ObjectId.isValid(workspaceid)) {
            return res.status(400).json({
                message: "Invalid workspace ID format",
                success: false,
                err: "Invalid workspace ID format"
            })
        }

        const workspace = await workspaceModel.findById(workspaceid)

        if (!workspace) {
            return res.status(404).json({
                message: "Workspace not found",
                success: false,
                err: "Workspace not found"
            })
        }

        await workspaceModel.findByIdAndDelete(workspace._id)

        res.status(200).json({
            message: "Workspace deleted successfully",
            success: true
        })
    } catch (err) {
        return res.status(500).json({
            message: "Failed to delete workspace",
            success: false,
            err: err.message
        })
    }
}

export async function addUserController(req, res) {
    const { workspaceid } = req.params
    const { newMemberList } = req.body

    const workspace = await workspaceModel.findById(workspaceid)

    if(!workspace){
        return res.status(400).json({
            message: "Workspace not found",
            success: false,
            err: "Workspace not found"
        })
    }

    if(newMemberList === undefined){
        return res.status(400).json({
            message: "New members list is empty",
            success: false,
            err: "Members list is empty"
        })
    }

    if(!Array.isArray(newMemberList)){
        return res.status(400).json({
            message: "Member list must be an array of user IDs",
            success: false,
            err: "Member list must be an array"
        })
    }

    // Verify they are valid ObjectIds
    for(const memberId of newMemberList){
        if(!mongoose.Types.ObjectId.isValid(memberId)){
            return res.status(400).json({
                message: `Invalid member user ID format: ${memberId}`,
                success: false,
                err: "Invalid ObjectId format"
            })
        }
    }

    // Remove duplicates
    const uniqueMemberList = [...new Set(newMemberList)]

    // Verify they exist in DB
    const existingUsersCount = await userModel.countDocuments({ _id: { $in: uniqueMemberList }})
    if(existingUsersCount !== uniqueMemberList.length){
        return res.status(400).json({
            message: "One or more member user IDs do not exist",
            success: false,
            err: "User not found"
        })
    }

    const userAdd = await workspaceModel.findByIdAndUpdate(
        workspace._id,
        { 
            $addToSet: {
                members:{ $each: uniqueMemberList }
            },
        },
        { returnDocument: 'after' }
    )
    .populate("members", "username email role")
    .populate("createdBy", "username email role")

    res.status(200).json({
        message: "Add User Successfully",
        success: true,
        userAdd
    })
}

export async function removeUserController(req, res) {
    try {
        const { workspaceid } = req.params
        const { userId } = req.body
    
        const workspace = await workspaceModel.findById(workspaceid)
    
        if(!workspace){
            return res.status(404).json({
                message: "Workspace not found",
                success: false,
                err: "Workspace not found"
            })
        }
    
        if(userId === undefined){
            return res.status(400).json({
                message: "New members list is empty",
                success: false,
                err: "Members list is empty"
            })
        }
    
        if(!mongoose.Types.ObjectId.isValid(userId)){
            return res.status(400).json({
                message: `Invalid member user ID format: ${userId}`,
                success: false,
                err: "Invalid ObjectId format"
            })
        }
    
        const updatedWorkspace = await workspaceModel.findByIdAndUpdate(
            workspace._id,
            { 
                $pull: {
                    members: userId
                }
            },
            { returnDocument: 'after' }
        )
        .populate("members", "username email role")
        .populate("createdBy", "username email role")
    
        return res.status(200).json({
            message: "User removed successfully",
            success: true,
            updatedWorkspace
        })

    } catch (err) {
        return res.status(400).json({
            message: "Failed to remove user",
            success: false,
            err: err.mmessage
        })
    }
}