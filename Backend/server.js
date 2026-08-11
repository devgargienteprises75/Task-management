import app, { initGeneralWorkspace } from "./src/app.js";
import 'dotenv/config'
import connectToDb from "./src/config/database.js";
import { config } from "./src/config/config.js";
import http from 'http'
import { Server } from "socket.io";
import webpush from 'web-push';

const PORT = config.PORT || 8000

// Create HTTP server wrapping Express app
const server = http.createServer(app)

// Initialize Socket.io Server with CORS
export const io = new Server(server, {
    cors: {
        origin: ["https://task-management-mauve-beta-80.vercel.app", "http://localhost:5173", "http://localhost:4173"],
        credentials: true
    }
});

// Socket Connection Listener & Rooms
io.on('connection', (socket) => {
    // Join workspace room
    socket.on('join_workspace', (worksapceId) => {
        socket.join(`workspace_${worksapceId}`);
    })

    socket.on('leave_workspace', (workspaceId) => {
        socket.leave(`workspace_${workspaceId}`);
        console.log(`User ${socket.id} left workspace_${workspaceId}`);
    })

    socket.on('disconnect', () => {
        console.log(`User disconnected: ${socket.id}`);
    })
})

connectToDb()
    .then(async () => {
        await initGeneralWorkspace()
        server.listen(PORT, () => {
            console.log(`Server connecting to port: ${PORT}`);
        })
    })
    .catch(err => {
        console.log(err);
        process.exit(1)
    })