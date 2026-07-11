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
                <div className="logo flex items-center gap-2 absolute top-5 left-5">
                    <CalendarClock style={{ color: "#105EF5"}}/>
                    <h1 className="font-bold text-2xl">Plan-It</h1>
                </div>
                <div className="mx-auto w-full max-w-md">
                    <div className="mb-10">
                        <h2 className="text-4xl font-bold tracking-tight text-[#0E1013] mb-2">
                            Welcome Back
                        </h2>
                        <p className="text-[15px] text-gray-500">
                            Sign in to continue
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
                                    "block w-full rounded-[14px] border border-gray-300 bg-transparent px-5 py-3 text-[15px] text-[#0E1013] transition-all",
                                    "placeholder:text-gray-400 placeholder:font-medium",
                                    "focus:border-[#105Ef5] focus:outline-none focus:ring-1 focus:ring-[#105Ef5]"
                                )}
                                placeholder="Email"
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
                                    "block w-full rounded-[14px] border border-gray-300 bg-transparent px-5 py-3 text-[15px] text-[#0E1013] transition-all",
                                    "placeholder:text-gray-400 placeholder:font-medium",
                                    "focus:border-[#105Ef5] focus:outline-none focus:ring-1 focus:ring-[#105Ef5]"
                                )}
                                placeholder="Password"
                                required
                            />
                            {/* Dummy eye icon placeholder - can be replaced with an actual lucide-react icon if you want to implement show/hide */}
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)} 
                                className="absolute inset-y-0 right-0 flex items-center pr-5 text-gray-400 cursor-pointer"
                            >
                                {showPassword ? (<EyeOff size={20} />) : (<Eye size={20} />)}
                            </button>
                        </div>
 
                        <button
                            type="submit"
                            className={cn(
                                "mt-6 flex w-full justify-center rounded-[14px] bg-[#105Ef5] px-4 py-4 text-[16px] font-semibold text-white transition-all duration-200 ease-in-out",
                                "hover:bg-[#105Ef5]/90 hover:shadow-lg hover:shadow-[#105Ef5]/20",
                                "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#105Ef5]",
                                "active:scale-[0.98]"
                            )}
                        >
                            Sign in
                        </button>
                    </form>
                </div>
            </div>

            {/* Right Column - Image */}
            <div className="hidden lg:block lg:w-1/2 p-4 pl-0">
                <div className="relative h-full w-full overflow-hidden rounded-[32px]">
                    <img 
                        src="https://images.unsplash.com/photo-1579267217516-b73084bd79a6?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" 
                        alt="Productivity dashboard" 
                        className="absolute inset-0 h-full w-full object-cover"
                    />
                </div>
            </div>
        </div>
    )
}

export default Login