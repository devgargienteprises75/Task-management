import type { RootState } from "@/app/app.store";
import useAdmin from "@/features/admin/hooks/useAdmin";
import { Folder, LayoutList, User, X, Settings, LogOut, ChevronUp, CheckSquare } from "lucide-react"
import { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux"
import { useNavigate, useLocation } from "react-router-dom";
import { cn } from "@/lib/cn";
import { setSidebarOpen } from "@/app/layout.slice";
import useAuth from "@/features/auth/hooks/useAuth";

const Sidebar = () => {
    const { user } = useSelector((state: RootState) => state.auth)
    const sidebarOpen = useSelector((state: RootState) => state.layout.sidebarOpen)
    const dispatch = useDispatch()
    const location = useLocation()

    const { handleGetUsers } = useAdmin()
    const { handleLogout } = useAuth()
    const navigate = useNavigate()

    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    useEffect(() => {
        if (user?.role === 'admin' || user?.role === 'head') {
            handleGetUsers()
        }
    }, [user])

    const handleNavigate = (path: string) => {
        navigate(path)
        dispatch(setSidebarOpen(false))
    }

    const handleLogoutSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        await handleLogout()
    }

    const isPathActive = (path: string) => {
        if (path === "/" && location.pathname === "/") return true;
        if (path !== "/" && location.pathname.startsWith(path)) return true;
        return false;
    }

    return (
        <>
            {/* Mobile Sidebar Backdrop */}
            {sidebarOpen && (
                <div 
                    onClick={() => dispatch(setSidebarOpen(false))}
                    className="fixed inset-0 z-40 bg-black/20 backdrop-blur-xs md:hidden"
                />
            )}

            <aside className={cn(
                "fixed inset-y-0 left-0 z-50 w-60 bg-[#FAFAFA] border-r border-zinc-200/80 flex flex-col pt-5 pb-4 transition-transform duration-200 ease-in-out md:static md:translate-x-0 shrink-0 select-none",
                sidebarOpen ? "translate-x-0" : "-translate-x-full"
            )}>
                {/* Brand Header */}
                <div className="px-4 mb-6 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                        <div className="w-7.5 h-7.5 rounded-lg bg-zinc-900 text-white flex items-center justify-center shadow-xs">
                            <CheckSquare size={16} strokeWidth={2.5} />
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="font-semibold text-base text-zinc-900 tracking-tight">Workspace</span>
                            <span className="text-[11px] bg-zinc-100 text-zinc-600 px-1.5 py-0.5 rounded font-mono border border-zinc-200">v1.0</span>
                        </div>
                    </div>
                    <button
                        onClick={() => dispatch(setSidebarOpen(false))}
                        className="p-1 hover:bg-zinc-200/60 rounded text-zinc-500 hover:text-zinc-800 transition-colors md:hidden cursor-pointer"
                        aria-label="Close sidebar"
                    >
                        <X size={18} />
                    </button>
                </div>

                {/* Navigation Sections */}
                <div className="flex-1 px-3 space-y-6 overflow-y-auto">
                    {/* General Section */}
                    <div>
                        <p className="px-2.5 mb-1 text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">
                            Workspace
                        </p>
                        <nav className="space-y-0.5">
                            <button 
                                onClick={() => handleNavigate("/")}
                                className={cn(
                                    "flex w-full items-center gap-2.5 px-2.5 py-1.5 rounded-lg text-[13px] font-medium transition-colors cursor-pointer text-left",
                                    isPathActive("/")
                                        ? "bg-zinc-200/80 text-zinc-900 font-semibold"
                                        : "text-zinc-600 hover:text-zinc-900 hover:bg-zinc-200/40"
                                )}
                            >
                                <LayoutList size={15} className={isPathActive("/") ? "text-zinc-900" : "text-zinc-500"} />
                                <span>Tasks</span>
                            </button>

                            <button 
                                onClick={() => handleNavigate("/workspaces")}
                                className={cn(
                                    "flex w-full items-center gap-2.5 px-2.5 py-1.5 rounded-lg text-[13px] font-medium transition-colors cursor-pointer text-left",
                                    isPathActive("/workspaces")
                                        ? "bg-zinc-200/80 text-zinc-900 font-semibold"
                                        : "text-zinc-600 hover:text-zinc-900 hover:bg-zinc-200/40"
                                )}
                            >
                                <Folder size={15} className={isPathActive("/workspaces") ? "text-zinc-900" : "text-zinc-500"} />
                                <span>Workspaces</span>
                            </button>

                            {user?.role === "admin" && (
                                <button
                                    onClick={() => handleNavigate("/users")}
                                    className={cn(
                                        "flex w-full items-center gap-2.5 px-2.5 py-1.5 rounded-lg text-[13px] font-medium transition-colors cursor-pointer text-left",
                                        isPathActive("/users")
                                            ? "bg-zinc-200/80 text-zinc-900 font-semibold"
                                            : "text-zinc-600 hover:text-zinc-900 hover:bg-zinc-200/40"
                                    )}
                                >
                                    <User size={15} className={isPathActive("/users") ? "text-zinc-900" : "text-zinc-500"} />
                                    <span>Team Members</span>
                                </button>
                            )}
                        </nav>
                    </div>

                    {/* Settings Section */}
                    <div>
                        <p className="px-2.5 mb-1 text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">
                            Settings
                        </p>
                        <nav className="space-y-0.5">
                            <button 
                                onClick={() => handleNavigate("/account-setting")}
                                className={cn(
                                    "flex w-full items-center gap-2.5 px-2.5 py-1.5 rounded-lg text-[13px] font-medium transition-colors cursor-pointer text-left",
                                    isPathActive("/account-setting")
                                        ? "bg-zinc-200/80 text-zinc-900 font-semibold"
                                        : "text-zinc-600 hover:text-zinc-900 hover:bg-zinc-200/40"
                                )}
                            >
                                <Settings size={15} className={isPathActive("/account-setting") ? "text-zinc-900" : "text-zinc-500"} />
                                <span>Preferences</span>
                            </button>
                        </nav>
                    </div>
                </div>

                {/* Footer User Profile */}
                <div className="px-3 mt-auto pt-3 border-t border-zinc-200/80 relative" ref={dropdownRef}>
                    {isDropdownOpen && (
                        <div className="absolute bottom-full left-3 right-3 mb-1.5 bg-white rounded-xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.12)] border border-zinc-200 overflow-hidden z-50 py-1">
                            <button
                                onClick={() => {
                                    setIsDropdownOpen(false);
                                    handleNavigate("/account-setting");
                                }}
                                className="w-full flex items-center gap-2.5 px-3 py-2 text-[13px] font-medium text-zinc-700 hover:bg-zinc-50 hover:text-zinc-900 transition-colors cursor-pointer"
                            >
                                <Settings size={15} className="text-zinc-400" /> Account Settings
                            </button>
                            <button
                                onClick={(e) => {
                                    setIsDropdownOpen(false);
                                    handleLogoutSubmit(e);
                                }}
                                className="w-full flex items-center gap-2.5 px-3 py-2 text-[13px] font-medium text-rose-600 hover:bg-rose-50 transition-colors border-t border-zinc-100 cursor-pointer"
                            >
                                <LogOut size={15} className="text-rose-500" /> Logout
                            </button>
                        </div>
                    )}
                    
                    <button 
                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                        className="w-full flex items-center gap-2.5 p-2 rounded-lg hover:bg-zinc-200/50 transition-colors cursor-pointer text-left"
                    >
                        <div className="w-8 h-8 rounded-md bg-zinc-900 text-white flex items-center justify-center text-xs font-semibold shrink-0">
                            {user?.username?.charAt(0).toUpperCase() || 'U'}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-[13px] font-semibold text-zinc-900 truncate leading-none">{user?.username || 'User'}</p>
                            <p className="text-[11px] text-zinc-500 truncate mt-1">{user?.email || 'user@example.com'}</p>
                        </div>
                        <ChevronUp size={14} className={cn("text-zinc-400 transition-transform duration-200", isDropdownOpen && "rotate-180")} />
                    </button>
                </div>
            </aside>
        </>
    )
}

export default Sidebar