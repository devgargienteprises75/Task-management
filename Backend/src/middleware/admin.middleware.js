import jwt from 'jsonwebtoken'
import { userModel } from '../models/user.model.js';

export async function verifyAdmin(req, res, next) {
    const { token } = req.cookies

    if(!token){
        return res.status(401).json({
            message: "Missing token",
            success: false,
            err: "Token missing"
        })
    }

    let decoded;

    try {
        decoded = jwt.verify(token, process.env.JWT_SECRET)

        if(!decoded.id){
            return res.status(401).json({
                message: "Unauthorized token",
                success: false,
                err: "Unauthorized token"
            })
        }

        const user = await userModel.findById(decoded.id)

        if(user.role !== "admin"){
            return res.status(403).json({
                message: "Only admin can access this path",
                success: false,
                err: "Only admin can access this path"
            })
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