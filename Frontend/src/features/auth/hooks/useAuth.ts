import { useDispatch } from "react-redux"
import { loginSuccess, logoutSuccess, setError, setLoading } from "../auth.slice"
import { authApi } from "../services/auth.api"
import type { LoginCredentials } from "@/types"

const useAuth = () => {

    const dispatch = useDispatch()
    const { login, getMe, logout, editUser } = authApi

    const handleLogin = async (credential: LoginCredentials) => {
        dispatch(setLoading(true))

        try {
            const res = await login(credential)
            dispatch(loginSuccess(res.user))
        } catch (err: any) {
            const message = err.response?.data?.message || err.message
            dispatch(setError(message))
            return message
        } finally {
            dispatch(setLoading(false))
        }
    }

    const handleGetMe = async () => {
        dispatch(setLoading(true))

        try {
            const res = await getMe()
            dispatch(loginSuccess(res.user))
            return {
                success: true,
                message: res.message
            }
        } catch (err: any) {
            const message = err?.response?.data?.message || err.message
            dispatch(setLoading(false))
            return {
                success: false,
                message
            } 
        } finally {
            dispatch(setLoading(false))
        }
    }

    const handleLogout = async () => {
        dispatch(setLoading(true))

        try {
            const res = await logout();
            dispatch(logoutSuccess())
            return {
                success: true,
                message: res.message,
            }
        } catch (err: any) {
            const message = err?.response?.data?.message || err.message
            dispatch(setError(message))
            return {
                success: false,
                message
            }
        } finally {
            dispatch(setLoading(false))
        }
    }

    const handleEditUser = async (id: string, username: string) => {
        dispatch(setLoading(true))

        try {
            const res = await editUser(id, username)
            dispatch(loginSuccess(res.user))
            return {
                success: true,
                message: res.message
            }
        } catch (err: any) {
            const message = err?.response?.data?.message || err.message
            dispatch(setError(message))
            return {
                success: false,
                message
            } 
        } finally {
            dispatch(setLoading(false))
        }
    }

    return {
        handleLogin,
        handleGetMe,
        handleLogout,
        handleEditUser
    }
}

export default useAuth;