import type { RootState } from "@/app/app.store"
import Sidebar from "@/components/Sidebar"
import { MoreVertical, Plus, Search } from "lucide-react"
import { useSelector } from "react-redux"
import type { user as UserType } from "@/types"

const Users = () => {

    const { users } = useSelector((state: RootState) => state.admin)
    console.log(users);
    

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
                    <button className="flex items-center gap-2 px-4 py-2 bg-[#D1F53B] hover:bg-[#c2e532] text-gray-900 rounded-lg font-semibold text-sm transition-colors shadow-sm">
                        <Plus size={16} strokeWidth={3} /> Add new user
                    </button>
                </div>
            </header>
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
                            {users?.map((user: UserType ) => (
                                <tr key={user._id} className="hover:bg-gray-50/50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="font-semibold text-gray-900">{user.username}</div>
                                        <div className="text-gray-500 font-medium mt-0.5">{user.email}</div>
                                    </td>
                                    
                                    {/* Role Badges */}
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-[11px] font-bold tracking-wide uppercase ${
                                            user.role === 'admin' ? 'bg-purple-50 text-purple-600' :
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
                                        <button className="p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer">
                                            <MoreVertical size={16} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </main>
    </div>
  )
}

export default Users