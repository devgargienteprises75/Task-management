import { useState, useEffect, type Dispatch, type SetStateAction } from "react"
import useTask from "../../task/hooks/useTask"
import type { task, user } from "@/types"
import { useSelector } from "react-redux"
import type { RootState } from "@/app/app.store"
import { cn } from "@/lib/cn"
import {
    X,
    AlignLeft,
    Calendar,
    Flag,
    Users,
    Loader2,
    CheckCircle2,
    Folder,
    ChevronUp,
} from "lucide-react"
import { useParams } from "react-router-dom"

interface AssignTaskModalProps {
    setModalOpen: Dispatch<SetStateAction<boolean>>
}

const PRIORITY_OPTIONS = [
    {
        value: "High" as const,
        label: "High",
        color: "text-rose-700 bg-rose-50 border-rose-200/80 dark:bg-rose-950/40 dark:text-rose-400 dark:border-rose-800/60",
        dot: "bg-rose-500",
    },
    {
        value: "Medium" as const,
        label: "Medium",
        color: "text-amber-700 bg-amber-50 border-amber-200/80 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-800/60",
        dot: "bg-amber-500",
    },
    {
        value: "Low" as const,
        label: "Low",
        color: "text-zinc-600 bg-zinc-100 border-zinc-200 dark:bg-zinc-700 dark:text-zinc-300 dark:border-zinc-600",
        dot: "bg-zinc-400",
    },
]

const AssignTaskModal = ({ setModalOpen }: AssignTaskModalProps) => {
    const { allWorkspaces } = useSelector((state: RootState) => state.workspace)
    const { user } = useSelector((state: RootState) => state.auth)
    const { users } = useSelector((state: RootState) => state.admin)
    const param = useParams()

    const generalWorkspace = allWorkspaces.find((w) => w.isGeneral === true)
    const initialWorkspaceId = param.workspaceId || generalWorkspace?._id || allWorkspaces[0]?._id || ""

    const [title, setTitle] = useState<string>("")
    const [description, setDescription] = useState<string>("")
    const [workspaceId, setWorkspaceId] = useState<string>(initialWorkspaceId)
    const [assignTo, setAssignTo] = useState<string[]>([])
    const [dueDate, setDueDate] = useState<string>("")
    const [status, setStatus] = useState<"Todo" | "In-progress" | "Done">("Todo")
    const [priority, setPriority] = useState<"High" | "Medium" | "Low">("Medium")

    const [workspaceDropdownOpen, setWorkspaceDropdownOpen] = useState(false)
    const [assignDropdownOpen, setAssignDropdownOpen] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [submitted, setSubmitted] = useState(false)

    const { handleCreateTask } = useTask()

    useEffect(() => {
        if (!workspaceId && allWorkspaces.length > 0) {
            const general = allWorkspaces.find((w) => w.isGeneral);
            setWorkspaceId(param.workspaceId || general?._id || allWorkspaces[0]._id);
        }
    }, [allWorkspaces, param.workspaceId, workspaceId])

    const selectedPriority = PRIORITY_OPTIONS.find((p) => p.value === priority)!
    const selectedAssignees = users.filter((u) => assignTo.includes(u._id))

    const toggleAssignee = (userId: string) => {
        setAssignTo((prev) =>
            prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId]
        )
    }

    const selectedWorkspace = allWorkspaces.find((w) => w._id === workspaceId)
    const workspaceUser = (selectedWorkspace?.members && selectedWorkspace.members.length > 0)
        ? selectedWorkspace.members
        : users

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)

        const taskDetails: task = {
            title,
            description,
            workspaceId,
            assignTo,
            assignBy: user?._id ?? "",
            status,
            priority,
            dueDate,
        }

        const res = await handleCreateTask(workspaceId, taskDetails)
        setIsSubmitting(false)

        if (res?.success) {
            setSubmitted(true)
            setTimeout(() => {
                setModalOpen(false)
            }, 900)
        }

        setTitle("")
        setDescription("")
        setWorkspaceId(initialWorkspaceId)
        setAssignTo([])
        setDueDate("")
        setStatus("Todo")
        setPriority("Medium")
    }
    
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs px-4">
            <div
                className="w-full max-w-lg bg-white dark:bg-zinc-800 rounded-xl shadow-[0_8px_30px_rgba(0,0,0,0.35)] border border-zinc-200 dark:border-zinc-700 flex flex-col overflow-hidden"
                style={{ maxHeight: "90vh" }}
            >
                {/* Header */}
                <div className="px-6 py-4 border-b border-zinc-100 dark:border-zinc-700 bg-zinc-50/50 dark:bg-zinc-900/60 flex items-center justify-between rounded-t-xl shrink-0">
                    <h3 className="font-semibold text-base text-zinc-900 dark:text-white">Create new task</h3>
                    <button
                        type="button"
                        onClick={() => setModalOpen(false)}
                        className="text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 transition-colors cursor-pointer p-1 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-700"
                        aria-label="Close modal"
                    >
                        <X size={18} />
                    </button>
                </div>

                {/* Scrollable body */}
                <form
                    onSubmit={handleSubmit}
                    className="p-6 space-y-4 overflow-y-auto flex-1"
                >
                    {/* Title */}
                    <div>
                        <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">
                            Title <span className="text-rose-500">*</span>
                        </label>
                        <input
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            type="text"
                            className={cn(
                                "block w-full rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3.5 py-2.5 text-sm text-zinc-900 dark:text-zinc-100 transition-all",
                                "placeholder:text-zinc-400 dark:placeholder:text-zinc-500",
                                "focus:border-black dark:focus:border-zinc-400 focus:outline-none focus:ring-1 focus:ring-black dark:focus:ring-zinc-400"
                            )}
                            placeholder="e.g. Design landing page mockup"
                            required
                        />
                    </div>

                    {/* Description */}
                    <div>
                        <label className="mb-1.5 flex items-center gap-1.5 text-sm font-medium text-zinc-700 dark:text-zinc-300">
                            <AlignLeft size={14} className="text-zinc-400 dark:text-zinc-500" />
                            Description
                        </label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            rows={3}
                            className={cn(
                                "block w-full resize-none rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3.5 py-2.5 text-sm text-zinc-900 dark:text-zinc-100 transition-all",
                                "placeholder:text-zinc-400 dark:placeholder:text-zinc-500",
                                "focus:border-black dark:focus:border-zinc-400 focus:outline-none focus:ring-1 focus:ring-black dark:focus:ring-zinc-400"
                            )}
                            placeholder="Add task details..."
                        />
                    </div>

                    {/* Workspace */}
                    <div>
                        <label className="mb-1.5 flex items-center gap-1.5 text-sm font-medium text-zinc-700 dark:text-zinc-300">
                            <Folder size={14} className="text-zinc-400 dark:text-zinc-500" />
                            Workspace <span className="text-rose-500">*</span>
                        </label>
                        <div className="relative">
                            <div
                                onClick={() => setWorkspaceDropdownOpen((v) => !v)}
                                className={cn(
                                    "min-h-[42px] flex items-center justify-between w-full rounded-lg border bg-white dark:bg-zinc-900 px-3.5 py-2 text-sm text-zinc-900 dark:text-zinc-100 transition-all cursor-pointer",
                                    workspaceDropdownOpen
                                        ? "border-black dark:border-zinc-400 ring-1 ring-black dark:ring-zinc-400"
                                        : "border-zinc-200 dark:border-zinc-700 hover:border-zinc-300 dark:hover:border-zinc-600"
                                )}
                            >
                                <span className={!selectedWorkspace ? "text-zinc-400 dark:text-zinc-500 text-sm" : "text-zinc-900 dark:text-zinc-100 text-sm font-medium"}>
                                    {selectedWorkspace?.name || "Select a workspace..."}
                                </span>
                                <ChevronUp
                                    size={15}
                                    className={cn(
                                        "text-zinc-400 dark:text-zinc-500 transition-transform duration-150 shrink-0",
                                        workspaceDropdownOpen && "rotate-180"
                                    )}
                                />
                            </div>

                            {workspaceDropdownOpen && (
                                <div className="absolute z-50 bottom-full mb-1 w-full rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 shadow-lg p-1.5 space-y-0.5 max-h-[170px] overflow-y-auto">
                                    {allWorkspaces.length === 0 ? (
                                        <p className="text-xs text-zinc-400 dark:text-zinc-500 px-3 py-2 text-center">
                                            No workspaces available
                                        </p>
                                    ) : (
                                        allWorkspaces.map((ws) => {
                                            const isSelected = ws._id === workspaceId;
                                            return (
                                                <div
                                                    key={ws._id}
                                                    onClick={() => {
                                                        setWorkspaceId(ws._id);
                                                        setWorkspaceDropdownOpen(false);
                                                    }}
                                                    className={cn(
                                                        "flex items-center justify-between px-3 py-2 rounded-md cursor-pointer transition-colors text-sm",
                                                        isSelected
                                                            ? "bg-zinc-100 dark:bg-zinc-700 text-zinc-900 dark:text-white font-medium"
                                                            : "hover:bg-zinc-50 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300"
                                                    )}
                                                >
                                                    <span>{ws.name}</span>
                                                    {isSelected && <CheckCircle2 size={14} className="text-zinc-900 dark:text-white shrink-0" />}
                                                </div>
                                            );
                                        })
                                    )}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Assign To */}
                    <div>
                        <label className="mb-1.5 flex items-center gap-1.5 text-sm font-medium text-zinc-700 dark:text-zinc-300">
                            <Users size={14} className="text-zinc-400 dark:text-zinc-500" />
                            Assign To
                        </label>
                        <div className="relative">
                            <div
                                onClick={() => setAssignDropdownOpen((v) => !v)}
                                className={cn(
                                    "min-h-[42px] flex items-center flex-wrap gap-1.5 w-full rounded-lg border bg-white dark:bg-zinc-900 px-3.5 py-2 text-sm text-zinc-900 dark:text-zinc-100 transition-all cursor-pointer pr-8",
                                    assignDropdownOpen
                                        ? "border-black dark:border-zinc-400 ring-1 ring-black dark:ring-zinc-400"
                                        : "border-zinc-200 dark:border-zinc-700 hover:border-zinc-300 dark:hover:border-zinc-600"
                                )}
                            >
                                {selectedAssignees.length > 0 ? (
                                    selectedAssignees.map((u) => (
                                        <span
                                            key={u._id}
                                            className="inline-flex items-center gap-1 rounded border border-zinc-200 dark:border-zinc-600 bg-zinc-50 dark:bg-zinc-700 px-2 py-0.5 text-xs font-medium text-zinc-700 dark:text-zinc-300"
                                        >
                                            {u.username}
                                        </span>
                                    ))
                                ) : (
                                    <span className="text-zinc-400 dark:text-zinc-500 text-sm">
                                        Select assignees...
                                    </span>
                                )}
                                <ChevronUp
                                    size={15}
                                    className={cn(
                                        "absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 dark:text-zinc-500 transition-transform duration-150",
                                        assignDropdownOpen && "rotate-180"
                                    )}
                                />
                            </div>

                            {assignDropdownOpen && (
                                <div className="absolute z-50 bottom-full mb-1 w-full rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 shadow-lg p-1.5 max-h-[190px] overflow-y-auto">
                                    {(!workspaceUser || workspaceUser.length === 0) ? (
                                        <p className="text-xs text-zinc-400 dark:text-zinc-500 px-3 py-2 text-center">
                                            No users available
                                        </p>
                                    ) : (
                                        <>
                                            <div className="sticky -top-1.5 -mx-1.5 px-3 py-1.5 mb-1 border-b border-zinc-100 dark:border-zinc-700/80 bg-white dark:bg-zinc-800 flex items-center justify-between z-10">
                                                <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
                                                    {assignTo.length} selected
                                                </span>
                                                <button
                                                    type="button"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setAssignDropdownOpen(false);
                                                    }}
                                                    className="text-xs font-medium px-2.5 py-1 rounded-md bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors cursor-pointer"
                                                >
                                                    Done
                                                </button>
                                            </div>
                                            <div className="space-y-0.5">
                                                {workspaceUser.map((u: string | user) => {
                                                    const isUserObj = typeof u !== "string";
                                                    const userId = isUserObj ? u._id : u;
                                                    const userObj = isUserObj ? u : users.find((usr) => usr._id === u);
                                                    const username = userObj?.username || "User";
                                                    const checked = assignTo.includes(userId);
                                                    return (
                                                        <label
                                                            key={userId}
                                                            htmlFor={`assignee-${userId}`}
                                                            className="flex items-center gap-2.5 px-3 py-2 rounded-md hover:bg-zinc-50 dark:hover:bg-zinc-700 cursor-pointer transition-colors"
                                                        >
                                                            <input
                                                                type="checkbox"
                                                                id={`assignee-${userId}`}
                                                                checked={checked}
                                                                onChange={() => toggleAssignee(userId)}
                                                                className="w-4 h-4 rounded border-zinc-300 dark:border-zinc-700 accent-black dark:accent-white cursor-pointer"
                                                            />
                                                            <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                                                                {username}
                                                            </span>
                                                        </label>
                                                    );
                                                })}
                                            </div>
                                        </>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Status & Priority */}
                    <div className="grid grid-cols-2 gap-4">
                        {/* Priority */}
                        <div>
                            <label className="mb-1.5 flex items-center gap-1.5 text-sm font-medium text-zinc-700 dark:text-zinc-300">
                                <Flag size={14} className="text-zinc-400 dark:text-zinc-500" />
                                Priority
                            </label>
                            <div className="relative">
                                <select
                                    value={priority}
                                    onChange={(e) =>
                                        setPriority(e.target.value as "High" | "Medium" | "Low")
                                    }
                                    className={cn(
                                        "block w-full appearance-none rounded-lg border px-3.5 py-2.5 pr-8 text-sm font-medium transition-all focus:outline-none",
                                        selectedPriority.color
                                    )}
                                >
                                    {PRIORITY_OPTIONS.map((p) => (
                                        <option key={p.value} value={p.value}>
                                            {p.label}
                                        </option>
                                    ))}
                                </select>
                                <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
                                    <ChevronUp size={14} className="text-zinc-500" />
                                </div>
                            </div>
                        </div>

                        {/* Due Date */}
                        <div>
                            <label className="mb-1.5 flex items-center gap-1.5 text-sm font-medium text-zinc-700 dark:text-zinc-300">
                                <Calendar size={14} className="text-zinc-400 dark:text-zinc-500" />
                                Due Date
                            </label>
                            <input
                                type="date"
                                value={dueDate}
                                onChange={(e) => setDueDate(e.target.value)}
                                className={cn(
                                    "block w-full rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3.5 py-2.5 text-sm text-zinc-900 dark:text-zinc-100 transition-all",
                                    "focus:border-black dark:focus:border-zinc-400 focus:outline-none focus:ring-1 focus:ring-black dark:focus:ring-zinc-400"
                                )}
                            />
                        </div>
                    </div>

                    {/* Submit */}
                    <button
                        type="submit"
                        disabled={isSubmitting || submitted}
                        className={cn(
                            "mt-5 flex w-full items-center justify-center gap-2 rounded-lg bg-black dark:bg-zinc-100 px-4 py-2.5 text-sm font-medium text-white dark:text-zinc-900 transition-colors cursor-pointer shadow-xs",
                            submitted
                                ? "bg-emerald-600 dark:bg-emerald-600 text-white"
                                : "hover:bg-zinc-800 dark:hover:bg-zinc-200",
                            (isSubmitting || submitted) && "opacity-80 cursor-not-allowed"
                        )}
                    >
                        {isSubmitting ? (
                            <>
                                <Loader2 size={15} className="animate-spin" />
                                Creating task...
                            </>
                        ) : submitted ? (
                            <>
                                <CheckCircle2 size={15} />
                                Task created!
                            </>
                        ) : (
                            "Create task"
                        )}
                    </button>
                </form>
            </div>
        </div>
    )
}

export default AssignTaskModal