import { RouterProvider } from "react-router-dom"
import { routes } from "./app.routes"
import { useEffect } from "react"
import useAdmin from "@/features/admin/hooks/useAdmin"
import useAuth from "@/features/auth/hooks/useAuth"
import useWorkspace from "@/features/workspace/hooks/useWorkspace"

const App = () => {

  const { handleGetUsers } = useAdmin()
  const { handleGetMe } = useAuth()
  const { handleGetWorkspaces } = useWorkspace()

  useEffect(() => {
    handleGetMe()
    handleGetUsers()
    handleGetWorkspaces()
  }, [])

  return (
    <RouterProvider router={routes} />
  )
}

export default App