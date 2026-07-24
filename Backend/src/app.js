import cookieParser from 'cookie-parser'
import express from 'express'
import authRouter from './routes/auth.route.js'
import workspaceRouter from './routes/workspace.route.js'
import taskRouter from './routes/task.routes.js'
import { workspaceModel } from './models/workspace.model.js'

const app = express()

app.use(express.json())
app.use(cookieParser())

export const initGeneralWorkspace = async () => {
    const workspace = await workspaceModel.findOne({ isGeneral: true })
    if(workspace){
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

export default app