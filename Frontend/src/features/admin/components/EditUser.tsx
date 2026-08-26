import { useState, useEffect, type Dispatch, type SetStateAction } from "react";
import useAdmin from "../hooks/useAdmin";
import type { UpdateUserPayload } from "@/types/admin.types";
import { useSelector } from "react-redux";
import type { RootState } from "@/app/app.store";
import { X, Loader2, UserCheck, Shield } from "lucide-react";
import { cn } from "@/lib/cn";

interface EditUserProps {
    isUpdateModalOpen: boolean;
    setIsUpdateModalOpen: Dispatch<SetStateAction<boolean>>;
    userId: string | null;
}

const EditUser = ({ userId, isUpdateModalOpen, setIsUpdateModalOpen }: EditUserProps) => {
    if (!isUpdateModalOpen || !userId) return null;

    const { users } = useSelector((state: RootState) => state.admin);
    const targetUser = users.find((u) => u._id === userId);

    const [newRole, setNewRole] = useState<'admin' | 'head' | 'user'>(targetUser?.role || 'user');
    const [currentActiveStatus, setCurrentActiveStatus] = useState<boolean>(targetUser?.isActive ?? true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { handleUpdateUser } = useAdmin();

    useEffect(() => {
        if (targetUser) {
            setNewRole(targetUser.role || 'user');
            setCurrentActiveStatus(targetUser.isActive ?? true);
        }
    }, [targetUser]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        const credential: UpdateUserPayload = {
            newRole,
            currentActiveStatus,
        };

        try {
            const res = await handleUpdateUser(userId, credential);
            if (res?.success) {
                setIsUpdateModalOpen(false);
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs px-4">
            <div className="w-full max-w-md bg-white dark:bg-zinc-800 rounded-xl shadow-[0_8px_30px_rgba(0,0,0,0.35)] border border-zinc-200 dark:border-zinc-700 overflow-hidden">
                {/* Header */}
                <div className="px-6 py-4 border-b border-zinc-100 dark:border-zinc-700 flex justify-between items-center bg-zinc-50/50 dark:bg-zinc-900/60 rounded-t-xl">
                    <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-md bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 flex items-center justify-center shadow-xs">
                            <Shield size={14} strokeWidth={2} />
                        </div>
                        <h3 className="font-semibold text-base text-zinc-900 dark:text-white">Edit team member</h3>
                    </div>
                    <button
                        type="button"
                        onClick={() => setIsUpdateModalOpen(false)}
                        className="text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 transition-colors cursor-pointer p-1 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-700"
                        aria-label="Close modal"
                    >
                        <X size={18} />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    {/* User Info Preview Card */}
                    <div className="flex items-center gap-3 p-3 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50/60 dark:bg-zinc-900/60">
                        <div className="w-9 h-9 rounded-lg bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 flex items-center justify-center font-bold text-xs shrink-0">
                            {targetUser?.username?.charAt(0).toUpperCase() || "U"}
                        </div>
                        <div className="min-w-0 flex-1">
                            <p className="font-semibold text-sm text-zinc-900 dark:text-white truncate">
                                {targetUser?.username || "User"}
                            </p>
                            <p className="text-xs text-zinc-500 dark:text-zinc-400 truncate">
                                {targetUser?.email || "No email"}
                            </p>
                        </div>
                    </div>

                    {/* Role Selection */}
                    <div>
                        <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">
                            Role
                        </label>
                        <select
                            value={newRole}
                            onChange={(e) => setNewRole(e.target.value as 'admin' | 'head' | 'user')}
                            className={cn(
                                "block w-full rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3.5 py-2.5 text-sm text-zinc-900 dark:text-zinc-100 transition-all",
                                "focus:border-black dark:focus:border-zinc-400 focus:outline-none focus:ring-1 focus:ring-black dark:focus:ring-zinc-400"
                            )}
                        >
                            <option value="user">Member (Standard access)</option>
                            <option value="head">Team Lead (Management access)</option>
                            <option value="admin">Administrator (Full control)</option>
                        </select>
                    </div>

                    {/* Active Status Selection */}
                    <div>
                        <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">
                            Account Status
                        </label>
                        <select
                            value={currentActiveStatus ? "active" : "inactive"}
                            onChange={(e) => setCurrentActiveStatus(e.target.value === "active")}
                            className={cn(
                                "block w-full rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3.5 py-2.5 text-sm text-zinc-900 dark:text-zinc-100 transition-all",
                                "focus:border-black dark:focus:border-zinc-400 focus:outline-none focus:ring-1 focus:ring-black dark:focus:ring-zinc-400"
                            )}
                        >
                            <option value="active">Active (Access enabled)</option>
                            <option value="inactive">Inactive (Access disabled)</option>
                        </select>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-2.5 pt-2">
                        <button
                            type="button"
                            onClick={() => setIsUpdateModalOpen(false)}
                            className="flex-1 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-4 py-2.5 text-sm font-medium text-zinc-700 dark:text-zinc-300 transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-700 cursor-pointer"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className={cn(
                                "flex-1 flex items-center justify-center gap-1.5 rounded-lg bg-black dark:bg-zinc-100 px-4 py-2.5 text-sm font-medium text-white dark:text-zinc-900 transition-colors cursor-pointer shadow-xs",
                                "hover:bg-zinc-800 dark:hover:bg-zinc-200",
                                isSubmitting && "opacity-80 cursor-not-allowed"
                            )}
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 size={14} className="animate-spin" />
                                    Saving...
                                </>
                            ) : (
                                <>
                                    <UserCheck size={15} />
                                    Save changes
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditUser;