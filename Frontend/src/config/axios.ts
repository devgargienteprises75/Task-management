import axios from "axios";

const api = axios.create({
    baseURL: "/api",
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