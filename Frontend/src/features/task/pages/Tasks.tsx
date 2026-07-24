import Sidebar from "@/components/Sidebar";
import {
  Calendar,
  CheckSquare,
  Filter,
  Grid,
  List,
  MoreVertical,
  Plus,
  Search,
  MessageSquare,
  Paperclip,
  CheckCircle2,
  Clock,
  Sparkles,
  SlidersHorizontal,
  FolderKanban,
  Tag
} from "lucide-react";
import { useState } from "react";

interface DummyTask {
  id: string;
  title: string;
  description: string;
  priority: "High" | "Medium" | "Low";
  category: string;
  status: "Todo" | "In-progress" | "Done";
  dueDate: string;
  assignees: { name: string; bg: string }[];
  commentsCount: number;
  attachmentsCount: number;
  subtasks: { completed: number; total: number };
}

const dummyTasks: DummyTask[] = [
  {
    id: "TASK-101",
    title: "Design System Tokens & Dark Mode Palette",
    description: "Establish foundational color variables, typography scales, and dark mode theme specifications.",
    priority: "High",
    category: "Design",
    status: "Todo",
    dueDate: "Jul 28, 2026",
    assignees: [
      { name: "Alex Riv", bg: "bg-purple-500" },
      { name: "Sarah Chen", bg: "bg-blue-500" },
    ],
    commentsCount: 4,
    attachmentsCount: 2,
    subtasks: { completed: 2, total: 6 },
  },
  {
    id: "TASK-102",
    title: "Setup OAuth 2.0 & Google Authentication",
    description: "Integrate passport Google Strategy and refresh token rotation logic on the backend auth middleware.",
    priority: "High",
    category: "Backend",
    status: "Todo",
    dueDate: "Jul 30, 2026",
    assignees: [{ name: "Marcus Vance", bg: "bg-emerald-500" }],
    commentsCount: 7,
    attachmentsCount: 1,
    subtasks: { completed: 0, total: 4 },
  },
  {
    id: "TASK-103",
    title: "Landing Page Micro-animations",
    description: "Add Framer Motion scroll triggers and interactive hover transitions for feature showcase cards.",
    priority: "Medium",
    category: "Frontend",
    status: "Todo",
    dueDate: "Aug 02, 2026",
    assignees: [{ name: "Elena Rostova", bg: "bg-pink-500" }],
    commentsCount: 2,
    attachmentsCount: 0,
    subtasks: { completed: 1, total: 3 },
  },
  {
    id: "TASK-104",
    title: "Kanban Drag-and-Drop State Integration",
    description: "Implement smooth HTML5 drag events with optimistic store updates for column status updates.",
    priority: "High",
    category: "Frontend",
    status: "In-progress",
    dueDate: "Jul 26, 2026",
    assignees: [
      { name: "Sarah Chen", bg: "bg-blue-500" },
      { name: "Alex Riv", bg: "bg-purple-500" },
    ],
    commentsCount: 12,
    attachmentsCount: 5,
    subtasks: { completed: 3, total: 5 },
  },
  {
    id: "TASK-105",
    title: "API Endpoint Rate Limiting & Caching",
    description: "Configure Redis caching layer for workspace queries and rate limiting middleware for public APIs.",
    priority: "Medium",
    category: "Backend",
    status: "In-progress",
    dueDate: "Jul 29, 2026",
    assignees: [{ name: "Marcus Vance", bg: "bg-emerald-500" }],
    commentsCount: 3,
    attachmentsCount: 1,
    subtasks: { completed: 4, total: 4 },
  },
  {
    id: "TASK-106",
    title: "User Profile Settings Modal",
    description: "Build user profile edit form with avatar file upload preview and password updates.",
    priority: "Low",
    category: "Frontend",
    status: "In-progress",
    dueDate: "Aug 05, 2026",
    assignees: [{ name: "Elena Rostova", bg: "bg-pink-500" }],
    commentsCount: 1,
    attachmentsCount: 0,
    subtasks: { completed: 1, total: 2 },
  },
  {
    id: "TASK-107",
    title: "Database Index Optimization for Task Queries",
    description: "Create compound indexes on (workspaceId, status, priority) to boost query performance.",
    priority: "Medium",
    category: "Database",
    status: "Done",
    dueDate: "Jul 22, 2026",
    assignees: [{ name: "Marcus Vance", bg: "bg-emerald-500" }],
    commentsCount: 8,
    attachmentsCount: 3,
    subtasks: { completed: 3, total: 3 },
  },
  {
    id: "TASK-108",
    title: "UI Component Library Audit & Testing",
    description: "Validate accessibility contrast ratios and responsive flex layouts across tablet and mobile viewports.",
    priority: "Low",
    category: "QA",
    status: "Done",
    dueDate: "Jul 21, 2026",
    assignees: [
      { name: "Sarah Chen", bg: "bg-blue-500" },
      { name: "Elena Rostova", bg: "bg-pink-500" },
    ],
    commentsCount: 5,
    attachmentsCount: 2,
    subtasks: { completed: 5, total: 5 },
  },
];

const Tasks = () => {
  const [selectedView, setSelectedView] = useState<"board" | "list">("board");

  const getPriorityStyles = (priority: "High" | "Medium" | "Low") => {
    switch (priority) {
      case "High":
        return "bg-rose-50 text-rose-600 border border-rose-100";
      case "Medium":
        return "bg-amber-50 text-amber-600 border border-amber-100";
      case "Low":
        return "bg-emerald-50 text-emerald-600 border border-emerald-100";
      default:
        return "bg-gray-50 text-gray-600 border border-gray-100";
    }
  };

  const getCategoryStyles = (category: string) => {
    switch (category) {
      case "Design":
        return "bg-purple-50 text-purple-600 border border-purple-100";
      case "Backend":
        return "bg-blue-50 text-blue-600 border border-blue-100";
      case "Frontend":
        return "bg-indigo-50 text-indigo-600 border border-indigo-100";
      case "Database":
        return "bg-cyan-50 text-cyan-600 border border-cyan-100";
      case "QA":
        return "bg-teal-50 text-teal-600 border border-teal-100";
      default:
        return "bg-gray-100 text-gray-700 border border-gray-200";
    }
  };

  const todoTasks = dummyTasks.filter((t) => t.status === "Todo");
  const inProgressTasks = dummyTasks.filter((t) => t.status === "In-progress");
  const doneTasks = dummyTasks.filter((t) => t.status === "Done");

  const renderColumn = (
    title: string,
    count: number,
    tasks: DummyTask[],
    statusType: "Todo" | "In-progress" | "Done"
  ) => {
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

    return (
      <div className={`flex flex-col bg-gray-50/70 rounded-2xl border border-gray-200/80 p-4 min-h-[640px] ${columnTheme.accent}`}>
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
          {tasks.map((task) => (
            <div
              key={task.id}
              className={`bg-white p-4 rounded-xl border border-gray-200/80 shadow-[0_2px_8px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_20px_rgba(0,0,0,0.08)] hover:-translate-y-0.5 transition-all duration-200 group cursor-pointer ${
                statusType === "Done" ? "bg-gray-50/40" : ""
              }`}
            >
              {/* Tags & Priority */}
              <div className="flex justify-between items-center mb-2.5">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className={`text-[11px] font-bold px-2 py-0.5 rounded-md ${getPriorityStyles(task.priority)}`}>
                    {task.priority}
                  </span>
                  <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-md ${getCategoryStyles(task.category)}`}>
                    {task.category}
                  </span>
                </div>
              </div>

              {/* Title & Description */}
              <h4 className={`font-bold text-[14px] leading-snug mb-1.5 text-gray-900 group-hover:text-gray-700 ${
                statusType === "Done" ? "line-through text-gray-500" : ""
              }`}>
                {task.title}
              </h4>
              <p className="text-gray-500 text-xs line-clamp-2 mb-4 leading-relaxed font-normal">
                {task.description}
              </p>

              {/* Footer Meta Details */}
              <div className="flex items-center justify-between pt-3 border-t border-gray-100 text-gray-400 text-xs font-medium">
                {/* Due date */}
                <div className="flex items-center gap-1 text-[11px]">
                  <Calendar size={13} className="text-gray-400" />
                  <span>{task.dueDate}</span>
                </div>

                {/* Right Meta: Comments, Attachments & Assignees */}
                <div className="flex items-center gap-3">
                  {/* {task.attachmentsCount > 0 && (
                    <div className="flex items-center gap-0.5 text-[11px]">
                      <Paperclip size={12} />
                      <span>{task.attachmentsCount}</span>
                    </div>
                  )} */}
                  {task.commentsCount > 0 && (
                    <div className="flex items-center gap-0.5 text-[11px]">
                      <MessageSquare size={12} />
                      <span>{task.commentsCount}</span>
                    </div>
                  )}

                  {/* Assignees Avatars Stack */}
                  <div className="flex -space-x-1.5 ml-1">
                    {task.assignees.map((user, idx) => (
                      <div
                        key={idx}
                        title={user.name}
                        className={`w-6 h-6 rounded-full border-2 border-white ${user.bg} text-white flex items-center justify-center text-[9px] font-bold shadow-xs`}
                      >
                        {user.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* Add Task Button */}
          <button className="flex items-center justify-center gap-2 py-3 rounded-xl border border-dashed border-gray-300 text-gray-500 hover:text-gray-900 hover:border-gray-400 hover:bg-white text-xs font-bold transition-all duration-200 mt-1 cursor-pointer shadow-2xs">
            <Plus size={15} strokeWidth={2.5} /> Add task
          </button>
        </div>
      </div>
    );
  };

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
                  {dummyTasks.length} Total
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
            <button className="flex items-center gap-2 px-4 py-2.5 bg-gray-900 text-white hover:bg-gray-800 rounded-xl font-semibold text-sm transition-all duration-200 shadow-sm cursor-pointer">
              <Plus size={16} strokeWidth={2.5} /> Create Task
            </button>
          </div>
        </header>

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
        <div className="flex-1 overflow-auto p-6 lg:p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-start">
            {renderColumn("To Do", todoTasks.length, todoTasks, "Todo")}
            {renderColumn("In Progress", inProgressTasks.length, inProgressTasks, "In-progress")}
            {renderColumn("Done", doneTasks.length, doneTasks, "Done")}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Tasks;
