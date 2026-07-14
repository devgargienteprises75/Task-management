import Sidebar from "@/components/Sidebar"
import { Calendar, Grid, LayoutList, Plus, Search, Share } from "lucide-react"

const Dashboard = () => {
  return (
    <div className="flex h-screen bg-[#F9FAFB] font-sans text-gray-900 overflow-hidden">

        {/* Sidebar */}
        <Sidebar />
        <main className="flex-1 flex flex-col">
        {/* Header */}
        <header className="px-8 py-6 border-b border-gray-200 bg-white flex justify-between items-center">
            <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-yellow-400 rounded-md flex items-center justify-center text-white font-bold text-xs">★</div>
                <h2 className="text-2xl font-bold">Workspace Name</h2>
            </div>
            
            <div className="flex items-center gap-4">
                <button className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg font-medium text-sm">
                    <Plus size={16} /> Add new task
                </button>
            </div>
        </header>
        {/* Filters Bar */}
    

        {/* Kanban Board */}
        <div className="flex-1 overflow-x-auto p-8">
            <div className="flex gap-6 min-w-max">
                
                {/* Column 1: To Do */}
                <div className="w-[320px] flex flex-col gap-4">
                    <div className="flex justify-between items-center text-gray-500 font-medium text-sm mb-2">
                        <span>To Do</span>
                        <span>⋮</span>
                    </div>
                    {/* Card 1 */}
                    <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
                        <div className="flex justify-between items-start mb-4">
                            <div className="flex -space-x-2">
                                <div className="w-7 h-7 rounded-full border-2 border-white bg-blue-200"></div>
                                <div className="w-7 h-7 rounded-full border-2 border-white bg-yellow-200"></div>
                            </div>
                            <span className="text-xs font-semibold text-orange-500 bg-orange-50 px-2 py-1 rounded-md">High</span>
                        </div>
                        <h4 className="font-bold text-[15px] mb-3">A/B Testing - Round 3</h4>
                        <div className="flex gap-2 mb-4">
                            <span className="text-[11px] font-bold text-purple-600 bg-purple-50 px-2.5 py-1 rounded-md">Prototype</span>
                            <span className="text-[11px] font-bold text-pink-600 bg-pink-50 px-2.5 py-1 rounded-md">Research</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-xs text-gray-400 font-medium">
                            <Calendar size={12} /> 5 Sept 2022 - 5 Oct 2022
                        </div>
                    </div>
                </div>
                {/* Column 2: In Progress */}
                <div className="w-[320px] flex flex-col gap-4">
                    <div className="flex justify-between items-center text-gray-500 font-medium text-sm mb-2">
                        <span>In Progress</span>
                        <span>⋮</span>
                    </div>
                    {/* Card 2 */}
                    <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
                        <div className="flex justify-between items-start mb-4">
                            <div className="flex -space-x-2">
                                <div className="w-7 h-7 rounded-full border-2 border-white bg-purple-200"></div>
                            </div>
                            <span className="text-xs font-semibold text-gray-400 bg-gray-100 px-2 py-1 rounded-md">Low</span>
                        </div>
                        <h4 className="font-bold text-[15px] mb-3">Create Prototype for payments flow in Protopie</h4>
                        <div className="flex gap-2 mb-4">
                            <span className="text-[11px] font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-md">Design</span>
                            <span className="text-[11px] font-bold text-purple-600 bg-purple-50 px-2.5 py-1 rounded-md">Prototype</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-xs text-gray-400 font-medium">
                            <Calendar size={12} /> 24 Aug 2022 - 30 Sept 2022
                        </div>
                    </div>
                    
                    {/* Inline Add Task Button */}
                    <button className="flex items-center gap-2 text-gray-500 font-medium text-sm mt-2 hover:text-gray-900 transition-colors">
                        <div className="w-6 h-6 rounded-full bg-[#D1F53B] flex items-center justify-center text-gray-900"><Plus size={14} strokeWidth={3}/></div>
                        Add new task
                    </button>
                </div>
                {/* Column 3: Done */}
                <div className="w-[320px] flex flex-col gap-4">
                    <div className="flex justify-between items-center text-gray-500 font-medium text-sm mb-2">
                        <span>Done</span>
                        <span>⋮</span>
                    </div>
                    {/* Card 3 */}
                    <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 opacity-75">
                        <div className="flex justify-between items-start mb-4">
                            <div className="flex -space-x-2">
                                <div className="w-7 h-7 rounded-full border-2 border-white bg-blue-200"></div>
                            </div>
                            <span className="text-xs font-semibold text-gray-400 bg-gray-100 px-2 py-1 rounded-md">Low</span>
                        </div>
                        <h4 className="font-bold text-[15px] mb-3">Create microinteraction flow</h4>
                        <div className="flex gap-2 mb-4">
                            <span className="text-[11px] font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-md">Design</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-xs text-gray-400 font-medium">
                            <Calendar size={12} /> 2 Sept 2022 - 16 Sept 2022
                        </div>
                    </div>
                </div>
            </div>
        </div>
      </main>
    </div>
  )
}

export default Dashboard