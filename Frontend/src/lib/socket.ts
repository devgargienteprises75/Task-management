import { io } from 'socket.io-client'

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || (import.meta.env.PROD ? "https://task-management-wjl7.onrender.com" : 'http://localhost:8000');

export const socket = io(SOCKET_URL, {
    autoConnect: false,
    withCredentials: true
})