import type { task } from "@/types";
import { useDroppable } from "@dnd-kit/react";
import { MoreVertical, Plus } from "lucide-react";
import TaskCard from "./TaskCard";
import { useSelector } from "react-redux";
import type { RootState } from "@/app/app.store";

interface RenderColumnProps {
    id: string,
    title: string,
    count: number,
    allTask: task[],
    statusType: "Todo" | "In-progress" | "Done"
}

const RenderColumn = ({ id, title, count, allTask, statusType }: RenderColumnProps) => {
    const columnTheme = {
        Todo: {
            dot: "bg-slate-400",
            badge: "bg-slate-100 text-slate-700",
            accent: "border-t-2 border-t-slate-400",
        },
        "In-progress": {
            dot: "bg-amber-500",
            badge: "bg-amber-100 text-amber-800",
            accent: "border-t-2 border-t-amber-500",
        },
        Done: {
            dot: "bg-emerald-500",
            badge: "bg-emerald-100 text-emerald-800",
            accent: "border-t-2 border-t-emerald-500",
        },
    }[statusType];

    const { ref } = useDroppable({
        id,
    })
    const users = useSelector((state: RootState) => state.admin.users)
    
    return (
        <div
            ref={ref}
            className={`flex flex-col bg-gray-50/70 rounded-2xl border border-gray-200/80 p-4 min-h-[640px] ${columnTheme.accent}`}>
            {/* Column Header */}
            <div className="flex justify-between items-center mb-4 px-1 pb-2 border-b border-gray-200/60">
                <div className="flex items-center gap-2.5">
                    <span className={`w-2.5 h-2.5 rounded-full ${columnTheme.dot}`} />
                    <h3 className="font-bold text-gray-800 text-sm tracking-tight">{title}</h3>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-extrabold ${columnTheme.badge}`}>
                        {count}
                    </span>
                </div>
                <div className="flex items-center gap-1">
                    <button className="p-1 hover:bg-gray-200/60 rounded-md text-gray-400 hover:text-gray-600 transition-colors cursor-pointer">
                        <MoreVertical size={16} />
                    </button>
                </div>
            </div>

            {/* Task Cards Stack */}
            <div className="flex-1 flex flex-col gap-3.5 overflow-y-auto pr-0.5">
                {allTask?.map((task) => (
                    <TaskCard
                        key={task._id}
                        task={task}
                        taskUsers={users}
                        statusType={statusType}
                    />
                ))}

                {/* Add Task Button */}
                <button className="flex items-center justify-center gap-2 py-3 rounded-xl border border-dashed border-gray-300 text-gray-500 hover:text-gray-900 hover:border-gray-400 hover:bg-white text-xs font-bold transition-all duration-200 mt-1 cursor-pointer shadow-2xs">
                    <Plus size={15} strokeWidth={2.5} /> Add task
                </button>
            </div>
        </div>
    );
};

export default RenderColumn