import type { RootState } from "@/app/app.store"
import Sidebar from "@/components/Sidebar"
import type { workspace as WorkspaceType } from "@/types"
import { Search, Plus, LayoutGrid, LayoutList } from "lucide-react"
import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import CreateWorkspaceModal from "../components/CreateWorkspaceModal"
import WorkspaceCard from "../components/WorkspaceCard"
import WorkspaceList from "../components/WorkspaceList"
import Loader from "@/components/Loader"
import useWorkspace from "../hooks/useWorkspace"
import NotFound from "@/components/NotFound"

const Workspaces = () => {

    const [ workspaceModal, setWorkspaceModal] = useState<boolean>(false)
    const [ layoutStyle, setlayoutStyle ] = useState<'grid' | 'list'>('grid')

    const { handleGetWorkspaces } = useWorkspace()
    const { allWorkspaces, isLoading } = useSelector((state: RootState) => state.workspace)
    
    useEffect(() => {
        handleGetWorkspaces()
    }, [])

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
                        <button onClick={() => setWorkspaceModal(true)} className="flex items-center gap-2 px-4 py-2 bg-[#D1F53B] hover:bg-[#c2e532] text-gray-900 rounded-lg font-semibold text-sm transition-colors shadow-sm cursor-pointer">
                            <Plus size={16} strokeWidth={3} /> Create Workspace
                        </button>
                    </div>
                </header>

                {workspaceModal && <CreateWorkspaceModal setWorkspaceModal={setWorkspaceModal} />}

                {/* Main Content Area */}
                <div className="flex-1 overflow-auto p-8">
                    {/* Toolbar / Filters (optional space) */}
                    <div className="flex justify-end items-end mb-6">
                        <div className="relative flex items-center bg-gray-100 p-1 rounded-lg w-fit shadow-inner">
                            <div 
                                className={`absolute left-1 top-1 bottom-1 w-[32px] bg-white rounded-md shadow-sm border border-gray-200/60 transition-transform duration-300 ease-in-out ${layoutStyle === 'grid' ? 'translate-x-0' : 'translate-x-full'}`}
                            ></div>
                            <button 
                                onClick={() => setlayoutStyle('grid')} 
                                className={`relative z-10 w-[32px] h-[32px] flex justify-center items-center transition-colors duration-300 cursor-pointer ${layoutStyle === 'grid' ? 'text-gray-900' : 'text-gray-400 hover:text-gray-700'}`}
                            >
                                <LayoutGrid size={16} />
                            </button>
                            <button 
                                onClick={() => setlayoutStyle('list')} 
                                className={`relative z-10 w-[32px] h-[32px] flex justify-center items-center transition-colors duration-300 cursor-pointer ${layoutStyle === 'list' ? 'text-gray-900' : 'text-gray-400 hover:text-gray-700'}`}
                            >
                                <LayoutList size={16}/>
                            </button>
                        </div>
                    </div>

                    {isLoading ? <Loader /> : (allWorkspaces.length > 0 ? <div className={layoutStyle === 'grid' ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" : "flex flex-col gap-4"}>
                        {allWorkspaces?.map((workspace: WorkspaceType) => (
                            layoutStyle === 'grid' 
                                ? <WorkspaceCard key={workspace._id} workspace={workspace} /> 
                                : <WorkspaceList key={workspace._id} workspace={workspace} />
                        ))}
                    </div> : <NotFound heading="Workspaces"/>)}
                </div>
            </main>
        </div>
    )
}

export default Workspaces