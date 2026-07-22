import { useEffect } from "react"
import useTask from "../hooks/useTask"

const Tasks = () => {

    const { handleGetTask } = useTask()

  return (
    <div>Tasks</div>
  )
}

export default Tasks