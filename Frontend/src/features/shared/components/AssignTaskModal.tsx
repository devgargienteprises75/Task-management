import { useState, type Dispatch, type SetStateAction } from "react"
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
    ChevronDown,
    Loader2,
    CheckCircle2,
} from "lucide-react"
import { useLocation, useParams } from "react-router-dom"

interface AssignTaskModalProps {
    setModalOpen: Dispatch<SetStateAction<boolean>>
}

const PRIORITY_OPTIONS = [
    {
        value: "High" as const,
        label: "High",
        color: "text-rose-700 bg-rose-50 border-rose-200/80",
        dot: "bg-rose-500",
    },
    {
        value: "Medium" as const,
        label: "Medium",
        color: "text-amber-700 bg-amber-50 border-amber-200/80",
        dot: "bg-amber-500",
    },
    {
        value: "Low" as const,
        label: "Low",
        color: "text-zinc-600 bg-zinc-100 border-zinc-200",
        dot: "bg-zinc-400",
    },
]

const AssignTaskModal = ({ setModalOpen }: AssignTaskModalProps) => {
    const { allWorkspaces } = useSelector((state: RootState) => state.workspace)
    var generalWorkspace = allWorkspaces.filter(w => w.isGeneral == true)
    const { pathname } = useLocation()
    const param = useParams()

    const [title, setTitle] = useState<string>("")
    const [description, setDescription] = useState<string>("")
    const [workspaceId, setWorkspaceId] = useState<string>(pathname === "/tasks" ? generalWorkspace[0]._id : param.workspaceId || "")
    const [assignTo, setAssignTo] = useState<string[]>([])
    const [dueDate, setDueDate] = useState<string>("")
    const [status, setStatus] = useState<"Todo" | "In-progress" | "Done">("Todo")
    const [priority, setPriority] = useState<"High" | "Medium" | "Low">("Medium")

    const [assignDropdownOpen, setAssignDropdownOpen] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [submitted, setSubmitted] = useState(false)

    const { user } = useSelector((state: RootState) => state.auth)
    const { users } = useSelector((state: RootState) => state.admin)

    const { handleCreateTask } = useTask()
    const selectedPriority = PRIORITY_OPTIONS.find((p) => p.value === priority)!
    const selectedAssignees = users.filter((u) => assignTo.includes(u._id))

    const toggleAssignee = (userId: string) => {
        setAssignTo((prev) =>
            prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId]
        )
    }

    const workspaceUser = allWorkspaces.find(w => w._id === workspaceId)?.members;

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
        setWorkspaceId(generalWorkspace[0]?._id)
        setAssignTo([])
        setDueDate("")
        setStatus("Todo")
        setPriority("Medium")
    }
    
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-xs px-4">
            <div
                className="w-full max-w-lg bg-white rounded-xl shadow-[0_8px_30px_rgba(0,0,0,0.12)] border border-zinc-200 flex flex-col overflow-hidden"
                style={{ maxHeight: "90vh" }}
            >
                {/* Header */}
                <div className="px-6 py-4 border-b border-zinc-100 bg-zinc-50/50 flex items-center justify-between rounded-t-xl shrink-0">
                    <h3 className="font-semibold text-base text-zinc-900">Create new task</h3>
                    <button
                        type="button"
                        onClick={() => setModalOpen(false)}
                        className="text-zinc-400 hover:text-zinc-700 transition-colors cursor-pointer p-1 rounded-md hover:bg-zinc-100"
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
                        <label className="block text-sm font-medium text-zinc-700 mb-1.5">
                            Title <span className="text-rose-500">*</span>
                        </label>
                        <input
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            type="text"
                            className={cn(
                                "block w-full rounded-lg border border-zinc-200 bg-white px-3.5 py-2.5 text-sm text-zinc-900 transition-all",
                                "placeholder:text-zinc-400",
                                "focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
                            )}
                            placeholder="e.g. Design landing page mockup"
                            required
                        />
                    </div>

                    {/* Description */}
                    <div>
                        <label className="mb-1.5 flex items-center gap-1.5 text-sm font-medium text-zinc-700">
                            <AlignLeft size={14} className="text-zinc-400" />
                            Description
                        </label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            rows={3}
                            className={cn(
                                "block w-full resize-none rounded-lg border border-zinc-200 bg-white px-3.5 py-2.5 text-sm text-zinc-900 transition-all",
                                "placeholder:text-zinc-400",
                                "focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
                            )}
                            placeholder="Add task details..."
                        />
                    </div>

                    {/* Workspace */}
                    <div>
                        <label className="block text-sm font-medium text-zinc-700 mb-1.5">
                            Workspace <span className="text-rose-500">*</span>
                        </label>
                        <div className="relative">
                            <select
                                value={workspaceId}
                                onChange={(e) => setWorkspaceId(e.target.value)}
                                required
                                className={cn(
                                    "block w-full appearance-none rounded-lg border border-zinc-200 bg-white px-3.5 py-2.5 pr-8 text-sm text-zinc-900 transition-all",
                                    "focus:border-black focus:outline-none focus:ring-1 focus:ring-black",
                                    !workspaceId && "text-zinc-400"
                                )}
                            >
                                {pathname === "/" ?
                                    <option value="" disabled> Select a workspace... </option> :
                                    <option value={workspaceId} disabled>
                                        {pathname === "/" ? "Select a workspace..." : allWorkspaces.find(w => w._id === param.workspaceId)?.name}
                                    </option>}
                                {pathname === "/" && allWorkspaces.map((ws) => (
                                    <option key={ws._id} value={ws._id}>
                                        {ws.name}
                                    </option>
                                ))}
                            </select>
                            <ChevronDown
                                size={15}
                                className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400"
                            />
                        </div>
                    </div>

                    {/* Assign To */}
                    <div>
                        <label className="mb-1.5 flex items-center gap-1.5 text-sm font-medium text-zinc-700">
                            <Users size={14} className="text-zinc-400" />
                            Assign To
                        </label>
                        <div className="relative">
                            <div
                                onClick={() => setAssignDropdownOpen((v) => !v)}
                                className={cn(
                                    "min-h-[42px] flex items-center flex-wrap gap-1.5 w-full rounded-lg border bg-white px-3.5 py-2 text-sm text-zinc-900 transition-all cursor-pointer pr-8",
                                    assignDropdownOpen
                                        ? "border-black ring-1 ring-black"
                                        : "border-zinc-200 hover:border-zinc-300"
                                )}
                            >
                                {selectedAssignees.length > 0 ? (
                                    selectedAssignees.map((u) => (
                                        <span
                                            key={u._id}
                                            className="inline-flex items-center gap-1 rounded border border-zinc-200 bg-zinc-50 px-2 py-0.5 text-xs font-medium text-zinc-700"
                                        >
                                            {u.username}
                                        </span>
                                    ))
                                ) : (
                                    <span className="text-zinc-400 text-sm">
                                        Select assignees...
                                    </span>
                                )}
                                <ChevronDown
                                    size={15}
                                    className={cn(
                                        "absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 transition-transform duration-150",
                                        assignDropdownOpen && "rotate-180"
                                    )}
                                />
                            </div>

                            {assignDropdownOpen && (
                                <div className="absolute z-50 mt-1 w-full rounded-lg border border-zinc-200 bg-white shadow-lg p-1.5 space-y-0.5 max-h-[170px] overflow-y-auto">
                                    {workspaceUser?.length === 0 ? (
                                        <p className="text-xs text-zinc-400 px-3 py-2 text-center">
                                            No users available
                                        </p>
                                    ) : (
                                        workspaceUser?.map((u: string | user) => {
                                            const isUserObj = typeof u !== "string";
                                            const userId = isUserObj ? u._id : u;
                                            const username = isUserObj ? u.username : "User"
                                            const checked = assignTo.includes(userId);
                                            return (
                                                <label
                                                    key={userId}
                                                    htmlFor={`assignee-${userId}`}
                                                    className="flex items-center gap-2.5 px-3 py-2 rounded-md hover:bg-zinc-50 cursor-pointer transition-colors"
                                                >
                                                    <input
                                                        type="checkbox"
                                                        id={`assignee-${userId}`}
                                                        checked={checked}
                                                        onChange={() => toggleAssignee(userId)}
                                                        className="w-4 h-4 rounded border-zinc-300 accent-black cursor-pointer"
                                                    />
                                                    <span className="text-sm font-medium text-zinc-700">
                                                        {username}
                                                    </span>
                                                </label>
                                            )
                                        })
                                    )}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Status & Priority */}
                    <div className="grid grid-cols-2 gap-4">
                        {/* Priority */}
                        <div>
                            <label className="mb-1.5 flex items-center gap-1.5 text-sm font-medium text-zinc-700">
                                <Flag size={14} className="text-zinc-400" />
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
                                    <ChevronDown size={14} className="text-zinc-500" />
                                </div>
                            </div>
                        </div>

                        {/* Due Date */}
                        <div>
                            <label className="mb-1.5 flex items-center gap-1.5 text-sm font-medium text-zinc-700">
                                <Calendar size={14} className="text-zinc-400" />
                                Due Date
                            </label>
                            <input
                                type="date"
                                value={dueDate}
                                onChange={(e) => setDueDate(e.target.value)}
                                className={cn(
                                    "block w-full rounded-lg border border-zinc-200 bg-white px-3.5 py-2.5 text-sm text-zinc-900 transition-all",
                                    "focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
                                )}
                            />
                        </div>
                    </div>

                    {/* Submit */}
                    <button
                        type="submit"
                        disabled={isSubmitting || submitted}
                        className={cn(
                            "mt-5 flex w-full items-center justify-center gap-2 rounded-lg bg-black px-4 py-2.5 text-sm font-medium text-white transition-colors cursor-pointer shadow-xs",
                            submitted
                                ? "bg-emerald-600"
                                : "hover:bg-zinc-800",
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