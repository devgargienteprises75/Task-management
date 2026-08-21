import { Folder, MoreVertical, Trash2, Users } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import type { UpdateWorkspace, user, workspace } from "@/types";
import { cn } from "@/lib/cn";
import { useSelector } from "react-redux";
import type { RootState } from "@/app/app.store";
import EditWorkspaceModal from "./EditWorkspaceModal";
import DeleteWorkspace from "./DeleteWorkspace";

interface WorkspaceListProps {
    workspace: workspace;
}

const WorkspaceList = ({ workspace }: WorkspaceListProps) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [modalOption, setModalOption] = useState<'edit' | 'delete' | ''>('')
    const [newName, setNewName] = useState<string>(workspace.name);
    const [newDescription, setNewDescription] = useState<string>(workspace.description ?? "");
    const [newMemberList, setNewMemberList] = useState<(string | user)[]>(workspace.members);

    const user = useSelector((state: RootState) => state.auth.user);
    const menuRef = useRef<HTMLDivElement>(null);

    const workspaceDetail: UpdateWorkspace = {
        workspaceId: workspace._id,
        newName: newName,
        newDescription: newDescription,
        newMemberList: newMemberList,
    }

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsMenuOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const isOwner = user?._id === workspace.createdBy;

    return (
        <div className="p-4 hover:bg-zinc-50 dark:hover:bg-zinc-700/50 transition-colors flex items-center justify-between gap-4">
            <div className="flex items-center gap-3.5 min-w-0">
                <div className="w-9 h-9 rounded-lg bg-zinc-100 dark:bg-zinc-700/70 flex items-center justify-center text-zinc-700 dark:text-zinc-200 shrink-0">
                    <Folder size={17} strokeWidth={2} />
                </div>
                <div className="min-w-0">
                    <div className="flex items-center gap-2">
                        <Link
                            to={`/workspaces/${workspace._id}`}
                            className="font-semibold text-sm text-zinc-900 dark:text-white hover:underline truncate cursor-pointer"
                        >
                            {workspace.name}
                        </Link>
                        <span className={cn(
                            "px-1.5 py-0.2 text-[10px] uppercase font-semibold tracking-wider rounded border",
                            workspace.status === "active"
                                ? "bg-emerald-50 text-emerald-700 border-emerald-200/80 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800/60"
                                : "bg-zinc-100 text-zinc-600 border-zinc-200 dark:bg-zinc-700 dark:text-zinc-300 dark:border-zinc-600"
                        )}>
                            {workspace.status}
                        </span>
                    </div>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 truncate mt-0.5 font-normal">
                        {workspace.description || "No description provided."}
                    </p>
                </div>
            </div>

            <div className="flex items-center gap-5 shrink-0">
                <div className="flex items-center gap-1.5 text-xs text-zinc-400 dark:text-zinc-400">
                    <Users size={13} />
                    <span>{workspace.members?.length || 0}</span>
                </div>

                <Link
                    to={`/workspaces/${workspace._id}`}
                    className="text-xs font-semibold text-zinc-900 dark:text-zinc-100 hover:underline hidden sm:inline-block cursor-pointer"
                >
                    Open →
                </Link>

                {isOwner && (
                    <div className="relative" ref={menuRef}>
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="p-1 hover:bg-zinc-100 dark:hover:bg-zinc-700 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 rounded-md transition-colors cursor-pointer"
                        >
                            <MoreVertical size={16} />
                        </button>

                        {isMenuOpen && (
                            <div className="absolute right-0 top-full mt-1 w-36 bg-white dark:bg-zinc-800 rounded-xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.35)] border border-zinc-200 dark:border-zinc-700 py-1.5 z-20">
                                <button
                                    onClick={() => {
                                        setModalOption('edit')
                                        setIsMenuOpen(false);
                                    }}
                                    className="w-full text-left px-3.5 py-2 text-sm font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-700/60 cursor-pointer"
                                >
                                    Edit
                                </button>
                                <div className="h-px bg-zinc-100 dark:bg-zinc-700 my-1" />
                                <button
                                    onClick={() => {
                                        setModalOption('delete')
                                        setIsMenuOpen(false);
                                    }}
                                    className="w-full text-left px-3.5 py-2 text-sm font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 flex items-center gap-2 cursor-pointer"
                                >
                                    <Trash2 size={14} /> Delete
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {modalOption === 'edit' && (
                <EditWorkspaceModal
                    setNewMemberList={setNewMemberList}
                    setNewDescription={setNewDescription}
                    setNewName={setNewName}
                    workspaceDetail={workspaceDetail}
                    modalOption={modalOption}
                    setModalOption={setModalOption}
                    workspace={workspace}
                    isMenuOpen={isMenuOpen}
                    setIsMenuOpen={setIsMenuOpen}
                />
            )}

            {modalOption === 'delete' && (
                <DeleteWorkspace
                    workspace={workspace}
                    isMenuOpen={modalOption === 'delete'}
                    setIsMenuOpen={() => setModalOption('')}
                />
            )}
        </div>
    );
};

export default WorkspaceList;