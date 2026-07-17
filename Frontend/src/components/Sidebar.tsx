import type { RootState } from "@/app/app.store";
import useAdmin from "@/features/admin/hooks/useAdmin";
import { Calendar, Folder, LayoutList, Plus, User } from "lucide-react"
import { useEffect } from "react";
import { useSelector } from "react-redux"
import { useNavigate } from "react-router-dom";

const Sidebar = () => {

    const { user } = useSelector((state: RootState) => state.auth)

    const { handleGetUsers } = useAdmin()
    const navigate = useNavigate()

    useEffect(() => {
        if(user?.role === 'admin' || user?.role === 'head'){
            handleGetUsers()
        }
    }, [user])

    const getUser = async () => {
        await handleGetUsers()
        navigate("/users")
    }
    
    const getWorkspace = async () => {
        navigate("/workspaces")
    }

    return (
        <aside className="w-64 bg-[#FCFCFC] border-r border-gray-200 flex flex-col pt-8 pb-4">
            <div className="px-6 mb-8 flex items-center gap-2">
                <div className="w-6 h-6 bg-gray-900 rounded grid grid-cols-2 gap-[2px] p-1">
                    <div className="bg-white rounded-[1px]"></div>
                    <div className="bg-white rounded-[1px]"></div>
                    <div className="bg-white rounded-[1px]"></div>
                    <div className="bg-white rounded-[1px]"></div>
                </div>
                <h1 className="font-bold text-xl tracking-tight">ToDo</h1>
            </div>
            <div className="px-6 mb-8">
                <button className="w-full flex items-center justify-center gap-2 bg-[#D1F53B] text-gray-900 font-bold py-3 rounded-xl hover:bg-[#c2e532] transition-colors shadow-sm cursor-pointer">
                    <Plus size={18} strokeWidth={3} />
                    Create new Project
                </button>
            </div>
            <nav className="flex-1 px-4 space-y-1">
                <button className="flex items-center gap-3 px-4 py-2.5 text-gray-500 font-medium rounded-lg hover:text-gray-900 hover:bg-gray-50">
                    <Calendar size={18} /> Dashboard
                </button>
                <button className="flex items-center gap-3 px-4 py-2.5 text-gray-900 font-medium rounded-lg hover:text-gray-900 hover:bg-gray-50">
                    <LayoutList size={18} /> Task List
                </button>

                {user?.role === "admin" &&
                    <button
                        onClick={() => {
                            getUser()
                        }}
                        className="flex w-full items-center gap-3 px-4 py-2.5 text-gray-900 font-medium rounded-lg hover:text-gray-900 hover:bg-gray-50 cursor-pointer"
                    >
                        <User /> User list
                    </button>
                }

                <button onClick={getWorkspace} className="flex w-full items-center gap-3 px-4 py-2.5 text-gray-900 font-medium rounded-lg hover:text-gray-900 hover:bg-gray-50 cursor-pointer">
                    <Folder size={18} /> Workspaces
                </button>
            </nav>
        </aside>
    )
}

export default Sidebar