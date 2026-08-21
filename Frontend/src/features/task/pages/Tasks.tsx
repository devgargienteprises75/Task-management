import type { RootState } from "@/app/app.store";
import Sidebar from "@/components/Sidebar";
import type { task, UpdatedTask } from "@/types";
import {
  FolderKanban,
  Plus,
  Search,
  UsersRound,
  Menu,
  RotateCcw,
  ChevronDown,
  User,
  SlidersHorizontal,
  AlertCircle,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import useTask from "../hooks/useTask";
import AssignTaskModal from "../../shared/components/AssignTaskModal";
import { DragDropProvider } from "@dnd-kit/react";
import RenderColumn from "../../shared/components/RenderColumn";
import TaskCard from "../../shared/components/TaskCard";
import EditTaskModal from "../../shared/components/EditTaskModal";
import { toggleSidebar } from "@/app/layout.slice";
import { socket } from "@/lib/socket";
import { setAddTask, setDeleteTask, setUpdateTask } from "../task.slice";

import Loader from "@/components/Loader";

const Tasks = () => {
  const dispatch = useDispatch()

  const allTask = useSelector((state: RootState) => state.task.allTask)
  const isTaskLoading = useSelector((state: RootState) => state.task.isLoading)
  const isAuthLoading = useSelector((state: RootState) => state.auth.isLoading)
  const user = useSelector((state: RootState) => state.auth.user)
  const users = useSelector((state: RootState) => state.admin.users)

  const [modalOpen, setModalOpen] = useState<boolean>(false)
  const [assignedTask, setAssignedTask] = useState<boolean>(false)
  const [editModalOpen, setEditModalOpen] = useState<boolean>(false)
  const [selectedTask, setSelectedTask] = useState<task | null>(null)
  const [activeTab, setActiveTab] = useState<'Todo' | 'In-progress' | 'Done'>('Todo')
  const [searchQuery, setSearchQuery] = useState<string>("")
  const [userFilter, setUserFilter] = useState<string>("")
  const [statusFilter, setStatusFilter] = useState<string>("")
  const [priorityFilter, setPriorityFilter] = useState<string>("")
  
  const { handleGetAllTask, handleUpdateTask } = useTask()

  useEffect(() => {
    if (!allTask.length) {
      handleGetAllTask()
    }
  }, [])

  const submitUpdateTask = async (id: string, status: 'Todo' | 'In-progress' | 'Done') => {
    const taskDetails: UpdatedTask = {
      _id: id,
      status,
    }

    const res = await handleUpdateTask(taskDetails);

    if (res.success) {
      setModalOpen(false)
    }
  }

  const tasksAssignedByCurrentUser = allTask.filter((task) => {
    const assignedById = typeof task.assignBy === "string" ? task.assignBy : task.assignBy?._id;
    return assignedById === user?._id;
  }).filter(task => {
    if(!searchQuery && !userFilter && !statusFilter && !priorityFilter) return true
    
    const lowerQuery = searchQuery.toLowerCase();
    const lowerUserFilter = userFilter.toLowerCase();
    const lowerStatusFilter = statusFilter.toLowerCase();
    const lowerPriorityFilter = priorityFilter.toLowerCase();
    
    // Search bar filter for Title or Assignee User
    const matchesSearch = !lowerQuery || task.title.toLowerCase().includes(lowerQuery) ||
    task.assignTo.some(assignee => {
      const targetUser = typeof assignee === "string" 
        ? users?.find(u => u._id === assignee) : assignee;

        return targetUser?.username?.toLowerCase().includes(lowerQuery)
    });

    // User Dropdown filter
    const matchUser = !lowerUserFilter || task.assignTo.some(assignee => {
      const targetUser = typeof assignee === "string"
       ? users?.find(u => u._id === assignee) : assignee;

       return targetUser?.username?.toLowerCase() === lowerUserFilter
    })

    // Status Dropdown filter
    const matchByStatus = !lowerStatusFilter || task.status.toLowerCase() === lowerStatusFilter;
    
    // Priority Dropdown filter
    const matchByPriority = !lowerPriorityFilter || task.priority.toLowerCase() === lowerPriorityFilter;
    
    return matchesSearch && matchUser && matchByStatus && matchByPriority;
  }).sort((a: any, b: any) => new Date(b.createdAt || b.createAt || 0).getTime() - new Date(a.createdAt || a.createAt || 0).getTime());

  const tasksAssignedToCurrentUser = allTask.filter(task => {
    return task.assignTo.some(userId => userId === user?._id)
  }).filter(task => {
    if (!searchQuery) return true;
    const lowerQuery = searchQuery.toLowerCase();

    const matchesTitle = task.title.toLowerCase().includes(lowerQuery)
    const matchesAssignee = typeof task.assignBy === "string" ?
      users.find(u => u._id === task.assignBy)?.username?.toLowerCase().includes(lowerQuery) : 
      task.assignBy?.username?.toLowerCase().includes(lowerQuery)

    return matchesTitle || matchesAssignee
  })

  const currentWorkspaceTask = assignedTask ? tasksAssignedByCurrentUser : tasksAssignedToCurrentUser;

  const todoTasks = currentWorkspaceTask.filter((t) => t.status === "Todo");
  const inProgressTasks = currentWorkspaceTask.filter((t) => t.status === "In-progress");
  const doneTasks = currentWorkspaceTask.filter((t) => t.status === "Done");

  const allWorkspaces = useSelector((state: RootState) => state.workspace.allWorkspaces)

  useEffect(() => {
    allWorkspaces?.forEach(workspace => {
      socket.emit('join_workspace', workspace._id)

      socket.on('task:created', (newTask: task) => {
        dispatch(setAddTask(newTask))
      })

      socket.on('task:updated', (updatedTask: task) => {
        dispatch(setUpdateTask(updatedTask))
      })

      socket.on('task:deleted', (deletedTaskId: string) => {
        dispatch(setDeleteTask(deletedTaskId))
      })
    })

    return () => {
      allWorkspaces?.forEach(workspace => {
        socket.emit('leave_workspace', workspace._id)
        socket.off('task:created');
        socket.off('task:updated');
        socket.off('task:deleted');
        socket.disconnect();
      })
    }
  }, [user, allWorkspaces, dispatch])

  return (
    <div className="flex h-screen bg-[#FAFAFA] font-sans text-zinc-900 overflow-hidden">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Task View */}
      <main className="flex-1 flex flex-col min-w-0">
        {/* Page Top Header */}
        <header className="px-4 sm:px-8 py-4 border-b border-zinc-200/80 bg-white flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
          <div className="flex items-center gap-3">
            <button
              onClick={() => dispatch(toggleSidebar())}
              className="p-1.5 hover:bg-zinc-100 rounded-lg text-zinc-500 hover:text-zinc-800 transition-colors md:hidden cursor-pointer"
              aria-label="Toggle sidebar"
            >
              <Menu size={18} />
            </button>
            <div className="w-8.5 h-8.5 bg-zinc-900 rounded-lg flex items-center justify-center text-white font-medium shadow-2xs shrink-0">
              <FolderKanban size={17} strokeWidth={2} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-bold tracking-tight text-zinc-900">Task Board</h1>
                <span className="bg-zinc-100 text-zinc-600 text-xs font-medium px-2 py-0.5 rounded-md border border-zinc-200">
                  {allTask.length}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 self-stretch md:self-auto justify-end w-full md:w-auto">
            {/* Quick Metrics */}
            <div className="hidden lg:flex items-center gap-4 mr-1 border-r border-zinc-200 pr-4 text-xs text-zinc-500">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-zinc-400" />
                <span>To Do:</span>
                <span className="font-semibold text-zinc-900 text-sm">{todoTasks.length}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-blue-500" />
                <span>In Progress:</span>
                <span className="font-semibold text-zinc-900 text-sm">{inProgressTasks.length}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span>Done:</span>
                <span className="font-semibold text-zinc-900 text-sm">{doneTasks.length}</span>
              </div>
            </div>

            {/* Primary Action Button (Vercel solid black button) */}
            {user?.role !== "user" && (
              <button 
                onClick={() => setModalOpen(true)} 
                className="flex items-center justify-center gap-1.5 px-4 py-2 bg-black text-white hover:bg-zinc-800 rounded-lg font-medium text-sm transition-colors shadow-xs cursor-pointer w-full md:w-auto active:scale-98"
              >
                <Plus size={15} strokeWidth={2.5} /> Create task
              </button>
            )}
          </div>
        </header>

        {modalOpen && <AssignTaskModal setModalOpen={setModalOpen} />}

        {/* Toolbar: Search, Filters & View Options */}
        <div className="px-4 sm:px-8 py-3 border-b border-zinc-200/80 bg-white flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3">
          {/* Search Box */}
          <div className="flex items-center gap-2.5 bg-zinc-50 px-3.5 py-2 rounded-lg border border-zinc-200 flex-1 max-w-sm focus-within:bg-white focus-within:border-zinc-400 transition-colors">
            <Search size={15} className="text-zinc-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search tasks..."
              className="bg-transparent outline-none w-full text-sm text-zinc-900 placeholder-zinc-400"
            />
          </div>

          {/* Controls & Switcher */}
          <div className="flex items-center gap-2 justify-end">
            {/* View Switcher */}
            <div className="flex items-center rounded-lg border border-zinc-200 bg-zinc-100 p-0.5">
              <button 
                onClick={() => setAssignedTask(false)} 
                className={`rounded-md px-3 py-1.5 text-xs font-medium transition-all cursor-pointer ${
                  !assignedTask 
                    ? "bg-white text-zinc-900 shadow-xs font-semibold" 
                    : "text-zinc-500 hover:text-zinc-800"
                }`}
              >
                Assigned to you
              </button>
              <button 
                onClick={() => setAssignedTask(true)} 
                className={`rounded-md px-3 py-1.5 text-xs font-medium transition-all cursor-pointer ${
                  assignedTask 
                    ? "bg-white text-zinc-900 shadow-xs font-semibold" 
                    : "text-zinc-500 hover:text-zinc-800"
                }`}
              >
                Assigned by you
              </button>
            </div>
          </div>
        </div>

        {/* Board Content */}
        {(isTaskLoading && !allTask.length) || isAuthLoading ? (
          <div className="flex-1 flex items-center justify-center min-h-[400px]">
            <Loader size="lg" text="Loading tasks..." />
          </div>
        ) : !assignedTask ? (
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
                  To Do <span className="ml-1 bg-zinc-200 px-1 py-0.2 rounded text-[10px] text-zinc-600">{todoTasks.length}</span>
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

            <DragDropProvider
              onDragEnd={(e) => {
                if (e.canceled) return;

                const dropTargetId = e.operation.target?.id || "";
                const draggedTaskId = e.operation.source?.id as string

                submitUpdateTask(draggedTaskId, dropTargetId as 'Todo' | 'In-progress' | 'Done')
              }}
            >
              <div className="flex-1 overflow-auto p-4 sm:p-6 bg-[#FAFAFA]">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 items-start">
                  <div className={activeTab === 'Todo' ? 'block' : 'hidden md:block'}>
                    <RenderColumn title="To Do" count={todoTasks.length} allTask={todoTasks} statusType="Todo" id="Todo" />
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
        ) : (
          <section className="flex-1 overflow-auto bg-[#FAFAFA] p-4 sm:p-6">
            <div className="mx-auto max-w-6xl">
              <div className="mb-5 flex flex-col gap-3 rounded-xl border border-zinc-200 bg-white p-4 shadow-[0_1px_3px_rgba(0,0,0,0.03)] sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-100 text-zinc-700">
                    <UsersRound size={16} strokeWidth={2} />
                  </div>
                  <div>
                    <h2 className="text-sm font-semibold tracking-tight text-zinc-900">Tasks assigned by you</h2>
                    <p className="text-[11px] text-zinc-500">Tasks you have delegated to team members.</p>
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  {/* User Filter */}
                  <div className="relative flex items-center">
                    <User size={12} className="absolute left-2.5 text-zinc-400 pointer-events-none" />
                    <select
                      name="users"
                      id="users"
                      value={userFilter}
                      onChange={(e) => setUserFilter(e.target.value)}
                      className="appearance-none bg-zinc-50 hover:bg-zinc-100 border border-zinc-200 rounded-lg text-xs font-medium text-zinc-700 py-1.5 pl-7 pr-6 transition-all focus:outline-none focus:border-zinc-400 cursor-pointer"
                    >
                      <option value="">All Users</option>
                      {users.map(user => (
                        <option key={user._id} value={user.username}>
                          {user.username.charAt(0).toUpperCase() + user.username.slice(1)}
                        </option>
                      ))}
                    </select>
                    <ChevronDown size={12} className="absolute right-2 text-zinc-400 pointer-events-none" />
                  </div>

                  {/* Status Filter */}
                  <div className="relative flex items-center">
                    <SlidersHorizontal size={12} className="absolute left-2.5 text-zinc-400 pointer-events-none" />
                    <select
                      name="status"
                      id="status"
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className="appearance-none bg-zinc-50 hover:bg-zinc-100 border border-zinc-200 rounded-lg text-xs font-medium text-zinc-700 py-1.5 pl-7 pr-6 transition-all focus:outline-none focus:border-zinc-400 cursor-pointer"
                    >
                      <option value="">All Statuses</option>
                      <option value="todo">Todo</option>
                      <option value="in-progress">In-progress</option>
                      <option value="done">Done</option>
                    </select>
                    <ChevronDown size={12} className="absolute right-2 text-zinc-400 pointer-events-none" />
                  </div>

                  {/* Priority Filter */}
                  <div className="relative flex items-center">
                    <AlertCircle size={12} className="absolute left-2.5 text-zinc-400 pointer-events-none" />
                    <select
                      name="priority"
                      id="priority"
                      value={priorityFilter}
                      onChange={(e) => setPriorityFilter(e.target.value)}
                      className="appearance-none bg-zinc-50 hover:bg-zinc-100 border border-zinc-200 rounded-lg text-xs font-medium text-zinc-700 py-1.5 pl-7 pr-6 transition-all focus:outline-none focus:border-zinc-400 cursor-pointer"
                    >
                      <option value="">All Priorities</option>
                      <option value="high">High</option>
                      <option value="medium">Medium</option>
                      <option value="low">Low</option>
                    </select>
                    <ChevronDown size={12} className="absolute right-2 text-zinc-400 pointer-events-none" />
                  </div>

                  {/* Reset Button */}
                  {(userFilter || statusFilter || priorityFilter) && (
                    <button
                      type="button"
                      onClick={() => {
                        setUserFilter("");
                        setStatusFilter("");
                        setPriorityFilter("");
                      }}
                      className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-rose-600 bg-rose-50 hover:bg-rose-100 border border-rose-100 rounded-lg transition-all cursor-pointer"
                      title="Reset Filters"
                    >
                      <RotateCcw size={11} className="text-rose-500" />
                      Reset
                    </button>
                  )}
                </div>
                <span className="w-fit rounded border border-zinc-200 bg-zinc-50 px-2 py-0.5 text-xs font-medium text-zinc-600">
                  {tasksAssignedByCurrentUser.length} {tasksAssignedByCurrentUser.length === 1 ? "task" : "tasks"}
                </span>
              </div>

              {tasksAssignedByCurrentUser.length > 0 ? (
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                  {tasksAssignedByCurrentUser.map((task) => (
                    <TaskCard
                      key={task._id}
                      task={task}
                      taskUsers={users}
                      statusType={task.status}
                      assignedTask={assignedTask}
                      setEditModalOpen={setEditModalOpen}
                      setSelectedTask={setSelectedTask}
                    />
                  ))}
                </div>
              ) : (
                <div className="flex min-h-60 flex-col items-center justify-center rounded-xl border border-dashed border-zinc-300 bg-white px-6 text-center">
                  <div className="mb-2 flex h-9 w-9 items-center justify-center rounded-lg bg-zinc-100 text-zinc-400">
                    <UsersRound size={18} />
                  </div>
                  <h3 className="text-xs font-semibold text-zinc-800">No assigned tasks</h3>
                  <p className="mt-0.5 max-w-sm text-xs leading-relaxed text-zinc-400">Tasks you assign to teammates will appear here.</p>
                </div>
              )}
            </div>
          </section>
        )}

        {editModalOpen && selectedTask && <EditTaskModal selectedTask={selectedTask} setEditModalOpen={setEditModalOpen} />}
      </main>
    </div>
  );
};

export default Tasks;
