import { userModel } from "../models/user.model.js"

export async function registerController(req, res) {
    const { username, email, password } = req.body

    const isUserExist = await userModel.findOne({ email })
    if(isUserExist){
        return res.status(409).json({
            message: "User already exist with this email",
            success: false,
            err: "User already exist"
        })
    }

    const user = await userModel.create({
        username,
        email,
        password
    })

    res.status(201).json({
        message: "User registered successfully",
        success: true,
        user: {
            username: user.username,
            email: user.username
        }
    })
}