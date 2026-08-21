import { useState, type Dispatch, type SetStateAction } from "react";
import { ChevronRight, FileText, Users, X, Loader2 } from "lucide-react";
import { cn } from "@/lib/cn";
import type { UpdateWorkspace, user, workspace } from "@/types";
import { useSelector } from "react-redux";
import type { RootState } from "@/app/app.store";
import useWorkspace from "../hooks/useWorkspace";

interface EditWorkspacePayload {
    workspace: workspace,
    isMenuOpen: boolean,
    modalOption: 'edit' | 'delete' | '';
    setModalOption: Dispatch<SetStateAction<'edit' | 'delete' | ''>>
    setIsMenuOpen: Dispatch<SetStateAction<boolean>>;
    setNewName: Dispatch<SetStateAction<string>>
    setNewDescription: Dispatch<SetStateAction<string>>
    setNewMemberList: Dispatch<SetStateAction<(string | user)[]>>
    workspaceDetail: UpdateWorkspace
}

const EditWorkspaceModal = ({ workspace, isMenuOpen, setModalOption, workspaceDetail, setNewName, setNewDescription, setNewMemberList }: EditWorkspacePayload) => {
    if (!isMenuOpen) return null

    const [selectBoxOpen, setSelectBoxOpen] = useState<boolean>(false)
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false)

    const users = useSelector((state: RootState) => state.admin.users)
    const { handleEditWorkspace } = useWorkspace()

    const getMemberId = (member: string | user) => {
        return typeof member === "string" ? member : member._id
    }

    const normalizedMemberIds = workspaceDetail.newMemberList.map(getMemberId)
    const selectedUsers = users.filter(u => normalizedMemberIds.includes(u._id))

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)
        try {
            await handleEditWorkspace({
                ...workspaceDetail,
                newMemberList: workspaceDetail.newMemberList.map(getMemberId)
            })
            setModalOption('')

            setNewName(workspace.name)
            setNewDescription(workspace.description ?? "")
            setNewMemberList(workspace.members)
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 backdrop-blur-xs">
            <div className="w-full max-w-md overflow-visible rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 shadow-[0_8px_30px_rgba(0,0,0,0.35)]">
                <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-700 bg-zinc-50/50 dark:bg-zinc-900/60 px-6 py-4 rounded-t-xl">
                    <h3 className="text-base font-semibold text-zinc-900 dark:text-white">Edit workspace</h3>
                    <button
                        type="button"
                        onClick={() => {
                            setModalOption('')
                        }}
                        className="cursor-pointer text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 transition-colors p-1 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-700"
                        aria-label="Close edit workspace modal"
                    >
                        <X size={18} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4 p-6">
                    <div>
                        <label className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300">Workspace name</label>
                        <input
                            type="text"
                            value={workspaceDetail.newName}
                            onChange={(e) => setNewName(e.target.value)}
                            className={cn(
                                "block w-full rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3.5 py-2.5 text-sm text-zinc-900 dark:text-zinc-100 transition-all",
                                "placeholder:text-zinc-400 dark:placeholder:text-zinc-500",
                                "focus:border-black dark:focus:border-zinc-400 focus:outline-none focus:ring-1 focus:ring-black dark:focus:ring-zinc-400"
                            )}
                        />
                    </div>

                    <div>
                        <label className="mb-1.5 flex items-center gap-1.5 text-sm font-medium text-zinc-700 dark:text-zinc-300">
                            <FileText size={14} className="text-zinc-400 dark:text-zinc-500" />
                            Description
                        </label>
                        <textarea
                            value={workspaceDetail.newDescription}
                            onChange={(e) => setNewDescription(e.target.value)}
                            rows={3}
                            className={cn(
                                "block w-full resize-none rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3.5 py-2.5 text-sm leading-relaxed text-zinc-900 dark:text-zinc-100 transition-all",
                                "placeholder:text-zinc-400 dark:placeholder:text-zinc-500",
                                "focus:border-black dark:focus:border-zinc-400 focus:outline-none focus:ring-1 focus:ring-black dark:focus:ring-zinc-400"
                            )}
                        />
                    </div>

                    <div>
                        <label className="mb-1.5 flex items-center gap-1.5 text-sm font-medium text-zinc-700 dark:text-zinc-300">
                            <Users size={14} className="text-zinc-400 dark:text-zinc-500" />
                            Members
                        </label>
                        <div className="relative">
                            <div
                                onClick={() => setSelectBoxOpen(!selectBoxOpen)}
                                className={cn(
                                    "rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3.5 py-2 cursor-pointer min-h-[42px] flex items-center",
                                    selectBoxOpen ? "border-black dark:border-zinc-400 ring-1 ring-black dark:ring-zinc-400" : "hover:border-zinc-300 dark:hover:border-zinc-600"
                                )}>
                                <div className="flex flex-wrap gap-1.5 w-full pr-14">
                                    {selectedUsers.length > 0 ? (
                                        selectedUsers.map((u) => (
                                            <span
                                                key={u._id}
                                                className="inline-flex items-center rounded border border-zinc-200 dark:border-zinc-600 bg-zinc-50 dark:bg-zinc-700 px-2 py-0.5 text-xs font-medium text-zinc-700 dark:text-zinc-300"
                                            >
                                                {u.username}
                                            </span>
                                        ))
                                    ) : (
                                        <span className="text-sm text-zinc-400 dark:text-zinc-500">No members assigned</span>
                                    )}
                                </div>
                                <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 pointer-events-none">
                                    <span className="text-zinc-400 dark:text-zinc-500 text-xs">Edit</span>
                                    <ChevronRight size={14} className={`text-zinc-400 dark:text-zinc-500 transition-transform duration-150 ${selectBoxOpen ? 'rotate-90' : ''}`} />
                                </div>
                            </div>

                            {selectBoxOpen && (
                                <div className="absolute top-full left-0 right-0 mt-1 w-full z-50 max-h-[170px] overflow-y-auto rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 p-1.5 shadow-lg space-y-0.5">
                                    {users.map((u) => {
                                        const isChecked = normalizedMemberIds.includes(u._id);
                                        return (
                                            <label
                                                key={u._id}
                                                htmlFor={u._id}
                                                className="flex items-center gap-2.5 px-3 py-2 rounded-md hover:bg-zinc-50 dark:hover:bg-zinc-700 cursor-pointer transition-colors"
                                            >
                                                <input
                                                    onChange={() => {
                                                        const currentIds = workspaceDetail.newMemberList.map(getMemberId);
                                                        if (!isChecked) {
                                                            setNewMemberList([...currentIds, u._id])
                                                        } else {
                                                            setNewMemberList(currentIds.filter(id => id !== u._id))
                                                        }
                                                    }}
                                                    checked={isChecked}
                                                    type="checkbox"
                                                    id={u._id}
                                                    className="w-4 h-4 rounded border-zinc-300 dark:border-zinc-700 accent-black dark:accent-white cursor-pointer"
                                                />
                                                <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                                                    {u.username}
                                                </span>
                                            </label>
                                        )
                                    })}
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="rounded-lg border border-zinc-100 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900/60 px-3.5 py-2.5">
                        <div className="flex items-center justify-between text-sm">
                            <span className="font-medium text-zinc-600 dark:text-zinc-400">Status</span>
                            <span className={cn("inline-flex items-center rounded px-2 py-0.5 text-xs font-medium uppercase tracking-wide", workspace.status === "active" ? "bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800/60" : "bg-zinc-100 text-zinc-600 border border-zinc-200 dark:bg-zinc-700 dark:text-zinc-300 dark:border-zinc-600")}>{workspace.status}</span>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className={cn(
                            "mt-4 flex w-full items-center justify-center gap-2 rounded-lg bg-black dark:bg-zinc-100 px-4 py-2.5 text-sm font-medium text-white dark:text-zinc-900 transition-colors cursor-pointer shadow-xs",
                            "hover:bg-zinc-800 dark:hover:bg-zinc-200",
                            isSubmitting && "opacity-80 cursor-not-allowed"
                        )}
                    >
                        {isSubmitting ? (
                            <>
                                <Loader2 size={15} className="animate-spin" />
                                Saving...
                            </>
                        ) : (
                            "Save changes"
                        )}
                    </button>
                </form>
            </div>
        </div>
    )
}

export default EditWorkspaceModal;