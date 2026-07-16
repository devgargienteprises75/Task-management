import { RouterProvider } from "react-router-dom"
import { routes } from "./app.routes"
import { useSelector } from "react-redux"
import type { RootState } from "./app.store"
import { useEffect } from "react"
import useAdmin from "@/features/admin/hooks/useAdmin"
import useAuth from "@/features/auth/hooks/useAuth"

const App = () => {

  const { user, isLoading } = useSelector((state: RootState) => state.auth)
  const { handleGetUsers } = useAdmin()
  const { handleGetMe } = useAuth()

  
  console.log(user);
  console.log(isLoading);

  useEffect(() => {
    handleGetMe()
  }, [])


  
  // if(user.role === 'admin' || user.role === 'head'){
  //   useEffect(() => {
  //     handleGetUsers()
  //   }, [])
  // }

  return (
    <RouterProvider router={routes} />
  )
}

export default App