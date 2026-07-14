import type { RootState } from "@/app/app.store"
import Sidebar from "@/components/Sidebar"
import { Pencil, Plus, Search } from "lucide-react"
import { useSelector } from "react-redux"
import type { user as UserType } from "@/types"
import useAdmin from "../hooks/useAdmin"
import { useState } from "react"
import { cn } from "@/lib/cn"
import type { CreateUserPayload, UpdateUserPayload } from "@/types/admin.types"

const Users = () => {

    const [formOpen, setFormOpen] = useState<boolean>(false)
    const [email, setEmail] = useState<string>("")
    const [username, setUsername] = useState<string>("")
    const [role, setRole] = useState<'admin' | 'head' | 'user' | "">("")
    const [password, setPassword] = useState<string>("")
    const [updateModalOpen, setUpdateModalOpen] = useState<boolean>(false)
    const [newRole, setNewRole] = useState<'admin' | 'head' | 'user'>('user')
    const [currentActiveStatus, setCurrentActiveStatus] = useState<boolean>(true)
    const [selectedUserId, setSelectedUserId] = useState<string | null>(null)

    const { users } = useSelector((state: RootState) => state.admin)
    console.log(users);

    const credential: CreateUserPayload = {
        username,
        email,
        role: role as 'admin' | 'head' | 'user',
        password
    }

    const { handleAddUser, handleUpdateUser } = useAdmin()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        await handleAddUser(credential)
        setFormOpen(false)
        setUsername("")
        setEmail("")
        setRole("")
        setPassword("")
    }

    const userUpdateCredentials: UpdateUserPayload = {
        newRole,
        currentActiveStatus
    }

    const handleUpdateSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!selectedUserId) return;
        
        await handleUpdateUser(selectedUserId, userUpdateCredentials)
        setUpdateModalOpen(false)
        setNewRole("user")
        setCurrentActiveStatus(true)
        setSelectedUserId(null)
    }


    return (
        <div className="flex h-screen bg-[#F9FAFB] font-sans text-gray-900 overflow-hidden">
            {/* Sidebar */}
            <Sidebar />
            <main className="flex-1 flex flex-col">
                {/* Header */}
                <header className="px-8 py-6 border-b border-gray-200 bg-white flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <h2 className="text-2xl font-bold tracking-tight">Manage Users</h2>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-lg border border-gray-200">
                            <Search size={16} className="text-gray-400" />
                            <input type="text" placeholder="Search users..." className="bg-transparent outline-none w-48 text-sm" />
                        </div>

                        {/* Primary Accent Button */}
                        <button onClick={() => setFormOpen(true)} className="flex items-center gap-2 px-4 py-2 bg-[#D1F53B] hover:bg-[#c2e532] text-gray-900 rounded-lg font-semibold text-sm transition-colors shadow-sm cursor-pointer">
                            <Plus size={16} strokeWidth={3} /> Add new user
                        </button>
                    </div>
                </header>

                {/* User register form Modal */}
                {formOpen && (
                    <div className="absolute inset-0 z-50 flex items-center justify-center bg-gray-900/40 backdrop-blur-sm">
                        <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                            <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                                <h3 className="font-bold text-lg text-gray-900">Add New User</h3>
                                <button type="button" onClick={() => setFormOpen(false)} className="text-gray-400 hover:text-gray-900 transition-colors cursor-pointer">
                                    ✕
                                </button>
                            </div>
                            <form onSubmit={handleSubmit} className="p-6 space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Username</label>
                                    <input
                                        type="text"
                                        id="username"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        className={cn(
                                            "block w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-[15px] text-gray-900 transition-all",
                                            "placeholder:text-gray-400",
                                            "focus:border-gray-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-gray-900"
                                        )}
                                        placeholder="Enter username"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Email Address</label>
                                    <input
                                        type="email"
                                        id="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className={cn(
                                            "block w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-[15px] text-gray-900 transition-all",
                                            "placeholder:text-gray-400",
                                            "focus:border-gray-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-gray-900"
                                        )}
                                        placeholder="name@company.com"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Role</label>
                                    <select
                                        id="role"
                                        value={role}
                                        onChange={(e) => setRole(e.target.value as 'admin' | 'head' | 'user')}
                                        className={cn(
                                            "block w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-[15px] text-gray-900 transition-all cursor-pointer",
                                            "focus:border-gray-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-gray-900"
                                        )}
                                        required
                                    >
                                        <option value="" disabled>Select a role</option>
                                        <option value="user">User</option>
                                        <option value="head">Head</option>
                                        <option value="admin">Admin</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
                                    <input
                                        type="password"
                                        id="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className={cn(
                                            "block w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-[15px] text-gray-900 transition-all",
                                            "placeholder:text-gray-400",
                                            "focus:border-gray-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-gray-900"
                                        )}
                                        placeholder="Set temporary password"
                                        required
                                    />
                                </div>

                                <button
                                    type="submit"
                                    className={cn(
                                        "mt-6 flex w-full justify-center rounded-xl bg-[#D1F53B] px-4 py-3.5 text-[15px] font-bold text-gray-900 transition-all duration-200 ease-in-out cursor-pointer",
                                        "hover:bg-[#c2e532] hover:shadow-lg hover:shadow-[#D1F53B]/20",
                                        "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-900",
                                        "active:scale-[0.98]"
                                    )}
                                >
                                    Create User
                                </button>
                            </form>
                        </div>
                    </div>
                )}

                {/* Table Area */}
                <div className="flex-1 overflow-auto p-8">
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-50/50 border-b border-gray-100 text-sm text-gray-500 font-medium">
                                    <th className="px-6 py-4 font-medium">Name</th>
                                    <th className="px-6 py-4 font-medium">Role</th>
                                    <th className="px-6 py-4 font-medium">Status</th>
                                    <th className="px-6 py-4 font-medium text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="text-sm divide-y divide-gray-100">
                                {users?.map((user: UserType) => (
                                    <tr key={user._id} className="hover:bg-gray-50/50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="font-semibold text-gray-900">{user.username}</div>
                                            <div className="text-gray-500 font-medium mt-0.5">{user.email}</div>
                                        </td>

                                        {/* Role Badges */}
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-[11px] font-bold tracking-wide uppercase ${user.role === 'admin' ? 'bg-purple-50 text-purple-600' :
                                                    user.role === 'head' ? 'bg-blue-50 text-blue-600' :
                                                        'bg-gray-100 text-gray-600'
                                                }`}>
                                                {user.role}
                                            </span>
                                        </td>

                                        {/* Status Indicators */}
                                        <td className="px-6 py-4">
                                            <span className="flex items-center gap-2">
                                                <span className={`w-2 h-2 rounded-full ${user.isActive ? 'bg-green-500' : 'bg-red-400'}`}></span>
                                                <span className="text-gray-500 font-medium">{user.isActive ? 'Active' : 'Disabled'}</span>
                                            </span>
                                        </td>

                                        {/* Actions */}
                                        <td className="px-6 py-4 text-right">
                                            <button onClick={() => {
                                                setSelectedUserId(user._id);
                                                setNewRole(user.role as 'admin' | 'head' | 'user');
                                                setCurrentActiveStatus(user.isActive);
                                                setUpdateModalOpen(true);
                                            }} className="p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer">
                                                <Pencil size={16} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        {/* Update User Modal */}
                        {updateModalOpen && (
                            <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/40 backdrop-blur-sm">
                                <div className="w-full max-w-sm bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden text-left">
                                    <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                                        <h3 className="font-bold text-lg text-gray-900">Update User</h3>
                                        <button type="button" onClick={() => setUpdateModalOpen(false)} className="text-gray-400 hover:text-gray-900 transition-colors cursor-pointer">
                                            ✕
                                        </button>
                                    </div>
                                    <form onSubmit={handleUpdateSubmit} className="p-6 space-y-5">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1.5">Role</label>
                                            <select
                                                value={newRole}
                                                onChange={(e) => setNewRole(e.target.value as 'admin' | 'head' | 'user')}
                                                className={cn(
                                                    "block w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-[15px] text-gray-900 transition-all cursor-pointer",
                                                    "focus:border-gray-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-gray-900"
                                                )}
                                            >
                                                <option value="user">User</option>
                                                <option value="head">Head</option>
                                                <option value="admin">Admin</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1.5">Account Status</label>
                                            <select
                                                value={currentActiveStatus ? "true" : "false"}
                                                onChange={(e) => setCurrentActiveStatus(e.target.value === "true")}
                                                className={cn(
                                                    "block w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-[15px] text-gray-900 transition-all cursor-pointer",
                                                    "focus:border-gray-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-gray-900"
                                                )}
                                            >
                                                <option value="true">Active</option>
                                                <option value="false">Disabled</option>
                                            </select>
                                        </div>
                        
                                        <button
                                            type="submit"
                                            className={cn(
                                                "mt-6 flex w-full justify-center rounded-xl bg-gray-900 px-4 py-3.5 text-[15px] font-bold text-white transition-all duration-200 ease-in-out cursor-pointer",
                                                "hover:bg-gray-800 hover:shadow-lg",
                                                "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-900",
                                                "active:scale-[0.98]"
                                            )}
                                        >
                                            Save Changes
                                        </button>
                                    </form>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    )
}

export default Users