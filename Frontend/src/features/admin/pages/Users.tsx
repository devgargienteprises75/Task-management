import type { RootState } from "@/app/app.store";
import Sidebar from "@/components/Sidebar";
import type { CreateUserPayload } from "@/types/admin.types";
import { Users as UsersIcon, Plus, Search, Shield, X, Loader2, Menu, Pencil } from "lucide-react";
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import useAdmin from "../hooks/useAdmin";
import { cn } from "@/lib/cn";
import { toggleSidebar } from "@/app/layout.slice";
import EditUser from "../components/EditUser";

const Users = () => {
    const { users } = useSelector((state: RootState) => state.admin)
    const dispatch = useDispatch()

    const [username, setUsername] = useState<string>('')
    const [email, setEmail] = useState<string>('')
    const [password, setPassword] = useState<string>('')
    const [role, setRole] = useState<'admin' | 'user'>('user')
    const [searchQuery, setSearchQuery] = useState<string>('')
    const [isCreateOpen, setIsCreateOpen] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [currentEditId, setCurrentEditId] = useState<string | null>(null)
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false)
    
    const { handleAddUser, handleGetUsers } = useAdmin()

    useEffect(() => {
        if (!users.length) {
            handleGetUsers()
        }
    }, [])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)

        const userDetails: CreateUserPayload = {
            username,
            email,
            password,
            role,
        }

        try {
            await handleAddUser(userDetails)
            setIsCreateOpen(false)
            setUsername('')
            setEmail('')
            setPassword('')
            setRole('user')
        } finally {
            setIsSubmitting(false)
        }
    }

    const filteredUsers = users.filter(u =>
        u.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.email.toLowerCase().includes(searchQuery.toLowerCase())
    )

    const adminCount = users.filter(u => u.role === 'admin').length
    const memberCount = users.filter(u => u.role !== 'admin').length

    return (
        <div className="flex h-screen bg-[#FAFAFA] dark:bg-zinc-900 font-sans text-zinc-900 dark:text-zinc-100 overflow-hidden transition-colors">
            <Sidebar />

            <main className="flex-1 flex flex-col min-w-0">
                {/* Standardized Navbar */}
                <header className="px-4 sm:px-8 py-3.5 border-b border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-900 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 transition-colors">
                    <div className="flex items-center gap-2.5">
                        <button
                            onClick={() => dispatch(toggleSidebar())}
                            className="p-1.5 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200 transition-colors md:hidden cursor-pointer"
                            aria-label="Toggle sidebar"
                        >
                            <Menu size={18} />
                        </button>
                        <div className="w-8 h-8 bg-zinc-900 dark:bg-zinc-100 rounded-lg flex items-center justify-center text-white dark:text-zinc-900 font-medium shadow-2xs shrink-0">
                            <UsersIcon size={16} strokeWidth={2} />
                        </div>
                        <div className="flex items-center gap-2">
                            <h1 className="text-base font-semibold tracking-tight text-zinc-900 dark:text-white">Team Members</h1>
                            <span className="bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 text-xs font-mono px-1.5 py-0.5 rounded border border-zinc-200 dark:border-zinc-700">
                                {users.length}
                            </span>
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center gap-2.5 w-full sm:w-auto">
                        <div className="flex items-center gap-2 bg-zinc-50 dark:bg-zinc-800/80 px-3 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-700/80 flex-1 sm:flex-initial focus-within:bg-white dark:focus-within:bg-zinc-800 focus-within:border-zinc-400 dark:focus-within:border-zinc-500 transition-colors">
                            <Search size={14} className="text-zinc-400 dark:text-zinc-500 shrink-0" />
                            <input
                                type="text"
                                placeholder="Search members..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="bg-transparent outline-none w-full sm:w-44 text-sm text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-500"
                            />
                        </div>

                        <button
                            onClick={() => setIsCreateOpen(true)}
                            className="flex items-center justify-center gap-1.5 px-3.5 py-1.5 bg-black dark:bg-zinc-100 text-white dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-zinc-200 rounded-lg font-medium text-sm transition-colors shadow-xs cursor-pointer w-full sm:w-auto active:scale-98"
                        >
                            <Plus size={15} strokeWidth={2.5} /> Add member
                        </button>
                    </div>
                </header>

                <div className="flex-1 overflow-auto p-4 sm:p-8 bg-[#FAFAFA] dark:bg-zinc-900">
                    <div className="max-w-5xl mx-auto space-y-5">
                        {/* Summary Bar */}
                        <div className="flex items-center justify-between text-xs text-zinc-500 dark:text-zinc-400">
                            <div className="flex items-center gap-3">
                                <span>Total: <strong className="text-zinc-900 dark:text-zinc-100">{users.length}</strong></span>
                                <span>•</span>
                                <span>Admins: <strong className="text-zinc-900 dark:text-zinc-100">{adminCount}</strong></span>
                                <span>•</span>
                                <span>Members: <strong className="text-zinc-900 dark:text-zinc-100">{memberCount}</strong></span>
                            </div>
                        </div>

                        {/* Members Table */}
                        <div className="bg-white dark:bg-zinc-800 rounded-xl border border-zinc-200 dark:border-zinc-700/80 overflow-hidden shadow-[0_1px_3px_rgba(0,0,0,0.03)]">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-sm">
                                    <thead className="bg-zinc-50 dark:bg-zinc-900/60 border-b border-zinc-200 dark:border-zinc-700 text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                                        <tr>
                                            <th className="px-6 py-3">Member</th>
                                            <th className="px-6 py-3">Role</th>
                                            <th className="px-6 py-3 text-right">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-zinc-100 dark:divide-zinc-700/60">
                                        {filteredUsers.length === 0 ? (
                                            <tr>
                                                <td colSpan={3} className="px-6 py-12 text-center text-zinc-400 dark:text-zinc-500 text-sm">
                                                    No members found
                                                </td>
                                            </tr>
                                        ) : (
                                            filteredUsers.map((u) => (
                                                <tr key={u._id} className="hover:bg-zinc-50/80 dark:hover:bg-zinc-700/50 transition-colors">
                                                    <td className="px-6 py-4">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-8.5 h-8.5 rounded-lg bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 flex items-center justify-center font-bold text-xs shrink-0">
                                                                {u.username.charAt(0).toUpperCase()}
                                                            </div>
                                                            <div>
                                                                <p className="font-semibold text-zinc-900 dark:text-zinc-100 text-sm leading-tight">{u.username}</p>
                                                                <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-0.5">{u.email}</p>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <span className={cn(
                                                            "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border",
                                                            u.role === 'admin'
                                                                ? "bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 border-transparent shadow-xs"
                                                                : "bg-zinc-100 dark:bg-zinc-700 text-zinc-600 dark:text-zinc-300 border-zinc-200 dark:border-zinc-600"
                                                        )}>
                                                            {u.role === 'admin' && <Shield size={10} />}
                                                            {u.role.toUpperCase()}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 text-right">
                                                        <button
                                                            onClick={() => {
                                                                setCurrentEditId(u._id);
                                                                setIsUpdateModalOpen(true);
                                                            }}
                                                            className="p-1.5 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-700 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 transition-colors cursor-pointer"
                                                            title="Edit member"
                                                        >
                                                            <Pencil size={15} />
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Edit User Modal */}
                {isUpdateModalOpen && <EditUser 
                                        userId={currentEditId} 
                                        isUpdateModalOpen={isUpdateModalOpen} 
                                        setIsUpdateModalOpen={setIsUpdateModalOpen} 
                                    />}

                {/* Add Member Modal */}
                {isCreateOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs px-4">
                        <div className="w-full max-w-md bg-white dark:bg-zinc-800 rounded-xl shadow-[0_8px_30px_rgba(0,0,0,0.35)] border border-zinc-200 dark:border-zinc-700 overflow-hidden">
                            <div className="px-6 py-4 border-b border-zinc-100 dark:border-zinc-700 flex justify-between items-center bg-zinc-50/50 dark:bg-zinc-900/60 rounded-t-xl">
                                <h3 className="font-semibold text-base text-zinc-900 dark:text-white">Add new team member</h3>
                                <button type="button" onClick={() => setIsCreateOpen(false)} className="text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 transition-colors cursor-pointer p-1 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-700">
                                    <X size={18} />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="p-6 space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">Username <span className="text-rose-500">*</span></label>
                                    <input
                                        type="text"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        className={cn(
                                            "block w-full rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3.5 py-2.5 text-sm text-zinc-900 dark:text-zinc-100 transition-all",
                                            "placeholder:text-zinc-400 dark:placeholder:text-zinc-500",
                                            "focus:border-black dark:focus:border-zinc-400 focus:outline-none focus:ring-1 focus:ring-black dark:focus:ring-zinc-400"
                                        )}
                                        placeholder="johndoe"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">Email address <span className="text-rose-500">*</span></label>
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className={cn(
                                            "block w-full rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3.5 py-2.5 text-sm text-zinc-900 dark:text-zinc-100 transition-all",
                                            "placeholder:text-zinc-400 dark:placeholder:text-zinc-500",
                                            "focus:border-black dark:focus:border-zinc-400 focus:outline-none focus:ring-1 focus:ring-black dark:focus:ring-zinc-400"
                                        )}
                                        placeholder="john@company.com"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">Password <span className="text-rose-500">*</span></label>
                                    <input
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className={cn(
                                            "block w-full rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3.5 py-2.5 text-sm text-zinc-900 dark:text-zinc-100 transition-all",
                                            "placeholder:text-zinc-400 dark:placeholder:text-zinc-500",
                                            "focus:border-black dark:focus:border-zinc-400 focus:outline-none focus:ring-1 focus:ring-black dark:focus:ring-zinc-400"
                                        )}
                                        placeholder="••••••••"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">Role</label>
                                    <select
                                        value={role}
                                        onChange={(e) => setRole(e.target.value as 'admin' | 'user')}
                                        className={cn(
                                            "block w-full rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3.5 py-2.5 text-sm text-zinc-900 dark:text-zinc-100 transition-all",
                                            "focus:border-black dark:focus:border-zinc-400 focus:outline-none focus:ring-1 focus:ring-black dark:focus:ring-zinc-400"
                                        )}
                                    >
                                        <option value="user">Member</option>
                                        <option value="head">Lead</option>
                                        <option value="admin">Administrator</option>
                                    </select>
                                </div>

                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className={cn(
                                        "mt-5 flex w-full items-center justify-center gap-2 rounded-lg bg-black dark:bg-zinc-100 px-4 py-2.5 text-sm font-medium text-white dark:text-zinc-900 transition-colors cursor-pointer shadow-xs",
                                        "hover:bg-zinc-800 dark:hover:bg-zinc-200",
                                        isSubmitting && "opacity-80 cursor-not-allowed"
                                    )}
                                >
                                    {isSubmitting ? (
                                        <>
                                            <Loader2 size={15} className="animate-spin" />
                                            Adding member...
                                        </>
                                    ) : (
                                        "Add member"
                                    )}
                                </button>
                            </form>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
};

export default Users;