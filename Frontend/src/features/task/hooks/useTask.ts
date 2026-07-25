import { useDispatch } from "react-redux"
import { taskApi } from "../services/task.api"
import { setAllTask, setError, setLoading, setTask } from "../task.slice"
import type { task } from "@/types"

const useTask = () => {

    const { getTasks, createTask, getAllTasks } = taskApi
    const dispatch = useDispatch()

    const handleGetTask = async (workspaceId: string) => {
        dispatch(setLoading(true))

        try {
            const res = await getTasks(workspaceId)
            dispatch(setAllTask(res.tasks))
            return {
                success: true,
                message: res.message
            }
        } catch (err: any) {
            const message = err?.response?.data?.message || err.message;
            dispatch(setError(message))
            return {
                success: false,
                message: message
            }
        } finally {
            dispatch(setLoading(false))
        }
    }

    const handleGetAllTask = async () => {
        dispatch(setLoading(true))

        try {
            const res = await getAllTasks()
            dispatch(setAllTask(res.tasks))
            return {
                success: true,
                message: res.message
            }
        } catch (err: any) {
            const message = err?.response?.data?.message || err.message;
            dispatch(setError(message))
            return {
                success: false,
                message: message
            }
        } finally {
            dispatch(setLoading(false))
        }
    }
    
    const handleCreateTask = async (workspaceId: string, taskDetails: task) => {
        dispatch(setLoading(true))

        try {
            const res = await createTask(workspaceId, taskDetails)
            dispatch(setTask(res.task))
            return {
                success: true,
                message: res.message
            }
        } catch (err:any) {
            const message = err?.response?.data?.message || err.message;
            dispatch(setError(message))
            return {
                success: false,
                message: message
            }
        } finally {
            dispatch(setLoading(false))
        }
    }

    return {
        handleGetTask,
        handleGetAllTask,
        handleCreateTask
    }
}

export default useTask