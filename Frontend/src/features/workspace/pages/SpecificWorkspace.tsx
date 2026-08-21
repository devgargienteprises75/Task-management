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
  Menu,
  Folder
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
    <div className="flex h-screen bg-[#FAFAFA] font-sans text-zinc-900 overflow-hidden">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Board Container */}
      <main className="flex-1 flex flex-col min-w-0">
        {/* Workspace Header */}
        <header className="px-4 sm:px-8 py-3.5 border-b border-zinc-200/80 bg-white flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
          <div className="flex flex-col gap-0.5">
            <div className="flex items-center gap-2.5">
              <button
                onClick={() => dispatch(toggleSidebar())}
                className="p-1.5 hover:bg-zinc-100 rounded-lg text-zinc-500 hover:text-zinc-800 transition-colors md:hidden cursor-pointer"
                aria-label="Toggle sidebar"
              >
                <Menu size={18} />
              </button>
              <Link to="/workspaces" className="p-1 hover:bg-zinc-100 rounded text-zinc-400 hover:text-zinc-700 transition-colors">
                <ArrowLeft size={16} />
              </Link>
              <div className="w-8 h-8 bg-zinc-900 rounded-lg flex items-center justify-center text-white font-medium shadow-2xs shrink-0">
                <Folder size={16} strokeWidth={2} />
              </div>
              <h2 className="text-base font-semibold tracking-tight text-zinc-900">{workspaceName}</h2>
            </div>
            <p className="text-xs text-zinc-400 ml-16 max-w-xl line-clamp-1">{workspaceDesc}</p>
          </div>

          <div className="flex items-center gap-2.5 self-stretch md:self-auto justify-end">
            <button className="p-1.5 hover:bg-zinc-100 rounded-lg text-zinc-500 hover:text-zinc-800 transition-colors border border-zinc-200">
              <Users size={15} />
            </button>
            <button className="p-1.5 hover:bg-zinc-100 rounded-lg text-zinc-500 hover:text-zinc-800 transition-colors border border-zinc-200">
              <Settings size={15} />
            </button>

            {/* Primary Action Button */}
            <button
              onClick={() => setModalOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-1.5 bg-black text-white hover:bg-zinc-800 rounded-lg font-medium text-sm transition-colors shadow-xs cursor-pointer active:scale-98"
            >
              <Plus size={15} strokeWidth={2.5} /> Create task
            </button>

            {modalOpen && <AssignTaskModal setModalOpen={setModalOpen} />}
          </div>
        </header>

        {/* Toolbar & Filters */}
        <div className="px-4 sm:px-8 py-2.5 border-b border-zinc-200/80 bg-white flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-2.5">
          {/* Left Controls: Search */}
          <div className="flex items-center gap-2 bg-zinc-50 px-3 py-1.5 rounded-lg border border-zinc-200 flex-1 max-w-sm">
            <Search size={14} className="text-zinc-400" />
            <input
              type="text"
              placeholder="Search tasks..."
              className="bg-transparent outline-none w-full text-xs text-zinc-900 placeholder-zinc-400"
              disabled
            />
          </div>

          {/* Right Controls: Filters & Views */}
          <div className="flex items-center gap-2 justify-end">
            <button className="flex items-center gap-1.5 px-2.5 py-1.5 border border-zinc-200 rounded-lg text-xs font-medium text-zinc-600 bg-white hover:bg-zinc-50 transition-colors">
              <Filter size={12} />
              <span>Filter</span>
            </button>

            <div className="h-4 w-[1px] bg-zinc-200 mx-0.5"></div>

            <div className="flex bg-zinc-100 p-0.5 rounded-lg border border-zinc-200">
              <button className="p-1 bg-white text-zinc-900 rounded shadow-xs">
                <Grid size={13} />
              </button>
              <button className="p-1 text-zinc-400 hover:text-zinc-600 rounded">
                <List size={13} />
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
            <div className="md:hidden px-4 pt-4 bg-[#FAFAFA]">
              <div className="flex p-0.5 bg-zinc-100 rounded-lg border border-zinc-200 gap-1">
                <button
                  onClick={() => setActiveTab('Todo')}
                  className={`flex-1 py-1.5 text-center text-xs font-medium rounded-md transition-all cursor-pointer ${
                    activeTab === 'Todo'
                      ? 'bg-white text-zinc-900 shadow-xs font-semibold'
                      : 'text-zinc-500 hover:text-zinc-800'
                  }`}
                >
                  To Do <span className="ml-1 bg-zinc-200 px-1 py-0.2 rounded text-[10px] text-zinc-600">{todoTask.length}</span>
                </button>
                <button
                  onClick={() => setActiveTab('In-progress')}
                  className={`flex-1 py-1.5 text-center text-xs font-medium rounded-md transition-all cursor-pointer ${
                    activeTab === 'In-progress'
                      ? 'bg-white text-zinc-900 shadow-xs font-semibold'
                      : 'text-zinc-500 hover:text-zinc-800'
                  }`}
                >
                  In Progress <span className="ml-1 bg-zinc-200 px-1 py-0.2 rounded text-[10px] text-zinc-600">{inProgressTasks.length}</span>
                </button>
                <button
                  onClick={() => setActiveTab('Done')}
                  className={`flex-1 py-1.5 text-center text-xs font-medium rounded-md transition-all cursor-pointer ${
                    activeTab === 'Done'
                      ? 'bg-white text-zinc-900 shadow-xs font-semibold'
                      : 'text-zinc-500 hover:text-zinc-800'
                  }`}
                >
                  Done <span className="ml-1 bg-zinc-200 px-1 py-0.2 rounded text-[10px] text-zinc-600">{doneTasks.length}</span>
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
              <div className="flex-1 overflow-auto p-4 sm:p-6 bg-[#FAFAFA]">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 items-start">
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
