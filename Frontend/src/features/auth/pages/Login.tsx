import { useState } from "react"
import useAuth from "../hooks/useAuth"
import { cn } from "@/lib/cn";
import { Eye, EyeOff, Loader2, CheckSquare } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Login = () => {
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [showPassword, setShowPassword] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)

    const credentials = {
        email,
        password
    }

    const { handleLogin } = useAuth()
    const navigate = useNavigate()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)

        try {
            await handleLogin(credentials)
            navigate("/")
            setEmail('')
            setPassword('')
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className="flex min-h-screen bg-[#FAFAFA] text-zinc-900 items-center justify-center p-4 font-sans">
            <div className="w-full max-w-sm">
                {/* Brand */}
                <div className="flex flex-col items-center mb-6">
                    <div className="w-8 h-8 rounded-lg bg-zinc-900 text-white flex items-center justify-center shadow-xs mb-2.5">
                        <CheckSquare size={16} strokeWidth={2.5} />
                    </div>
                    <h1 className="font-semibold text-base text-zinc-900 tracking-tight">Sign in to Workspace</h1>
                    <p className="text-xs text-zinc-500 mt-0.5">Manage your team and track projects</p>
                </div>

                <div className="bg-white p-6 rounded-xl border border-zinc-200 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-zinc-700 mb-1.5">Email</label>
                            <input
                                type="email"
                                id="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className={cn(
                                    "block w-full rounded-lg border border-zinc-200 bg-white px-3.5 py-2.5 text-sm text-zinc-900 transition-all",
                                    "placeholder:text-zinc-400",
                                    "focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
                                )}
                                placeholder="name@company.com"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-zinc-700 mb-1.5">Password</label>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    id="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className={cn(
                                        "block w-full rounded-lg border border-zinc-200 bg-white px-3.5 py-2.5 pr-10 text-sm text-zinc-900 transition-all",
                                        "placeholder:text-zinc-400",
                                        "focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
                                    )}
                                    placeholder="••••••••"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)} 
                                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-zinc-400 hover:text-zinc-700 transition-colors cursor-pointer"
                                >
                                    {showPassword ? (<EyeOff size={16} />) : (<Eye size={16} />)}
                                </button>
                            </div>
                        </div>
 
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className={cn(
                                "mt-5 flex w-full items-center justify-center gap-2 rounded-lg bg-black px-4 py-2.5 text-sm font-medium text-white transition-colors cursor-pointer shadow-xs",
                                "hover:bg-zinc-800 active:scale-[0.98]",
                                isSubmitting && "opacity-80 cursor-not-allowed"
                            )}
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 size={15} className="animate-spin" />
                                    Signing in...
                                </>
                            ) : (
                                "Continue"
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default Login