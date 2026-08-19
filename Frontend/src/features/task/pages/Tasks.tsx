import type { RootState } from "@/app/app.store";
import Sidebar from "@/components/Sidebar";
import type { task, UpdatedTask } from "@/types";
import {
  CheckCircle2,
  Clock,
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

const Tasks = () => {
  const dispatch = useDispatch()

  const allTask = useSelector((state: RootState) => state.task.allTask)
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

  console.log(userFilter, statusFilter, priorityFilter);
  
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
  })

  console.log(tasksAssignedByCurrentUser);

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

  const todoTasks = tasksAssignedToCurrentUser?.filter((t) => t.status === "Todo");
  const inProgressTasks = tasksAssignedToCurrentUser?.filter((t) => t.status === "In-progress");
  const doneTasks = tasksAssignedToCurrentUser?.filter((t) => t.status === "Done");

  const allWorkspaces = useSelector((state: RootState) => state.workspace.allWorkspaces)

  // Socket Connection
  useEffect(() => {
    if (!user) return;

    socket.connect();

    // Iterate through all workspace
    allWorkspaces?.forEach(workspace => {
      socket.emit('join_workspace', workspace._id);

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
    <div className="flex h-screen bg-[#F9FAFB] font-sans text-gray-900 overflow-hidden">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Task View */}
      <main className="flex-1 flex flex-col min-w-0">
        {/* Page Top Header */}
        <header className="px-4 sm:px-8 py-5 border-b border-gray-200 bg-white flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => dispatch(toggleSidebar())}
              className="p-2 hover:bg-gray-100 rounded-lg text-gray-500 hover:text-gray-800 transition-colors md:hidden cursor-pointer"
              aria-label="Toggle sidebar"
            >
              <Menu size={20} />
            </button>
            <div className="w-10 h-10 bg-[#D1F53B] rounded-xl flex items-center justify-center text-gray-900 font-bold shadow-xs shrink-0">
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

          <div className="flex items-center gap-3 self-stretch md:self-auto justify-end w-full md:w-auto">
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
            {user?.role !== "user" && <button onClick={() => setModalOpen(true)} className="flex items-center justify-center gap-2 px-4 py-2.5 bg-gray-900 text-white hover:bg-gray-800 rounded-xl font-semibold text-sm transition-all duration-200 shadow-sm cursor-pointer w-full md:w-auto">
              <Plus size={16} strokeWidth={2.5} /> Create Task
            </button>}
          </div>
        </header>

        {modalOpen && <AssignTaskModal setModalOpen={setModalOpen} />}

        {/* Toolbar: Search, Filters & View Options */}
        <div className="px-4 sm:px-8 py-3.5 border-b border-gray-200 bg-white flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3">
          {/* Search Box */}
          <div className="flex items-center gap-2.5 bg-gray-50 px-3.5 py-2 rounded-xl border border-gray-200 flex-1 max-w-md focus-within:bg-white focus-within:border-gray-400 transition-colors">
            <Search size={16} className="text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search tasks by title, category or assignee..."
              className="bg-transparent outline-none w-full text-xs text-gray-800 placeholder-gray-400"
            />
          </div>

          {/* Controls & Switcher */}
          <div className="flex items-center gap-2.5 justify-end">
            <div className="h-4 w-[1px] bg-gray-200 mx-0.5" />

            {/* View Switcher */}
            <div className="flex items-center rounded-xl border border-gray-200 bg-gray-100 p-1 shadow-inner shadow-gray-200/40">
              <button onClick={() => setAssignedTask(!assignedTask)} className="rounded-lg bg-white px-3.5 py-2 text-xs font-bold tracking-tight text-gray-800 shadow-sm whitespace-nowrap cursor-pointer">
                {assignedTask ? "Assign to you" : "Assigned by You"}
              </button>
            </div>
          </div>
        </div>

        {/* Board Content */}
        {!assignedTask ? (
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
                  To Do <span className="ml-1 bg-gray-200 px-1.5 py-0.5 rounded-full text-[10px] font-extrabold">{todoTasks.length}</span>
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

            <DragDropProvider
              onDragEnd={(e) => {
                if (e.canceled) return;

                const dropTargetId = e.operation.target?.id || "";
                const draggedTaskId = e.operation.source?.id as string

                submitUpdateTask(draggedTaskId, dropTargetId as 'Todo' | 'In-progress' | 'Done')
              }}
            >
              <div className="flex-1 overflow-auto p-4 sm:p-6 lg:p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-start">
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
          <section className="flex-1 overflow-auto bg-[#F9FAFB] p-4 sm:p-6 lg:p-8">
            <div className="mx-auto max-w-6xl">
              <div className="mb-6 flex flex-col gap-4 rounded-2xl border border-gray-200 bg-white p-5 shadow-[0_2px_8px_rgba(0,0,0,0.03)] sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#D1F53B] text-gray-900">
                    <UsersRound size={20} strokeWidth={2.3} />
                  </div>
                  <div>
                    <h2 className="text-base font-bold tracking-tight text-gray-900">Tasks assigned by you</h2>
                    <p className="mt-0.5 text-xs text-gray-500">Tasks you have delegated to your team.</p>
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-2.5">
                  {/* User Filter */}
                  <div className="relative flex items-center">
                    <User size={14} className="absolute left-3 text-gray-400 pointer-events-none" />
                    <select
                      name="users"
                      id="users"
                      value={userFilter}
                      onChange={(e) => setUserFilter(e.target.value)}
                      className="appearance-none bg-gray-50/80 hover:bg-gray-100/80 border border-gray-200/80 rounded-xl text-xs font-semibold text-gray-700 py-2 pl-8 pr-7 transition-all focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-300 cursor-pointer shadow-xs"
                    >
                      <option value="">All Users</option>
                      {users.map(user => (
                        <option key={user._id} value={user.username}>
                          {user.username.charAt(0).toUpperCase() + user.username.slice(1)}
                        </option>
                      ))}
                    </select>
                    <ChevronDown size={14} className="absolute right-2.5 text-gray-400 pointer-events-none" />
                  </div>

                  {/* Status Filter */}
                  <div className="relative flex items-center">
                    <SlidersHorizontal size={14} className="absolute left-3 text-gray-400 pointer-events-none" />
                    <select
                      name="status"
                      id="status"
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className="appearance-none bg-gray-50/80 hover:bg-gray-100/80 border border-gray-200/80 rounded-xl text-xs font-semibold text-gray-700 py-2 pl-8 pr-7 transition-all focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-300 cursor-pointer shadow-xs"
                    >
                      <option value="">All Statuses</option>
                      <option value="todo">Todo</option>
                      <option value="in-progress">In-progress</option>
                      <option value="done">Done</option>
                    </select>
                    <ChevronDown size={14} className="absolute right-2.5 text-gray-400 pointer-events-none" />
                  </div>

                  {/* Priority Filter */}
                  <div className="relative flex items-center">
                    <AlertCircle size={14} className="absolute left-3 text-gray-400 pointer-events-none" />
                    <select
                      name="priority"
                      id="priority"
                      value={priorityFilter}
                      onChange={(e) => setPriorityFilter(e.target.value)}
                      className="appearance-none bg-gray-50/80 hover:bg-gray-100/80 border border-gray-200/80 rounded-xl text-xs font-semibold text-gray-700 py-2 pl-8 pr-7 transition-all focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-300 cursor-pointer shadow-xs"
                    >
                      <option value="">All Priorities</option>
                      <option value="high">High</option>
                      <option value="medium">Medium</option>
                      <option value="low">Low</option>
                    </select>
                    <ChevronDown size={14} className="absolute right-2.5 text-gray-400 pointer-events-none" />
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
                      className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-red-600 bg-red-50 hover:bg-red-100 border border-red-100 rounded-xl transition-all cursor-pointer active:scale-95 shadow-xs"
                      title="Reset Filters"
                    >
                      <RotateCcw size={13} className="text-red-500" />
                      Reset
                    </button>
                  )}
                </div>
                <span className="w-fit rounded-full border border-gray-200 bg-gray-100 px-3 py-1 text-xs font-bold text-gray-700">
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
                <div className="flex min-h-72 flex-col items-center justify-center rounded-2xl border border-dashed border-gray-300 bg-white px-6 text-center">
                  <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-gray-100 text-gray-400">
                    <UsersRound size={20} />
                  </div>
                  <h3 className="text-sm font-bold text-gray-800">No assigned tasks yet</h3>
                  <p className="mt-1 max-w-sm text-xs leading-relaxed text-gray-500">Tasks you assign to teammates will appear here.</p>
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
