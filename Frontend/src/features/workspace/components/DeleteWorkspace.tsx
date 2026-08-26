import { AlertTriangle, Loader2 } from "lucide-react";
import { cn } from "@/lib/cn";
import type { workspace } from "@/types";
import { useState, type Dispatch, type SetStateAction } from "react";
import useWorkspace from "../hooks/useWorkspace";

interface DeleteOptionProps {
  isMenuOpen: boolean;
  setIsMenuOpen: Dispatch<SetStateAction<boolean>>;
  workspace?: workspace;
}

const DeleteWorkspace = ({ isMenuOpen, setIsMenuOpen, workspace }: DeleteOptionProps) => {
  if (!isMenuOpen) return null;

  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const { handleDeleteWorkspace } = useWorkspace()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsDeleting(true)

    try {
      await handleDeleteWorkspace(workspace?._id ?? "")
      setIsMenuOpen(false)
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 backdrop-blur-xs">
      <div className="w-full max-w-sm overflow-hidden rounded-xl bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 shadow-[0_8px_30px_rgba(0,0,0,0.35)]">
        <div className="p-6">
          <div className="flex items-center justify-center w-11 h-11 rounded-full bg-rose-50 dark:bg-rose-950/40 mb-3.5 mx-auto border border-rose-100 dark:border-rose-900/60">
            <AlertTriangle className="text-rose-600 dark:text-rose-400" size={20} />
          </div>
          
          <h3 className="text-base font-semibold text-zinc-900 dark:text-white text-center mb-1.5">
            Delete Workspace
          </h3>
          
          <p className="text-[13px] leading-relaxed text-zinc-500 dark:text-zinc-400 text-center mb-6 font-normal">
            Are you sure you want to delete <span className="font-semibold text-zinc-800 dark:text-zinc-200">"{workspace?.name || 'this workspace'}"</span>? All data and tasks will be permanently removed.
          </p>

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setIsMenuOpen(false)}
              className={cn(
                "flex-1 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-4 py-2.5 text-sm font-medium text-zinc-700 dark:text-zinc-300 transition-colors cursor-pointer",
                "hover:bg-zinc-50 dark:hover:bg-zinc-700"
              )}
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={isDeleting}
              className={cn(
                "flex-1 flex items-center justify-center gap-1.5 rounded-lg bg-rose-600 px-4 py-2.5 text-sm font-medium text-white transition-colors cursor-pointer",
                "hover:bg-rose-700 shadow-xs",
                isDeleting && "opacity-80 cursor-not-allowed"
              )}
            >
              {isDeleting ? (
                <>
                  <Loader2 size={14} className="animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteWorkspace;