import type { task, user } from "@/types";
import { useDraggable } from "@dnd-kit/react";
import { Calendar } from "lucide-react";

interface TaskCardProps {
  task: task;
  taskUsers: user[];
  statusType: "Todo" | "In-progress" | "Done";
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

const TaskCard = ({ task, taskUsers, statusType }: TaskCardProps) => {
  const assignees = taskUsers.filter((u) =>
    (task.assignTo as string[]).includes(u._id)
  );

  const {ref} = useDraggable({
    id: task._id,
  })

  return (
    <div
      ref={ref}
      className={`bg-white p-4 rounded-xl border border-gray-200/80 shadow-[0_2px_8px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_20px_rgba(0,0,0,0.08)] hover:-translate-y-0.5 transition-all duration-200 group cursor-pointer ${
        statusType === "Done" ? "bg-gray-50/40" : ""
      }`}
    >
      {/* Tags & Priority */}
      <div className="flex justify-between items-center mb-2.5">
        <div className="flex items-center gap-1.5 flex-wrap">
          <span
            className={`text-[11px] font-bold px-2 py-0.5 rounded-md ${getPriorityStyles(
              task.priority
            )}`}
          >
            {task.priority}
          </span>
        </div>
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

      {/* Footer Meta Details */}
      <div className="flex items-center justify-between pt-3 border-t border-gray-100 text-gray-400 text-xs font-medium">
        {/* Due date */}
        <div className="flex items-center gap-1 text-[11px]">
          <Calendar size={13} className="text-gray-400" />
          <span>{task.dueDate || "—"}</span>
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
