import type { user, workspace } from "@/types";
import { Pencil, Users } from "lucide-react";
import { stringToColor } from "@/lib/colors";
import type { Dispatch, SetStateAction } from "react";

interface WorkspaceType {
    workspace: workspace;
    setIsModalOpen: Dispatch<SetStateAction<boolean>>;
    setSelectedWorkspaceId: Dispatch<SetStateAction<string>>;
    setSelectedWorkspace: Dispatch<SetStateAction<workspace | null>>;
    setNewName: Dispatch<SetStateAction<string>>;
    setNewMemberList: Dispatch<SetStateAction<(string)[]>>;
    setNewDescription: Dispatch<SetStateAction<string>>;
}

const WorkspaceCard = ({ workspace, setIsModalOpen, setNewName, setNewMemberList, setSelectedWorkspaceId, setNewDescription, setSelectedWorkspace }: WorkspaceType) => {
    
  return (
    <div
      key={workspace._id}
      className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md hover:border-gray-200 transition-all cursor-pointer flex flex-col h-full group"
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
          <button
            onClick={() => {
              setSelectedWorkspace(workspace)
              setIsModalOpen(true)
              setSelectedWorkspaceId(workspace._id)
              setNewName(workspace.name)
              setNewDescription(workspace.description ?? "")
              setNewMemberList(workspace.members)
            }}
            className="text-gray-400 hover:text-gray-900 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
          >
            <Pencil size={16} />
          </button>
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
