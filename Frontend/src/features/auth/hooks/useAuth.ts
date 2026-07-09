import { useDispatch } from "react-redux"
import { loginSuccess, setError, setLoading } from "../auth.slice"
import { authApi } from "../services/auth.api"
import type { addUserCredentials, LoginCredentials } from "@/types"

const useAuth = () => {

    const dispatch = useDispatch()
    const { addUser, login } = authApi

    const handleAddUser = async (credential: addUserCredentials) => {

        dispatch(setLoading(true))

        try {
            const res = await addUser(credential)
            dispatch(loginSuccess(res.user))
            dispatch(setLoading(false))
        } catch (err: any) {
            const message = err.response?.data?.message || err.message
            dispatch(setError(message))
            return message
        } finally {
            dispatch(setLoading(false))
        }
    }

    const handleLogin = async (credential: LoginCredentials) => {
        dispatch(setLoading(true))

        try {
            const res = await login(credential)
            dispatch(loginSuccess(res.user))
            dispatch(setLoading(false))
        } catch (err: any) {
            const message = err.response?.data?.message || err.message
            dispatch(setError(message))
            return message
        } finally {
            dispatch(setLoading(false))
        }
    }

    return {
        handleAddUser,
        handleLogin
    }
}

export default useAuth;