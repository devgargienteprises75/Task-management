import { AlertTriangle } from "lucide-react";
import { cn } from "@/lib/cn";
import type { workspace } from "@/types";
import type { Dispatch, FormEvent, SetStateAction } from "react";
import useWorkspace from "../hooks/useWorkspace";

interface DeleteOptionProps {
  isMenuOpen: boolean;
  setIsMenuOpen: Dispatch<SetStateAction<boolean>>;
  workspace?: workspace;
}

const DeleteWorkspace = ({ isMenuOpen, setIsMenuOpen, workspace }: DeleteOptionProps) => {
  if (!isMenuOpen) return null;

  const { handleDeleteWorkspace } = useWorkspace()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    await handleDeleteWorkspace(workspace._id)
    setIsMenuOpen(false)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/40 px-4 backdrop-blur-sm">
      <div className="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl scale-100 animate-in zoom-in-95 duration-200">
        <div className="p-6">
          <div className="flex items-center justify-center w-14 h-14 rounded-full bg-red-50 mb-5 mx-auto border-[6px] border-red-50/50">
            <AlertTriangle className="text-red-600" size={24} />
          </div>
          
          <h3 className="text-xl font-bold text-gray-900 text-center mb-2">
            Delete Workspace
          </h3>
          
          <p className="text-[15px] leading-relaxed text-gray-500 text-center mb-8">
            Are you sure you want to delete <span className="font-semibold text-gray-800">"{workspace?.name || 'this workspace'}"</span>? All of its data, tasks, and member associations will be permanently removed. This action cannot be undone.
          </p>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsMenuOpen(false)}
              className={cn(
                "flex-1 rounded-xl border border-gray-200 bg-white px-4 py-3.5 text-[15px] font-bold text-gray-700 transition-all cursor-pointer",
                "hover:bg-gray-50 hover:border-gray-300 hover:text-gray-900",
                "focus:outline-none focus:ring-2 focus:ring-gray-200 focus:ring-offset-1"
              )}
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className={cn(
                "flex-1 rounded-xl bg-red-600 px-4 py-3.5 text-[15px] font-bold text-white transition-all cursor-pointer",
                "hover:bg-red-700 hover:shadow-lg hover:shadow-red-600/20",
                "focus:outline-none focus:ring-2 focus:ring-red-600 focus:ring-offset-1",
                "active:scale-[0.98]"
              )}
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteWorkspace;