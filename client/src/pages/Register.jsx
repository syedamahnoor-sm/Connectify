import { useForm } from "react-hook-form";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import { useState, useRef } from "react";
import { Eye, EyeOff, User, Mail, Lock, Loader2, Check, X } from "lucide-react";
import axiosInstance from "../api/axiosInstance";

function Register() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const nameRef = useRef(null);
    const emailRef = useRef(null);
    const passwordRef = useRef(null);
    const submitBtnRef = useRef(null);

    const { register, handleSubmit, watch, formState: { errors } } = useForm({
        mode: "onChange"
    });

    const passwordValue = watch("password", "");

    const requirements = [
        { label: "6+ characters", met: passwordValue.length >= 6 },
        { label: "1 uppercase letter", met: /[A-Z]/.test(passwordValue) },
        { label: "1 number", met: /[0-9]/.test(passwordValue) },
        { label: "1 special character (@$!%*?&)", met: /[!@#$%^&*(),.?":{}|<>]/.test(passwordValue) },
    ];

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
            const res = await axiosInstance.post("/auth/register", data)
            localStorage.setItem("token", res.data.token);
            toast.success("Welcome! 🎉");
            navigate("/feed");
        } catch (err) {
            toast.error(err.response?.data?.message || "Registration failed");
        } finally {
            setLoading(false);
        }
    };

    const { ref: nameReg, ...nameFields } = register("name", { required: "Name is required" });
    const { ref: emailReg, ...emailFields } = register("email", {
        required: "Email is required",
        pattern: { value: /^\S+@\S+\.\S+$/, message: "Invalid email" }
    });
    const { ref: passReg, ...passFields } = register("password", { required: "Password required" });

    return (
        <div className="flex flex-col lg:flex-row min-h-screen bg-white">

            {/* Left Side: Hero (Hidden on mobile/tablet, shown on large screens) */}
            <div className="hidden lg:flex lg:w-1/2 bg-linear-to-br from-indigo-600 via-purple-600 to-pink-500 items-center justify-center p-12 sticky top-0 h-screen">
                <div className="max-w-md text-white">
                    <h1 className="text-4xl xl:text-5xl font-bold mb-6">Connect with the world.</h1>
                    <p className="text-lg text-indigo-100">
                        Join a growing community where ideas, conversations, and connections come to life.
                    </p>
                    <div className="mt-10 flex -space-x-2">
                        {[1, 2, 3, 4].map((i) => (
                            <img key={i} className="w-10 h-10 rounded-full border-2 border-white" src={`https://i.pravatar.cc/150?img=${i + 10}`} alt="user" />
                        ))}
                    </div>
                </div>
            </div>

            {/* Right Side: Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-4 sm:p-8 lg:p-12 bg-gray-50 min-h-screen">
                <div className="w-full max-w-md">
                    <div className="text-center mb-6 sm:mb-10">
                        <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900">Create Account</h2>
                        <p className="text-gray-500 mt-2 text-sm sm:text-base">Start your journey today</p>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 sm:space-y-5">

                        {/* Name */}
                        <div className="space-y-1">
                            <label className="block text-sm font-medium text-gray-700 ml-1">Full Name</label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
                                <input
                                    {...nameFields}
                                    placeholder="e.g. John Doe"
                                    onKeyDown={(e) => handleKeyDown(e, emailRef, null)}
                                    ref={(e) => { nameReg(e); nameRef.current = e; }}
                                    className={`w-full pl-10 pr-4 py-2.5 sm:py-3 bg-white border rounded-xl outline-none transition-all ${errors.name ? 'border-red-500' : 'border-gray-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100'}`}
                                />
                            </div>
                            {errors.name && <span className="text-red-500 text-xs mt-1">{errors.name.message}</span>}
                        </div>

                        {/* Email */}
                        <div className="space-y-1">
                            <label className="block text-sm font-medium text-gray-700 ml-1">Email Address</label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
                                <input
                                    {...emailFields}
                                    placeholder="john@example.com"
                                    onKeyDown={(e) => handleKeyDown(e, passwordRef, nameRef)}
                                    ref={(e) => { emailReg(e); emailRef.current = e; }}
                                    className={`w-full pl-10 pr-4 py-2.5 sm:py-3 bg-white border rounded-xl outline-none transition-all ${errors.email ? 'border-red-500' : 'border-gray-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100'}`}
                                />
                            </div>
                            {errors.email && <span className="text-red-500 text-xs mt-1">{errors.email.message}</span>}
                        </div>

                        {/* Password */}
                        <div className="space-y-1">
                            <label className="block text-sm font-medium text-gray-700 ml-1">Password</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
                                <input
                                    type={showPassword ? "text" : "password"}
                                    {...passFields}
                                    placeholder="••••••••"
                                    onKeyDown={(e) => handleKeyDown(e, submitBtnRef, emailRef)}
                                    ref={(e) => { passReg(e); passwordRef.current = e; }}
                                    className={`w-full pl-10 pr-12 py-2.5 sm:py-3 bg-white border rounded-xl outline-none transition-all ${errors.password ? 'border-red-500' : 'border-gray-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100'}`}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-indigo-600"
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>

                        {/* Password Checklist */}
                        <div className="bg-white border border-gray-100 rounded-xl p-3 space-y-2 shadow-sm">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-2 gap-y-1">
                                {requirements.map((req, index) => (
                                    <div key={index} className="flex items-center gap-2">
                                        {req.met ? <Check className="h-3.5 w-3.5 text-green-500" /> : <X className={`h-3.5 w-3.5 ${passwordValue.length > 0 ? "text-red-500" : "text-gray-300"}`} />}
                                        <span className={`text-[10px] sm:text-xs ${req.met ? "text-green-600 font-medium" : "text-gray-500"}`}>{req.label}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <button
                            ref={submitBtnRef}
                            type="submit"
                            onKeyDown={(e) => handleKeyDown(e, null, passwordRef)}
                            disabled={loading}
                            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-xl shadow-lg active:scale-95 flex items-center justify-center disabled:opacity-70 transition-all text-sm sm:text-base"
                        >
                            {loading ? <Loader2 className="animate-spin mr-2" /> : "Create Account"}
                        </button>

                        <p className="text-center text-gray-600 text-xs sm:text-sm mt-4">
                            Already have an account?{" "}
                            <Link to="/login" className="text-indigo-600 font-semibold hover:underline">Sign in</Link>
                        </p>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default Register;