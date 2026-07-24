import cookieParser from 'cookie-parser'
import express from 'express'
import authRouter from './routes/auth.route.js'
import workspaceRouter from './routes/workspace.route.js'
import taskRouter from './routes/task.routes.js'

const app = express()

app.use(express.json())
app.use(cookieParser())

// Health Check
app.get('/health', (req, res) => {
    res.json({ message: "Server is running" })
})

app.use('/api/auth', authRouter)
app.use('/api/workspace', workspaceRouter)
app.use('/api/tasks', taskRouter)

export default app