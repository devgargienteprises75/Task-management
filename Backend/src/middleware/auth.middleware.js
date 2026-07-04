import jwt from 'jsonwebtoken'
import { config } from '../config/config.js';

export async function verifyUser(req, res, next) {
    const { token } = req.cookies

    if(!token){
        return res.status(401).json({
            message: "Token missing, user not logged in",
            success: false,
            err: "Token missing"
        })
    }

    let decoded;

    try {
        decoded = jwt.verify(token, config.JWT_SECRET)

        if(!decoded.id){
            return res.status(401).json({
                message: "Unauthorized token",
                success: false,
                err: "Unauthorized"
            })
        }

        req.userId = decoded.id
        next()
    } catch (err) {
        return res.status(400).json({
            message: "Unexpected error",
            success: false,
            err: err.message
        })
    }
}