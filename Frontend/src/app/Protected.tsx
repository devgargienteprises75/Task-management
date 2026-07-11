import type { AuthState } from "@/types"
import type { ReactNode } from "react"
import { useSelector } from "react-redux"
import { Navigate } from "react-router-dom"

interface ProtectedProps {
    children: ReactNode
}

const Protected = ({ children }: ProtectedProps) => {
    const { isAuthenticated } = useSelector((state: { auth: AuthState}) => state.auth)

    if(!isAuthenticated){
        return <Navigate to="/login" replace />
    }

    return <>{children}</>
}

export default Protected;