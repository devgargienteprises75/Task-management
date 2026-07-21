import { useState, type Dispatch, type SetStateAction } from "react";
import { ChevronRight, FileText, Users, X } from "lucide-react";
import { cn } from "@/lib/cn";
import type { UpdateWorkspace, user, workspace } from "@/types";
import { useSelector } from "react-redux";
import type { RootState } from "@/app/app.store";
import useWorkspace from "../hooks/useWorkspace";

interface EditWorkspacePayload {
    workspace: workspace,
    isModalOpen: boolean,
    setIsModalOpen: Dispatch<SetStateAction<boolean>>;
    setNewName: Dispatch<SetStateAction<string>>
    setNewDescription: Dispatch<SetStateAction<string>>
    setNewMemberList: Dispatch<SetStateAction<(string | user)[]>>
    workspaceDetail: UpdateWorkspace
}

const EditWorkspaceModal = ({ workspace, isModalOpen, setIsModalOpen, workspaceDetail, setNewName, setNewDescription, setNewMemberList }: EditWorkspacePayload) => {
    if (!isModalOpen) return null

    const [selectBoxOpen, setSelectBoxOpen] = useState<boolean>(false)
    const memberItems: (string | user)[] = workspace.members ?? []

    const users = useSelector((state: RootState) => state.admin.users)
    const { handleEditWorkspace } = useWorkspace()

    const getMemberId = (member: string | user) => {
        return typeof member === "string" ? member : member._id
    }

    const normalizedMemberIds = workspaceDetail.newMemberList.map(getMemberId)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        await handleEditWorkspace({
            ...workspaceDetail,
            newMemberList: workspaceDetail.newMemberList.map(getMemberId)
        })
        setIsModalOpen(false)

        setNewName(workspace.name)
        setNewDescription(workspace.description ?? "")
        setNewMemberList(workspace.members)
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-100/00 px-4 backdrop-blur-[2px]">
            <div className="w-full max-w-md overflow-visible rounded-2xl border border-gray-100 bg-white shadow-xl">
                <div className="flex items-center justify-between border-b border-gray-100 bg-gray-50/50 px-6 py-5">
                    <h3 className="text-lg font-bold text-gray-900">Edit Workspace</h3>
                    <button
                        type="button"
                        onClick={() => setIsModalOpen(false)}
                        className="cursor-pointer text-gray-400 transition-colors hover:text-gray-900"
                        aria-label="Close edit workspace modal"
                    >
                        <X size={18} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4 p-6">
                    <div>
                        <label className="mb-1.5 block text-sm font-medium text-gray-700">Workspace Name</label>
                        <input
                            type="text"
                            value={workspaceDetail.newName}
                            onChange={(e) => setNewName(e.target.value)}
                            className={cn(
                                "block w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-[15px] text-gray-900 transition-all",
                                "placeholder:text-gray-400",
                                "focus:border-gray-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-gray-900"
                            )}
                        />
                    </div>

                    <div>
                        <label className="mb-1.5 flex items-center gap-2 text-sm font-medium text-gray-700">
                            <FileText size={15} className="text-gray-400" />
                            Description
                        </label>
                        <textarea
                            value={workspaceDetail.newDescription}
                            onChange={(e) => setNewDescription(e.target.value)}
                            rows={4}
                            className={cn(
                                "block w-full resize-none rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-[15px] leading-6 text-gray-900 transition-all",
                                "placeholder:text-gray-400",
                                "focus:border-gray-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-gray-900"
                            )}
                        />
                    </div>

                    <div>
                        <label className="mb-1.5 flex items-center gap-2 text-sm font-medium text-gray-700">
                            <Users size={15} className="text-gray-400" />
                            Update Members
                        </label>
                        <div 
                            onClick={() => setSelectBoxOpen(!selectBoxOpen)}
                            className={cn(
                                "relative rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 cursor-pointer",
                                selectBoxOpen ? "border-gray-900 bg-white ring-1 ring-gray-900" : "border-gray-200 hover:border-gray-300"
                        )}>
                            <div className="flex flex-wrap gap-2">
                                {memberItems.length > 0 ? (
                                    memberItems.map((member) => (
                                        <span
                                            key={typeof member === "string" ? member : member._id}
                                            className={cn(
                                                "inline-flex items-center rounded-full border border-gray-200 bg-white px-3 py-1.5 text-xs font-semibold text-gray-700"
                                            )}
                                        >
                                            {typeof member === "string" ? member : member.username}
                                        </span>
                                    ))
                                ) : (
                                    <span className="text-sm text-gray-500">No members assigned</span>
                                )}
                                <div className="flex items-center gap-2 absolute right-4 top-1/2 -translate-y-1/2">
                                    <span className="text-gray-500 text-sm">Change members...</span>
                                    <ChevronRight size={16} className={`text-gray-400 transition-transform duration-300 ${selectBoxOpen ? 'rotate-180' : ''}`} />
                                </div>
                            </div>

                            {selectBoxOpen && (
                                <div className="absolute left-0 top-full z-50 mt-2 max-h-[300px] w-full overflow-y-auto rounded-xl border border-gray-200 bg-white p-2 shadow-xl space-y-1">
                                    {users.map((user) => (
                                        <label 
                                            key={user._id}
                                            htmlFor={user._id}
                                            className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors group"
                                        >
                                            <input 
                                                onChange={(e) => {
                                                    if(e.target.checked) {
                                                        setNewMemberList([...workspaceDetail.newMemberList.map(getMemberId), user._id])
                                                    }
                                                }}
                                                checked={normalizedMemberIds.includes(user._id)}
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
                    </div>

                    <div className="rounded-xl border border-gray-100 bg-gray-50 px-4 py-3">
                        <div className="flex items-center justify-between text-sm">
                            <span className="font-medium text-gray-600">Status</span>
                            <span className={cn("inline-flex items-center rounded-md px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide", workspace.status === "active" ? "bg-green-50 text-green-600" : "bg-gray-100 text-gray-500")}>{workspace.status}</span>
                        </div>
                    </div>

                    <button
                        type="submit"
                        className={cn(
                            "mt-2 flex w-full justify-center rounded-xl bg-gray-900 px-4 py-3.5 text-[15px] font-bold text-white transition-all duration-200 ease-in-out cursor-pointer",
                            "hover:bg-gray-800 hover:shadow-lg",
                            "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-900",
                            "active:scale-[0.98]"
                        )}
                    >
                        Save Changes
                    </button>
                </form>
            </div>
        </div>
    )
}

export default EditWorkspaceModal;