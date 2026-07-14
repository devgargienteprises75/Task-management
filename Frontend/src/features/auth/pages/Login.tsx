import { useState } from "react"
import useAuth from "../hooks/useAuth"
import { cn } from "@/lib/cn";
import { CalendarClock, Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Login = () => {

    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [showPassword, setShowPassword] = useState(false)

    const credentials = {
        email,
        password
    }

    const { handleLogin } = useAuth()
    const navigate = useNavigate()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        await handleLogin(credentials)
        navigate("/")

        setEmail('')
        setPassword('')
    }

    return (
        <div className="flex min-h-screen bg-[#FEFEFE]">
            {/* Left Column - Form */}
            <div className="flex w-full flex-col justify-center px-8 sm:px-12 lg:w-1/2 lg:px-24 xl:px-32">
                {/* Logo */}
                <div className="logo flex items-center gap-2 absolute top-8 left-8">
                    <CalendarClock className="text-gray-900" />
                    <h1 className="font-bold text-2xl text-gray-900 tracking-tight">ToDo</h1>
                </div>
                
                <div className="mx-auto w-full max-w-md">
                    <div className="mb-10">
                        <h2 className="text-4xl font-bold tracking-tight text-gray-900 mb-2">
                            Welcome Back
                        </h2>
                        <p className="text-[15px] text-gray-500 font-medium">
                            Sign in to continue to your workspace
                        </p>
                    </div>
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <input
                                type="email"
                                id="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className={cn(
                                    "block w-full rounded-[14px] border border-gray-200 bg-gray-50 px-5 py-3.5 text-[15px] text-gray-900 transition-all",
                                    "placeholder:text-gray-400 placeholder:font-medium",
                                    "focus:border-gray-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-gray-900"
                                )}
                                placeholder="Email address"
                                required
                            />
                        </div>
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className={cn(
                                    "block w-full rounded-[14px] border border-gray-200 bg-gray-50 px-5 py-3.5 text-[15px] text-gray-900 transition-all",
                                    "placeholder:text-gray-400 placeholder:font-medium",
                                    "focus:border-gray-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-gray-900"
                                )}
                                placeholder="Password"
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)} 
                                className="absolute inset-y-0 right-0 flex items-center pr-5 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
                            >
                                {showPassword ? (<EyeOff size={20} />) : (<Eye size={20} />)}
                            </button>
                        </div>
 
                        <button
                            type="submit"
                            className={cn(
                                "mt-8 flex w-full justify-center rounded-[14px] bg-[#D1F53B] px-4 py-4 text-[16px] font-bold text-gray-900 transition-all duration-200 ease-in-out",
                                "hover:bg-[#c2e532] hover:shadow-lg hover:shadow-[#D1F53B]/20",
                                "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-900",
                                "active:scale-[0.98]"
                            )}
                        >
                            Sign in
                        </button>
                    </form>
                </div>
            </div>
            {/* Right Column - Image Placeholder */}
            <div className="hidden lg:block lg:w-1/2 p-4 pl-0">
                <div className="relative h-full w-full overflow-hidden rounded-[32px] bg-gray-100 flex items-center justify-center">
                   {/* Replace with a minimal graphic or leave as a clean gray canvas */}
                   <p className="text-gray-400 font-medium tracking-widest uppercase">Workspace Illustration</p>
                </div>
            </div>
        </div>
    )
}

export default Login