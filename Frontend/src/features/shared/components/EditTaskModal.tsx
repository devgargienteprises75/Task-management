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
  High: "border-rose-200/80 bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-400 dark:border-rose-800/60",
  Medium: "border-amber-200/80 bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-800/60",
  Low: "border-zinc-200 bg-zinc-100 text-zinc-600 dark:bg-zinc-700 dark:text-zinc-300 dark:border-zinc-600",
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 backdrop-blur-xs">
      <div className="flex max-h-[90vh] w-full max-w-lg flex-col overflow-hidden rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 shadow-[0_8px_30px_rgba(0,0,0,0.35)]">
        <div className="flex shrink-0 items-center justify-between border-b border-zinc-100 dark:border-zinc-700 bg-zinc-50/50 dark:bg-zinc-900/60 px-6 py-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 shadow-xs">
              <Pencil size={14} strokeWidth={2} />
            </div>
            <div>
              <h2 className="text-base font-semibold text-zinc-900 dark:text-white">Edit task</h2>
            </div>
          </div>
          <button type="button" onClick={() => setEditModalOpen(false)} className="rounded-md p-1 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 transition-colors hover:bg-zinc-100 dark:hover:bg-zinc-700 cursor-pointer" aria-label="Close edit task modal">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 space-y-4 overflow-y-auto p-6">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300">Title <span className="text-rose-500">*</span></label>
            <input value={newTitle} onChange={(event) => setNewTitle(event.target.value)} required className="block w-full rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3.5 py-2.5 text-sm text-zinc-900 dark:text-zinc-100 transition-all placeholder:text-zinc-400 dark:placeholder:text-zinc-500 focus:border-black dark:focus:border-zinc-400 focus:outline-none focus:ring-1 focus:ring-black dark:focus:ring-zinc-400" />
          </div>

          <div>
            <label className="mb-1.5 flex items-center gap-1.5 text-sm font-medium text-zinc-700 dark:text-zinc-300"><AlignLeft size={14} className="text-zinc-400 dark:text-zinc-500" />Description</label>
            <textarea value={newDescription} onChange={(event) => setNewDescription(event.target.value)} rows={3} className="block w-full resize-none rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3.5 py-2.5 text-sm leading-relaxed text-zinc-900 dark:text-zinc-100 transition-all placeholder:text-zinc-400 dark:placeholder:text-zinc-500 focus:border-black dark:focus:border-zinc-400 focus:outline-none focus:ring-1 focus:ring-black dark:focus:ring-zinc-400" />
          </div>

          <div>
            <label className="mb-1.5 flex items-center gap-1.5 text-sm font-medium text-zinc-700 dark:text-zinc-300"><Users size={14} className="text-zinc-400 dark:text-zinc-500" />Assign to</label>
            <div className="relative">
              <button type="button" onClick={() => setAssigneeMenuOpen((open) => !open)} className={cn("flex min-h-[42px] w-full flex-wrap items-center gap-1.5 rounded-lg border bg-white dark:bg-zinc-900 px-3.5 py-2 pr-8 text-left text-sm transition-all cursor-pointer", assigneeMenuOpen ? "border-black dark:border-zinc-400 ring-1 ring-black dark:ring-zinc-400" : "border-zinc-200 dark:border-zinc-700 hover:border-zinc-300 dark:hover:border-zinc-600")}>
                {selectedAssignees.length ? selectedAssignees.map((assignee) => <span key={assignee._id} className="inline-flex items-center gap-1 rounded border border-zinc-200 dark:border-zinc-600 bg-zinc-50 dark:bg-zinc-700 px-2 py-0.5 text-xs font-medium text-zinc-700 dark:text-zinc-300">{assignee.username}</span>) : <span className="text-zinc-400 dark:text-zinc-500 text-sm">Select assignees...</span>}
                <ChevronDown size={15} className={cn("absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 dark:text-zinc-500 transition-transform", assigneeMenuOpen && "rotate-180")} />
              </button>
              {assigneeMenuOpen && <div className="absolute z-10 mt-1 max-h-48 w-full space-y-0.5 overflow-y-auto rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 p-1.5 shadow-lg">
                {users.map((assignee) => <label key={assignee._id} className="flex cursor-pointer items-center gap-2.5 rounded-md px-3 py-2 transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-700"><input type="checkbox" checked={assignTo.includes(assignee._id)} onChange={() => toggleAssignee(assignee._id)} className="h-4 w-4 rounded border-zinc-300 dark:border-zinc-700 accent-black dark:accent-white" /><span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">{assignee.username}</span></label>)}
              </div>}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 flex items-center gap-1.5 text-sm font-medium text-zinc-700 dark:text-zinc-300"><Flag size={14} className="text-zinc-400 dark:text-zinc-500" />Priority</label>
              <select value={priority} onChange={(event) => setPriority(event.target.value as task["priority"])} className={cn("block w-full rounded-lg border px-3.5 py-2.5 text-sm font-medium transition-all focus:outline-none cursor-pointer", priorityStyles[priority])}>
                {PRIORITY_OPTIONS.map((option) => <option key={option} value={option}>{option}</option>)}
              </select>
            </div>
            <div>
              <label className="mb-1.5 flex items-center gap-1.5 text-sm font-medium text-zinc-700 dark:text-zinc-300"><Calendar size={14} className="text-zinc-400 dark:text-zinc-500" />Due date</label>
              <input type="date" value={dueDate} onChange={(event) => setDueDate(event.target.value)} className="block w-full rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3.5 py-2.5 text-sm text-zinc-900 dark:text-zinc-100 transition-all focus:border-black dark:focus:border-zinc-400 focus:outline-none focus:ring-1 focus:ring-black dark:focus:ring-zinc-400" />
            </div>
          </div>

          <div className="flex gap-2.5 border-t border-zinc-100 dark:border-zinc-700 pt-4">
            <button type="button" onClick={() => setEditModalOpen(false)} className="rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-4 py-2.5 text-sm font-medium text-zinc-700 dark:text-zinc-300 transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-700 cursor-pointer">Cancel</button>
            <button type="submit" disabled={isSaving} className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-black dark:bg-zinc-100 px-4 py-2.5 text-sm font-medium text-white dark:text-zinc-900 transition-colors hover:bg-zinc-800 dark:hover:bg-zinc-200 shadow-xs cursor-pointer disabled:cursor-not-allowed disabled:opacity-70">
              {isSaving ? <><Loader2 size={14} className="animate-spin" />Saving...</> : <><CheckCircle2 size={15} />Save changes</>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditTaskModal;
