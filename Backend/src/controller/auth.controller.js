import { userModel } from "../models/user.model.js"
import jwt, { decode } from 'jsonwebtoken'
import sendEmail from "../services/email.service.js"
import bcrypt from "bcryptjs"
import { config } from "../config/config.js"

// Add User controller
export async function addUserController(req, res) {
    const userId = req.userId
    const { username, email, role, password } = req.body

    const adminUser = await userModel.findById(userId)

    if(adminUser.role !== "admin"){
        return res.status(403).json({
            message: "Only admin can add user",
            success: false,
            error: "Only admin can add user"
        })
    }

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
        role,
        password
    })

    res.status(201).json({
        message: "User registered successfully",
        success: true,
        user: {
            username: user.username,
            email: user.email,
            role: user.role,
            isActive: user.isActive
        }
    })
}

// Login controller
export async function loginController(req, res){
    const { email, password } = req.body

    const user = await userModel.findOne({ email })
    if(!user){
        return res.status(404).json({
            message: "User not exist with this email, register first.",
            success: false,
            err: "User not exist"
        })
    }

    const correctPass = await user.comparePassword(password)
    if(!correctPass){
        return res.status(401).json({
            message: "Invalid credential",
            success: false,
            err: "Invalid credential"
        })
    }

    const token = jwt.sign({
        id: user._id
    }, config.JWT_SECRET, { expiresIn: '7d' })

    res.cookie("token", token)

    res.status(200).json({
        message: "User logged in successfully",
        success: true,
        user: {
            username: user.username,
            email: user.email,
            role: user.role,
            isActive: user.isActive
        }
    })
}

// Get-me Controlle
export async function getMeController(req, res) {
    try {
        const userId = req.userId

        const user = await userModel.findById(userId)
        
        return res.status(200).json({
            message: "Get user successfully",
            success: true,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                role: user.role,
                isActive: user.isActive
            }
        })

    } catch (err) {
        return res.status(400).json({
            message: "Unexpected Error",
            success: false,
            err: err.message
        })
    }
}

// Forget password controller
export async function forgetPasswordController(req, res) {
    const { email } = req.body

    const user = await userModel.findOne({ email })
    if(!user){
        return res.status(404).json({
            message: "User not exist with this email",
            success: false,
            err: "User not exist"
        })
    }

    const token = jwt.sign({
        id: user._id
    }, config.JWT_SECRET, { expiresIn: '15m' })

    const hashedToken = await bcrypt.hash(token, 8)

    await userModel.findByIdAndUpdate(
        user._id,
        { resetToken: hashedToken }
    )

    const resetLink = `${process.env.CLIENT_URL || 'http://localhost:8000'}/reset-password?token=${token}`

    await sendEmail({
        to: email,
        subject: "Reset your password",
        html: `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="utf-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Reset Your Password</title>
                <style>
                    body {
                        font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
                        background-color: #f9fafb;
                        margin: 0;
                        padding: 0;
                        -webkit-font-smoothing: antialiased;
                    }
                    .container {
                        max-width: 600px;
                        margin: 0 auto;
                        padding: 40px 20px;
                    }
                    .card {
                        background-color: #ffffff;
                        border-radius: 16px;
                        padding: 40px;
                        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
                        border: 1px solid #f3f4f6;
                    }
                    .logo {
                        font-size: 24px;
                        font-weight: 800;
                        color: #7c3aed;
                        margin-bottom: 24px;
                        text-align: center;
                    }
                    .heading {
                        font-size: 22px;
                        font-weight: 700;
                        color: #1f2937;
                        margin-top: 0;
                        margin-bottom: 16px;
                        text-align: center;
                    }
                    .text {
                        font-size: 16px;
                        color: #4b5563;
                        line-height: 1.6;
                        margin-bottom: 32px;
                        text-align: center;
                    }
                    .button-wrapper {
                        text-align: center;
                        margin-bottom: 32px;
                    }
                    .button {
                        display: inline-block;
                        background-color: #7c3aed;
                        color: #ffffff !important;
                        text-decoration: none;
                        padding: 14px 32px;
                        font-size: 16px;
                        font-weight: 600;
                        border-radius: 8px;
                        box-shadow: 0 4px 6px -1px rgba(124, 58, 237, 0.3), 0 2px 4px -1px rgba(124, 58, 237, 0.1);
                        text-align: center;
                    }
                    .footer {
                        font-size: 13px;
                        color: #9ca3af;
                        text-align: center;
                        line-height: 1.5;
                        border-top: 1px solid #f3f4f6;
                        padding-top: 24px;
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="card">
                        <div class="logo">GGS Task Management</div>
                        <h1 class="heading">Reset your password</h1>
                        <p class="text">
                            You recently requested to reset your password for your GGS Task Management account. Click the button below to choose a new one. This link is valid for 15 minutes.
                        </p>
                        <div class="button-wrapper">
                            <a href="${resetLink}" class="button" style="color: #ffffff;">Change password</a>
                        </div>
                        <div class="footer">
                            If you did not request a password reset, please ignore this email or contact support if you have questions.<br><br>
                            &copy; ${new Date().getFullYear()} GGS Task Management. All rights reserved.
                        </div>
                    </div>
                </div>
            </body>
            </html>
        `
    })

    res.status(200).json({
        message: "Password reset link sent to your email",
        success: true
    })
}

// Reset password controller
export async function resetPasswordController(req, res) {
    const { token } = req.query
    const { newPassword, confirmPassword } = req.body

    let decoded;

    try {
        decoded = jwt.verify(token, process.env.JWT_SECRET)
    } catch (err) {
        return res.status(401).json({
            message: "Invalid or expired Token",
            success: false,
            err: "invalid or expired token"
        })
    }

    const user = await userModel.findById(decoded.id)

    if (!user) {
        return res.status(404).json({
            success: false,
            message: "User not found"
        })
    }

    if(newPassword.length < 8){
        return res.status(400).json({
            message: "Password should be 8 character",
            success: false,
            err: "Password should be 8 character"
        })
    }

    if(newPassword !== confirmPassword){
        return res.status(400).json({
            message: "Password should be match",
            success: false,
            err: "Password doesn't matched"
        })
    }

    const hashPass = await bcrypt.hash(newPassword, 10)

    if (user.resetToken == null) {
        return res.status(401).json({
            message: "Reset token already used",
            success: false,
            err: "Reset token already used"
        })
    }

    const compareToken = await bcrypt.compare(token, user.resetToken)

    if(!compareToken){
        return res.status(401).json({
            message: "Invalid reset token",
            success: false,
            err: "Invalid reset token"
        })
    }

    await userModel.findByIdAndUpdate(
        user._id,
        { $set: { 
            password: hashPass,
            resetToken: null
        }}
    )

    res.status(200).json({
        message: "Reset password successfully",
        success: true
    })
}

// Fetch user controller
export async function getUserController(req, res){
    try {
        const allUser = await userModel.find().select("-password -resetToken")
    
        res.status(200).json({
            message: "Users fetched successfully",
            success: true,
            allUser
        })
    } catch (err) {
        return res.status(400).json({
            message: "Unexpected error",
            success: false,
            err: err.message
        })
    }
}

// Update user controller
export async function updateUserController(req, res){
    try {
        const { id } = req.params
        const { newRole, currentActiveStatus } = req.body
    
        const user = await userModel.findById(id)
        if(!user){
            return res.status(404).json({
                message: "User not found",
                success: false,
                err: "User not found"
            })
        }
    
        const updateData = {}
    
        if(newRole !== undefined){
            updateData.role = newRole
        }
        if(currentActiveStatus !== undefined){
            updateData.isActive = currentActiveStatus
        }
    
        const updatedUser = await userModel.findByIdAndUpdate(
            user._id,
            { $set: updateData },
            { returnDocument: 'after', runValidators: true }
        )

        return res.status(200).json({
            message: "User update successfully",
            success: true,
            updatedUser
        })
    } catch (err) {
        return res.status(400).json({
            message: "Failed to update user",
            success: false,
            err: err.message
        })
    }
}

// delete user controller
export async function deleteUserController(req, res) {
    try {
        const { id } = req.params

        const user = await userModel.findById(id)

        if(!user){
            return res.status(404).json({
                message: "User not found",
                success: false,
                err: "User not found"
            })
        }

        if (user.role === 'admin') {
            return res.status(400).json({
                message: "You can't delete yourself",
                success: false,
                err: "You can't delete yourself"
            })
        }

        await userModel.findByIdAndDelete(user._id)

        return res.status(200).json({
            message: "Delete user successfully",
            success: true
        })
    } catch (err) {
        return res.status(400).json({
            message: "Failed to delete user",
            success: false,
            err: err.message
        })
    }
}