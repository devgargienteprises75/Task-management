import axios from "axios";

const baseURL = import.meta.env.VITE_API_BASE_URL || (
    import.meta.env.PROD
        ? "https://task-management-wjl7.onrender.com/api"
        : "http://localhost:8000/api"
);

const api = axios.create({
    baseURL,
    withCredentials: true
})

// Request Inteceptor
api.interceptors.request.use((config) => {
    return config
}, (error) => {
    return Promise.reject(error)
})

// Response Interceptor
api.interceptors.response.use((response) => {
    return response
}, (error) => {
    if(error.response?.status === 401){
        console.error("Unauthorized Redirecting to login...")
    }
    return Promise.reject(error)
})

export default api;