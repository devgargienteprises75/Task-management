import { RouterProvider } from "react-router-dom"
import { routes } from "./app.routes"
import { useSelector } from "react-redux"
import type { RootState } from "./app.store"
import { useEffect } from "react"
import useAdmin from "@/features/admin/hooks/useAdmin"
import useAuth from "@/features/auth/hooks/useAuth"
import useWorkspace from "@/features/workspace/hooks/useWorkspace"

const App = () => {

  const { user } = useSelector((state: RootState) => state.auth)
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