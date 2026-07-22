import { useDispatch } from "react-redux"
import { taskApi } from "../services/task.api"
import { setAllTask, setError, setLoading } from "../task.slice"

const useTask = () => {

    const { getTasks, createTask } = taskApi
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


  return {
    handleGetTask,
  }
}

export default useTask