import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "@/app/app.store";
import useWorkspace from "../hooks/useWorkspace";
import CreateWorkspaceModal from "../components/CreateWorkspaceModal";
import WorkspaceToolbar from "../components/WorkspaceToolbar";
import WorkspaceCard from "../components/WorkspaceCard";
import WorkspaceList from "../components/WorkspaceList";
import NotFound from "@/components/NotFound";
import Sidebar from "@/components/Sidebar";
import Loader from "@/components/Loader";
import { Folder, Plus, Search, Menu } from "lucide-react";
import { toggleSidebar } from "@/app/layout.slice";

const Workspaces = () => {
    const { allWorkspaces, isLoading } = useSelector((state: RootState) => state.workspace);
    const { handleGetWorkspaces } = useWorkspace();
    const dispatch = useDispatch();
    const user = useSelector((state: RootState) => state.auth.user)

    const [isCardView, setIsCardView] = useState<boolean>(true);
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [workspaceModal, setWorkspaceModal] = useState<boolean>(false);

    useEffect(() => {
        if (!allWorkspaces.length) {
            handleGetWorkspaces();
        }
    }, []);

    const currentUserWorkspace = allWorkspaces.filter(w =>
        w?.members?.some(member => (typeof member === "string" ? member : member?._id) === user?._id)
    );

    const filteredWorkspaces = currentUserWorkspace.filter(w =>
        w.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (w.description && w.description.toLowerCase().includes(searchQuery.toLowerCase()))
    );

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
                            <Folder size={16} strokeWidth={2} />
                        </div>
                        <div className="flex items-center gap-2">
                            <h1 className="text-base font-semibold tracking-tight text-zinc-900 dark:text-white">Workspaces</h1>
                            <span className="bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 text-xs font-mono px-1.5 py-0.5 rounded border border-zinc-200 dark:border-zinc-700">
                                {allWorkspaces.length}
                            </span>
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center gap-2.5 w-full sm:w-auto">
                        <div className="flex items-center gap-2 bg-zinc-50 dark:bg-zinc-800/80 px-3 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-700/80 flex-1 sm:flex-initial focus-within:bg-white dark:focus-within:bg-zinc-800 focus-within:border-zinc-400 dark:focus-within:border-zinc-500 transition-colors">
                            <Search size={14} className="text-zinc-400 dark:text-zinc-500 shrink-0" />
                            <input
                                type="text"
                                placeholder="Search workspaces..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="bg-transparent outline-none w-full sm:w-44 text-sm text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-500"
                            />
                        </div>

                        <button
                            onClick={() => setWorkspaceModal(true)}
                            className="flex items-center justify-center gap-1.5 px-3.5 py-1.5 bg-black dark:bg-zinc-100 text-white dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-zinc-200 rounded-lg font-medium text-sm transition-colors shadow-xs cursor-pointer w-full sm:w-auto active:scale-98"
                        >
                            <Plus size={15} strokeWidth={2.5} /> Create workspace
                        </button>
                    </div>
                </header>

                <div className="flex-1 overflow-auto p-4 sm:p-8 bg-[#FAFAFA] dark:bg-zinc-900">
                    <div className="max-w-6xl mx-auto space-y-5">
                        <WorkspaceToolbar
                            isCardView={isCardView}
                            setIsCardView={setIsCardView}
                        />

                        {isLoading && !allWorkspaces.length ? (
                            <div className="flex items-center justify-center min-h-[300px]">
                                <Loader size="lg" text="Loading workspaces..." />
                            </div>
                        ) : filteredWorkspaces.length === 0 ? (
                            <NotFound heading="Workspaces" />
                        ) : isCardView ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {filteredWorkspaces.map((ws) => (
                                    <WorkspaceCard key={ws._id} workspace={ws} />
                                ))}
                            </div>
                        ) : (
                            <div className="bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700/80 rounded-xl overflow-hidden shadow-[0_1px_3px_rgba(0,0,0,0.03)]">
                                <div className="divide-y divide-zinc-100 dark:divide-zinc-700/60">
                                    {filteredWorkspaces.map((ws) => (
                                        <WorkspaceList key={ws._id} workspace={ws} />
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {workspaceModal && (
                    <CreateWorkspaceModal setWorkspaceModal={setWorkspaceModal} />
                )}
            </main>
        </div>
    );
};

export default Workspaces;