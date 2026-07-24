import jwt from 'jsonwebtoken'
import { userModel } from '../models/user.model.js';
import { workspaceModel } from '../models/workspace.model.js';
import { config } from '../config/config.js';
import mongoose from 'mongoose';

export async function requireAdminOrHead(req, res, next) {
    const { token } = req.cookies

    if(!token){
        return res.status(401).json({
            message: "Missing token",
            success: false,
            err: "Missing token"
        })
    }

    let decoded;

    try {
        decoded = jwt.verify(token, config.JWT_SECRET)

        const user = await userModel.findById(decoded.id)
        if(!user){
            return res.status(401).json({
                message: "Unauthorized user",
                success: false,
                err: "Unauthorized user"
            })
        }

        if(user.role !== "admin" && user.role !== "head"){
            return res.status(403).json({
                message: "Only Admin and Heads can access this path",
                success: false,
                err: "Only Admin and Heads can access this path"
            })
        }

        req.userId = user._id
        next()
    } catch (err) {
        return res.status(400).json({
            message: "Unexpected error",
            success: false,
            err: err.message
        })
    }
}

export async function verifyWorkspaceOwnership(req, res, next) {
    try {
        const { workspaceid } = req.params;
        const { assignTo } = req.body;
        const userId = req.userId;
    
        if(!workspaceid){
            return res.status(400).json({
                message: "Workspace Id not available",
                success: false,
                err: "Workspace Id not available"
            })
        }
    
        const workspace = await workspaceModel.findById(workspaceid)
        if(!workspace){
            return res.status(404).json({
                message: "Workspace not found",
                success: false,
                err: "Workspace not found"
            })
        }

        if(!workspace.isGeneral){
            if(!workspace.createdBy.equals(userId)){
                return res.status(401).json({
                    message: "Workspace not owned by this user",
                    success: false,
                    err: "Workspace not owned by this user"
                })
            }
            const assignToId = assignTo.map((id) => new mongoose.Types.ObjectId(id))
        
            const assignedMember = workspace.members.filter((id) => assignToId.includes(id.toString()))
            if(assignedMember.length !== assignToId.length){
                return res.status(400).json({
                    message: "Assign user is not the member of this workspace",
                    success: false,
                    err: "Assign user is not the member of this workspace"
                })
            }
        }

        next()
    } catch (err) {
        return res.status(400).json({
            message: "Unexpected error",
            success: false,
            err: err.message
        })
    }
}

export async function verifyWorkspaceUser(req, res, next){
    try {
        const { workspaceid, taskid } = req.params;
        const userId = req.userId
    
        if(!workspaceid){
            return res.status(400).json({
                message: "Workspace Id not available",
                success: false,
                err: "Workspace Id not available"
            })
        }

        const workspace = await workspaceModel.findById(workspaceid);
        if(!workspace){
            return res.status(404).json({
                message: "Workspace not found",
                success: false,
                err: "Workspace not found"
            })
        }

        const workspaceMember = workspace.members.find((id) => userId === id.toString())
        
        if(!workspace.isGeneral){
            if(!workspaceMember && !workspace.createdBy.equals(userId)){
                return res.status(400).json({
                    message: "Member are not from this workspace",
                    success: false,
                    err: "Member are not from this workspace"
                })
            }
        }

        next()
    } catch (err) {
        return res.status(400).json({
            message: "Unexpected error",
            success: false,
            err: err.message
        })
    }
}