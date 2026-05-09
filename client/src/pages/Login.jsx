import { useForm } from "react-hook-form";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import { useState, useRef } from "react";
import { Eye, EyeOff, Mail, Lock, Loader2 } from "lucide-react";
import axiosInstance from "../api/axiosInstance";

function Login() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const emailRef = useRef(null);
    const passwordRef = useRef(null);
    const submitBtnRef = useRef(null);

    const { register, handleSubmit, formState: { errors } } = useForm({
        mode: "onChange"
    });

    const handleKeyDown = (e, nextRef, prevRef) => {
        if (e.key === "Enter" || e.key === "ArrowDown") {
            if (nextRef) {
                e.preventDefault();
                nextRef.current?.focus();
            }
        } else if (e.key === "ArrowUp") {
            if (prevRef) {
                e.preventDefault();
                prevRef.current?.focus();
            }
        }
    };

    const onSubmit = async (data) => {
        try {
            setLoading(true);
            const res = await axiosInstance.post("/auth/login", data);
            localStorage.setItem("token", res.data.token);
            localStorage.setItem("userId", res.data._id);

            localStorage.setItem("user", JSON.stringify({
                _id: res.data._id,
                name: res.data.name,
                username: res.data.username,
                profilePic: res.data.profilePic
            }));

            toast.success("Welcome back! 👋");
            navigate("/feed");
        } catch (err) {
            toast.error(err.response?.data?.message || "Login failed. Check your credentials.");
        } finally {
            setLoading(false);
        }
    };

    const { ref: emailReg, ...emailFields } = register("email", {
        required: "Email is required",
        pattern: { value: /^\S+@\S+\.\S+$/, message: "Invalid email address" }
    });
    const { ref: passReg, ...passFields } = register("password", {
        required: "Password is required"
    });

    return (
        /* 1. Full Page Gradient Background */
        <div className="min-h-screen w-full flex items-center justify-center p-4 bg-[linear-gradient(135deg,#3b82f6_0%,#6366f1_5%,#8b5cf6_20%,#d946ef_65%)]">

            {/* Optional: Add the subtle dot pattern from 'Option 1' earlier across the whole page */}
            <div
                className="absolute inset-0 opacity-10 pointer-events-none"
                style={{
                    backgroundImage: `radial-gradient(#ffffff 0.5px, transparent 0.5px)`,
                    backgroundSize: '30px 30px'
                }}
            ></div>

            {/* 2. Centralized Glass Card - INCREASED PADDING (py-16) AND SPACING (space-y-8) */}
            <div className="relative z-10 w-full max-w-md bg-white/95 backdrop-blur-sm px-8 py-20 sm:px-10 rounded-3xl shadow-2xl">

                <div className="text-center mb-10">
                    <h2 className="text-3xl font-extrabold text-gray-900">Welcome Back</h2>
                    <p className="text-gray-500 mt-2">Enter your details to sign in</p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">

                    {/* Email Field */}
                    <div className="space-y-1">
                        <label className="block text-sm font-semibold text-gray-700 ml-1">Email Address</label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
                            <input
                                {...emailFields}
                                placeholder="john@example.com"
                                onKeyDown={(e) => handleKeyDown(e, passwordRef, null)}
                                ref={(e) => { emailReg(e); emailRef.current = e; }}
                                className={`w-full pl-10 pr-4 py-3 bg-gray-50 border rounded-xl outline-none transition-all ${errors.email ? 'border-red-500' : 'border-gray-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100'}`}
                            />
                        </div>
                        {errors.email && <span className="text-red-500 text-xs mt-1 ml-1">{errors.email.message}</span>}
                    </div>

                    {/* Password Field */}
                    <div className="space-y-1">
                        <div className="flex justify-between items-center">
                            <label className="block text-sm font-semibold text-gray-700 ml-1">Password</label>
                            <Link to="/forgot-password" size="sm" className="text-xs text-indigo-600 font-medium hover:underline">Forgot Password?</Link>
                        </div>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
                            <input
                                type={showPassword ? "text" : "password"}
                                {...passFields}
                                placeholder="••••••••"
                                onKeyDown={(e) => handleKeyDown(e, submitBtnRef, emailRef)}
                                ref={(e) => { passReg(e); passwordRef.current = e; }}
                                className={`w-full pl-10 pr-12 py-3 bg-gray-50 border rounded-xl outline-none transition-all ${errors.password ? 'border-red-500' : 'border-gray-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100'}`}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-indigo-600"
                            >
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                        {errors.password && <span className="text-red-500 text-xs mt-1 ml-1">{errors.password.message}</span>}
                    </div>

                    {/* Submit Button */}
                    <button
                        ref={submitBtnRef}
                        type="submit"
                        onKeyDown={(e) => handleKeyDown(e, null, passwordRef)}
                        disabled={loading}
                        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3.5 rounded-xl shadow-lg active:scale-95 flex items-center justify-center disabled:opacity-70 transition-all cursor-pointer mt-6"
                    >
                        {loading ? <Loader2 className="animate-spin mr-2" /> : "Sign In"}
                    </button>

                    <p className="text-center text-gray-600 text-sm mt-8">
                        Don't have an account?{" "}
                        <Link to="/register" className="text-indigo-600 font-bold hover:underline">Create one</Link>
                    </p>
                </form>
            </div>
        </div>
    );
}

export default Login;