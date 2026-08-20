import { LayoutGrid, LayoutList } from "lucide-react"
import type { Dispatch, SetStateAction } from "react"

interface LayoutType {
    layoutStyle: string,
    setLayoutStyle: Dispatch<SetStateAction<"grid" | "list">>
}

const WorkspaceToolbar = ({ layoutStyle, setLayoutStyle }: LayoutType) => {
    return (
        <div className="flex justify-end items-end mb-4">
            <div className="relative flex items-center bg-zinc-100 p-0.5 rounded-lg w-fit border border-zinc-200">
                <div
                    className={`absolute left-0.5 top-0.5 bottom-0.5 w-[28px] bg-white rounded-md shadow-xs transition-transform duration-200 ease-in-out ${layoutStyle === 'grid' ? 'translate-x-0' : 'translate-x-full'}`}
                ></div>
                <button
                    onClick={() => setLayoutStyle('grid')}
                    className={`relative z-10 w-[28px] h-[26px] flex justify-center items-center transition-colors duration-200 cursor-pointer ${layoutStyle === 'grid' ? 'text-zinc-900 font-semibold' : 'text-zinc-400 hover:text-zinc-700'}`}
                >
                    <LayoutGrid size={13} />
                </button>
                <button
                    onClick={() => setLayoutStyle('list')}
                    className={`relative z-10 w-[28px] h-[26px] flex justify-center items-center transition-colors duration-200 cursor-pointer ${layoutStyle === 'list' ? 'text-zinc-900 font-semibold' : 'text-zinc-400 hover:text-zinc-700'}`}
                >
                    <LayoutList size={13} />
                </button>
            </div>
        </div>
    )
}

export default WorkspaceToolbar