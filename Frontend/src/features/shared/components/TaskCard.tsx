import type { task, UpdatedTask, user, workspace } from "@/types";
import { useDraggable } from "@dnd-kit/react";
import { Calendar, ChevronDown, MoreVertical, Pencil, Trash2, Check } from "lucide-react";
import useTask from "../../task/hooks/useTask";
import { useState, useEffect, useRef, type Dispatch, type SetStateAction } from "react";

interface TaskCardProps {
  task: task;
  taskUsers: user[];
  statusType?: "Todo" | "In-progress" | "Done";
  assignedTask?: boolean;
  setEditModalOpen?: Dispatch<SetStateAction<boolean>>;
  setSelectedTask?: Dispatch<SetStateAction<task | null>>;
}

const getPriorityStyles = (priority: "High" | "Medium" | "Low") => {
  switch (priority) {
    case "High":
      return "bg-rose-50 text-rose-700 border-rose-200/80";
    case "Medium":
      return "bg-amber-50 text-amber-700 border-amber-200/80";
    case "Low":
      return "bg-zinc-100 text-zinc-600 border-zinc-200";
    default:
      return "bg-zinc-100 text-zinc-600 border-zinc-200";
  }
};

const STATUS_CONFIG = {
  Todo: {
    label: "To Do",
    dot: "bg-zinc-400",
    pill: "bg-zinc-100 text-zinc-700 border-zinc-200 hover:bg-zinc-200/60",
  },
  "In-progress": {
    label: "In Progress",
    dot: "bg-blue-500",
    pill: "bg-blue-50 text-blue-700 border-blue-200/80 hover:bg-blue-100/60",
  },
  Done: {
    label: "Done",
    dot: "bg-emerald-500",
    pill: "bg-emerald-50 text-emerald-700 border-emerald-200/80 hover:bg-emerald-100/60",
  },
};

const TaskCard = ({ task, taskUsers, assignedTask = false, setEditModalOpen, setSelectedTask }: TaskCardProps) => {

  const [status, setStatus] = useState<'Todo' | 'In-progress' | "Done">(task.status)
  const [dropdownOpen, setDropdownOpen] = useState<boolean>(false)
  const [statusMenuOpen, setStatusMenuOpen] = useState<boolean>(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const statusMenuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setStatus(task.status);
  }, [task.status]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false)
      }
      if (statusMenuRef.current && !statusMenuRef.current.contains(event.target as Node)) {
        setStatusMenuOpen(false)
      }
    }
    if (dropdownOpen || statusMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside)
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [dropdownOpen, statusMenuOpen])

  const assignees = taskUsers.filter((u) =>
    (task.assignTo as string[]).includes(u._id)
  );

  const { ref } = useDraggable({
    id: task._id ?? `task-${task.title}`,
  })

  const { handleUpdateTask, handleDeleteTask } = useTask()

  const updateStatus = async (nextStatus: UpdatedTask["status"]) => {
    if (!nextStatus || nextStatus === status) {
      setStatusMenuOpen(false);
      return;
    }

    const taskDetails: UpdatedTask = {
      _id: task._id,
      status: nextStatus,
      workspaceId: task?.workspaceId
    }

    setStatus(nextStatus);
    setStatusMenuOpen(false);
    await handleUpdateTask(taskDetails);
  };

  const handleDeleteClick = async (workspaceId: string | workspace, taskId: string) => {
    const workspaceID = typeof workspaceId === 'object' ? workspaceId._id : workspaceId;
    await handleDeleteTask(workspaceID, taskId);
  }

  const currentStatusConfig = STATUS_CONFIG[status] || STATUS_CONFIG.Todo;

  return (
    <div
      ref={ref}
      className={`relative bg-white p-3 rounded-lg border border-zinc-200 shadow-[0_1px_3px_rgba(0,0,0,0.03)] hover:shadow-[0_4px_12px_rgba(0,0,0,0.05)] hover:border-zinc-300 transition-all duration-150 group cursor-pointer ${
        status === "Done" ? "bg-zinc-50/50" : ""
      }`}
    >
      {/* Tags, Status Pill & Actions */}
      <div className="flex justify-between items-center mb-2 gap-2">
        <div className="flex items-center gap-1.5 flex-wrap">
          {/* Priority Badge */}
          <span
            className={`inline-flex items-center justify-center h-5 text-[11px] font-medium px-2 rounded-md border leading-none shrink-0 ${getPriorityStyles(
              task.priority
            )}`}
          >
            {task.priority}
          </span>

          {/* Interactive Status Pill Selector */}
          <div className="relative inline-flex items-center shrink-0" ref={statusMenuRef}>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setStatusMenuOpen(!statusMenuOpen);
              }}
              className={`inline-flex items-center justify-center h-5 gap-1.5 text-[11px] font-medium px-2 rounded-md border leading-none transition-colors cursor-pointer ${currentStatusConfig.pill}`}
              title="Change status"
            >
              <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${currentStatusConfig.dot}`} />
              <span>{currentStatusConfig.label}</span>
              <ChevronDown size={10} className={`shrink-0 transition-transform duration-150 ${statusMenuOpen ? "rotate-180" : ""}`} />
            </button>

            {/* Status Dropdown Menu */}
            {statusMenuOpen && (
              <div
                onClick={(e) => e.stopPropagation()}
                className="absolute left-0 top-full mt-1 w-36 bg-white rounded-lg shadow-[0_4px_20px_-4px_rgba(0,0,0,0.12)] border border-zinc-200 overflow-hidden z-30 py-1 text-left animate-in fade-in zoom-in-95 duration-100"
              >
                {(["Todo", "In-progress", "Done"] as const).map((st) => {
                  const cfg = STATUS_CONFIG[st];
                  const isSelected = status === st;
                  return (
                    <button
                      key={st}
                      type="button"
                      onClick={() => updateStatus(st)}
                      className={`w-full px-3 py-1.5 text-xs font-medium flex items-center justify-between transition-colors cursor-pointer ${
                        isSelected ? "bg-zinc-100 text-zinc-900 font-semibold" : "text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
                        <span>{cfg.label}</span>
                      </div>
                      {isSelected && <Check size={12} className="text-zinc-900 stroke-[2.5]" />}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Assigned Task Options Menu */}
        {assignedTask && (
          <div ref={dropdownRef} className="relative">
            <button
              onClick={() => {
                setSelectedTask?.(task)
                setDropdownOpen(!dropdownOpen)
              }}
              className="p-1 hover:bg-zinc-100 rounded text-zinc-400 hover:text-zinc-600 transition-colors cursor-pointer"
            >
              <MoreVertical size={14} />
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 mt-1.5 w-36 bg-white rounded-xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.12)] border border-zinc-200 overflow-hidden z-20 py-1.5">
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    setDropdownOpen(false)
                    setEditModalOpen?.(true)
                  }}
                  className="w-full text-left px-3.5 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50 flex items-center gap-2.5 cursor-pointer transition-colors"
                >
                  <Pencil size={14} className="text-zinc-400" /> Edit
                </button>
                <div className="h-px bg-zinc-100 w-full" />
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    void handleDeleteClick(task.workspaceId, task._id!)
                  }}
                  className="w-full text-left px-3.5 py-2 text-sm font-medium text-rose-600 hover:bg-rose-50 flex items-center gap-2.5 cursor-pointer transition-colors"
                >
                  <Trash2 size={14} className="text-rose-500" /> Delete
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Title & Description */}
      <h4
        className={`font-semibold text-sm leading-snug text-zinc-900 ${
          status === "Done" ? "line-through text-zinc-400" : ""
        }`}
      >
        {task.title}
      </h4>
      <p className="text-zinc-500 text-[13px] line-clamp-2 mb-2.5 leading-relaxed font-normal">
        {task.description}
      </p>

      {/* Footer Meta Details */}
      <div className="flex items-center justify-between pt-2 border-t border-zinc-100 text-zinc-400 text-xs font-normal">
        {/* Due date */}
        <div className="flex items-center gap-1.5 text-xs text-zinc-500 font-mono">
          <Calendar size={12} className="text-zinc-400" />
          <span>{task.dueDate?.split("T")[0] || "—"}</span>
        </div>

        {/* Assignees Avatars Stack */}
        <div className="flex -space-x-1 ml-1">
          {assignees.map((user, idx) => (
            <div
              key={idx}
              title={user.username}
              className="w-5.5 h-5.5 rounded-full border-2 border-white bg-zinc-800 text-white flex items-center justify-center text-[9px] font-semibold shadow-2xs"
            >
              {user.username
                ?.split(" ")
                ?.map((n: string) => n[0])
                ?.join("")}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
