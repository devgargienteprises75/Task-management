import Sidebar from "@/components/Sidebar"
import { Plus, Menu } from "lucide-react"
import { useDispatch } from "react-redux"
import { toggleSidebar } from "@/app/layout.slice"
// import { enableNotification } from "@/lib/helper"

const Dashboard = () => {
  const dispatch = useDispatch()

  return (
    <div className="flex h-screen bg-[#F9FAFB] font-sans text-gray-900 overflow-hidden">

        {/* Sidebar */}
        <Sidebar />
        <main className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="px-4 sm:px-8 py-5 border-b border-gray-200 bg-white flex justify-between items-center gap-4">
            <div className="flex items-center gap-3">
                <button
                    onClick={() => dispatch(toggleSidebar())}
                    className="p-2 hover:bg-gray-100 rounded-lg text-gray-500 hover:text-gray-800 transition-colors md:hidden cursor-pointer"
                    aria-label="Toggle sidebar"
                >
                    <Menu size={20} />
                </button>
                <div className="w-6 h-6 bg-yellow-400 rounded-md flex items-center justify-center text-white font-bold text-xs">★</div>
                <h2 className="text-xl sm:text-2xl font-bold truncate">Workspace Name</h2>
            </div>
            
            <div className="flex items-center gap-4 shrink-0">
                <button className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg font-medium text-sm">
                    <Plus size={16} /> Add new task
                </button>
            </div>
        </header>
        {/* Filters Bar */}
    

        {/* Kanban Board */}    
        
      </main>
    </div>
  )
}

export default Dashboard