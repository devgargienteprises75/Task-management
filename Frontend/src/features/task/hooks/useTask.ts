import { useDispatch, useSelector } from "react-redux"
import { taskApi } from "../services/task.api"
import { setAllTask, setError, setLoading, setTask, setUpdateTask } from "../task.slice"
import type { task, UpdatedTask } from "@/types"
import type { RootState } from "@/app/app.store"

const useTask = () => {

    const { getTasks, createTask, getAllTasks, updateTask } = taskApi
    const dispatch = useDispatch()
    const allTask = useSelector((state: RootState) => state.task.allTask)

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
            dispatch(setTask(res.newTask))
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

    const handleUpdateTask = async (taskDetails: UpdatedTask) => {
        dispatch(setLoading(true))

        const previousTask = allTask.find(t => t._id === taskDetails._id)
        dispatch(setUpdateTask({...previousTask, ...taskDetails}))
        
        try {
            const res = await updateTask(taskDetails)
            dispatch(setUpdateTask(res.newTask))
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
        handleCreateTask,
        handleUpdateTask
    }
}

export default useTask