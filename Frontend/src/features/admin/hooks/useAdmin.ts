import { useDispatch } from "react-redux"
import { addUserToList, setAdminLoading, setUser, updateUserInList } from "../admin.slice"
import { adminApi } from "../services/admin.api"
import type { CreateUserPayload, UpdateUserPayload } from "@/types/admin.types"

const useAdmin = () => {
    const dispatch = useDispatch()
    const { getAllUser, addUser, updateUser } = adminApi

    const handleGetUsers = async () => {
        dispatch(setAdminLoading(true))

        try {
            const res = await getAllUser()
            dispatch(setUser(res.allUser))
            return {
                success: true,
                message: res.message
            }
        } catch (err) { 
            const message = err?.response?.data?.message || err.message
            return {
                success: false,
                message
            }
        } finally {
            dispatch(setAdminLoading(false))
        }
    }

    const handleAddUser = async (credential: CreateUserPayload) => {
        dispatch(setAdminLoading(true))

        try {
            const res = await addUser(credential)
            dispatch(addUserToList(res.user))
            return {
                success: true,
                message: res.message
            }
        } catch (err: any) {
            const message = err?.response?.data?.message || err.message
            return { 
                success: false,
                message
            } 
        } finally {
            dispatch(setAdminLoading(false))
        }
    }

    const handleUpdateUser = async (userId: any, credential: UpdateUserPayload) => {
        dispatch(setAdminLoading(true))

        try {
            const res = await updateUser(userId, credential)
            dispatch(updateUserInList(res.updatedUser))
            return {
                success: true,
                message: res.message
            }
        } catch (err: any) {
            const message = err?.response?.data?.message || err.message;
            return {
                success: false,
                message
            }
        } finally {
            dispatch(setAdminLoading(false))
        }
    }

    return {
        handleGetUsers,
        handleAddUser,
        handleUpdateUser
    }
}

export default useAdmin