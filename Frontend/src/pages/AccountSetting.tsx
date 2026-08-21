import { User, Mail, Lock, Camera } from "lucide-react";
import { useSelector } from "react-redux";
import type { RootState } from "@/app/app.store";
import { useState } from "react";
import useAuth from "@/features/auth/hooks/useAuth";

export const AccountSetting = () => {
    const { user } = useSelector((state: RootState) => state.auth);

    const [ username, setUsername ] = useState<string | undefined>(user?.username)
    const [ email, setEmail ] = useState<string | undefined>(user?.email)

    const { handleEditUser } = useAuth()

    const handleSubmit = async () => {
        if (!user || !user._id || !username) return;

        await handleEditUser(user._id, username)

        setUsername(user.username)
        setEmail(user.email)
    }

    return (
        <div className="flex-1 overflow-auto bg-[#FAFAFA] p-6 lg:p-10 h-screen text-zinc-900 font-sans">
            <div className="max-w-3xl mx-auto space-y-6">
                <div>
                    <h1 className="text-2xl font-bold text-zinc-900 tracking-tight">Account Settings</h1>
                    <p className="text-zinc-500 mt-1 text-sm">Manage your profile details and preferences.</p>
                </div>

                <div className="bg-white rounded-xl shadow-[0_1px_3px_rgba(0,0,0,0.03)] border border-zinc-200 overflow-hidden">
                    <div className="p-6 sm:p-8">
                        <div className="flex items-center gap-5 mb-6 pb-6 border-b border-zinc-100">
                            <div className="relative group cursor-pointer">
                                <div className="w-16 h-16 rounded-full bg-zinc-900 text-white flex items-center justify-center text-xl font-bold">
                                    {user?.username?.charAt(0).toUpperCase() || 'U'}
                                </div>
                                <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Camera className="text-white" size={18} />
                                </div>
                            </div>
                            <div>
                                <h3 className="text-base font-bold text-zinc-900">{user?.username || 'User'}</h3>
                                <p className="text-xs text-zinc-500 font-medium mt-0.5">{user?.role === 'admin' ? 'Administrator' : 'Member'}</p>
                            </div>
                        </div>

                        <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <div className="space-y-1.5">
                                    <label className="text-sm font-medium text-zinc-700 flex items-center gap-1.5">
                                        <User size={14} className="text-zinc-400" /> Full Name
                                    </label>
                                    <input 
                                        type="text" 
                                        value={username || ''}
                                        className="w-full px-3.5 py-2.5 rounded-lg border border-zinc-200 bg-white text-zinc-900 focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-all text-sm"
                                        placeholder="Enter your full name"
                                        onChange={(e) => setUsername(e.target.value)}
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-sm font-medium text-zinc-700 flex items-center gap-1.5">
                                        <Mail size={14} className="text-zinc-400" /> Email Address
                                    </label>
                                    <input 
                                        type="email" 
                                        value={email || ''}
                                        className="w-full px-3.5 py-2.5 rounded-lg border border-zinc-200 bg-zinc-50 text-zinc-500 focus:outline-none transition-all text-sm cursor-not-allowed"
                                        placeholder="Enter your email"
                                        disabled
                                    />
                                    <p className="text-xs text-zinc-400">Email address cannot be changed.</p>
                                </div>
                            </div>

                            <div className="pt-4 border-t border-zinc-100">
                                <h3 className="text-sm font-semibold text-zinc-900 mb-3.5 flex items-center gap-1.5">
                                    <Lock size={15} className="text-zinc-500" /> Change Password
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    <div className="space-y-1.5">
                                        <label className="text-sm font-medium text-zinc-700">Current Password</label>
                                        <input 
                                            type="password" 
                                            className="w-full px-3.5 py-2.5 rounded-lg border border-zinc-200 bg-white text-zinc-900 focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-all text-sm"
                                            placeholder="Enter current password"
                                        />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-sm font-medium text-zinc-700">New Password</label>
                                        <input 
                                            type="password" 
                                            className="w-full px-3.5 py-2.5 rounded-lg border border-zinc-200 bg-white text-zinc-900 focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-all text-sm"
                                            placeholder="Enter new password"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-end gap-2 pt-5 border-t border-zinc-100">
                                <button onClick={handleSubmit} type="submit" className="px-5 py-2.5 rounded-lg font-medium bg-black text-white hover:bg-zinc-800 transition-colors shadow-xs cursor-pointer text-sm active:scale-98">
                                    Save changes
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AccountSetting;