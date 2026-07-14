import { useDispatch } from "react-redux"
import { setAdminLoading, setUser } from "../admin.slice"
import { adminApi } from "../services/admin.api"

const useAdmin = () => {
    const dispatch = useDispatch()
    const { getAllUser, addUser, updateUser } = adminApi

    const handleGetUsers = async () => {
        dispatch(setAdminLoading(true))

        try {
            const res = await getAllUser()
            dispatch(setUser(res.allUser))
            dispatch(setAdminLoading(false))
        } catch (err) { 
            const message = err?.response?.data?.message || err.message
            return message
        } finally {
            dispatch(setAdminLoading(false))
        }
    }

    return {
        handleGetUsers
    }
}

export default useAdmin