import type { RootState } from "@/app/app.store";
import Sidebar from "@/components/Sidebar";
import type { task, UpdatedTask } from "@/types";
import {
  CheckCircle2,
  Clock,
  Filter,
  FolderKanban,
  Grid,
  List,
  MoreVertical,
  Plus,
  Search,
  SlidersHorizontal,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import useTask from "../hooks/useTask";
import AssignTaskModal from "../components/AssignTaskModal";
import { DragDropProvider, useDroppable } from "@dnd-kit/react";
import RenderColumn from "../components/RenderColumn";

const Tasks = () => {

  const allTask = useSelector((state: RootState) => state.task.allTask)

  const [selectedView, setSelectedView] = useState<"board" | "list">("board");
  const [modalOpen, setModalOpen] = useState<boolean>(false)
  

  const { handleGetAllTask, handleUpdateTask } = useTask()

  useEffect(() => {
    if(!allTask.length){
      handleGetAllTask()
    }
  }, [])

  

  const submitUpdateTask = async (id: string, status: 'Todo' | 'In-progress' | 'Done') => {
    const taskDetails: UpdatedTask = {
      _id: id,
      status
    }

    const currentTask = allTask.find(t => t._id === id)

    const res = await handleUpdateTask(currentTask?.workspaceId, taskDetails);

    if(res.success){
      setModalOpen(false)
    }
  }

  const todoTasks = allTask?.filter((t) => t.status === "Todo");
  const inProgressTasks = allTask?.filter((t) => t.status === "In-progress");
  const doneTasks = allTask?.filter((t) => t.status === "Done");

  return (
    <div className="flex h-screen bg-[#F9FAFB] font-sans text-gray-900 overflow-hidden">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Task View */}
      <main className="flex-1 flex flex-col min-w-0">
        {/* Page Top Header */}
        <header className="px-8 py-5 border-b border-gray-200 bg-white flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#D1F53B] rounded-xl flex items-center justify-center text-gray-900 font-bold shadow-xs">
              <FolderKanban size={22} strokeWidth={2.2} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold tracking-tight text-gray-900">Task Board</h1>
                <span className="bg-gray-100 text-gray-600 text-xs font-semibold px-2.5 py-0.5 rounded-full border border-gray-200">
                  {allTask.length} Total
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-0.5">
                Manage, organize, and track task progress across all active pipelines.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Quick Metrics */}
            <div className="hidden lg:flex items-center gap-4 mr-2 border-r border-gray-200 pr-6">
              <div className="flex items-center gap-2 text-xs">
                <Clock size={15} className="text-gray-500" />
                <span className="text-gray-500">To Do:</span>
                <span className="font-bold text-gray-900">{todoTasks.length}</span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <Clock size={15} className="text-amber-500" />
                <span className="text-gray-500">In Progress:</span>
                <span className="font-bold text-gray-900">{inProgressTasks.length}</span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <CheckCircle2 size={15} className="text-emerald-500" />
                <span className="text-gray-500">Completed:</span>
                <span className="font-bold text-gray-900">{doneTasks.length}</span>
              </div>
            </div>

            {/* Primary Action Button */}
            <button onClick={() => setModalOpen(true)} className="flex items-center gap-2 px-4 py-2.5 bg-gray-900 text-white hover:bg-gray-800 rounded-xl font-semibold text-sm transition-all duration-200 shadow-sm cursor-pointer">
              <Plus size={16} strokeWidth={2.5} /> Create Task
            </button>
          </div>
        </header>

        {modalOpen && <AssignTaskModal modalOpen={modalOpen} setModalOpen={setModalOpen} />}

        {/* Toolbar: Search, Filters & View Options */}
        <div className="px-8 py-3.5 border-b border-gray-200 bg-white flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3">
          {/* Search Box */}
          <div className="flex items-center gap-2.5 bg-gray-50 px-3.5 py-2 rounded-xl border border-gray-200 flex-1 max-w-md focus-within:bg-white focus-within:border-gray-400 transition-colors">
            <Search size={16} className="text-gray-400" />
            <input
              type="text"
              placeholder="Search tasks by title, category or assignee..."
              className="bg-transparent outline-none w-full text-xs text-gray-800 placeholder-gray-400"
            />
          </div>

          {/* Controls & Switcher */}
          <div className="flex items-center gap-2.5 justify-end">
            <button className="flex items-center gap-1.5 px-3 py-2 border border-gray-200 rounded-xl text-xs font-semibold text-gray-700 bg-white hover:bg-gray-50 transition-colors cursor-pointer">
              <Filter size={14} />
              <span>Filter</span>
            </button>

            <button className="flex items-center gap-1.5 px-3 py-2 border border-gray-200 rounded-xl text-xs font-semibold text-gray-700 bg-white hover:bg-gray-50 transition-colors cursor-pointer">
              <SlidersHorizontal size={14} />
              <span>Sort</span>
            </button>

            <div className="h-4 w-[1px] bg-gray-200 mx-0.5" />

            {/* View Switcher */}
            <div className="flex bg-gray-100 p-1 rounded-xl border border-gray-200">
              <button
                onClick={() => setSelectedView("board")}
                className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                  selectedView === "board"
                    ? "bg-white text-gray-900 shadow-xs font-bold"
                    : "text-gray-400 hover:text-gray-700"
                }`}
                title="Board View"
              >
                <Grid size={15} />
              </button>
              <button
                onClick={() => setSelectedView("list")}
                className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                  selectedView === "list"
                    ? "bg-white text-gray-900 shadow-xs font-bold"
                    : "text-gray-400 hover:text-gray-700"
                }`}
                title="List View"
              >
                <List size={15} />
              </button>
            </div>
          </div>
        </div>

        {/* Board Content */}
        <DragDropProvider
          onDragEnd={(e) => {
            if(e.canceled) return;

            const dropTargetId = e.operation.target?.id || "";
            const draggedTaskId = e.operation.source?.id as string

            submitUpdateTask(draggedTaskId, dropTargetId as 'Todo' | 'In-progress' | 'Done')
          }}
        >
          <div className="flex-1 overflow-auto p-6 lg:p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-start">
              <RenderColumn title="To Do" count={todoTasks.length} allTask={todoTasks} statusType="Todo" id="Todo" />
              <RenderColumn title="In Progress" count={inProgressTasks.length} allTask={inProgressTasks} statusType="In-progress" id="In-progress" />
              <RenderColumn title="Done" count={doneTasks.length} allTask={doneTasks} statusType="Done" id="Done" />
            </div>
          </div>
        </DragDropProvider>
      </main>
    </div>
  );
};

export default Tasks;
