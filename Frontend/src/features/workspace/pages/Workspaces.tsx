import type { RootState } from "@/app/app.store"
import Sidebar from "@/components/Sidebar"
import type { UpdateWorkspace, user, workspace as WorkspaceType } from "@/types"
import { Search, Plus, Menu } from "lucide-react"
import { useMemo, useState } from "react"
import { useSelector, useDispatch } from "react-redux"
import CreateWorkspaceModal from "../components/CreateWorkspaceModal"
import WorkspaceCard from "../components/WorkspaceCard"
import WorkspaceList from "../components/WorkspaceList"
import Loader from "@/components/Loader"
import NotFound from "@/components/NotFound"
import WorkspaceToolbar from "../components/WorkspaceToolbar"
import EditWorkspaceModal from "../components/EditWorkspaceModal"
import DeleteWorkspace from "../components/DeleteWorkspace"
import { toggleSidebar } from "@/app/layout.slice"

const Workspaces = () => {
    const dispatch = useDispatch()

    const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false)
    const [workspaceModal, setWorkspaceModal] = useState<boolean>(false)
    const [layoutStyle, setLayoutStyle] = useState<'grid' | 'list'>('grid')
    const [search, setSearch] = useState<string>("")
    const [modalOption, setModalOption] = useState<'edit' | 'delete' | ''>("")
    const [newName, setNewName] = useState<string>("")
    const [newDescription, setNewDescription] = useState<string>("")
    const [newMemberList, setNewMemberList] = useState<(string | user)[]>([])
    const [selectedWorkspaceId, setSelectedWorkspaceId] = useState<string>("")
    const [selectedWorkspace, setSelectedWorkspace] = useState<WorkspaceType | null>(null)

    const allWorkspaces = useSelector((state: RootState) => state.workspace.allWorkspaces)
    const isLoading = useSelector((state: RootState) => state.workspace.isLoading)
    const user = useSelector((state: RootState) => state.auth.user)

    const usersWorkspaces = allWorkspaces.filter(w => {
        return w.members.some(member => {
            if (typeof member === "string") return member === user?._id;
            return member._id === user?._id;
        })
    })

    const WorkspaceComponent =
        layoutStyle === "grid"
            ? WorkspaceCard
            : WorkspaceList

    const filterWorkspace = useMemo(() => {
        const query = search.trim().toLowerCase()

        if(!query) return usersWorkspaces

        return usersWorkspaces.filter(workspace => 
            workspace.name.toLowerCase().includes(query) ||
            workspace.description?.toLowerCase().includes(query)
        )
    }, [search, usersWorkspaces])

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
            <main className="flex-1 flex flex-col min-w-0">
                {/* Header */}
                <header className="px-4 sm:px-8 py-4 sm:py-6 border-b border-gray-200 bg-white flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => dispatch(toggleSidebar())}
                            className="p-2 hover:bg-gray-100 rounded-lg text-gray-500 hover:text-gray-800 transition-colors md:hidden cursor-pointer"
                            aria-label="Toggle sidebar"
                        >
                            <Menu size={20} />
                        </button>
                        <h2 className="text-xl sm:text-2xl font-bold tracking-tight">Workspaces</h2>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center gap-3 w-full sm:w-auto">
                        <div className="flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-xl border border-gray-200 flex-1 sm:flex-initial">
                            <Search size={16} className="text-gray-400 shrink-0" />
                            <input
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                type="text"
                                placeholder="Search workspaces..." 
                                className="bg-transparent outline-none w-full sm:w-48 text-sm" 
                            />
                        </div>

                        {/* Primary Accent Button */}
                        <button onClick={() => setWorkspaceModal(true)} className="flex items-center justify-center gap-2 px-4 py-2.5 bg-[#D1F53B] hover:bg-[#c2e532] text-gray-900 rounded-xl font-semibold text-sm transition-colors shadow-sm cursor-pointer w-full sm:w-auto">
                            <Plus size={16} strokeWidth={3} /> Create Workspace
                        </button>
                    </div>
                </header>

                {workspaceModal && <CreateWorkspaceModal setWorkspaceModal={setWorkspaceModal} />}

                {/* Main Content Area */}
                <div className="flex-1 overflow-auto p-4 sm:p-8">
                    {/* Toolbar / Filters (optional space) */}
                    <WorkspaceToolbar layoutStyle={layoutStyle} setLayoutStyle={setLayoutStyle} />

                    {isLoading ? <Loader /> : (filterWorkspace.length > 0 ? <div className={layoutStyle === 'grid' ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" : "flex flex-col gap-4"}>
                        {filterWorkspace?.map((workspace: WorkspaceType) => (
                            <>
                                <WorkspaceComponent 
                                    workspace={workspace} 
                                    setIsMenuOpen={setIsMenuOpen}
                                    modalOption={modalOption} 
                                    setModalOption={setModalOption}
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

                {modalOption === 'edit' && selectedWorkspace && (
                    <EditWorkspaceModal 
                        workspace={selectedWorkspace} 
                        isMenuOpen={isMenuOpen}
                        setIsMenuOpen={setIsMenuOpen}
                        modalOption={modalOption}
                        setModalOption={setModalOption}
                        workspaceDetail={workspaceDetail}
                        setNewName={setNewName}
                        setNewDescription={setNewDescription}
                        setNewMemberList={setNewMemberList}
                    />
                )}

                {modalOption === 'delete' && selectedWorkspace && (
                    <DeleteWorkspace 
                        workspace={selectedWorkspace}
                        isMenuOpen={isMenuOpen}
                        setIsMenuOpen={setIsMenuOpen}
                    />
                )}
            </main>
        </div>
    )
}

export default Workspaces