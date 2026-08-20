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
  High: "border-rose-200/80 bg-rose-50 text-rose-700",
  Medium: "border-amber-200/80 bg-amber-50 text-amber-700",
  Low: "border-zinc-200 bg-zinc-100 text-zinc-600",
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 px-4 backdrop-blur-xs">
      <div className="flex max-h-[90vh] w-full max-w-lg flex-col overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-[0_8px_30px_rgba(0,0,0,0.12)]">
        <div className="flex shrink-0 items-center justify-between border-b border-zinc-100 bg-zinc-50/50 px-5 py-3.5">
          <div className="flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded bg-zinc-900 text-white">
              <Pencil size={12} strokeWidth={2} />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-zinc-900">Edit task</h2>
            </div>
          </div>
          <button type="button" onClick={() => setEditModalOpen(false)} className="rounded p-1 text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-zinc-700" aria-label="Close edit task modal">
            <X size={16} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 space-y-3.5 overflow-y-auto p-5">
          <div>
            <label className="mb-1 block text-xs font-medium text-zinc-700">Title <span className="text-rose-500">*</span></label>
            <input value={newTitle} onChange={(event) => setNewTitle(event.target.value)} required className="block w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-xs text-zinc-900 transition-all placeholder:text-zinc-400 focus:border-black focus:outline-none focus:ring-1 focus:ring-black" />
          </div>

          <div>
            <label className="mb-1 flex items-center gap-1.5 text-xs font-medium text-zinc-700"><AlignLeft size={13} className="text-zinc-400" />Description</label>
            <textarea value={newDescription} onChange={(event) => setNewDescription(event.target.value)} rows={3} className="block w-full resize-none rounded-lg border border-zinc-200 bg-white px-3 py-2 text-xs leading-5 text-zinc-900 transition-all placeholder:text-zinc-400 focus:border-black focus:outline-none focus:ring-1 focus:ring-black" />
          </div>

          <div>
            <label className="mb-1 flex items-center gap-1.5 text-xs font-medium text-zinc-700"><Users size={13} className="text-zinc-400" />Assign to</label>
            <div className="relative">
              <button type="button" onClick={() => setAssigneeMenuOpen((open) => !open)} className={cn("flex min-h-[38px] w-full flex-wrap items-center gap-1.5 rounded-lg border bg-white px-3 py-1.5 pr-8 text-left text-xs transition-all", assigneeMenuOpen ? "border-black ring-1 ring-black" : "border-zinc-200 hover:border-zinc-300")}>
                {selectedAssignees.length ? selectedAssignees.map((assignee) => <span key={assignee._id} className="inline-flex items-center gap-1 rounded border border-zinc-200 bg-zinc-50 px-1.5 py-0.5 text-[10px] font-medium text-zinc-700">{assignee.username}</span>) : <span className="text-zinc-400">Select assignees...</span>}
                <ChevronDown size={14} className={cn("absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 transition-transform", assigneeMenuOpen && "rotate-180")} />
              </button>
              {assigneeMenuOpen && <div className="absolute z-10 mt-1 max-h-48 w-full space-y-0.5 overflow-y-auto rounded-lg border border-zinc-200 bg-white p-1 shadow-lg">
                {users.map((assignee) => <label key={assignee._id} className="flex cursor-pointer items-center gap-2 rounded px-2.5 py-1.5 transition-colors hover:bg-zinc-50"><input type="checkbox" checked={assignTo.includes(assignee._id)} onChange={() => toggleAssignee(assignee._id)} className="h-3.5 w-3.5 rounded border-zinc-300 accent-black" /><span className="text-xs font-medium text-zinc-700">{assignee.username}</span></label>)}
              </div>}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <label className="mb-1 flex items-center gap-1.5 text-xs font-medium text-zinc-700"><Flag size={13} className="text-zinc-400" />Priority</label>
              <select value={priority} onChange={(event) => setPriority(event.target.value as task["priority"])} className={cn("block w-full rounded-lg border px-3 py-2 text-xs font-medium transition-all focus:outline-none", priorityStyles[priority])}>
                {PRIORITY_OPTIONS.map((option) => <option key={option} value={option}>{option}</option>)}
              </select>
            </div>
            <div>
              <label className="mb-1 flex items-center gap-1.5 text-xs font-medium text-zinc-700"><Calendar size={13} className="text-zinc-400" />Due date</label>
              <input type="date" value={dueDate} onChange={(event) => setDueDate(event.target.value)} className="block w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-xs text-zinc-900 transition-all focus:border-black focus:outline-none focus:ring-1 focus:ring-black" />
            </div>
          </div>

          <div className="flex gap-2 border-t border-zinc-100 pt-3.5">
            <button type="button" onClick={() => setEditModalOpen(false)} className="rounded-lg border border-zinc-200 bg-white px-3 py-2 text-xs font-medium text-zinc-700 transition-colors hover:bg-zinc-50">Cancel</button>
            <button type="submit" disabled={isSaving} className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-black px-4 py-2 text-xs font-medium text-white transition-colors hover:bg-zinc-800 shadow-xs disabled:cursor-not-allowed disabled:opacity-70">
              {isSaving ? <><Loader2 size={13} className="animate-spin" />Saving...</> : <><CheckCircle2 size={13} />Save changes</>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditTaskModal;
