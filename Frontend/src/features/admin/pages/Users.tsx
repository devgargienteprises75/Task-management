import type { RootState } from "@/app/app.store"
import Sidebar from "@/components/Sidebar"
import { Pencil, Plus, Search, Menu, Loader2, Users as UsersIcon, X } from "lucide-react"
import { useSelector, useDispatch } from "react-redux"
import type { user as UserType } from "@/types"
import useAdmin from "../hooks/useAdmin"
import { useMemo, useState } from "react"
import { cn } from "@/lib/cn"
import type { CreateUserPayload, UpdateUserPayload } from "@/types/admin.types"
import Loader from "@/components/Loader"
import NotFound from "@/components/NotFound"
import { toggleSidebar } from "@/app/layout.slice"

const Users = () => {
    const dispatch = useDispatch()

    const [formOpen, setFormOpen] = useState<boolean>(false)
    const [email, setEmail] = useState<string>("")
    const [username, setUsername] = useState<string>("")
    const [role, setRole] = useState<'admin' | 'head' | 'user' | "">("")
    const [password, setPassword] = useState<string>("")
    const [updateModalOpen, setUpdateModalOpen] = useState<boolean>(false)
    const [newRole, setNewRole] = useState<'admin' | 'head' | 'user'>('user')
    const [currentActiveStatus, setCurrentActiveStatus] = useState<boolean>(true)
    const [selectedUserId, setSelectedUserId] = useState<string | null>(null)
    const [search, setSearch] = useState<string>("")
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
    const [isUpdating, setIsUpdating] = useState<boolean>(false)

    const { users, isLoading } = useSelector((state: RootState) => state.admin)

    const credential: CreateUserPayload = {
        username,
        email,
        role: role as 'admin' | 'head' | 'user',
        password
    }

    const { handleAddUser, handleUpdateUser } = useAdmin()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)
        try {
            await handleAddUser(credential)
            setFormOpen(false)
            setUsername("")
            setEmail("")
            setRole("")
            setPassword("")
        } finally {
            setIsSubmitting(false)
        }
    }

    const userUpdateCredentials: UpdateUserPayload = {
        newRole,
        currentActiveStatus
    }

    const handleUpdateSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!selectedUserId) return;
        
        setIsUpdating(true)
        try {
            await handleUpdateUser(selectedUserId, userUpdateCredentials)
            setUpdateModalOpen(false)
            setNewRole("user")
            setCurrentActiveStatus(true)
            setSelectedUserId(null)
        } finally {
            setIsUpdating(false)
        }
    }

    const filterUser = useMemo(() => {
        const query = search.trim().toLowerCase()

        if(!query) return users

        return users.filter(user => 
            user.username.toLowerCase().includes(query) ||
            user.email.toLowerCase().includes(query)
        )
    }, [users, search])

    return (
        <div className="flex h-screen bg-[#FAFAFA] font-sans text-zinc-900 overflow-hidden">
            {/* Sidebar */}
            <Sidebar />
            <main className="flex-1 flex flex-col min-w-0">
                {/* Header */}
                <header className="px-4 sm:px-8 py-4 border-b border-zinc-200/80 bg-white flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => dispatch(toggleSidebar())}
                            className="p-1.5 hover:bg-zinc-100 rounded-lg text-zinc-500 hover:text-zinc-800 transition-colors md:hidden cursor-pointer"
                            aria-label="Toggle sidebar"
                        >
                            <Menu size={18} />
                        </button>
                        <div className="w-8.5 h-8.5 bg-zinc-900 rounded-lg flex items-center justify-center text-white font-medium shadow-2xs shrink-0">
                            <UsersIcon size={17} strokeWidth={2} />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold tracking-tight text-zinc-900">Team Members</h2>
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center gap-3 w-full sm:w-auto">
                        <div className="flex items-center gap-2.5 bg-zinc-50 px-3.5 py-2 rounded-lg border border-zinc-200 flex-1 sm:flex-initial focus-within:bg-white focus-within:border-zinc-400 transition-colors">
                            <Search size={15} className="text-zinc-400 shrink-0" />
                            <input 
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                type="text" 
                                placeholder="Search users..." 
                                className="bg-transparent outline-none w-full sm:w-48 text-sm text-zinc-900 placeholder-zinc-400" 
                            />
                        </div>

                        {/* Primary Accent Button */}
                        <button 
                            onClick={() => setFormOpen(true)} 
                            className="flex items-center justify-center gap-1.5 px-4 py-2 bg-black text-white hover:bg-zinc-800 rounded-lg font-medium text-sm transition-colors shadow-xs cursor-pointer w-full sm:w-auto active:scale-98"
                        >
                            <Plus size={15} strokeWidth={2.5} /> Add user
                        </button>
                    </div>
                </header>

                {/* User register form Modal */}
                {formOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-xs px-4">
                        <div className="w-full max-w-md bg-white rounded-xl shadow-[0_8px_30px_rgba(0,0,0,0.12)] border border-zinc-200 overflow-hidden">
                            <div className="px-6 py-4 border-b border-zinc-100 flex justify-between items-center bg-zinc-50/50">
                                <h3 className="font-semibold text-base text-zinc-900">Add new user</h3>
                                <button type="button" onClick={() => setFormOpen(false)} className="text-zinc-400 hover:text-zinc-700 transition-colors cursor-pointer p-1 rounded-md hover:bg-zinc-100">
                                    <X size={18} />
                                </button>
                            </div>
                            <form onSubmit={handleSubmit} className="p-6 space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-zinc-700 mb-1.5">Username</label>
                                    <input
                                        type="text"
                                        id="username"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        className={cn(
                                            "block w-full rounded-lg border border-zinc-200 bg-white px-3.5 py-2.5 text-sm text-zinc-900 transition-all",
                                            "placeholder:text-zinc-400",
                                            "focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
                                        )}
                                        placeholder="Enter username"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-zinc-700 mb-1.5">Email address</label>
                                    <input
                                        type="email"
                                        id="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className={cn(
                                            "block w-full rounded-lg border border-zinc-200 bg-white px-3.5 py-2.5 text-sm text-zinc-900 transition-all",
                                            "placeholder:text-zinc-400",
                                            "focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
                                        )}
                                        placeholder="name@company.com"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-zinc-700 mb-1.5">Role</label>
                                    <select
                                        id="role"
                                        value={role}
                                        onChange={(e) => setRole(e.target.value as 'admin' | 'head' | 'user')}
                                        className={cn(
                                            "block w-full rounded-lg border border-zinc-200 bg-white px-3.5 py-2.5 text-sm text-zinc-900 transition-all cursor-pointer",
                                            "focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
                                        )}
                                        required
                                    >
                                        <option value="" disabled className="text-zinc-400">Select a role</option>
                                        <option value="user">User</option>
                                        <option value="head">Head</option>
                                        <option value="admin">Admin</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-zinc-700 mb-1.5">Password</label>
                                    <input
                                        type="password"
                                        id="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className={cn(
                                            "block w-full rounded-lg border border-zinc-200 bg-white px-3.5 py-2.5 text-sm text-zinc-900 transition-all",
                                            "placeholder:text-zinc-400",
                                            "focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
                                        )}
                                        placeholder="Set temporary password"
                                        required
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className={cn(
                                        "mt-5 flex w-full items-center justify-center gap-2 rounded-lg bg-black px-4 py-2.5 text-sm font-medium text-white transition-colors cursor-pointer shadow-xs",
                                        "hover:bg-zinc-800",
                                        isSubmitting && "opacity-80 cursor-not-allowed"
                                    )}
                                >
                                    {isSubmitting ? (
                                        <>
                                            <Loader2 size={15} className="animate-spin" />
                                            Creating...
                                        </>
                                    ) : (
                                        "Create user"
                                    )}
                                </button>
                            </form>
                        </div>
                    </div>
                )}

                {/* Table Area */}
                {isLoading ? (
                    <div className="flex-1 flex items-center justify-center min-h-[400px]">
                        <Loader size="lg" text="Loading users..." />
                    </div>
                ) : (filterUser.length > 0 ? (
                    <div className="flex-1 overflow-auto p-4 sm:p-6 bg-[#FAFAFA]">
                        <div className="bg-white rounded-xl shadow-[0_1px_3px_rgba(0,0,0,0.03)] border border-zinc-200 overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse min-w-[600px]">
                                    <thead>
                                        <tr className="bg-zinc-50/70 border-b border-zinc-200 text-xs text-zinc-500 font-semibold uppercase tracking-wider">
                                            <th className="px-6 py-3.5">Name</th>
                                            <th className="px-6 py-3.5">Role</th>
                                            <th className="px-6 py-3.5">Status</th>
                                            <th className="px-6 py-3.5 text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="text-sm divide-y divide-zinc-100">
                                        {filterUser?.map((user: UserType) => (
                                            <tr key={user._id} className="hover:bg-zinc-50/50 transition-colors">
                                                <td className="px-6 py-3.5">
                                                    <div className="font-semibold text-zinc-900 text-sm">{user.username}</div>
                                                    <div className="text-zinc-500 text-xs mt-0.5">{user.email}</div>
                                                </td>

                                                {/* Role Badges */}
                                                <td className="px-6 py-3.5">
                                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium tracking-wide uppercase ${
                                                        user.role === 'admin' ? 'bg-purple-50 text-purple-700 border border-purple-200' :
                                                        user.role === 'head' ? 'bg-blue-50 text-blue-700 border border-blue-200' :
                                                        'bg-zinc-100 text-zinc-700 border border-zinc-200'
                                                    }`}>
                                                        {user.role}
                                                    </span>
                                                </td>

                                                {/* Status Indicators */}
                                                <td className="px-6 py-3.5">
                                                    <span className="flex items-center gap-2">
                                                        <span className={`w-2 h-2 rounded-full ${user.isActive ? 'bg-emerald-500' : 'bg-zinc-300'}`}></span>
                                                        <span className="text-zinc-600 text-xs font-normal">{user.isActive ? 'Active' : 'Disabled'}</span>
                                                    </span>
                                                </td>

                                                {/* Actions */}
                                                <td className="px-6 py-3.5 text-right">
                                                    <button onClick={() => {
                                                        setSelectedUserId(user._id);
                                                        setNewRole(user.role as 'admin' | 'head' | 'user');
                                                        setCurrentActiveStatus(user.isActive);
                                                        setUpdateModalOpen(true);
                                                    }} className="p-1.5 text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 rounded-lg transition-colors cursor-pointer">
                                                        <Pencil size={14} />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Update User Modal */}
                            {updateModalOpen && (
                                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-xs px-4">
                                    <div className="w-full max-w-sm bg-white rounded-xl shadow-[0_8px_30px_rgba(0,0,0,0.12)] border border-zinc-200 overflow-hidden text-left">
                                        <div className="px-6 py-4 border-b border-zinc-100 flex justify-between items-center bg-zinc-50/50">
                                            <h3 className="font-semibold text-base text-zinc-900">Update User</h3>
                                            <button type="button" onClick={() => setUpdateModalOpen(false)} className="text-zinc-400 hover:text-zinc-700 transition-colors cursor-pointer p-1 rounded-md hover:bg-zinc-100">
                                                <X size={18} />
                                            </button>
                                        </div>
                                        <form onSubmit={handleUpdateSubmit} className="p-6 space-y-4">
                                            <div>
                                                <label className="block text-sm font-medium text-zinc-700 mb-1.5">Role</label>
                                                <select
                                                    value={newRole}
                                                    onChange={(e) => setNewRole(e.target.value as 'admin' | 'head' | 'user')}
                                                    className={cn(
                                                        "block w-full rounded-lg border border-zinc-200 bg-white px-3.5 py-2.5 text-sm text-zinc-900 transition-all cursor-pointer",
                                                        "focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
                                                    )}
                                                >
                                                    <option value="user">User</option>
                                                    <option value="head">Head</option>
                                                    <option value="admin">Admin</option>
                                                </select>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-zinc-700 mb-1.5">Account Status</label>
                                                <select
                                                    value={currentActiveStatus ? "true" : "false"}
                                                    onChange={(e) => setCurrentActiveStatus(e.target.value === "true")}
                                                    className={cn(
                                                        "block w-full rounded-lg border border-zinc-200 bg-white px-3.5 py-2.5 text-sm text-zinc-900 transition-all cursor-pointer",
                                                        "focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
                                                    )}
                                                >
                                                    <option value="true">Active</option>
                                                    <option value="false">Disabled</option>
                                                </select>
                                            </div>
                            
                                            <button
                                                type="submit"
                                                disabled={isUpdating}
                                                className={cn(
                                                    "mt-5 flex w-full items-center justify-center gap-2 rounded-lg bg-black px-4 py-2.5 text-sm font-medium text-white transition-colors cursor-pointer shadow-xs",
                                                    "hover:bg-zinc-800",
                                                    isUpdating && "opacity-80 cursor-not-allowed"
                                                )}
                                            >
                                                {isUpdating ? (
                                                    <>
                                                        <Loader2 size={15} className="animate-spin" />
                                                        Saving...
                                                    </>
                                                ) : (
                                                    "Save changes"
                                                )}
                                            </button>
                                        </form>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                ) : (
                    <NotFound heading="Users"/>
                ))}
            </main>
        </div>
    )
}

export default Users