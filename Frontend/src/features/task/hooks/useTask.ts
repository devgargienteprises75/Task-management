import { useDispatch, useSelector } from "react-redux"
import { taskApi } from "../services/task.api"
import { setAllTask, setDeleteTask, setRestoreTask, setError, setLoading, setTask, setUpdateTask } from "../task.slice"
import type { task, UpdatedTask } from "@/types"
import type { RootState } from "@/app/app.store"

const useTask = () => {

    const { getTasks, createTask, getAllTasks, updateTask, deleteTask } = taskApi
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

    const handleDeleteTask = async (workspaceId: string, taskId: string) => {
        dispatch(setLoading(true))

        const index = allTask.findIndex(t => t._id === taskId)
        const previousTask = allTask[index]
        dispatch(setDeleteTask(taskId))

        try {
            const res = await deleteTask(workspaceId, taskId)
            return {
                success: true,
                message: res.message
            }
        } catch (err:any) {
            // Rollback: restore the task at its original position
            if (previousTask) dispatch(setRestoreTask({ task: previousTask, index }))
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
        handleUpdateTask,
        handleDeleteTask
    }
}

export default useTask