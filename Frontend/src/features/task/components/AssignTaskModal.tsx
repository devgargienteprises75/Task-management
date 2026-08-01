import { useState, type Dispatch, type SetStateAction } from "react"
import useTask from "../hooks/useTask"
import type { task } from "@/types"
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

interface AssignTaskModalProps {
    setModalOpen: Dispatch<SetStateAction<boolean>>
}

const PRIORITY_OPTIONS = [
    {
        value: "High" as const,
        label: "High",
        color: "text-orange-600 bg-orange-50 border-orange-200",
        dot: "bg-orange-500",
    },
    {
        value: "Medium" as const,
        label: "Medium",
        color: "text-yellow-600 bg-yellow-50 border-yellow-200",
        dot: "bg-yellow-400",
    },
    {
        value: "Low" as const,
        label: "Low",
        color: "text-gray-500 bg-gray-100 border-gray-200",
        dot: "bg-gray-400",
    },
]

const AssignTaskModal = ({ setModalOpen }: AssignTaskModalProps) => {

    const { allWorkspaces } = useSelector((state: RootState) => state.workspace)
    var generalWorkspace = allWorkspaces.filter(w => w.isGeneral == true)

    const [title, setTitle] = useState<string>("")
    const [description, setDescription] = useState<string>("")
    const [workspaceId, setWorkspaceId] = useState<string>(generalWorkspace[0]._id)
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/40 backdrop-blur-sm px-4">
            <div
                className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-gray-100 flex flex-col overflow-hidden"
                style={{ maxHeight: "90vh" }}
            >
                {/* Header */}
                <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/60 flex items-center justify-between rounded-t-2xl shrink-0">
                    <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-lg bg-[#D1F53B] flex items-center justify-center">
                            <CheckCircle2 size={15} className="text-gray-900" strokeWidth={2.5} />
                        </div>
                        <h3 className="font-bold text-lg text-gray-900">Create New Task</h3>
                    </div>
                    <button
                        type="button"
                        onClick={() => setModalOpen(false)}
                        className="text-gray-400 hover:text-gray-900 transition-colors cursor-pointer p-1 rounded-lg hover:bg-gray-100"
                        aria-label="Close modal"
                    >
                        <X size={18} />
                    </button>
                </div>

                {/* Scrollable body */}
                <form
                    onSubmit={handleSubmit}
                    className="p-6 space-y-5 overflow-y-auto flex-1"
                >
                    {/* Title */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">
                            Task Title <span className="text-red-400">*</span>
                        </label>
                        <input
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            type="text"
                            className={cn(
                                "block w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-[15px] text-gray-900 transition-all",
                                "placeholder:text-gray-400",
                                "focus:border-gray-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-gray-900"
                            )}
                            placeholder="e.g. Design landing page mockup"
                            required
                        />
                    </div>

                    {/* Description */}
                    <div>
                        <label className="mb-1.5 flex items-center gap-1.5 text-sm font-medium text-gray-700">
                            <AlignLeft size={14} className="text-gray-400" />
                            Description
                        </label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            rows={3}
                            className={cn(
                                "block w-full resize-none rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-[15px] leading-6 text-gray-900 transition-all",
                                "placeholder:text-gray-400",
                                "focus:border-gray-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-gray-900"
                            )}
                            placeholder="Describe the task in detail..."
                        />
                    </div>

                    {/* Workspace */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">
                            Workspace <span className="text-red-400">*</span>
                        </label>
                        <div className="relative">
                            <select
                                value={workspaceId}
                                onChange={(e) => setWorkspaceId(e.target.value)}
                                required
                                className={cn(
                                    "block w-full appearance-none rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 pr-10 text-[15px] text-gray-900 transition-all",
                                    "focus:border-gray-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-gray-900",
                                    !workspaceId && "text-gray-400"
                                )}
                            >
                                <option value="" disabled>
                                    Select a workspace...
                                </option>
                                {allWorkspaces.map((ws) => (
                                    <option key={ws._id} value={ws._id}>
                                        {ws.name}
                                    </option>
                                ))}
                            </select>
                            <ChevronDown
                                size={16}
                                className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
                            />
                        </div>
                    </div>

                    {/* Assign To */}
                    <div>
                        <label className="mb-1.5 flex items-center gap-1.5 text-sm font-medium text-gray-700">
                            <Users size={14} className="text-gray-400" />
                            Assign To
                        </label>
                        <div className="relative">
                            <div
                                onClick={() => setAssignDropdownOpen((v) => !v)}
                                className={cn(
                                    "min-h-[50px] flex items-center flex-wrap gap-2 w-full rounded-xl border bg-gray-50 px-4 py-2.5 text-[15px] text-gray-900 transition-all cursor-pointer pr-10",
                                    assignDropdownOpen
                                        ? "border-gray-900 bg-white ring-1 ring-gray-900"
                                        : "border-gray-200 hover:border-gray-300"
                                )}
                            >
                                {selectedAssignees.length > 0 ? (
                                    selectedAssignees.map((u) => (
                                        <span
                                            key={u._id}
                                            className="inline-flex items-center gap-1.5 rounded-full border border-gray-200 bg-white px-3 py-1 text-xs font-semibold text-gray-700"
                                        >
                                            <span className="w-4 h-4 rounded-full bg-[#D1F53B] flex items-center justify-center text-[9px] font-bold text-gray-900">
                                                {u.username.charAt(0).toUpperCase()}
                                            </span>
                                            {u.username}
                                        </span>
                                    ))
                                ) : (
                                    <span className="text-gray-400 text-[15px]">
                                        Select assignees...
                                    </span>
                                )}
                                <ChevronDown
                                    size={16}
                                    className={cn(
                                        "absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 transition-transform duration-200",
                                        assignDropdownOpen && "rotate-180"
                                    )}
                                />
                            </div>

                            {assignDropdownOpen && (
                                <div className="absolute z-50 mt-2 w-full rounded-xl border border-gray-200 bg-white shadow-xl p-2 space-y-0.5 max-h-[200px] overflow-y-auto">
                                    {users.length === 0 ? (
                                        <p className="text-sm text-gray-400 px-3 py-3 text-center">
                                            No users available
                                        </p>
                                    ) : (
                                        users.map((u) => {
                                            const checked = assignTo.includes(u._id)
                                            return (
                                                <label
                                                    key={u._id}
                                                    htmlFor={`assignee-${u._id}`}
                                                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors group"
                                                >
                                                    <input
                                                        type="checkbox"
                                                        id={`assignee-${u._id}`}
                                                        checked={checked}
                                                        onChange={() => toggleAssignee(u._id)}
                                                        className="w-4 h-4 rounded border-gray-300 cursor-pointer accent-[#D1F53B]"
                                                    />
                                                    <span className="w-6 h-6 rounded-full bg-[#D1F53B]/30 flex items-center justify-center text-xs font-bold text-gray-700">
                                                        {u.username.charAt(0).toUpperCase()}
                                                    </span>
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-sm font-medium text-gray-700 group-hover:text-gray-900 truncate">
                                                            {u.username}
                                                        </p>
                                                        <p className="text-xs text-gray-400 truncate">
                                                            {u.email}
                                                        </p>
                                                    </div>
                                                </label>
                                            )
                                        })
                                    )}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Status & Priority — side by side */}
                    <div className="grid grid-cols-2 gap-4">
                        {/* Priority */}
                        <div>
                            <label className="mb-1.5 flex items-center gap-1.5 text-sm font-medium text-gray-700">
                                <Flag size={14} className="text-gray-400" />
                                Priority
                            </label>
                            <div className="relative">
                                <select
                                    value={priority}
                                    onChange={(e) =>
                                        setPriority(e.target.value as "High" | "Medium" | "Low")
                                    }
                                    className={cn(
                                        "block w-full appearance-none rounded-xl border px-4 py-3 pr-10 text-[15px] font-semibold transition-all",
                                        "focus:outline-none focus:ring-1 focus:ring-gray-900",
                                        selectedPriority.color
                                    )}
                                >
                                    {PRIORITY_OPTIONS.map((p) => (
                                        <option key={p.value} value={p.value}>
                                            {p.label}
                                        </option>
                                    ))}
                                </select>
                                <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
                                    <span
                                        className={cn(
                                            "w-2 h-2 rounded-full",
                                            selectedPriority.dot
                                        )}
                                    />
                                    <ChevronDown size={14} className="text-gray-500" />
                                </div>
                            </div>
                        </div>

                        {/* Due Date */}
                        <div>
                        <label className="mb-1.5 flex items-center gap-1.5 text-sm font-medium text-gray-700">
                            <Calendar size={14} className="text-gray-400" />
                            Due Date
                        </label>
                        <input
                            type="date"
                            value={dueDate}
                            onChange={(e) => setDueDate(e.target.value)}
                            className={cn(
                                "block w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-[15px] text-gray-900 transition-all",
                                "focus:border-gray-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-gray-900"
                                )}
                            />
                        </div>
                    </div>

                    {/* Submit */}
                    <button
                        type="submit"
                        disabled={isSubmitting || submitted}
                        className={cn(
                            "mt-2 flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3.5 text-[15px] font-bold transition-all duration-200 ease-in-out cursor-pointer",
                            submitted
                                ? "bg-green-500 text-white"
                                : "bg-[#D1F53B] text-gray-900 hover:bg-[#c2e532] hover:shadow-lg hover:shadow-[#D1F53B]/30 active:scale-[0.98]",
                            "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-900",
                            (isSubmitting || submitted) && "opacity-80 cursor-not-allowed"
                        )}
                    >
                        {isSubmitting ? (
                            <>
                                <Loader2 size={17} className="animate-spin" />
                                Creating task...
                            </>
                        ) : submitted ? (
                            <>
                                <CheckCircle2 size={17} />
                                Task Created!
                            </>
                        ) : (
                            "Create Task"
                        )}
                    </button>
                </form>
            </div>
        </div>
    )
}

export default AssignTaskModal