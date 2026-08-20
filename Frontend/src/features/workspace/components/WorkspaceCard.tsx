import type { user, workspace } from "@/types";
import { MoreHorizontal, Pencil, Trash2, Users } from "lucide-react";
import { useState, useRef, useEffect, type Dispatch, type SetStateAction } from "react";
import useTask from "@/features/task/hooks/useTask";
import { useNavigate } from "react-router-dom";

interface WorkspaceType {
    workspace: workspace;
    setIsMenuOpen: Dispatch<SetStateAction<boolean>>;
    setSelectedWorkspaceId: Dispatch<SetStateAction<string>>;
    setSelectedWorkspace: Dispatch<SetStateAction<workspace | null>>;
    modalOption: 'edit' | 'delete' | '';
    setModalOption: Dispatch<SetStateAction<'edit' | 'delete' | ''>>
    setNewName: Dispatch<SetStateAction<string>>;
    setNewMemberList: Dispatch<SetStateAction<(string | user)[]>>;
    setNewDescription: Dispatch<SetStateAction<string>>;
}

const WorkspaceCard = ({ workspace, setIsMenuOpen, setModalOption, setNewName, setNewMemberList, setSelectedWorkspaceId, setNewDescription, setSelectedWorkspace }: WorkspaceType) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedWorkspace(workspace);
    setModalOption('edit');
    setIsMenuOpen(true);
    setSelectedWorkspaceId(workspace._id);
    setNewName(workspace.name);
    setNewDescription(workspace.description ?? "");
    setNewMemberList(workspace.members);
    setIsDropdownOpen(false);
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedWorkspace(workspace);
    setModalOption('delete');
    setIsMenuOpen(true);
    setSelectedWorkspaceId(workspace._id);
    setIsDropdownOpen(false);
  };

  const { handleGetTask } = useTask()
  const navigate = useNavigate()

  const getTasks = async (workspaceId: string) => {
    await handleGetTask(workspaceId)
    navigate(`/workspaces/${workspace._id}`)
  }

  return (
    <div
      key={workspace._id}
      onClick={() => getTasks(workspace._id)}
      className="bg-white p-4 rounded-xl shadow-[0_1px_3px_rgba(0,0,0,0.03)] border border-zinc-200 hover:shadow-[0_4px_12px_rgba(0,0,0,0.05)] hover:border-zinc-300 transition-all duration-150 cursor-pointer flex flex-col h-full group relative"
    >
      <div className="flex justify-between items-start mb-3">
        <div className="w-8 h-8 rounded-lg bg-zinc-900 text-white flex items-center justify-center text-xs font-semibold">
          {workspace?.name?.charAt(0).toUpperCase()}
        </div>
        <div className="flex items-center gap-2">
          <span
            className={`inline-flex items-center px-1.5 py-0.2 rounded text-[10px] font-medium tracking-wide uppercase ${
              workspace?.status === "active"
                ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                : "bg-zinc-100 text-zinc-600 border border-zinc-200"
            }`}
          >
            {workspace?.status}
          </span>
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsDropdownOpen(!isDropdownOpen);
              }}
              className="text-zinc-400 hover:text-zinc-700 p-1 rounded hover:bg-zinc-100 transition-colors"
            >
              <MoreHorizontal size={14}/>
            </button>

            {isDropdownOpen && (
              <div className="absolute right-0 top-full mt-1 w-28 bg-white rounded-lg shadow-[0_4px_20px_-4px_rgba(0,0,0,0.12)] border border-zinc-200 overflow-hidden z-20 py-1">
                <button
                  onClick={handleEditClick}
                  className="w-full text-left px-2.5 py-1 text-[11px] font-medium text-zinc-700 hover:bg-zinc-50 flex items-center gap-1.5 cursor-pointer transition-colors"
                >
                  <Pencil size={12} className="text-zinc-400" /> Edit
                </button>
                <div className="h-px bg-zinc-100 w-full" />
                <button
                  onClick={handleDeleteClick}
                  className="w-full text-left px-2.5 py-1 text-[11px] font-medium text-rose-600 hover:bg-rose-50 flex items-center gap-1.5 cursor-pointer transition-colors"
                >
                  <Trash2 size={12} className="text-rose-500" /> Delete
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <h3 className="font-semibold text-sm mb-1 text-zinc-900">
        {workspace?.name}
      </h3>
      <p className="text-xs text-zinc-500 mb-4 flex-1 line-clamp-2 leading-relaxed font-normal">
        {workspace?.description}
      </p>

      <div className="flex justify-between items-center mt-auto pt-2.5 border-t border-zinc-100">
        <div className="flex -space-x-1">
          <div className="w-5 h-5 rounded-full border border-white bg-zinc-800 text-white flex items-center justify-center text-[8px] font-medium">
            {workspace?.name?.charAt(0) || 'W'}
          </div>
        </div>
        <div className="flex items-center gap-1 text-[11px] font-medium text-zinc-500">
          <Users size={11} /> {workspace?.members?.length}
        </div>
      </div>
    </div>
  );
};

export default WorkspaceCard;
