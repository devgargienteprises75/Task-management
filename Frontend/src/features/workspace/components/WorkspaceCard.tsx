import { Folder, MoreVertical, Pencil, Trash2, Users } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import type { UpdateWorkspace, user, workspace } from "@/types";
import { cn } from "@/lib/cn";
import EditWorkspaceModal from "./EditWorkspaceModal";
import useWorkspace from "../hooks/useWorkspace";

interface WorkspaceCardProps {
    workspace: workspace;
}

const WorkspaceCard = ({ workspace }: WorkspaceCardProps) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [modalOption, setModalOption] = useState<'edit' | 'delete' | ''>('')
    const [newName, setNewName] = useState<string>(workspace.name);
    const [newDescription, setNewDescription] = useState<string>(workspace.description ?? "");
    const [newMemberList, setNewMemberList] = useState<(string | user)[]>(workspace.members);

    const { handleDeleteWorkspace } = useWorkspace();
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

    return (
        <div className="bg-white dark:bg-zinc-800 rounded-xl border border-zinc-200 dark:border-zinc-700/80 p-5 shadow-[0_1px_3px_rgba(0,0,0,0.03)] hover:shadow-[0_4px_12px_rgba(0,0,0,0.2)] hover:border-zinc-300 dark:hover:border-zinc-600 transition-all flex flex-col justify-between h-48 group">
            <div>
                <div className="flex items-start justify-between gap-2 mb-3">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-zinc-100 dark:bg-zinc-700/70 flex items-center justify-center text-zinc-700 dark:text-zinc-200 shrink-0">
                            <Folder size={17} strokeWidth={2} />
                        </div>
                        <div>
                            <Link
                                to={`/workspaces/${workspace._id}`}
                                className="font-semibold text-sm text-zinc-900 dark:text-white hover:underline line-clamp-1 cursor-pointer"
                            >
                                {workspace.name}
                            </Link>
                            <span className={cn(
                                "inline-block px-1.5 py-0.2 text-[10px] uppercase font-semibold tracking-wider rounded border mt-0.5",
                                workspace.status === "active"
                                    ? "bg-emerald-50 text-emerald-700 border-emerald-200/80 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800/60"
                                    : "bg-zinc-100 text-zinc-600 border-zinc-200 dark:bg-zinc-700 dark:text-zinc-300 dark:border-zinc-600"
                            )}>
                                {workspace.status}
                            </span>
                        </div>
                    </div>

                    <div className="relative" ref={menuRef}>
                        {workspace.name !== "General Workspace" && <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="p-1 hover:bg-zinc-100 dark:hover:bg-zinc-700 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 rounded-md transition-colors cursor-pointer"
                            aria-label="Workspace options"
                        >
                            <MoreVertical size={16} />
                        </button>}

                        {isMenuOpen && (
                            <div className="absolute right-0 top-full mt-1 w-36 bg-white dark:bg-zinc-800 rounded-xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.35)] border border-zinc-200 dark:border-zinc-700 py-1.5 z-20 overflow-hidden">
                                <button
                                    onClick={() => {
                                        setIsMenuOpen(false);
                                        setModalOption('edit');
                                    }}
                                    className="w-full text-left px-3.5 py-2 text-sm font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-700/60 flex items-center gap-2 cursor-pointer transition-colors"
                                >
                                    <Pencil size={14} className="text-zinc-400 dark:text-zinc-500" />
                                    <span>Edit</span>
                                </button>
                                {!workspace.isGeneral && (
                                    <>
                                        <div className="h-px bg-zinc-100 dark:bg-zinc-700 my-1" />
                                        <button
                                            onClick={async () => {
                                                setIsMenuOpen(false);
                                                await handleDeleteWorkspace(workspace._id);
                                            }}
                                            className="w-full text-left px-3.5 py-2 text-sm font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 flex items-center gap-2 cursor-pointer transition-colors"
                                        >
                                            <Trash2 size={14} />
                                            <span>Delete</span>
                                        </button>
                                    </>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                <p className="text-zinc-500 dark:text-zinc-400 text-xs line-clamp-2 leading-relaxed font-normal">
                    {workspace.description || "No description provided."}
                </p>
            </div>

            <div className="pt-3 border-t border-zinc-100 dark:border-zinc-700/60 flex items-center justify-between text-xs text-zinc-400 dark:text-zinc-400">
                <div className="flex items-center gap-1.5">
                    <Users size={13} />
                    <span>{workspace.members?.length || 0} members</span>
                </div>
                <Link
                    to={`/workspaces/${workspace._id}`}
                    className="text-xs font-semibold text-zinc-900 dark:text-zinc-100 hover:underline cursor-pointer"
                >
                    Open Workspace →
                </Link>
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
                    isMenuOpen={true}
                    setIsMenuOpen={() => setModalOption('')}
                />
            )}
        </div>
    );
};

export default WorkspaceCard;
