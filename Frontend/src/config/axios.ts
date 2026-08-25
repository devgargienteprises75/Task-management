import axios from "axios";

const baseURL = import.meta.env.VITE_API_BASE_URL || (
    import.meta.env.PROD
        ? (window.location.origin.includes("vercel.app") 
            ? "https://task-management-wjl7.onrender.com/api" 
            : "/api")
        : "http://localhost:8000/api"
);

const api = axios.create({
    baseURL,
    withCredentials: true
})

// Request Inteceptor
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token')
    if(token){
        config.headers.Authorization = `Bearer ${token}`
    }
    return config
}, (error) => {
    return Promise.reject(error)
})

// Response Interceptor
api.interceptors.response.use((response) => {
    return response
}, (error) => {
    if(error.response?.status === 401){
        localStorage.removeItem('token')
        console.error("Token expired, Redirecting to login...")
        window.location.href = "/login"
    }
    return Promise.reject(error)
})

export default api;