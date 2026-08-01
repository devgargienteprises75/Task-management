import type { RootState } from "@/app/app.store";
import useAdmin from "@/features/admin/hooks/useAdmin";
import { Calendar, Folder, LayoutList, Plus, User, X } from "lucide-react"
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/cn";
import { setSidebarOpen } from "@/app/layout.slice";

const Sidebar = () => {

    const { user } = useSelector((state: RootState) => state.auth)
    const sidebarOpen = useSelector((state: RootState) => state.layout.sidebarOpen)
    const dispatch = useDispatch()

    const { handleGetUsers } = useAdmin()
    const navigate = useNavigate()

    useEffect(() => {
        if(user?.role === 'admin' || user?.role === 'head'){
            handleGetUsers()
        }
    }, [user])
    
    const getWorkspace = async () => {
        navigate("/workspaces")
        dispatch(setSidebarOpen(false))
    }

    const handleNavigate = (path: string) => {
        navigate(path)
        dispatch(setSidebarOpen(false))
    }

    return (
        <>
            {/* Mobile Sidebar Backdrop Overlay */}
            {sidebarOpen && (
                <div 
                    onClick={() => dispatch(setSidebarOpen(false))}
                    className="fixed inset-0 z-40 bg-gray-900/40 backdrop-blur-xs md:hidden"
                />
            )}

            <aside className={cn(
                "fixed inset-y-0 left-0 z-50 w-64 bg-[#FCFCFC] border-r border-gray-200 flex flex-col pt-8 pb-4 transition-transform duration-300 ease-in-out md:static md:translate-x-0 shrink-0",
                sidebarOpen ? "translate-x-0" : "-translate-x-full"
            )}>
                <div className="px-6 mb-8 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                        <div className="w-6 h-6 bg-gray-900 rounded grid grid-cols-2 gap-[2px] p-1">
                            <div className="bg-white rounded-[1px]"></div>
                            <div className="bg-white rounded-[1px]"></div>
                            <div className="bg-white rounded-[1px]"></div>
                            <div className="bg-white rounded-[1px]"></div>
                        </div>
                        <h1 className="font-bold text-xl tracking-tight">ToDo</h1>
                    </div>
                    <button
                        onClick={() => dispatch(setSidebarOpen(false))}
                        className="p-1 hover:bg-gray-100 rounded-lg text-gray-500 hover:text-gray-800 transition-colors md:hidden cursor-pointer"
                        aria-label="Close sidebar"
                    >
                        <X size={18} />
                    </button>
                </div>
                <div className="px-6 mb-8">
                    <button className="w-full flex items-center justify-center gap-2 bg-[#D1F53B] text-gray-900 font-bold py-3 rounded-xl hover:bg-[#c2e532] transition-colors shadow-sm cursor-pointer">
                        <Plus size={18} strokeWidth={3} />
                        Create new Project
                    </button>
                </div>
                <nav className="flex-1 px-4 space-y-1">
                    <button 
                        onClick={() => handleNavigate("/")}
                        className="flex w-full items-center gap-3 px-4 py-2.5 text-gray-500 font-medium rounded-lg hover:text-gray-900 hover:bg-gray-100 cursor-pointer"
                    >
                        <Calendar size={18} /> Dashboard
                    </button>
                    <button 
                        onClick={() => handleNavigate("/tasks")}
                        className="flex w-full items-center gap-3 px-4 py-2.5 text-gray-900 font-medium rounded-lg hover:text-gray-900 hover:bg-gray-100 cursor-pointer">
                        <LayoutList size={18} /> Task List
                    </button>

                    {user?.role === "admin" &&
                        <button
                            onClick={() => handleNavigate("/users")}
                            className="flex w-full items-center gap-3 px-4 py-2.5 text-gray-900 font-medium rounded-lg hover:text-gray-900 hover:bg-gray-100 cursor-pointer"
                        >
                            <User /> User list
                        </button>
                    }

                    <button onClick={getWorkspace} className="flex w-full items-center gap-3 px-4 py-2.5 text-gray-900 font-medium rounded-lg hover:text-gray-900 hover:bg-gray-100 cursor-pointer">
                        <Folder size={18} /> Workspaces
                    </button>
                </nav>
            </aside>
        </>
    )
}

export default Sidebar