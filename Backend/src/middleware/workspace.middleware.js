import jwt from 'jsonwebtoken'
import { userModel } from '../models/user.model.js';

export async function workspaceVerification(req, res, next) {
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
        decoded = jwt.verify(token, process.env.JWT_SECRET)

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