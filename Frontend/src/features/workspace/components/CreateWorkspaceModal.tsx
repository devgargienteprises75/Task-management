import type { RootState } from "@/app/app.store";
import { cn } from "@/lib/cn"
import { useState } from "react";
import { useSelector } from "react-redux";
import { ChevronDown, ChevronLeft, ChevronRight, ChevronUp } from "lucide-react";
import useWorkspace from "../hooks/useWorkspace";
import type { user, workspace } from "@/types";

interface CreateWorkspaceModalProps {
    setWorkspaceModal: (workspaceModal: boolean) => void;
}

const CreateWorkspaceModal = ({ setWorkspaceModal }: CreateWorkspaceModalProps) => {

    const [selecBoxOpen, setSelectBoxOpen] = useState<boolean>(false)
    const [workspaceName, setWorkspaceName] = useState<string>("")
    const [description, setDescription] = useState<string>("")
    const [members, setMembers] = useState<user[]>([])
    const { users } = useSelector((state: RootState) => state.admin)
    const {user} = useSelector((state: RootState) => state.auth)

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
        await handleCreateWorkspace(workspaceDetails)

        setWorkspaceModal(false)
        setWorkspaceName("")
        setDescription("")
        setMembers([])
    }
    return (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-gray-900/40 backdrop-blur-sm">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-gray-100">
                <div className="px-6 py-3 border-b border-gray-100 flex justify-between items-center bg-gray-50/50 rounded-t-2xl">
                    <h3 className="font-bold text-lg text-gray-900">Create New Workspace</h3>
                    <button type="button" onClick={() => setWorkspaceModal(false)} className="text-gray-400 hover:text-gray-900 transition-colors cursor-pointer">
                        ✕
                    </button>
                </div>
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Workspace Name</label>
                        <input
                            value={workspaceName}
                            onChange={(e) => setWorkspaceName(e.target.value)}
                            type="text"
                            className={cn(
                                "block w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-[15px] text-gray-900 transition-all",
                                "placeholder:text-gray-400",
                                "focus:border-gray-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-gray-900"
                            )}
                            placeholder="e.g. Design Team"
                            required
                        />
                    </div>
                    
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Description</label>
                        <textarea
                            className={cn(
                                "block w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-[15px] text-gray-900 transition-all resize-none",
                                "placeholder:text-gray-400",
                                "focus:border-gray-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-gray-900"
                            )}
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="What is this workspace for?"
                            rows={3}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Add Members</label>
                        <div className="relative">
                            <div
                                onClick={() => setSelectBoxOpen(!selecBoxOpen)}
                                className={cn(
                                    "flex items-center justify-between w-full rounded-xl border bg-gray-50 px-4 py-3 text-[15px] text-gray-900 transition-all cursor-pointer",
                                    selecBoxOpen ? "border-gray-900 bg-white ring-1 ring-gray-900" : "border-gray-200 hover:border-gray-300"
                                )}
                            >
                                <span className="text-gray-500">Select members...</span>
                                <ChevronRight size={18} className={`text-gray-400 transition-transform duration-300 ${selecBoxOpen ? 'rotate-180' : ''}`} />
                            </div>
                            
                            {selecBoxOpen && (
                                <div className="absolute top-0 left-[calc(100%+32px)] w-[280px] z-50 max-h-[300px] overflow-y-auto rounded-xl border border-gray-200 bg-white p-2 shadow-xl space-y-1">
                                    {users.map(user => (
                                        <label 
                                            key={user._id}
                                            htmlFor={user._id}
                                            className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors group"
                                        >
                                            <input 
                                                onChange={(e) => {
                                                    if(e.target.checked) {
                                                        setMembers([...members, user])
                                                    }
                                                }}
                                                checked={members.some(m => m._id === user._id)}
                                                type="checkbox" 
                                                id={user._id} 
                                                className="w-4 h-4 rounded border-gray-300 text-gray-900 focus:ring-gray-900 cursor-pointer accent-[#D1F53B]"
                                            />
                                            <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900">
                                                {user.username}
                                            </span>
                                        </label>
                                    ))}
                                </div>
                            )}
                        </div>
                        <p className="text-xs text-gray-500 mt-2">Select the team members to include in this workspace.</p>
                    </div>

                    <button
                        type="submit"
                        className={cn(
                            "mt-6 flex w-full justify-center rounded-xl bg-[#D1F53B] px-4 py-3.5 text-[15px] font-bold text-gray-900 transition-all duration-200 ease-in-out cursor-pointer",
                            "hover:bg-[#c2e532] hover:shadow-lg hover:shadow-[#D1F53B]/20",
                            "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-900",
                            "active:scale-[0.98]"
                        )}
                    >
                        Create Workspace
                    </button>
                </form>
            </div>
        </div>
    )
}

export default CreateWorkspaceModal