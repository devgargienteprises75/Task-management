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
import useWorkspace from "@/features/workspace/hooks/useWorkspace";
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
  const allWorkspaces = useSelector((state: RootState) => state.workspace.allWorkspaces)

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
  const { handleGetWorkspaces } = useWorkspace()

  useEffect(() => {
    if (!allTask.length) {
      handleGetAllTask()
    }
    if (!allWorkspaces.length) {
      handleGetWorkspaces()
    }
  }, [])

  const submitUpdateTask = async (id: string, status: 'Todo' | 'In-progress' | 'Done') => {
    const targetTask = allTask.find(t => t._id === id);
    const taskDetails: UpdatedTask = {
      _id: id,
      status,
      workspaceId: targetTask?.workspaceId,
    }

    const res = await handleUpdateTask(taskDetails);

    if (res.success) {
      setModalOpen(false)
      setSelectedTask(null)
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

  useEffect(() => {
    socket.connect();

    allWorkspaces?.forEach(workspace => {
      socket.emit('join_workspace', workspace._id)
    })

    const onCreated = (newTask: task) => dispatch(setAddTask(newTask))
    const onUpdated = (updatedTask: task) => dispatch(setUpdateTask(updatedTask))
    const onDeleted = (deletedTaskId: string) => dispatch(setDeleteTask(deletedTaskId))

    socket.on('task:created', onCreated)
    socket.on('task:updated', onUpdated)
    socket.on('task:deleted', onDeleted)

    return () => {
      allWorkspaces?.forEach(workspace => {
        socket.emit('leave_workspace', workspace._id)
      })
      socket.off('task:created', onCreated);
      socket.off('task:updated', onUpdated);
      socket.off('task:deleted', onDeleted);
    }
  }, [user, allWorkspaces, dispatch])

  return (
    <div className="flex h-screen bg-[#FAFAFA] dark:bg-zinc-900 font-sans text-zinc-900 dark:text-zinc-100 overflow-hidden transition-colors">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Task View */}
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
              <FolderKanban size={16} strokeWidth={2} />
            </div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-semibold tracking-tight text-zinc-900 dark:text-white">Task Board</h1>
              <span className="bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 text-xs font-mono px-1.5 py-0.5 rounded border border-zinc-200 dark:border-zinc-700">
                {allTask.length}
              </span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center gap-2.5 w-full sm:w-auto">
            {/* Search Box in Navbar */}
            <div className="flex items-center gap-2 bg-zinc-50 dark:bg-zinc-800/80 px-3 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-700/80 flex-1 sm:flex-initial focus-within:bg-white dark:focus-within:bg-zinc-800 focus-within:border-zinc-400 dark:focus-within:border-zinc-500 transition-colors">
              <Search size={14} className="text-zinc-400 dark:text-zinc-500 shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search tasks..."
                className="bg-transparent outline-none w-full sm:w-44 text-sm text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-500"
              />
            </div>

            {/* Primary Action Button */}
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

        {modalOpen && <AssignTaskModal setModalOpen={setModalOpen} />}

        {/* Sub-toolbar: Metrics & View Switcher */}
        <div className="px-4 sm:px-8 py-2.5 border-b border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-900 flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-2.5 transition-colors">
          {/* Quick Metrics */}
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

          {/* View Switcher */}
          <div className="flex items-center gap-2 justify-end">
            <div className="flex items-center rounded-lg border border-zinc-200 dark:border-zinc-700/80 bg-zinc-100 dark:bg-zinc-800/80 p-0.5">
              <button 
                onClick={() => setAssignedTask(false)} 
                className={`rounded-md px-3 py-1 text-xs font-medium transition-all cursor-pointer ${
                  !assignedTask 
                    ? "bg-white dark:bg-zinc-700 text-zinc-900 dark:text-white shadow-xs font-semibold" 
                    : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200"
                }`}
              >
                Assigned to you
              </button>
              <button 
                onClick={() => setAssignedTask(true)} 
                className={`rounded-md px-3 py-1 text-xs font-medium transition-all cursor-pointer ${
                  assignedTask 
                    ? "bg-white dark:bg-zinc-700 text-zinc-900 dark:text-white shadow-xs font-semibold" 
                    : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200"
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
            <div className="md:hidden px-4 pt-4 bg-[#FAFAFA] dark:bg-zinc-900">
              <div className="flex p-0.5 bg-zinc-100 dark:bg-zinc-800 rounded-lg border border-zinc-200 dark:border-zinc-700 gap-1">
                <button
                  onClick={() => setActiveTab('Todo')}
                  className={`flex-1 py-1.5 text-center text-xs font-medium rounded-md transition-all cursor-pointer ${
                    activeTab === 'Todo'
                      ? 'bg-white dark:bg-zinc-700 text-zinc-900 dark:text-white shadow-xs font-semibold'
                      : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200'
                  }`}
                >
                  To Do <span className="ml-1 bg-zinc-200 dark:bg-zinc-600 px-1 py-0.2 rounded text-[10px] text-zinc-600 dark:text-zinc-200">{todoTasks.length}</span>
                </button>
                <button
                  onClick={() => setActiveTab('In-progress')}
                  className={`flex-1 py-1.5 text-center text-xs font-medium rounded-md transition-all cursor-pointer ${
                    activeTab === 'In-progress'
                      ? 'bg-white dark:bg-zinc-700 text-zinc-900 dark:text-white shadow-xs font-semibold'
                      : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200'
                  }`}
                >
                  In Progress <span className="ml-1 bg-zinc-200 dark:bg-zinc-600 px-1 py-0.2 rounded text-[10px] text-zinc-600 dark:text-zinc-200">{inProgressTasks.length}</span>
                </button>
                <button
                  onClick={() => setActiveTab('Done')}
                  className={`flex-1 py-1.5 text-center text-xs font-medium rounded-md transition-all cursor-pointer ${
                    activeTab === 'Done'
                      ? 'bg-white dark:bg-zinc-700 text-zinc-900 dark:text-white shadow-xs font-semibold'
                      : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200'
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
                const draggedTaskId = e.operation.source?.id as string

                submitUpdateTask(draggedTaskId, dropTargetId as 'Todo' | 'In-progress' | 'Done')
              }}
            >
              <div className="flex-1 overflow-auto p-4 sm:p-6 bg-[#FAFAFA] dark:bg-zinc-900">
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
          <section className="flex-1 overflow-auto bg-[#FAFAFA] dark:bg-zinc-900 p-4 sm:p-6">
            <div className="mx-auto max-w-6xl">
              <div className="mb-5 flex flex-col gap-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-800 p-4 shadow-[0_1px_3px_rgba(0,0,0,0.03)] sm:flex-row sm:items-center sm:justify-between transition-colors">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-100 dark:bg-zinc-700/60 text-zinc-700 dark:text-zinc-200">
                    <UsersRound size={16} strokeWidth={2} />
                  </div>
                  <div>
                    <h2 className="text-sm font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">Tasks assigned by you</h2>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400">Tasks you have delegated to team members.</p>
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  {/* User Filter */}
                  <div className="relative flex items-center">
                    <User size={12} className="absolute left-2.5 text-zinc-400 dark:text-zinc-500 pointer-events-none" />
                    <select
                      name="users"
                      id="users"
                      value={userFilter}
                      onChange={(e) => setUserFilter(e.target.value)}
                      className="appearance-none bg-zinc-50 dark:bg-zinc-900 hover:bg-zinc-100 dark:hover:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg text-xs font-medium text-zinc-700 dark:text-zinc-300 py-1.5 pl-7 pr-6 transition-all focus:outline-none focus:border-zinc-400 dark:focus:border-zinc-500 cursor-pointer"
                    >
                      <option value="">All Users</option>
                      {users.map(user => (
                        <option key={user._id} value={user.username}>
                          {user.username.charAt(0).toUpperCase() + user.username.slice(1)}
                        </option>
                      ))}
                    </select>
                    <ChevronDown size={12} className="absolute right-2 text-zinc-400 dark:text-zinc-500 pointer-events-none" />
                  </div>

                  {/* Status Filter */}
                  <div className="relative flex items-center">
                    <SlidersHorizontal size={12} className="absolute left-2.5 text-zinc-400 dark:text-zinc-500 pointer-events-none" />
                    <select
                      name="status"
                      id="status"
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className="appearance-none bg-zinc-50 dark:bg-zinc-900 hover:bg-zinc-100 dark:hover:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg text-xs font-medium text-zinc-700 dark:text-zinc-300 py-1.5 pl-7 pr-6 transition-all focus:outline-none focus:border-zinc-400 dark:focus:border-zinc-500 cursor-pointer"
                    >
                      <option value="">All Statuses</option>
                      <option value="todo">Todo</option>
                      <option value="in-progress">In-progress</option>
                      <option value="done">Done</option>
                    </select>
                    <ChevronDown size={12} className="absolute right-2 text-zinc-400 dark:text-zinc-500 pointer-events-none" />
                  </div>

                  {/* Priority Filter */}
                  <div className="relative flex items-center">
                    <AlertCircle size={12} className="absolute left-2.5 text-zinc-400 dark:text-zinc-500 pointer-events-none" />
                    <select
                      name="priority"
                      id="priority"
                      value={priorityFilter}
                      onChange={(e) => setPriorityFilter(e.target.value)}
                      className="appearance-none bg-zinc-50 dark:bg-zinc-900 hover:bg-zinc-100 dark:hover:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg text-xs font-medium text-zinc-700 dark:text-zinc-300 py-1.5 pl-7 pr-6 transition-all focus:outline-none focus:border-zinc-400 dark:focus:border-zinc-500 cursor-pointer"
                    >
                      <option value="">All Priorities</option>
                      <option value="high">High</option>
                      <option value="medium">Medium</option>
                      <option value="low">Low</option>
                    </select>
                    <ChevronDown size={12} className="absolute right-2 text-zinc-400 dark:text-zinc-500 pointer-events-none" />
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
                      className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 dark:hover:bg-rose-950/60 border border-rose-100 dark:border-rose-900/50 rounded-lg transition-all cursor-pointer"
                      title="Reset Filters"
                    >
                      <RotateCcw size={11} className="text-rose-500 dark:text-rose-400" />
                      Reset
                    </button>
                  )}
                </div>
                <span className="w-fit rounded border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900 px-2 py-0.5 text-xs font-medium text-zinc-600 dark:text-zinc-400">
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
                <div className="flex min-h-[280px] flex-col items-center justify-center rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-800 p-8 text-center shadow-[0_1px_3px_rgba(0,0,0,0.03)] transition-colors">
                  <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-700 text-zinc-600 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-600">
                    <UsersRound size={18} strokeWidth={2} />
                  </div>
                  <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">No assigned tasks</h3>
                  <p className="mt-1 max-w-sm text-xs leading-relaxed text-zinc-500 dark:text-zinc-400">Tasks you assign to teammates will appear here.</p>
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
