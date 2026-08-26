import { useDroppable } from "@dnd-kit/react";
import TaskCard from "./TaskCard";
import { useSelector } from "react-redux";
import type { RootState } from "@/app/app.store";
import type { task } from "@/types";

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
            dot: "bg-zinc-400 dark:bg-zinc-400",
            badge: "bg-zinc-200/70 dark:bg-zinc-700 text-zinc-600 dark:text-zinc-200",
        },
        "In-progress": {
            dot: "bg-blue-500",
            badge: "bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300",
        },
        Done: {
            dot: "bg-emerald-500",
            badge: "bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300",
        },
    }[statusType];

    const { ref } = useDroppable({
        id,
    })
    const users = useSelector((state: RootState) => state.admin.users)

    const sortedTask = [...allTask].sort((a: any, b: any) => new Date(b.createdAt || b.createAt || 0).getTime() - new Date(a.createdAt || a.createAt || 0).getTime())

    return (
        <div
            ref={ref}
            className="flex flex-col bg-[#F4F4F5]/70 dark:bg-zinc-800/60 rounded-xl border border-zinc-200/70 dark:border-zinc-700/70 p-3 max-h-[300px] md:min-h-[640px] transition-colors">
            {/* Column Header */}
            <div className="flex justify-between items-center mb-3 px-1">
                <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${columnTheme.dot}`} />
                    <h3 className="font-semibold text-zinc-900 dark:text-zinc-100 text-sm tracking-tight">{title}</h3>
                    <span className={`text-xs px-2 py-0.5 rounded-md font-medium ${columnTheme.badge}`}>
                        {count}
                    </span>
                </div>
            </div>

            {/* Task Cards Stack */}
            <div className="flex-1 flex flex-col gap-2.5 overflow-y-auto pr-0.5">
                {sortedTask?.map((task) => (
                    <TaskCard
                        key={task._id}
                        task={task}
                        taskUsers={users}
                        statusType={statusType}
                    />
                ))}
            </div>
        </div>
    );
};

export default RenderColumn