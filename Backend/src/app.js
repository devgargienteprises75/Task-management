import cookieParser from 'cookie-parser'
import express from 'express'
import authRouter from './routes/auth.route.js'
import workspaceRouter from './routes/workspace.route.js'
import taskRouter from './routes/task.routes.js'
import { workspaceModel } from './models/workspace.model.js'
import cors from 'cors'
import webpush from 'web-push'
import { config } from './config/config.js'
import { verifyUser } from './middleware/auth.middleware.js'
import { subscriptionModel } from './models/subscription.model.js'
import path from 'path'

const app = express()

const __dirname = path.join(process.cwd(), "")

app.use(cors({  
    origin: ["https://task-management-mauve-beta-80.vercel.app", "http://localhost:5173", "http://localhost:4173", "http://localhost:8000"],
    credentials: true
}))
app.use(express.json())
app.use(cookieParser())
app.use(express.static("./public"))

webpush.setVapidDetails(
    "https://task-management-mauve-beta-80.vercel.app",
    config.PUBLIC_VAPID_KEY,
    config.PRIVATE_VAPID_KEY
)

app.post("/api/subscribe", verifyUser, async (req, res) => {
    try {
        const { endpoint, expirationTime, keys } = req.body
        const userId = req.userId
    
        await subscriptionModel.findOneAndUpdate(
            { endpoint },
            {
                user: userId,
                expirationTime,
                endpoint,
                keys
            },
            { upsert: true, new: true }
        )
    
        return res.status(201).json({
            message: "Subscribed successfully",
            success: true
        })
    } catch (err) {
        return res.status(400).json({
            message: "Failed to save subscription",
            success: false,
            err: err.message
        })
    }
})

export const initGeneralWorkspace = async () => {
    const workspace = await workspaceModel.findOne({ isGeneral: true })
    if (workspace) {
        console.log("Workspace already exists");
        return;
    }

    const generalWorkspace = await workspaceModel.create({
        name: "General Workspace",
        description: "All company common task will create here",
        isGeneral: true
    })

    console.log("General workspace created successfully", generalWorkspace);
}

// Health Check
app.get('/health', (req, res) => {
    res.json({ message: "Server is running" })
})

app.use('/api/auth', authRouter)
app.use('/api/workspace', workspaceRouter)
app.use('/api/tasks', taskRouter)

app.get("*name", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"))
})

export default app