import { RouterProvider } from "react-router-dom"
import { routes } from "./app.routes"
import { useEffect } from "react"
import useAdmin from "@/features/admin/hooks/useAdmin"
import useAuth from "@/features/auth/hooks/useAuth"
import useWorkspace from "@/features/workspace/hooks/useWorkspace"
import { useSelector } from "react-redux"
import type { RootState } from "./app.store"

const App = () => {

  const { handleGetUsers } = useAdmin()
  const { handleGetMe } = useAuth()
  const { handleGetWorkspaces } = useWorkspace()
  const user = useSelector((state: RootState) => state.auth.user)

  useEffect(() => {
    handleGetMe()
  }, [])

  useEffect(() => {
    if(user){
      handleGetUsers()
      handleGetWorkspaces()
    }
  }, [user])

  return (
    <RouterProvider router={routes} />
  )
}

export default App