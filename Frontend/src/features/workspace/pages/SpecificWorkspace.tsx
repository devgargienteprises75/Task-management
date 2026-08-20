import { useEffect, useState } from "react"
import type { RootState } from "@/app/app.store"
import Sidebar from "@/components/Sidebar"
import { useSelector, useDispatch } from "react-redux"
import { useParams, Link } from "react-router-dom"
import {
  Plus,
  Search,
  Filter,
  ArrowLeft,
  Users,
  Settings,
  Grid,
  List,
  Menu
} from "lucide-react"
import type { task, UpdatedTask } from "@/types"
import { toggleSidebar } from "@/app/layout.slice"
import { DragDropProvider } from "@dnd-kit/react"
import RenderColumn from "@/features/shared/components/RenderColumn"
import useTask from "@/features/task/hooks/useTask"
import { socket } from "@/lib/socket"
import { setDeleteTask, setAddTask, setUpdateTask } from "@/features/task/task.slice"
import AssignTaskModal from "@/features/shared/components/AssignTaskModal"

import Loader from "@/components/Loader"

const SpecificWorkspace = () => {
  const dispatch = useDispatch()
  const { workspaceId } = useParams()
  const { allWorkspaces, isLoading: isWorkspaceLoading } = useSelector((state: RootState) => state.workspace)
  const { allTask, isLoading: isTaskLoading } = useSelector((state: RootState) => state.task)
  const [activeTab, setActiveTab] = useState<'Todo' | 'In-progress' | 'Done'>('Todo')
  const [modalOpen, setModalOpen] = useState<boolean>(false)
  const { handleUpdateTask, handleGetAllTask } = useTask()

  // Find the current workspace name from the store
  const currentWorkspace = allWorkspaces.find((w) => w._id === workspaceId)
  const workspaceName = currentWorkspace ? currentWorkspace.name : "Team Workspace"
  const workspaceDesc = currentWorkspace?.description || "Collaborative space for managing daily tasks, sprints, and issues."
  const workspaceTask = allTask.filter(t => t.workspaceId === workspaceId)

  const todoTask = workspaceTask.filter(t => t.status === "Todo")
  const inProgressTasks = workspaceTask.filter(t => t.status === "In-progress")
  const doneTasks = workspaceTask.filter(t => t.status === "Done")

  const submitUpdateTask = async (id: string, status: 'Todo' | 'In-progress' | 'Done') => {
    const taskDetails: UpdatedTask = {
      _id: id,
      status,
      workspaceId,
    }
    await handleUpdateTask(taskDetails)
  }

  useEffect(() => {
    if (!allTask.length) {
      handleGetAllTask()
    }
  }, [])

  // Socket Connection
  useEffect(() => {
    if (!workspaceId) return;

    // Connect Socket
    socket.connect();

    // Join room for the workspace
    socket.emit('join_workspace', workspaceId);

    // Listen for new task creation
    socket.on('task:created', (newTask: task) => {
      dispatch(setAddTask(newTask));
    });

    // Listen for updated task
    socket.on('task:updated', (updatedTask: task) => {
      dispatch(setUpdateTask(updatedTask))
    });

    // Listen for deleted task
    socket.on('task:deleted', (deletedTaskId: string) => {
      dispatch(setDeleteTask(deletedTaskId))
    });

    return () => {
      socket.emit('leave_workspace', workspaceId)
      socket.off('task:created')
      socket.off('task:updated')
      socket.off('task:deleted')
      socket.disconnect();
    }

  }, [workspaceId, dispatch])

  return (
    <div className="flex h-screen bg-[#F9FAFB] font-sans text-gray-900 overflow-hidden">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Board Container */}
      <main className="flex-1 flex flex-col min-w-0">
        {/* Workspace Header */}
        <header className="px-4 sm:px-8 py-5 border-b border-gray-200 bg-white flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center gap-3">
              <button
                onClick={() => dispatch(toggleSidebar())}
                className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-500 hover:text-gray-800 transition-colors md:hidden cursor-pointer"
                aria-label="Toggle sidebar"
              >
                <Menu size={20} />
              </button>
              <Link to="/workspaces" className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-500 hover:text-gray-800 transition-colors">
                <ArrowLeft size={16} />
              </Link>
              <div className="w-7 h-7 bg-amber-400 rounded-lg flex items-center justify-center text-white font-extrabold text-sm shadow-sm">
                W
              </div>
              <h2 className="text-xl font-bold tracking-tight text-gray-900">{workspaceName}</h2>
            </div>
            <p className="text-xs text-gray-500 ml-10 sm:ml-14 max-w-xl line-clamp-1">{workspaceDesc}</p>
          </div>

          <div className="flex items-center gap-3 self-stretch md:self-auto justify-end">
            {/* Share / Settings buttons */}
            <button className="p-2 hover:bg-gray-100 rounded-lg text-gray-500 hover:text-gray-800 transition-colors border border-gray-200">
              <Users size={16} />
            </button>
            <button className="p-2 hover:bg-gray-100 rounded-lg text-gray-500 hover:text-gray-800 transition-colors border border-gray-200">
              <Settings size={16} />
            </button>

            {/* Primary Accent Button */}
            <button
              onClick={() => setModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white hover:bg-gray-800 rounded-xl font-semibold text-sm transition-all duration-200 shadow-sm cursor-pointer ml-2"
            >
              <Plus size={16} strokeWidth={2.5} /> Create Task
            </button>

            {modalOpen && <AssignTaskModal setModalOpen={setModalOpen} />}
          </div>
        </header>

        {/* Toolbar & Filters */}
        <div className="px-4 sm:px-8 py-4 border-b border-gray-150 bg-white flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3.5">
          {/* Left Controls: Search */}
          <div className="flex items-center gap-2.5 bg-gray-50 px-3.5 py-2 rounded-xl border border-gray-200 flex-1 max-w-md">
            <Search size={15} className="text-gray-400" />
            <input
              type="text"
              placeholder="Search tasks, descriptions..."
              className="bg-transparent outline-none w-full text-xs text-gray-700 placeholder-gray-400"
              disabled
            />
          </div>

          {/* Right Controls: Filters & Views */}
          <div className="flex items-center gap-2 justify-end">
            <button className="flex items-center gap-1.5 px-3 py-2 border border-gray-200 rounded-xl text-xs font-semibold text-gray-600 bg-white hover:bg-gray-50 transition-colors">
              <Filter size={13} />
              <span>Filter</span>
            </button>

            <div className="h-4 w-[1px] bg-gray-200 mx-1"></div>

            <div className="flex bg-gray-100 p-1 rounded-xl border border-gray-200">
              <button className="p-1.5 bg-white text-gray-800 rounded-lg shadow-sm">
                <Grid size={14} />
              </button>
              <button className="p-1.5 text-gray-400 hover:text-gray-600 rounded-lg">
                <List size={14} />
              </button>
            </div>
          </div>
        </div>

        {/* Board Content */}
        {(isTaskLoading && !workspaceTask.length) || isWorkspaceLoading ? (
          <div className="flex-1 flex items-center justify-center min-h-[400px]">
            <Loader size="lg" text="Loading workspace tasks..." />
          </div>
        ) : (
          <>
            {/* Mobile Tab Switcher */}
            <div className="md:hidden px-4 pt-4 bg-[#F9FAFB]">
              <div className="flex p-1 bg-gray-100 rounded-xl border border-gray-200/80 gap-1 shadow-inner shadow-gray-200/40">
                <button
                  onClick={() => setActiveTab('Todo')}
                  className={`flex-1 py-2 text-center text-xs font-bold rounded-lg transition-all duration-200 cursor-pointer ${activeTab === 'Todo'
                    ? 'bg-white text-gray-900 shadow-sm font-extrabold'
                    : 'text-gray-500 hover:text-gray-800'
                    }`}
                >
                  To Do <span className="ml-1 bg-gray-200 px-1.5 py-0.5 rounded-full text-[10px] font-extrabold">{todoTask.length}</span>
                </button>
                <button
                  onClick={() => setActiveTab('In-progress')}
                  className={`flex-1 py-2 text-center text-xs font-bold rounded-lg transition-all duration-200 cursor-pointer ${activeTab === 'In-progress'
                    ? 'bg-white text-gray-900 shadow-sm font-extrabold'
                    : 'text-gray-500 hover:text-gray-800'
                    }`}
                >
                  In Progress <span className="ml-1 bg-gray-200 px-1.5 py-0.5 rounded-full text-[10px] font-extrabold">{inProgressTasks.length}</span>
                </button>
                <button
                  onClick={() => setActiveTab('Done')}
                  className={`flex-1 py-2 text-center text-xs font-bold rounded-lg transition-all duration-200 cursor-pointer ${activeTab === 'Done'
                    ? 'bg-white text-gray-900 shadow-sm font-extrabold'
                    : 'text-gray-500 hover:text-gray-800'
                    }`}
                >
                  Done <span className="ml-1 bg-gray-200 px-1.5 py-0.5 rounded-full text-[10px] font-extrabold">{doneTasks.length}</span>
                </button>
              </div>
            </div>

            {/* Kanban Columns Board */}
            <DragDropProvider
              onDragEnd={(e) => {
                if (e.canceled) return
                const dropTargetId = e.operation.target?.id || ""
                const draggedTaskId = e.operation.source?.id as string
                submitUpdateTask(draggedTaskId, dropTargetId as 'Todo' | 'In-progress' | 'Done')
              }}
            >
              <div className="flex-1 overflow-auto p-4 sm:p-6 lg:p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-start">
                  <div className={activeTab === 'Todo' ? 'block' : 'hidden md:block'}>
                    <RenderColumn title="To Do" count={todoTask.length} allTask={todoTask} statusType="Todo" id="Todo" />
                  </div>
                  <div className={activeTab === 'In-progress' ? 'block' : 'hidden md:block'}>
                    <RenderColumn title="In Progress" count={inProgressTasks.length} allTask={inProgressTasks} statusType="In-progress" id="In-progress" />
                  </div>
                  <div className={activeTab === 'Done' ? 'block' : 'hidden md:block'}>
                    <RenderColumn title="Done" count={doneTasks.length} allTask={doneTasks} statusType="Done" id="Done" />
                  </div>
                </div>
              </div>
            </DragDropProvider>
          </>
        )}
      </main>
    </div>
  )
}

export default SpecificWorkspace
