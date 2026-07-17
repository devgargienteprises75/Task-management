import { RouterProvider } from "react-router-dom"
import { routes } from "./app.routes"
import { useSelector } from "react-redux"
import type { RootState } from "./app.store"
import { useEffect } from "react"
import useAdmin from "@/features/admin/hooks/useAdmin"
import useAuth from "@/features/auth/hooks/useAuth"

const App = () => {

  const { user } = useSelector((state: RootState) => state.auth)
  const { handleGetUsers } = useAdmin()
  const { handleGetMe } = useAuth()

  useEffect(() => {
    handleGetMe()
  }, [])

  return (
    <RouterProvider router={routes} />
  )
}

export default App