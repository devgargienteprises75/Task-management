import { useState } from "react"
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
  FilterIcon,
  Menu
} from "lucide-react"
import  Loader from "@/components/Loader"
import type { task } from "@/types"
import { toggleSidebar } from "@/app/layout.slice"

const SpecificWorkspace = () => {
  const dispatch = useDispatch()
  const { workspaceId } = useParams()
  const { allWorkspaces } = useSelector((state: RootState) => state.workspace)
  const { allTask, isLoading } = useSelector((state: RootState) => state.task)
  const [activeTab, setActiveTab] = useState<'Todo' | 'In-progress' | 'Done'>('Todo')

  // Find the current workspace name from the store, fallback to workspaceId or default
  const currentWorkspace = allWorkspaces.find((w) => w._id === workspaceId)
  const workspaceName = currentWorkspace ? currentWorkspace.name : "Team Workspace"
  const workspaceDesc = currentWorkspace?.description || "Collaborative space for managing daily tasks, sprints, and issues."
  const workspaceTask = allTask.filter(t => t.workspaceId === workspaceId)

  // Priority color helper
  const getPriorityStyles = (priority: "High" | "Medium" | "Low") => {
    switch (priority) {
      case "High":
        return "bg-rose-50 text-rose-600 border border-rose-100"
      case "Medium":
        return "bg-amber-50 text-amber-600 border border-amber-100"
      case "Low":
        return "bg-emerald-50 text-emerald-600 border border-emerald-100"
      default:
        return "bg-gray-50 text-gray-600 border border-gray-100"
    }
  }

  // Category badge color helper
  // const getCategoryStyles = (category: string) => {
  //   switch (category) {
  //     case "Design":
  //       return "bg-purple-50 text-purple-600"
  //     case "Backend":
  //       return "bg-blue-50 text-blue-600"
  //     case "Frontend":
  //       return "bg-indigo-50 text-indigo-600"
  //     case "Database":
  //       return "bg-cyan-50 text-cyan-600"
  //     case "Research":
  //       return "bg-pink-50 text-pink-600"
  //     default:
  //       return "bg-gray-100 text-gray-700"
  //   }
  // }

  const todoTask = workspaceTask.filter(t => t.status === "Todo")
  const inProgressTasks = workspaceTask.filter(t => t.status === "In-progress")
  const doneTasks = workspaceTask.filter(t => t.status === "Done")

  const renderColumn = (title: string, count: number, workspaceTask: task[], columnType: "todo" | "inprogress" | "done") => {
    return (
      <div className="w-full flex flex-col bg-gray-50/50 p-4 rounded-2xl border border-gray-100 min-h-[300px] md:min-h-[600px]">
        {/* Column Header */}
        <div className="flex justify-between items-center mb-4 px-1">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-gray-800 text-sm">{title}</span>
            <span className="text-xs bg-gray-200/70 text-gray-600 px-2 py-0.5 rounded-full font-bold">
              {count}
            </span>
          </div>
          <button className="text-gray-400 hover:text-gray-600 transition-colors cursor-pointer">
            <FilterIcon size={16} />
          </button>
        </div>
            
        {/* Task Cards Container */}
        <div className="flex-1 flex flex-col gap-3.5 overflow-y-auto">
          {isLoading ? <Loader /> : workspaceTask?.map((task) => {
            return (
              <div 
                key={task._id}
                className={`bg-white p-4 rounded-xl border border-gray-100 shadow-[0_2px_8px_rgba(0,0,0,0.02)] hover:shadow-[0_8px_20px_rgba(0,0,0,0.06)] hover:translate-y-[-2px] transition-all duration-300 group cursor-pointer ${
                  columnType === "done" ? "opacity-85 hover:opacity-100" : ""
                }`}
              >
                {/* Badge Header */}
                <div className="flex justify-between items-start mb-3">
                  <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-md ${getPriorityStyles(task.priority)}`}>
                    {task.priority} Priority
                  </span>
                  {/* <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${getCategoryStyles(task.category)}`}>
                    {task.category}
                  </span> */}
                </div>

                {/* Title & Description */}
                <h4 className="font-bold text-[14px] text-gray-900 mb-1.5 leading-snug group-hover:text-gray-800 transition-colors">
                  {task.title}
                </h4>
                <p className="text-gray-500 text-xs line-clamp-2 mb-4 leading-relaxed">
                  {task.description}
                </p>

                {/* Card Footer: Due Date & Team Members */}
              </div>
            )
          })}

          {/* Inline Add Task Button */}
          <button className="flex items-center justify-center gap-2 py-3 rounded-xl border border-dashed border-gray-200 text-gray-400 hover:text-gray-800 hover:border-gray-400 hover:bg-gray-50/50 text-xs font-semibold transition-all duration-200 mt-1 cursor-pointer">
            <Plus size={14} /> Add new task
          </button>
        </div>
      </div>
    )
  }

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
            <button className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white hover:bg-gray-800 rounded-xl font-semibold text-sm transition-all duration-200 shadow-sm cursor-pointer ml-2">
              <Plus size={16} strokeWidth={2.5} /> Create Task
            </button>
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

        {/* Mobile Tab Switcher */}
        <div className="md:hidden px-4 pt-4 bg-[#F9FAFB]">
          <div className="flex p-1 bg-gray-100 rounded-xl border border-gray-200/80 gap-1 shadow-inner shadow-gray-200/40">
            <button
              onClick={() => setActiveTab('Todo')}
              className={`flex-1 py-2 text-center text-xs font-bold rounded-lg transition-all duration-200 cursor-pointer ${
                activeTab === 'Todo'
                  ? 'bg-white text-gray-900 shadow-sm font-extrabold'
                  : 'text-gray-500 hover:text-gray-800'
              }`}
            >
              To Do <span className="ml-1 bg-gray-200 px-1.5 py-0.5 rounded-full text-[10px] font-extrabold">{todoTask.length}</span>
            </button>
            <button
              onClick={() => setActiveTab('In-progress')}
              className={`flex-1 py-2 text-center text-xs font-bold rounded-lg transition-all duration-200 cursor-pointer ${
                activeTab === 'In-progress'
                  ? 'bg-white text-gray-900 shadow-sm font-extrabold'
                  : 'text-gray-500 hover:text-gray-800'
              }`}
            >
              In Progress <span className="ml-1 bg-gray-200 px-1.5 py-0.5 rounded-full text-[10px] font-extrabold">{inProgressTasks.length}</span>
            </button>
            <button
              onClick={() => setActiveTab('Done')}
              className={`flex-1 py-2 text-center text-xs font-bold rounded-lg transition-all duration-200 cursor-pointer ${
                activeTab === 'Done'
                  ? 'bg-white text-gray-900 shadow-sm font-extrabold'
                  : 'text-gray-500 hover:text-gray-800'
              }`}
            >
              Done <span className="ml-1 bg-gray-200 px-1.5 py-0.5 rounded-full text-[10px] font-extrabold">{doneTasks.length}</span>
            </button>
          </div>
        </div>

        {/* Kanban Columns Board */}
        <div className="flex-1 overflow-auto p-4 sm:p-6 lg:p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-start">
            <div className={activeTab === 'Todo' ? 'block' : 'hidden md:block'}>
              {renderColumn("To Do", todoTask.length, workspaceTask.filter(t => t.status === "Todo"), "todo")}
            </div>
            <div className={activeTab === 'In-progress' ? 'block' : 'hidden md:block'}>
              {renderColumn("In Progress", inProgressTasks.length, workspaceTask.filter(t => t.status === "In-progress"), "inprogress")}
            </div>
            <div className={activeTab === 'Done' ? 'block' : 'hidden md:block'}>
              {renderColumn("Done", doneTasks.length, workspaceTask.filter(t => t.status === "Done"), "done")}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default SpecificWorkspace
