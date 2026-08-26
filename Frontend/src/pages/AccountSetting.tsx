import { User, Mail, Lock, Camera, ChevronDown } from "lucide-react";
import { useSelector } from "react-redux";
import type { RootState } from "@/app/app.store";
import { useState } from "react";
import useAuth from "@/features/auth/hooks/useAuth";
import { useTheme } from "@/hooks/useTheme";

export const AccountSetting = () => {
    const { user } = useSelector((state: RootState) => state.auth);
    const { theme, changeTheme } = useTheme();

    const [ username, setUsername ] = useState<string | undefined>(user?.username);
    const [ email, setEmail ] = useState<string | undefined>(user?.email);

    const { handleEditUser } = useAuth();

    const handleSubmit = async () => {
        if (!user || !user._id || !username) return;

        await handleEditUser(user._id, username);

        setUsername(user.username);
        setEmail(user.email);
    };

    return (
        <div className="flex-1 overflow-auto bg-[#FAFAFA] dark:bg-zinc-900 p-6 lg:p-10 h-screen text-zinc-900 dark:text-zinc-100 font-sans transition-colors duration-150">
            <div className="max-w-3xl mx-auto space-y-6">
                <div>
                    <h1 className="text-2xl font-bold text-zinc-900 dark:text-white tracking-tight">Account Settings</h1>
                    <p className="text-zinc-500 dark:text-zinc-400 mt-1 text-sm">Manage your profile details, appearance, and preferences.</p>
                </div>

                {/* Profile & Security Card */}
                <div className="bg-white dark:bg-zinc-800 rounded-xl shadow-[0_1px_3px_rgba(0,0,0,0.03)] border border-zinc-200 dark:border-zinc-700/80 overflow-hidden transition-colors">
                    <div className="p-6 sm:p-8">
                        <div className="flex items-center gap-5 mb-6 pb-6 border-b border-zinc-100 dark:border-zinc-700">
                            <div className="relative group cursor-pointer">
                                <div className="w-16 h-16 rounded-full bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 flex items-center justify-center text-xl font-bold shadow-xs">
                                    {user?.username?.charAt(0).toUpperCase() || 'U'}
                                </div>
                                <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Camera className="text-white" size={18} />
                                </div>
                            </div>
                            <div>
                                <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100">{user?.username || 'User'}</h3>
                                <p className="text-xs text-zinc-500 dark:text-zinc-400 font-medium mt-0.5">{user?.role === 'admin' ? 'Administrator' : 'Member'}</p>
                            </div>
                        </div>

                        <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <div className="space-y-1.5">
                                    <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300 flex items-center gap-1.5">
                                        <User size={14} className="text-zinc-400 dark:text-zinc-500" /> Full Name
                                    </label>
                                    <input 
                                        type="text" 
                                        value={username || ''}
                                        className="w-full px-3.5 py-2.5 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-black dark:focus:border-zinc-400 focus:ring-1 focus:ring-black dark:focus:ring-zinc-400 transition-all text-sm"
                                        placeholder="Enter your full name"
                                        onChange={(e) => setUsername(e.target.value)}
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300 flex items-center gap-1.5">
                                        <Mail size={14} className="text-zinc-400 dark:text-zinc-500" /> Email Address
                                    </label>
                                    <input 
                                        type="email" 
                                        value={email || ''}
                                        className="w-full px-3.5 py-2.5 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900/60 text-zinc-500 dark:text-zinc-400 focus:outline-none transition-all text-sm cursor-not-allowed"
                                        placeholder="Enter your email"
                                        disabled
                                    />
                                    <p className="text-xs text-zinc-400 dark:text-zinc-500">Email address cannot be changed.</p>
                                </div>
                            </div>

                            <div className="pt-4 border-t border-zinc-100 dark:border-zinc-700">
                                <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 mb-3.5 flex items-center gap-1.5">
                                    <Lock size={15} className="text-zinc-500 dark:text-zinc-400" /> Change Password
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    <div className="space-y-1.5">
                                        <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Current Password</label>
                                        <input 
                                            type="password" 
                                            className="w-full px-3.5 py-2.5 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-black dark:focus:border-zinc-400 focus:ring-1 focus:ring-black dark:focus:ring-zinc-400 transition-all text-sm"
                                            placeholder="Enter current password"
                                        />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">New Password</label>
                                        <input 
                                            type="password" 
                                            className="w-full px-3.5 py-2.5 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-black dark:focus:border-zinc-400 focus:ring-1 focus:ring-black dark:focus:ring-zinc-400 transition-all text-sm"
                                            placeholder="Enter new password"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-end gap-2 pt-5 border-t border-zinc-100 dark:border-zinc-700">
                                <button onClick={handleSubmit} type="submit" className="px-5 py-2.5 rounded-lg font-medium bg-black dark:bg-zinc-100 text-white dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors shadow-xs cursor-pointer text-sm active:scale-98">
                                    Save profile changes
                                </button>
                            </div>
                        </form>
                    </div>
                </div>

                {/* Appearance / Theme Switcher Card */}
                <div className="bg-white dark:bg-zinc-800 rounded-xl shadow-[0_1px_3px_rgba(0,0,0,0.03)] border border-zinc-200 dark:border-zinc-700/80 overflow-hidden transition-colors">
                    <div className="p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div>
                            <h2 className="text-base font-bold text-zinc-900 dark:text-zinc-100">Appearance</h2>
                            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">Customize how TaskFlow looks on your device.</p>
                        </div>

                        <div className="relative shrink-0">
                            <select
                                id="theme-select"
                                value={theme}
                                onChange={(e) => changeTheme(e.target.value as "light" | "dark" | "system")}
                                className="appearance-none bg-zinc-50 dark:bg-zinc-900 hover:bg-zinc-100 dark:hover:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg text-xs font-semibold text-zinc-800 dark:text-zinc-200 py-2 pl-3.5 pr-8 transition-all focus:outline-none focus:border-zinc-400 dark:focus:border-zinc-500 cursor-pointer min-w-[130px]"
                            >
                                <option value="light">Light</option>
                                <option value="dark">Dark</option>
                                <option value="system">System</option>
                            </select>
                            <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-400 dark:text-zinc-500 pointer-events-none" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AccountSetting;