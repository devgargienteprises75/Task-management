import type { task, UpdatedTask, user, workspace } from "@/types";
import { useDraggable } from "@dnd-kit/react";
import { Calendar, Check, MoreVertical, Pencil, Trash2, } from "lucide-react";
import useTask from "../hooks/useTask";
import { useState, useEffect, useRef, type Dispatch, type SetStateAction } from "react";

interface TaskCardProps {
  task: task;
  taskUsers: user[];
  statusType: "Todo" | "In-progress" | "Done";
  assignedTask?: boolean;
  setEditModalOpen?: Dispatch<SetStateAction<boolean>>;
  setSelectedTask?: Dispatch<SetStateAction<task | null>>;
}

const getPriorityStyles = (priority: "High" | "Medium" | "Low") => {
  switch (priority) {
    case "High":
      return "bg-rose-50 text-rose-600 border border-rose-100";
    case "Medium":
      return "bg-amber-50 text-amber-600 border border-amber-100";
    case "Low":
      return "bg-emerald-50 text-emerald-600 border border-emerald-100";
    default:
      return "bg-gray-50 text-gray-600 border border-gray-100";
  }
};

const getStatusStyles = (priority: "Todo" | "In-progress" | "Done") => {
  switch (priority) {
    case "Todo":
      return "bg-blue-100 text-blue-600 border border-blue-100";
    case "In-progress":
      return "bg-amber-100 text-amber-600 border border-amber-100";
    case "Done":
      return "bg-emerald-100 text-emerald-600 border border-emerald-100";
    default:
      return "bg-gray-50 text-gray-600 border border-gray-100";
  }
};

const TaskCard = ({ task, taskUsers, statusType, assignedTask = false, setEditModalOpen, setSelectedTask }: TaskCardProps) => {

  const [status, setStatus] = useState<'Todo' | 'In-progress' | "Done">(task.status)
  const [dropdownOpen, setDropdownOpen] = useState<boolean>(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false)
      }
    }
    if (dropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside)
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [dropdownOpen])

  const assignees = taskUsers.filter((u) =>
    (task.assignTo as string[]).includes(u._id)
  );

  const {ref} = useDraggable({
    id: task._id ?? `task-${task.title}`,
  })

  const { handleUpdateTask, handleDeleteTask } = useTask()

  const updateStatus = async (taskId: any, nextStatus: UpdatedTask["status"]) => {
    if (!nextStatus || nextStatus === status) return;

    const taskDetails: UpdatedTask = {
      _id: taskId,
      status: nextStatus,
      workspaceId: task?.workspaceId
    }

    setStatus(nextStatus);
    await handleUpdateTask(taskDetails);
  };

  const handleDeleteClick = async (workspaceId: string | workspace, taskId: string) => {
    const workspaceID = typeof workspaceId === 'object' ? workspaceId._id : workspaceId;
    await handleDeleteTask(workspaceID, taskId);
  }

  return (
    <div
      ref={ref}
      className={`relative bg-white p-4 rounded-xl border border-gray-200/80 shadow-[0_2px_8px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_20px_rgba(0,0,0,0.08)] hover:-translate-y-0.5 transition-all duration-200 group cursor-pointer ${
        statusType === "Done" ? "bg-gray-50/40" : ""
      }`}
    >
      {/* Tags & Priority */}
      <div className="flex justify-between items-center mb-2.5">
        <div className="flex gap-2">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span
              className={`text-[11px] font-bold px-2 py-0.5 rounded-md ${getPriorityStyles(
                task.priority
              )}`}
            >
              {task.priority}
            </span>
          </div>

          {assignedTask && <div className="flex items-center gap-1.5 flex-wrap">
            <span
              className={`text-[11px] font-bold px-2 py-0.5 rounded-md ${getStatusStyles(
                task.status
              )}`}
            >
              {task.status}
            </span>
          </div>}
        </div>
        {assignedTask && (
          <div ref={dropdownRef} className="relative">
            <button
              onClick={() => {
                setSelectedTask?.(task)
                setDropdownOpen(!dropdownOpen)
              }}
              className="p-1 hover:bg-gray-200/60 rounded-md text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
            >
                <MoreVertical size={16}/>
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 mt-1 w-32 bg-white rounded-xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.1)] border border-gray-100 overflow-hidden z-20 py-1">
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    setDropdownOpen(false)
                    setEditModalOpen?.(true)
                  }}
                  className="w-full text-left px-3 py-2 text-[13px] font-medium text-gray-700 hover:bg-gray-50 flex items-center gap-2 cursor-pointer transition-colors"
                >
                  <Pencil size={14} className="text-gray-400" /> Edit
                </button>
                <div className="h-px bg-gray-100 w-full" />
                <button
                  onClick={(e) => {
                    e.stopPropagation(); 
                    void handleDeleteClick(task.workspaceId, task._id!)
                  }}
                  className="w-full text-left px-3 py-2 text-[13px] font-medium text-red-600 hover:bg-red-50 flex items-center gap-2 cursor-pointer transition-colors"
                >
                  <Trash2 size={14} className="text-red-500" /> Delete
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Title & Description */}
      <h4
        className={`font-bold text-[14px] leading-snug mb-1.5 text-gray-900 group-hover:text-gray-700 ${
          statusType === "Done" ? "line-through text-gray-500" : ""
        }`}
      >
        {task.title}
      </h4>
      <p className="text-gray-500 text-xs line-clamp-2 mb-4 leading-relaxed font-normal">
        {task.description}
      </p>

      {/* Task actions */}
      {!assignedTask && status !== "Done" && (
        <div className="flex items-center gap-2 mb-3.5 pt-3 border-t border-gray-100">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              void updateStatus(task._id, status === "Todo" ? "In-progress" : "Todo");
            }}
            className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-[11px] font-bold transition-all duration-200 cursor-pointer ${
              status === "Todo"
                ? "bg-blue-600 text-white shadow-sm hover:bg-blue-700 hover:shadow-md"
                : "bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100"
            }`}
          >
            {status === "Todo" ? "Start work" : "Put on hold"}
          </button>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              void updateStatus(task._id, "Done");
            }}
            className="flex items-center justify-center gap-1.5 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-[11px] font-bold text-emerald-700 transition-all duration-200 hover:bg-emerald-100 hover:border-emerald-300 cursor-pointer"
            aria-label="Mark task as done"
          >
            <Check size={14} strokeWidth={3} />
            Done
          </button>
        </div>
      )}

      {/* Footer Meta Details */}
      <div className="flex items-center justify-between pt-3 border-t border-gray-100 text-gray-400 text-xs font-medium">
        {/* Due date */}
        <div className="flex items-center gap-1 text-[11px]">
          <Calendar size={13} className="text-gray-400" />
          <span>{task.dueDate?.split("T")[0] || "—"}</span>
        </div>

        {/* Assignees Avatars Stack */}
        <div className="flex -space-x-1.5 ml-1">
          {assignees.map((user, idx) => (
            <div
              key={idx}
              title={user.username}
              className="w-6 h-6 rounded-full border-2 border-white bg-blue-500 text-white flex items-center justify-center text-[9px] font-bold shadow-xs"
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
