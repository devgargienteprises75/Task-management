import type { RootState } from "@/app/app.store"
import Sidebar from "@/components/Sidebar"
import type { UpdateWorkspace, user, workspace as WorkspaceType } from "@/types"
import { Search, Plus, Menu, Folder } from "lucide-react"
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
    const isAuthLoading = useSelector((state: RootState) => state.auth.isLoading)
    const user = useSelector((state: RootState) => state.auth.user)

    const usersWorkspaces = useMemo(() => {
        if (!user) return []
        return allWorkspaces.filter(w => {
            return w.members.some(member => {
                if (typeof member === "string") return member === user._id;
                return member._id === user._id;
            })
        })
    }, [allWorkspaces, user])

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
        <div className="flex h-screen bg-[#FAFAFA] font-sans text-zinc-900 overflow-hidden">
            {/* Sidebar */}
            <Sidebar />
            <main className="flex-1 flex flex-col min-w-0">
                {/* Header */}
                <header className="px-4 sm:px-8 py-3.5 border-b border-zinc-200/80 bg-white flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => dispatch(toggleSidebar())}
                            className="p-1.5 hover:bg-zinc-100 rounded-lg text-zinc-500 hover:text-zinc-800 transition-colors md:hidden cursor-pointer"
                            aria-label="Toggle sidebar"
                        >
                            <Menu size={18} />
                        </button>
                        <div className="w-8 h-8 bg-zinc-900 rounded-lg flex items-center justify-center text-white font-medium shadow-2xs shrink-0">
                            <Folder size={16} strokeWidth={2} />
                        </div>
                        <div>
                            <h2 className="text-base font-semibold tracking-tight text-zinc-900">Workspaces</h2>
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center gap-2.5 w-full sm:w-auto">
                        <div className="flex items-center gap-2 bg-zinc-50 px-3 py-1.5 rounded-lg border border-zinc-200 flex-1 sm:flex-initial focus-within:bg-white focus-within:border-zinc-400 transition-colors">
                            <Search size={14} className="text-zinc-400 shrink-0" />
                            <input
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                type="text"
                                placeholder="Search workspaces..." 
                                className="bg-transparent outline-none w-full sm:w-44 text-xs text-zinc-900 placeholder-zinc-400" 
                            />
                        </div>

                        {/* Primary Accent Button */}
                        <button 
                            onClick={() => setWorkspaceModal(true)} 
                            className="flex items-center justify-center gap-1.5 px-3.5 py-1.5 bg-black text-white hover:bg-zinc-800 rounded-lg font-medium text-xs transition-colors shadow-xs cursor-pointer w-full sm:w-auto active:scale-98"
                        >
                            <Plus size={14} strokeWidth={2.5} /> Create workspace
                        </button>
                    </div>
                </header>

                {workspaceModal && <CreateWorkspaceModal setWorkspaceModal={setWorkspaceModal} />}

                {/* Main Content Area */}
                <div className="flex-1 overflow-auto p-4 sm:p-6 bg-[#FAFAFA]">
                    {/* Toolbar */}
                    <WorkspaceToolbar layoutStyle={layoutStyle} setLayoutStyle={setLayoutStyle} />

                    {(isLoading || isAuthLoading) ? (
                        <div className="flex-1 flex items-center justify-center min-h-[400px]">
                            <Loader size="lg" text="Loading workspaces..." />
                        </div>
                    ) : (filterWorkspace.length > 0 ? (
                        <div className={layoutStyle === 'grid' ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4" : "flex flex-col gap-2.5"}>
                            {filterWorkspace?.map((workspace: WorkspaceType) => (
                                <WorkspaceComponent 
                                    key={workspace._id}
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
                            ))}
                        </div>
                    ) : (
                        <NotFound heading="Workspaces" />
                    ))}
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