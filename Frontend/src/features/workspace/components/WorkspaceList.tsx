import type { user, workspace } from '@/types'
import { MoreHorizontal, Pencil, Trash2, Users } from 'lucide-react'
import { useState, useRef, useEffect, type Dispatch, type SetStateAction } from 'react';
import useTask from '@/features/task/hooks/useTask';
import { useNavigate } from 'react-router-dom';

interface WorkspaceType {
  workspace: workspace;
  setIsMenuOpen: Dispatch<SetStateAction<boolean>>;
  setSelectedWorkspaceId: Dispatch<SetStateAction<string>>;
  modalOption: 'edit' | 'delete' | '';
  setModalOption: Dispatch<SetStateAction<'edit' | 'delete' | ''>>
  setSelectedWorkspace: Dispatch<SetStateAction<workspace | null>>;
  setNewName: Dispatch<SetStateAction<string>>;
  setNewMemberList: Dispatch<SetStateAction<(string | user)[]>>;
  setNewDescription: Dispatch<SetStateAction<string>>;
}

const WorkspaceList = ({ workspace, setIsMenuOpen, setModalOption, setNewName, setNewMemberList, setSelectedWorkspaceId, setNewDescription, setSelectedWorkspace }: WorkspaceType) => {
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
    <div onClick={() => getTasks(workspace._id)} className="bg-white p-3.5 rounded-xl shadow-[0_1px_3px_rgba(0,0,0,0.03)] border border-zinc-200 hover:shadow-[0_4px_12px_rgba(0,0,0,0.05)] hover:border-zinc-300 transition-all duration-150 cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between group gap-3 relative">
      <div className="flex items-center gap-3 flex-1 w-full">
        <div className="w-8 h-8 rounded-lg bg-zinc-900 text-white flex items-center justify-center text-xs font-semibold shrink-0">
          {workspace?.name?.charAt(0).toUpperCase()}
        </div>
        <div className="flex-1 min-w-0 pr-4">
          <h3 className="font-semibold text-xs text-zinc-900 truncate">
            {workspace?.name}
          </h3>
          <p className="text-[11px] text-zinc-500 truncate mt-0.5 font-normal">
            {workspace?.description}
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between sm:justify-end gap-3 sm:gap-5 shrink-0 w-full sm:w-auto border-t sm:border-t-0 pt-2.5 sm:pt-0 border-zinc-100">
        <span
          className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium tracking-wide uppercase ${
            workspace?.status === "active"
              ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
              : "bg-zinc-100 text-zinc-600 border border-zinc-200"
          }`}
        >
          {workspace?.status}
        </span>

        <div className="flex items-center gap-2 sm:w-24 border-l border-zinc-100 pl-3">
          <div className="flex items-center gap-1.5 text-xs font-medium text-zinc-500">
            <Users size={13} /> {workspace?.members?.length}
          </div>
        </div>

        <div className="relative" ref={dropdownRef}>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsDropdownOpen(!isDropdownOpen);
            }}
            className="text-zinc-400 hover:text-zinc-700 p-1 hover:bg-zinc-100 rounded cursor-pointer"
          >
            <MoreHorizontal size={15} />
          </button>

          {isDropdownOpen && (
            <div className="absolute right-0 top-full mt-1.5 w-36 bg-white rounded-xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.12)] border border-zinc-200 overflow-hidden z-20 py-1.5">
              <button
                onClick={handleEditClick}
                className="w-full text-left px-3.5 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50 flex items-center gap-2.5 cursor-pointer transition-colors"
              >
                <Pencil size={14} className="text-zinc-400" /> Edit
              </button>
              <div className="h-px bg-zinc-100 w-full" />
              <button
                onClick={handleDeleteClick}
                className="w-full text-left px-3.5 py-2 text-sm font-medium text-rose-600 hover:bg-rose-50 flex items-center gap-2.5 cursor-pointer transition-colors"
              >
                <Trash2 size={14} className="text-rose-500" /> Delete
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default WorkspaceList