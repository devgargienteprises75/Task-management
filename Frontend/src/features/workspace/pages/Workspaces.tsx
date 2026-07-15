import type { RootState } from "@/app/app.store"
import Sidebar from "@/components/Sidebar"
import { Search, Plus, Users, LayoutGrid, MoreVertical } from "lucide-react"
import { useSelector } from "react-redux"

const Workspaces = () => {

    const { allWorkspaces } = useSelector((state: RootState) => state.workspace)
    console.log(allWorkspaces);

    return (
        <div className="flex h-screen bg-[#F9FAFB] font-sans text-gray-900 overflow-hidden">
            {/* Sidebar */}
            <Sidebar />
            <main className="flex-1 flex flex-col">
                {/* Header */}
                <header className="px-8 py-6 border-b border-gray-200 bg-white flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <h2 className="text-2xl font-bold tracking-tight">Workspaces</h2>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-lg border border-gray-200">
                            <Search size={16} className="text-gray-400" />
                            <input type="text" placeholder="Search workspaces..." className="bg-transparent outline-none w-48 text-sm" />
                        </div>

                        {/* Primary Accent Button */}
                        <button className="flex items-center gap-2 px-4 py-2 bg-[#D1F53B] hover:bg-[#c2e532] text-gray-900 rounded-lg font-semibold text-sm transition-colors shadow-sm cursor-pointer">
                            <Plus size={16} strokeWidth={3} /> Create Workspace
                        </button>
                    </div>
                </header>

                {/* Main Content Area */}
                <div className="flex-1 overflow-auto p-8">
                    {/* Toolbar / Filters (optional space) */}
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-lg font-bold text-gray-800">All Workspaces</h3>
                        <div className="flex items-center gap-2">
                            <button className="p-2 bg-white border border-gray-200 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-colors shadow-sm">
                                <LayoutGrid size={16} />
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {allWorkspaces[0]?.map((workspace) => (
                            <div key={workspace._id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md hover:border-gray-200 transition-all cursor-pointer flex flex-col h-full group">
                                <div className="flex justify-between items-start mb-4">
                                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl font-bold ${workspace?.iconColor }`}>
                                        {workspace?.name?.charAt(0).toUpperCase()}
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-[11px] font-bold tracking-wide uppercase ${
                                            workspace?.status === 'active' 
                                                ? 'bg-green-50 text-green-600' 
                                                : 'bg-gray-100 text-gray-500'
                                        }`}>
                                            {workspace?.status}
                                        </span>
                                        <button className="text-gray-400 hover:text-gray-900 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <MoreVertical size={16} />
                                        </button>
                                    </div>
                                </div>
                                
                                <h3 className="font-bold text-lg mb-2 text-gray-900 group-hover:text-blue-600 transition-colors">{workspace?.name}</h3>
                                <p className="text-sm text-gray-500 mb-6 flex-1 line-clamp-2 leading-relaxed">
                                    {workspace?.description}
                                </p>
                                
                                <div className="flex justify-between items-center mt-auto pt-4 border-t border-gray-50">
                                    <div className="flex -space-x-2">
                                        <div className="w-8 h-8 rounded-full border-2 border-white bg-blue-200"></div>
                                        <div className="w-8 h-8 rounded-full border-2 border-white bg-purple-200"></div>
                                        <div className="w-8 h-8 rounded-full border-2 border-white bg-yellow-200 flex items-center justify-center text-[10px] font-bold text-gray-700">
                                            +{workspace?.members?.length > 2 ? workspace?.members?.length - 2 : 0}
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-400 bg-gray-50 px-2 py-1 rounded-md">
                                        <Users size={12} /> {workspace?.members?.length}
                                    </div>  
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </main>
        </div>
    )
}

export default Workspaces