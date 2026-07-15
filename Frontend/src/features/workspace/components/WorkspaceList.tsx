import type { workspace } from '@/types'
import { Pencil, Users } from 'lucide-react'
import { stringToColor } from '@/lib/colors'

interface WorkspaceType {
    workspace: workspace
}

const WorkspaceList = ({ workspace }: WorkspaceType) => {
  return (
    <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 hover:shadow-md hover:border-gray-200 transition-all cursor-pointer flex items-center justify-between group">
      <div className="flex items-center gap-4 flex-1">
        <div 
          className="w-12 h-12 rounded-lg flex items-center justify-center text-lg font-bold text-gray-900 shrink-0"
          style={{ backgroundColor: stringToColor(workspace?.name || '') + '50' }}
        >
          {workspace?.name?.charAt(0).toUpperCase()}
        </div>
        <div className="flex-1 min-w-0 pr-4">
          <h3 className="font-bold text-[15px] text-gray-900 group-hover:text-blue-600 transition-colors truncate">
            {workspace?.name}
          </h3>
          <p className="text-xs text-gray-500 truncate mt-0.5">
            {workspace?.description}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-6 shrink-0">
        <span
          className={`inline-flex items-center px-2.5 py-1 rounded-md text-[11px] font-bold tracking-wide uppercase ${
            workspace?.status === "active"
              ? "bg-green-50 text-green-600"
              : "bg-gray-100 text-gray-500"
          }`}
        >
          {workspace?.status}
        </span>

        <div className="flex items-center gap-2 w-32 border-l border-gray-100 pl-6">
          <div className="flex -space-x-2 shrink-0">
            <div className="w-7 h-7 rounded-full border-2 border-white bg-blue-200"></div>
            <div className="w-7 h-7 rounded-full border-2 border-white bg-purple-200"></div>
            <div className="w-7 h-7 rounded-full border-2 border-white bg-yellow-200 flex items-center justify-center text-[9px] font-bold text-gray-700">
              +{workspace?.members?.length > 2 ? workspace?.members?.length - 2 : 0}
            </div>
          </div>
          <div className="flex items-center gap-1 text-xs font-semibold text-gray-500">
            <Users size={14} /> {workspace?.members?.length}
          </div>
        </div>

        <button className="text-gray-400 hover:text-gray-900 opacity-0 group-hover:opacity-100 transition-opacity p-2 hover:bg-gray-50 rounded-lg cursor-pointer">
          <Pencil size={16} />
        </button>
      </div>
    </div>
  )
}

export default WorkspaceList