import type { user, workspace } from "@/types";
import { EllipsisVertical, Pencil, Trash2, Users } from "lucide-react";
import { stringToColor } from "@/lib/colors";
import { useState, useRef, useEffect, type Dispatch, type SetStateAction } from "react";
import useWorkspace from "../hooks/useWorkspace";

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

  return (
    <div
      key={workspace._id}
      className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md hover:border-gray-200 transition-all cursor-pointer flex flex-col h-full group relative"
    >
      <div className="flex justify-between items-start mb-4">
        <div
          className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl font-bold`}
          style={{ backgroundColor: stringToColor(workspace?.name || "") + '50' }}
        >
          {workspace?.name?.charAt(0).toUpperCase()}
        </div>
        <div className="flex items-center gap-4">
          <span
            className={`inline-flex items-center px-2.5 py-1 rounded-md text-[11px] font-bold tracking-wide uppercase ${
              workspace?.status === "active"
                ? "bg-green-50 text-green-600"
                : "bg-gray-100 text-gray-500"
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
              className="text-gray-400 hover:text-gray-900 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer p-1 rounded-md hover:bg-gray-100"
            >
              <EllipsisVertical size={16}/>
            </button>

            {isDropdownOpen && (
              <div className="absolute right-0 top-full mt-1 w-32 bg-white rounded-xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.1)] border border-gray-100 overflow-hidden z-20 py-1">
                <button
                  onClick={handleEditClick}
                  className="w-full text-left px-3 py-2 text-[13px] font-medium text-gray-700 hover:bg-gray-50 flex items-center gap-2 cursor-pointer transition-colors"
                >
                  <Pencil size={14} className="text-gray-400" /> Edit
                </button>
                <div className="h-px bg-gray-100 w-full" />
                <button
                  onClick={handleDeleteClick}
                  className="w-full text-left px-3 py-2 text-[13px] font-medium text-red-600 hover:bg-red-50 flex items-center gap-2 cursor-pointer transition-colors"
                >
                  <Trash2 size={14} className="text-red-500" /> Delete
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <h3 className="font-bold text-lg mb-2 text-gray-900 group-hover:text-blue-600 transition-colors">
        {workspace?.name}
      </h3>
      <p className="text-sm text-gray-500 mb-6 flex-1 line-clamp-2 leading-relaxed">
        {workspace?.description}
      </p>

      <div className="flex justify-between items-center mt-auto pt-4 border-t border-gray-50">
        <div className="flex -space-x-2">
          <div className="w-8 h-8 rounded-full border-2 border-white bg-blue-200"></div>
          <div className="w-8 h-8 rounded-full border-2 border-white bg-purple-200"></div>
          <div className="w-8 h-8 rounded-full border-2 border-white bg-yellow-200 flex items-center justify-center text-[10px] font-bold text-gray-700">
            +
            {workspace?.members?.length > 2
              ? workspace?.members?.length - 2
              : 0}
          </div>
        </div>
        <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-400 bg-gray-50 px-2 py-1 rounded-md">
          <Users size={12} /> {workspace?.members?.length}
        </div>
      </div>

      {/* Workspace Edit Modal */}
    </div>
  );
};

export default WorkspaceCard;
