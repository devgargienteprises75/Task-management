import type { RootState } from "@/app/app.store"
import Sidebar from "@/components/Sidebar"
import type { UpdateWorkspace, user, workspace as WorkspaceType } from "@/types"
import { Search, Plus } from "lucide-react"
import { useEffect, useMemo, useState } from "react"
import { useSelector } from "react-redux"
import CreateWorkspaceModal from "../components/CreateWorkspaceModal"
import WorkspaceCard from "../components/WorkspaceCard"
import WorkspaceList from "../components/WorkspaceList"
import Loader from "@/components/Loader"
import useWorkspace from "../hooks/useWorkspace"
import NotFound from "@/components/NotFound"
import WorkspaceToolbar from "../components/WorkspaceToolbar"
import EditWorkspaceModal from "../components/EditWorkspaceModal"

const Workspaces = () => {

    const [workspaceModal, setWorkspaceModal] = useState<boolean>(false)
    const [layoutStyle, setLayoutStyle] = useState<'grid' | 'list'>('grid')
    const [search, setSearch] = useState<string>("")
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
    const [newName, setNewName] = useState<string>("")
    const [newDescription, setNewDescription] = useState<string>("")
    const [newMemberList, setNewMemberList] = useState<(string | user)[]>([])
    const [selectedWorkspaceId, setSelectedWorkspaceId] = useState<string>("")
    const [selectedWorkspace, setSelectedWorkspace] = useState<WorkspaceType | null>(null)

    const { handleGetWorkspaces } = useWorkspace()
    const { allWorkspaces, isLoading } = useSelector((state: RootState) => state.workspace)

    useEffect(() => {
        if (!allWorkspaces.length) {
            handleGetWorkspaces()
        }
    }, [allWorkspaces])

    const WorkspaceComponent =
        layoutStyle === "grid"
            ? WorkspaceCard
            : WorkspaceList

    const filterWorkspace = useMemo(() => {
        const query = search.trim().toLowerCase()

        if(!query) return allWorkspaces

        return allWorkspaces.filter(workspace => 
            workspace.name.toLowerCase().includes(query) ||
            workspace.description?.toLowerCase().includes(query)
        )
    }, [search, allWorkspaces])

    const workspaceDetail: UpdateWorkspace = {
        workspaceId: selectedWorkspaceId,
        newName,
        newDescription,
        newMemberList
    }

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
                            <input
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                type="text"
                                placeholder="Search workspaces..." 
                                className="bg-transparent outline-none w-48 text-sm" 
                            />
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
                    <WorkspaceToolbar layoutStyle={layoutStyle} setLayoutStyle={setLayoutStyle} />

                    {isLoading ? <Loader /> : (filterWorkspace.length > 0 ? <div className={layoutStyle === 'grid' ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" : "flex flex-col gap-4"}>
                        {filterWorkspace?.map((workspace: WorkspaceType) => (
                            <>
                                <WorkspaceComponent 
                                    workspace={workspace} 
                                    setIsModalOpen={setIsModalOpen}
                                    setSelectedWorkspaceId={setSelectedWorkspaceId}
                                    setSelectedWorkspace={setSelectedWorkspace}
                                    setNewName={setNewName}
                                    setNewDescription={setNewDescription}
                                    setNewMemberList={setNewMemberList}
                                />
                            </>
                        ))}
                    </div> : <NotFound heading="Workspaces" />)}
                </div>

                {isModalOpen && selectedWorkspace && (
                    <EditWorkspaceModal 
                        workspace={selectedWorkspace} 
                        isModalOpen={isModalOpen} 
                        setIsModalOpen={setIsModalOpen}
                        workspaceDetail={workspaceDetail}
                        setNewName={setNewName}
                        setNewDescription={setNewDescription}
                        setNewMemberList={setNewMemberList}
                    />
                )}
            </main>
        </div>
    )
}

export default Workspaces