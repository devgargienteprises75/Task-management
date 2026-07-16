import Loader from "@/components/Loader"
import useAuth from "@/features/auth/hooks/useAuth"
import type { AuthState } from "@/types"
import { useEffect, type ReactNode } from "react"
import { useSelector } from "react-redux"
import { Navigate } from "react-router-dom"

interface ProtectedProps {
    children: ReactNode
}

const Protected = ({ children }: ProtectedProps) => {
    const { user, isAuthenticated, isLoading } = useSelector((state: { auth: AuthState}) => state.auth)
    const { handleGetMe } = useAuth()

    useEffect(() => {
        handleGetMe()
    }, [])

    if(isLoading) return <Loader />

    if(!user && !isAuthenticated){
        return <Navigate to="/login" replace />
    }

    return children
}

export default Protected;