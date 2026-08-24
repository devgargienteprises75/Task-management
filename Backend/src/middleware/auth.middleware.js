import jwt from 'jsonwebtoken'
import { config } from '../config/config.js';
import { redis } from '../config/cache.js';

export async function verifyUser(req, res, next) {
    const authHeader = req.headers.authorization
    const token = (authHeader && authHeader.startsWith('Bearer ')) 
        ? authHeader.split(' ')
        : req.cookies.token;

    if(!token){
        return res.status(401).json({
            message: "Token missing, user not logged in",
            success: false,
            err: "Token missing"
        })
    }

    const isBlacklisted = await redis.get(token)
    if(isBlacklisted){
        return res.status(401).json({
            message: "Token blacklisted, please login again",
            success: false,
            err: "Token blacklisted"
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