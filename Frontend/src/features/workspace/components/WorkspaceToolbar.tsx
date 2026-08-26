import { LayoutGrid, List } from "lucide-react";
import type { Dispatch, SetStateAction } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "@/app/app.store";

interface WorkspaceToolbarProps {
    isCardView: boolean;
    setIsCardView: Dispatch<SetStateAction<boolean>>;
}

const WorkspaceToolbar = ({ isCardView, setIsCardView }: WorkspaceToolbarProps) => {
    const { allWorkspaces } = useSelector((state: RootState) => state.workspace);

    return (
        <div className="flex items-center justify-between">
            <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
                Showing <span className="font-semibold text-zinc-900 dark:text-zinc-100">{allWorkspaces.length}</span> workspaces
            </p>

            <div className="flex items-center gap-1 bg-zinc-100 dark:bg-zinc-800/80 p-1 rounded-lg border border-zinc-200 dark:border-zinc-700/80">
                <button
                    onClick={() => setIsCardView(true)}
                    className={`p-1.5 rounded-md transition-all cursor-pointer ${
                        isCardView
                            ? "bg-white dark:bg-zinc-700 text-zinc-900 dark:text-white shadow-xs"
                            : "text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200"
                    }`}
                    title="Grid view"
                >
                    <LayoutGrid size={15} />
                </button>
                <button
                    onClick={() => setIsCardView(false)}
                    className={`p-1.5 rounded-md transition-all cursor-pointer ${
                        !isCardView
                            ? "bg-white dark:bg-zinc-700 text-zinc-900 dark:text-white shadow-xs"
                            : "text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200"
                    }`}
                    title="List view"
                >
                    <List size={15} />
                </button>
            </div>
        </div>
    );
};

export default WorkspaceToolbar;