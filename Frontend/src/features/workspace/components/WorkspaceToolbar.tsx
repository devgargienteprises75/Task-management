import { LayoutGrid, LayoutList } from "lucide-react"
import type { Dispatch, SetStateAction } from "react"

interface LayoutType {
    layoutStyle: string,
    setLayoutStyle: Dispatch<SetStateAction<"grid" | "list">>
}

const WorkspaceToolbar = ({ layoutStyle, setLayoutStyle }: LayoutType) => {
    return (
        <div className="flex justify-end items-end mb-6">
            <div className="relative flex items-center bg-gray-100 p-1 rounded-lg w-fit shadow-inner">
                <div
                    className={`absolute left-1 top-1 bottom-1 w-[32px] bg-white rounded-md shadow-sm border border-gray-200/60 transition-transform duration-300 ease-in-out ${layoutStyle === 'grid' ? 'translate-x-0' : 'translate-x-full'}`}
                ></div>
                <button
                    onClick={() => setLayoutStyle('grid')}
                    className={`relative z-10 w-[32px] h-[32px] flex justify-center items-center transition-colors duration-300 cursor-pointer ${layoutStyle === 'grid' ? 'text-gray-900' : 'text-gray-400 hover:text-gray-700'}`}
                >
                    <LayoutGrid size={16} />
                </button>
                <button
                    onClick={() => setLayoutStyle('list')}
                    className={`relative z-10 w-[32px] h-[32px] flex justify-center items-center transition-colors duration-300 cursor-pointer ${layoutStyle === 'list' ? 'text-gray-900' : 'text-gray-400 hover:text-gray-700'}`}
                >
                    <LayoutList size={16} />
                </button>
            </div>
        </div>
    )
}

export default WorkspaceToolbar