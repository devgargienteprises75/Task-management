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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-xs px-4">
            <div className="w-full max-w-md bg-white rounded-xl shadow-[0_8px_30px_rgba(0,0,0,0.12)] border border-zinc-200 overflow-visible">
                <div className="px-5 py-3.5 border-b border-zinc-100 flex justify-between items-center bg-zinc-50/50 rounded-t-xl">
                    <h3 className="font-semibold text-sm text-zinc-900">Create workspace</h3>
                    <button type="button" onClick={() => setWorkspaceModal(false)} className="text-zinc-400 hover:text-zinc-700 transition-colors cursor-pointer">
                        <X size={16} />
                    </button>
                </div>
                <form onSubmit={handleSubmit} className="p-5 space-y-3.5">
                    <div>
                        <label className="block text-xs font-medium text-zinc-700 mb-1">Name</label>
                        <input
                            value={workspaceName}
                            onChange={(e) => setWorkspaceName(e.target.value)}
                            type="text"
                            className={cn(
                                "block w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-xs text-zinc-900 transition-all",
                                "placeholder:text-zinc-400",
                                "focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
                            )}
                            placeholder="e.g. Design Team"
                            required
                        />
                    </div>
                    
                    <div>
                        <label className="block text-xs font-medium text-zinc-700 mb-1">Description</label>
                        <textarea
                            className={cn(
                                "block w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-xs text-zinc-900 transition-all resize-none",
                                "placeholder:text-zinc-400",
                                "focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
                            )}
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="What is this workspace for?"
                            rows={3}
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-medium text-zinc-700 mb-1">Members</label>
                        <div className="relative">
                            <div
                                onClick={() => setSelectBoxOpen(!selectBoxOpen)}
                                className={cn(
                                    "flex items-center justify-between w-full rounded-lg border bg-white px-3 py-2 text-xs text-zinc-900 transition-all cursor-pointer",
                                    selectBoxOpen ? "border-black ring-1 ring-black" : "border-zinc-200 hover:border-zinc-300"
                                )}
                            >
                                <span className="text-zinc-500">
                                    {members.length ? `${members.length} members selected` : "Select members..."}
                                </span>
                                <ChevronRight size={14} className={`text-zinc-400 transition-transform duration-150 ${selectBoxOpen ? 'rotate-90' : ''}`} />
                            </div>
                            
                            {selectBoxOpen && (
                                <div className="absolute top-full left-0 right-0 mt-1 w-full z-50 max-h-[160px] overflow-y-auto rounded-lg border border-zinc-200 bg-white p-1 shadow-lg space-y-0.5">
                                    {users.map(u => (
                                        <label 
                                            key={u._id}
                                            htmlFor={u._id}
                                            className="flex items-center gap-2 px-2.5 py-1.5 rounded hover:bg-zinc-50 cursor-pointer transition-colors"
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
                                                className="w-3.5 h-3.5 rounded border-zinc-300 text-black focus:ring-0 cursor-pointer accent-black"
                                            />
                                            <span className="text-xs font-medium text-zinc-700">
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
                            "mt-4 flex w-full items-center justify-center gap-1.5 rounded-lg bg-black px-4 py-2.5 text-xs font-medium text-white transition-colors cursor-pointer shadow-xs",
                            "hover:bg-zinc-800",
                            isSubmitting && "opacity-80 cursor-not-allowed"
                        )}
                    >
                        {isSubmitting ? (
                            <>
                                <Loader2 size={14} className="animate-spin" />
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