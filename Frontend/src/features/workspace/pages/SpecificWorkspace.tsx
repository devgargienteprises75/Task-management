import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "@/app/app.store";
import useWorkspace from "../hooks/useWorkspace";
import useTask from "@/features/task/hooks/useTask";
import RenderColumn from "@/features/shared/components/RenderColumn";
import AssignTaskModal from "@/features/shared/components/AssignTaskModal";
import EditTaskModal from "@/features/shared/components/EditTaskModal";
import Sidebar from "@/components/Sidebar";
import Loader from "@/components/Loader";
import { DragDropProvider } from "@dnd-kit/react";
import type { task, UpdatedTask } from "@/types";
import { Folder, Plus, Search, Menu } from "lucide-react";
import { toggleSidebar } from "@/app/layout.slice";
import { socket } from "@/lib/socket";
import { setAddTask, setDeleteTask, setUpdateTask } from "@/features/task/task.slice";

const SpecificWorkspace = () => {
    const { workspaceId } = useParams<{ workspaceId: string }>();
    const { allWorkspaces } = useSelector((state: RootState) => state.workspace);
    const { allTask, isLoading } = useSelector((state: RootState) => state.task);
    const user = useSelector((state: RootState) => state.auth.user);
    const dispatch = useDispatch();

    const { handleGetWorkspaces } = useWorkspace();
    const { handleGetAllTask, handleUpdateTask } = useTask();

    const [modalOpen, setModalOpen] = useState(false);
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [selectedTask, setSelectedTask] = useState<task | null>(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [activeTab, setActiveTab] = useState<'Todo' | 'In-progress' | 'Done'>('Todo');

    useEffect(() => {
        if (!allWorkspaces.length) handleGetWorkspaces();
        if (!allTask.length) handleGetAllTask();
    }, []);

    const workspace = allWorkspaces.find((w) => w._id === workspaceId);

    const workspaceTasks = allTask
        .filter((t) => {
            const wsId = typeof t.workspaceId === "string" ? t.workspaceId : t.workspaceId?._id;
            return wsId === workspaceId;
        })
        .filter((t) => {
            if (!searchQuery) return true;
            return (
                t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                (t.description && t.description.toLowerCase().includes(searchQuery.toLowerCase()))
            );
        });

    const todoTasks = workspaceTasks.filter((t) => t.status === "Todo");
    const inProgressTasks = workspaceTasks.filter((t) => t.status === "In-progress");
    const doneTasks = workspaceTasks.filter((t) => t.status === "Done");

    const submitUpdateTask = async (id: string, status: "Todo" | "In-progress" | "Done") => {
        const taskDetails: UpdatedTask = {
            _id: id,
            status,
            workspaceId: workspaceId || "",
        };
        const res = await handleUpdateTask(taskDetails);
        if (res?.success) {
            setModalOpen(false);
            setSelectedTask(null);
        }
    };

    useEffect(() => {
        if (!workspaceId) return;
        socket.connect();
        socket.emit("join_workspace", workspaceId);

        const onCreated = (newTask: task) => dispatch(setAddTask(newTask));
        const onUpdated = (updatedTask: task) => dispatch(setUpdateTask(updatedTask));
        const onDeleted = (deletedTaskId: string) => dispatch(setDeleteTask(deletedTaskId));

        socket.on("task:created", onCreated);
        socket.on("task:updated", onUpdated);
        socket.on("task:deleted", onDeleted);

        return () => {
            socket.emit("leave_workspace", workspaceId);
            socket.off("task:created", onCreated);
            socket.off("task:updated", onUpdated);
            socket.off("task:deleted", onDeleted);
        };
    }, [workspaceId, dispatch]);

    return (
        <div className="flex h-screen bg-[#FAFAFA] dark:bg-zinc-900 font-sans text-zinc-900 dark:text-zinc-100 overflow-hidden transition-colors">
            <Sidebar />

            <main className="flex-1 flex flex-col min-w-0">
                {/* Standardized Navbar */}
                <header className="px-4 sm:px-8 py-3.5 border-b border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-900 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 transition-colors">
                    <div className="flex items-center gap-2.5">
                        <button
                            onClick={() => dispatch(toggleSidebar())}
                            className="p-1.5 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200 transition-colors md:hidden cursor-pointer"
                            aria-label="Toggle sidebar"
                        >
                            <Menu size={18} />
                        </button>
                        <div className="w-8 h-8 bg-zinc-900 dark:bg-zinc-100 rounded-lg flex items-center justify-center text-white dark:text-zinc-900 font-medium shadow-2xs shrink-0">
                            <Folder size={16} strokeWidth={2} />
                        </div>
                        <div className="flex items-center gap-2">
                            <h1 className="text-base font-semibold tracking-tight text-zinc-900 dark:text-white truncate max-w-[200px] sm:max-w-xs">
                                {workspace?.name || "Workspace"}
                            </h1>
                            <span className="bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 text-xs font-mono px-1.5 py-0.5 rounded border border-zinc-200 dark:border-zinc-700">
                                {workspaceTasks.length}
                            </span>
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center gap-2.5 w-full sm:w-auto">
                        <div className="flex items-center gap-2 bg-zinc-50 dark:bg-zinc-800/80 px-3 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-700/80 flex-1 sm:flex-initial focus-within:bg-white dark:focus-within:bg-zinc-800 focus-within:border-zinc-400 dark:focus-within:border-zinc-500 transition-colors">
                            <Search size={14} className="text-zinc-400 dark:text-zinc-500 shrink-0" />
                            <input
                                type="text"
                                placeholder="Search workspace tasks..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="bg-transparent outline-none w-full sm:w-44 text-sm text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-500"
                            />
                        </div>

                        {user?.role !== "user" && (
                            <button
                                onClick={() => setModalOpen(true)}
                                className="flex items-center justify-center gap-1.5 px-3.5 py-1.5 bg-black dark:bg-zinc-100 text-white dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-zinc-200 rounded-lg font-medium text-sm transition-colors shadow-xs cursor-pointer w-full sm:w-auto active:scale-98"
                            >
                                <Plus size={15} strokeWidth={2.5} /> Create task
                            </button>
                        )}
                    </div>
                </header>

                {/* Sub-toolbar */}
                <div className="px-4 sm:px-8 py-2.5 border-b border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-900 flex justify-between items-center gap-2.5 transition-colors">
                    <div className="flex items-center gap-4 text-xs text-zinc-500 dark:text-zinc-400">
                        <div className="flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-zinc-400" />
                            <span>To Do:</span>
                            <span className="font-semibold text-zinc-900 dark:text-zinc-100">{todoTasks.length}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-blue-500" />
                            <span>In Progress:</span>
                            <span className="font-semibold text-zinc-900 dark:text-zinc-100">{inProgressTasks.length}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-emerald-500" />
                            <span>Done:</span>
                            <span className="font-semibold text-zinc-900 dark:text-zinc-100">{doneTasks.length}</span>
                        </div>
                    </div>

                    <span className="text-xs text-zinc-400 dark:text-zinc-400 hidden sm:inline">
                        {workspace?.members?.length || 0} members in workspace
                    </span>
                </div>

                {modalOpen && <AssignTaskModal setModalOpen={setModalOpen} />}

                {isLoading && !allTask.length ? (
                    <div className="flex-1 flex items-center justify-center min-h-[400px]">
                        <Loader size="lg" text="Loading tasks..." />
                    </div>
                ) : (
                    <>
                        {/* Mobile Tab Switcher */}
                        <div className="md:hidden px-4 pt-4 bg-[#FAFAFA] dark:bg-zinc-900">
                            <div className="flex p-0.5 bg-zinc-100 dark:bg-zinc-800 rounded-lg border border-zinc-200 dark:border-zinc-700 gap-1">
                                <button
                                    onClick={() => setActiveTab("Todo")}
                                    className={`flex-1 py-1.5 text-center text-xs font-medium rounded-md transition-all cursor-pointer ${
                                        activeTab === "Todo"
                                            ? "bg-white dark:bg-zinc-700 text-zinc-900 dark:text-white shadow-xs font-semibold"
                                            : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200"
                                    }`}
                                >
                                    To Do <span className="ml-1 bg-zinc-200 dark:bg-zinc-600 px-1 py-0.2 rounded text-[10px] text-zinc-600 dark:text-zinc-200">{todoTasks.length}</span>
                                </button>
                                <button
                                    onClick={() => setActiveTab("In-progress")}
                                    className={`flex-1 py-1.5 text-center text-xs font-medium rounded-md transition-all cursor-pointer ${
                                        activeTab === "In-progress"
                                            ? "bg-white dark:bg-zinc-700 text-zinc-900 dark:text-white shadow-xs font-semibold"
                                            : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200"
                                    }`}
                                >
                                    In Progress <span className="ml-1 bg-zinc-200 dark:bg-zinc-600 px-1 py-0.2 rounded text-[10px] text-zinc-600 dark:text-zinc-200">{inProgressTasks.length}</span>
                                </button>
                                <button
                                    onClick={() => setActiveTab("Done")}
                                    className={`flex-1 py-1.5 text-center text-xs font-medium rounded-md transition-all cursor-pointer ${
                                        activeTab === "Done"
                                            ? "bg-white dark:bg-zinc-700 text-zinc-900 dark:text-white shadow-xs font-semibold"
                                            : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200"
                                    }`}
                                >
                                    Done <span className="ml-1 bg-zinc-200 dark:bg-zinc-600 px-1 py-0.2 rounded text-[10px] text-zinc-600 dark:text-zinc-200">{doneTasks.length}</span>
                                </button>
                            </div>
                        </div>

                        <DragDropProvider
                            onDragEnd={(e) => {
                                if (e.canceled) return;
                                const dropTargetId = e.operation.target?.id || "";
                                const draggedTaskId = e.operation.source?.id as string;
                                submitUpdateTask(draggedTaskId, dropTargetId as "Todo" | "In-progress" | "Done");
                            }}
                        >
                            <div className="flex-1 overflow-auto p-4 sm:p-6 bg-[#FAFAFA] dark:bg-zinc-900">
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 items-start">
                                    <div className={activeTab === "Todo" ? "block" : "hidden md:block"}>
                                        <RenderColumn title="To Do" count={todoTasks.length} allTask={todoTasks} statusType="Todo" id="Todo" />
                                    </div>
                                    <div className={activeTab === "In-progress" ? "block" : "hidden md:block"}>
                                        <RenderColumn title="In Progress" count={inProgressTasks.length} allTask={inProgressTasks} statusType="In-progress" id="In-progress" />
                                    </div>
                                    <div className={activeTab === "Done" ? "block" : "hidden md:block"}>
                                        <RenderColumn title="Done" count={doneTasks.length} allTask={doneTasks} statusType="Done" id="Done" />
                                    </div>
                                </div>
                            </div>
                        </DragDropProvider>
                    </>
                )}

                {editModalOpen && selectedTask && (
                    <EditTaskModal selectedTask={selectedTask} setEditModalOpen={setEditModalOpen} />
                )}
            </main>
        </div>
    );
};

export default SpecificWorkspace;
