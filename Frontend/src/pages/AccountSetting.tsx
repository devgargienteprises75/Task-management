import { User, Mail, Lock, Camera } from "lucide-react";
import { useSelector } from "react-redux";
import type { RootState } from "@/app/app.store";

export const AccountSetting = () => {
    const { user } = useSelector((state: RootState) => state.auth);

    return (
        <div className="flex-1 overflow-auto bg-[#F9FAFB] p-6 lg:p-10 h-screen">
            <div className="max-w-4xl mx-auto space-y-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Account Settings</h1>
                    <p className="text-gray-500 mt-2">Manage your account details and preferences.</p>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="p-8">
                        <div className="flex items-center gap-6 mb-8 pb-8 border-b border-gray-100">
                            <div className="relative group cursor-pointer">
                                <div className="w-24 h-24 rounded-full bg-gray-900 text-white flex items-center justify-center text-3xl font-bold">
                                    {user?.username?.charAt(0).toUpperCase() || 'U'}
                                </div>
                                <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Camera className="text-white" size={24} />
                                </div>
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-gray-900">{user?.username || 'User'}</h3>
                                <p className="text-gray-500 font-medium">{user?.role === 'admin' ? 'Administrator' : 'Member'}</p>
                            </div>
                        </div>

                        <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                                        <User size={16} className="text-gray-400" /> Full Name
                                    </label>
                                    <input 
                                        type="text" 
                                        defaultValue={user?.username || ''}
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all"
                                        placeholder="Enter your full name"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                                        <Mail size={16} className="text-gray-400" /> Email Address
                                    </label>
                                    <input 
                                        type="email" 
                                        defaultValue={user?.email || ''}
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all bg-gray-50"
                                        placeholder="Enter your email"
                                        disabled
                                    />
                                    <p className="text-xs text-gray-500">Email address cannot be changed.</p>
                                </div>
                            </div>

                            <div className="pt-4">
                                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                                    <Lock size={18} /> Change Password
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-gray-700">Current Password</label>
                                        <input 
                                            type="password" 
                                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all"
                                            placeholder="Enter current password"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-gray-700">New Password</label>
                                        <input 
                                            type="password" 
                                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all"
                                            placeholder="Enter new password"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-end gap-3 pt-6 border-t border-gray-100">
                                <button type="button" className="px-6 py-3 rounded-xl font-semibold text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer">
                                    Cancel
                                </button>
                                <button type="submit" className="px-6 py-3 rounded-xl font-bold bg-[#D1F53B] text-gray-900 hover:bg-[#c2e532] transition-colors shadow-sm cursor-pointer">
                                    Save Changes
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