import type { RootState } from "@/app/app.store";
import { cn } from "@/lib/cn"
import { useState } from "react";
import { useSelector } from "react-redux";
import { ChevronRight, Loader2, X } from "lucide-react";
import useWorkspace from "../hooks/useWorkspace";
import type { user, workspace } from "@/types";

interface CreateWorkspaceModalProps {
    setWorkspaceModal: (workspaceModal: boolean) => void;
}

const CreateWorkspaceModal = ({ setWorkspaceModal }: CreateWorkspaceModalProps) => {
    const [selectBoxOpen, setSelectBoxOpen] = useState<boolean>(false)
    const [workspaceName, setWorkspaceName] = useState<string>("")
    const [description, setDescription] = useState<string>("")
    const [members, setMembers] = useState<user[]>([])
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
    const { users } = useSelector((state: RootState) => state.admin)
    const user = useSelector((state: RootState) => state.auth.user)

    const { handleCreateWorkspace } = useWorkspace()
    
    const workspaceDetails: workspace = {
        _id: "",
        name: workspaceName,
        description: description,
        createdBy: user?._id,
        members: members.map(m => m._id),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        status: "active",
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)
        try {
            await handleCreateWorkspace(workspaceDetails)
            setWorkspaceModal(false)
            setWorkspaceName("")
            setDescription("")
            setMembers([])
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs px-4">
            <div className="w-full max-w-md bg-white dark:bg-zinc-800 rounded-xl shadow-[0_8px_30px_rgba(0,0,0,0.35)] border border-zinc-200 dark:border-zinc-700 overflow-visible">
                <div className="px-6 py-4 border-b border-zinc-100 dark:border-zinc-700 flex justify-between items-center bg-zinc-50/50 dark:bg-zinc-900/60 rounded-t-xl">
                    <h3 className="font-semibold text-base text-zinc-900 dark:text-white">Create workspace</h3>
                    <button type="button" onClick={() => setWorkspaceModal(false)} className="text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 transition-colors cursor-pointer p-1 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-700">
                        <X size={18} />
                    </button>
                </div>
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">Name</label>
                        <input
                            value={workspaceName}
                            onChange={(e) => setWorkspaceName(e.target.value)}
                            type="text"
                            className={cn(
                                "block w-full rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3.5 py-2.5 text-sm text-zinc-900 dark:text-zinc-100 transition-all",
                                "placeholder:text-zinc-400 dark:placeholder:text-zinc-500",
                                "focus:border-black dark:focus:border-zinc-400 focus:outline-none focus:ring-1 focus:ring-black dark:focus:ring-zinc-400"
                            )}
                            placeholder="e.g. Design Team"
                            required
                        />
                    </div>
                    
                    <div>
                        <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">Description</label>
                        <textarea
                            className={cn(
                                "block w-full rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3.5 py-2.5 text-sm text-zinc-900 dark:text-zinc-100 transition-all resize-none",
                                "placeholder:text-zinc-400 dark:placeholder:text-zinc-500",
                                "focus:border-black dark:focus:border-zinc-400 focus:outline-none focus:ring-1 focus:ring-black dark:focus:ring-zinc-400"
                            )}
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="What is this workspace for?"
                            rows={3}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">Members</label>
                        <div className="relative">
                            <div
                                onClick={() => setSelectBoxOpen(!selectBoxOpen)}
                                className={cn(
                                    "flex items-center justify-between w-full rounded-lg border bg-white dark:bg-zinc-900 px-3.5 py-2.5 text-sm text-zinc-900 dark:text-zinc-100 transition-all cursor-pointer",
                                    selectBoxOpen ? "border-black dark:border-zinc-400 ring-1 ring-black dark:ring-zinc-400" : "border-zinc-200 dark:border-zinc-700 hover:border-zinc-300 dark:hover:border-zinc-600"
                                )}
                            >
                                <span className="text-zinc-500 dark:text-zinc-400">
                                    {members.length ? `${members.length} members selected` : "Select members..."}
                                </span>
                                <ChevronRight size={15} className={`text-zinc-400 dark:text-zinc-500 transition-transform duration-150 ${selectBoxOpen ? 'rotate-90' : ''}`} />
                            </div>
                            
                            {selectBoxOpen && (
                                <div className="absolute top-full left-0 right-0 mt-1 w-full z-50 max-h-[170px] overflow-y-auto rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 p-1.5 shadow-lg space-y-0.5">
                                    {users.map(u => (
                                        <label 
                                            key={u._id}
                                            htmlFor={u._id}
                                            className="flex items-center gap-2.5 px-3 py-2 rounded-md hover:bg-zinc-50 dark:hover:bg-zinc-700 cursor-pointer transition-colors"
                                        >
                                            <input 
                                                onChange={(e) => {
                                                    if(e.target.checked) {
                                                        setMembers([...members, u])
                                                    } else {
                                                        setMembers(members.filter(m => m._id !== u._id))
                                                    }
                                                }}
                                                checked={members.some(m => m._id === u._id)}
                                                type="checkbox" 
                                                id={u._id} 
                                                className="w-4 h-4 rounded border-zinc-300 dark:border-zinc-700 text-black focus:ring-0 cursor-pointer accent-black dark:accent-white"
                                            />
                                            <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                                                {u.username}
                                            </span>
                                        </label>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className={cn(
                            "mt-5 flex w-full items-center justify-center gap-2 rounded-lg bg-black dark:bg-zinc-100 px-4 py-2.5 text-sm font-medium text-white dark:text-zinc-900 transition-colors cursor-pointer shadow-xs",
                            "hover:bg-zinc-800 dark:hover:bg-zinc-200",
                            isSubmitting && "opacity-80 cursor-not-allowed"
                        )}
                    >
                        {isSubmitting ? (
                            <>
                                <Loader2 size={15} className="animate-spin" />
                                Creating...
                            </>
                        ) : (
                            "Create workspace"
                        )}
                    </button>
                </form>
            </div>
        </div>
    )
}

export default CreateWorkspaceModal