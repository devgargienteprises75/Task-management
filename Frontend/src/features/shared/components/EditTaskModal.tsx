import type { RootState } from "@/app/app.store";
import { cn } from "@/lib/cn";
import type { task, UpdatedTask, user } from "@/types";
import { AlignLeft, Calendar, CheckCircle2, ChevronDown, Flag, Loader2, Pencil, Users, X } from "lucide-react";
import { useState, type Dispatch, type SetStateAction } from "react";
import { useSelector } from "react-redux";
import useTask from "../../task/hooks/useTask";

interface EditTaskModalProps {
  selectedTask: task;
  setEditModalOpen: Dispatch<SetStateAction<boolean>>;
}

const PRIORITY_OPTIONS = ["High", "Medium", "Low"] as const;

const priorityStyles = {
  High: "border-rose-200 bg-rose-50 text-rose-700",
  Medium: "border-amber-200 bg-amber-50 text-amber-700",
  Low: "border-gray-200 bg-gray-50 text-gray-700",
};

const userId = (value: string | user) => (typeof value === "string" ? value : value._id);

const EditTaskModal = ({ selectedTask, setEditModalOpen }: EditTaskModalProps) => {
  const users = useSelector((state: RootState) => state.admin.users);
  const { handleUpdateTask } = useTask();

  const [newTitle, setNewTitle] = useState(selectedTask.title);
  const [newDescription, setNewDescription] = useState(selectedTask.description);
  const [assignTo, setAssignTo] = useState<string[]>(selectedTask?.assignTo?.map(userId));
  const [priority, setPriority] = useState<task["priority"]>(selectedTask.priority);
  const [dueDate, setDueDate] = useState(selectedTask.dueDate?.split("T")[0] ?? "");
  const [assigneeMenuOpen, setAssigneeMenuOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const selectedAssignees = users.filter((user) => assignTo.includes(user._id));

  const toggleAssignee = (id: string) => {
    setAssignTo((current) => current.includes(id) ? current.filter((userId) => userId !== id) : [...current, id]);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsSaving(true);

    const workspaceId = typeof selectedTask.workspaceId === "string"
      ? selectedTask.workspaceId
      : selectedTask.workspaceId._id;
    const taskDetails: UpdatedTask = { _id: selectedTask._id, newTitle, newDescription, assignTo, priority, dueDate, workspaceId };
    const result = await handleUpdateTask(taskDetails);

    setIsSaving(false);
    if (result?.success) setEditModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/40 px-4 backdrop-blur-sm">
      <div className="flex max-h-[90vh] w-full max-w-lg flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-2xl">
        <div className="flex shrink-0 items-center justify-between border-b border-gray-100 bg-gray-50/60 px-6 py-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#D1F53B] text-gray-900">
              <Pencil size={15} strokeWidth={2.5} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">Edit task</h2>
              <p className="text-xs text-gray-500">Update the task details and assignees.</p>
            </div>
          </div>
          <button type="button" onClick={() => setEditModalOpen(false)} className="rounded-lg p-1 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-900" aria-label="Close edit task modal">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 space-y-5 overflow-y-auto p-6">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">Task title <span className="text-red-400">*</span></label>
            <input value={newTitle} onChange={(event) => setNewTitle(event.target.value)} required className="block w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-[15px] text-gray-900 transition-all placeholder:text-gray-400 focus:border-gray-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-gray-900" />
          </div>

          <div>
            <label className="mb-1.5 flex items-center gap-1.5 text-sm font-medium text-gray-700"><AlignLeft size={14} className="text-gray-400" />Description</label>
            <textarea value={newDescription} onChange={(event) => setNewDescription(event.target.value)} rows={3} className="block w-full resize-none rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-[15px] leading-6 text-gray-900 transition-all placeholder:text-gray-400 focus:border-gray-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-gray-900" />
          </div>

          <div>
            <label className="mb-1.5 flex items-center gap-1.5 text-sm font-medium text-gray-700"><Users size={14} className="text-gray-400" />Assign to</label>
            <div className="relative">
              <button type="button" onClick={() => setAssigneeMenuOpen((open) => !open)} className={cn("flex min-h-[50px] w-full flex-wrap items-center gap-2 rounded-xl border bg-gray-50 px-4 py-2.5 pr-10 text-left text-[15px] transition-all", assigneeMenuOpen ? "border-gray-900 bg-white ring-1 ring-gray-900" : "border-gray-200 hover:border-gray-300")}>
                {selectedAssignees.length ? selectedAssignees.map((assignee) => <span key={assignee._id} className="inline-flex items-center gap-1.5 rounded-full border border-gray-200 bg-white px-2.5 py-1 text-xs font-semibold text-gray-700"><span className="flex h-4 w-4 items-center justify-center rounded-full bg-[#D1F53B] text-[9px] font-bold text-gray-900">{assignee.username.charAt(0).toUpperCase()}</span>{assignee.username}</span>) : <span className="text-gray-400">Select assignees...</span>}
                <ChevronDown size={16} className={cn("absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 transition-transform", assigneeMenuOpen && "rotate-180")} />
              </button>
              {assigneeMenuOpen && <div className="absolute z-10 mt-2 max-h-52 w-full space-y-0.5 overflow-y-auto rounded-xl border border-gray-200 bg-white p-2 shadow-xl">
                {users.map((assignee) => <label key={assignee._id} className="flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 transition-colors hover:bg-gray-50"><input type="checkbox" checked={assignTo.includes(assignee._id)} onChange={() => toggleAssignee(assignee._id)} className="h-4 w-4 rounded border-gray-300 accent-[#D1F53B]" /><span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#D1F53B]/30 text-xs font-bold text-gray-700">{assignee.username.charAt(0).toUpperCase()}</span><span className="min-w-0"><span className="block truncate text-sm font-medium text-gray-700">{assignee.username}</span><span className="block truncate text-xs text-gray-400">{assignee.email}</span></span></label>)}
              </div>}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 flex items-center gap-1.5 text-sm font-medium text-gray-700"><Flag size={14} className="text-gray-400" />Priority</label>
              <select value={priority} onChange={(event) => setPriority(event.target.value as task["priority"])} className={cn("block w-full rounded-xl border px-4 py-3 text-[15px] font-semibold transition-all focus:outline-none focus:ring-1 focus:ring-gray-900", priorityStyles[priority])}>
                {PRIORITY_OPTIONS.map((option) => <option key={option} value={option}>{option}</option>)}
              </select>
            </div>
            <div>
              <label className="mb-1.5 flex items-center gap-1.5 text-sm font-medium text-gray-700"><Calendar size={14} className="text-gray-400" />Due date</label>
              <input type="date" value={dueDate} onChange={(event) => setDueDate(event.target.value)} className="block w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-[15px] text-gray-900 transition-all focus:border-gray-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-gray-900" />
            </div>
          </div>

          <div className="flex gap-3 border-t border-gray-100 pt-5">
            <button type="button" onClick={() => setEditModalOpen(false)} className="rounded-xl border border-gray-200 px-4 py-3 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50">Cancel</button>
            <button type="submit" disabled={isSaving} className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#D1F53B] px-4 py-3 text-sm font-bold text-gray-900 transition-all hover:bg-[#c2e532] hover:shadow-lg hover:shadow-[#D1F53B]/30 disabled:cursor-not-allowed disabled:opacity-70">
              {isSaving ? <><Loader2 size={17} className="animate-spin" />Saving changes...</> : <><CheckCircle2 size={17} />Save changes</>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditTaskModal;
