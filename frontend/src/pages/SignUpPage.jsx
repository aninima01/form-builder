import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, User, Eye, EyeOff, Loader, Sparkles } from "lucide-react";
import toast from "react-hot-toast";

import useSignup from "../hooks/useSignUp.js";
import useAuthUser from "../hooks/useAuthUser.js";

const SignupPage = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);

  const { signupMutation, isPending } = useSignup();
  const { isLoading, authUser } = useAuthUser();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && authUser) {
      navigate("/dashboard");
    }
  }, [authUser, isLoading, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // validation checks
    if (!formData.fullName.trim()) {
      toast.error("Full name is required");
      return;
    }

    if (!formData.email.trim()) {
      toast.error("Email is required");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error("Invalid email format");
      return;
    }

    if (formData.password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    signupMutation(formData);
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center px-4 relative overflow-hidden ">
      <div className="absolute inset-0 bg-gradient-to-br from-neutral-950 via-neutral-900 to-black"></div>
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgb(71 85 105 / 0.4) 1px, transparent 0)`,
          backgroundSize: "40px 40px",
        }}
      ></div>
      <div className="absolute top-20 right-20 w-96 h-96 bg-white/5 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-20 left-20 w-80 h-80 bg-white/5 rounded-full blur-3xl animate-pulse delay-1000"></div>

      <div className="max-w-md w-full relative z-10">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 mt-5 bg-white rounded-2xl mb-4 shadow-lg shadow-white/10">
            <Sparkles className="w-7 h-7 text-black" />
          </div>
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">
            Create Account
          </h1>
          <p className="text-white/60">Join us to create amazing forms</p>
        </div>

        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label
                htmlFor="fullName"
                className="block text-sm font-medium text-white/80 mb-2"
              >
                Full Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-white/40" />
                </div>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  className="block w-full pl-10 pr-3 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:ring-2 focus:ring-white/20 focus:border-transparent transition"
                  placeholder="Your Full Name"
                  disabled={isPending}
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-white/80 mb-2"
              >
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-white/40" />
                </div>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="block w-full pl-10 pr-3 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:ring-2 focus:ring-white/20 focus:border-transparent transition"
                  placeholder="you@example.com"
                  disabled={isPending}
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-white/80 mb-2"
              >
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-white/40" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="block w-full pl-10 pr-10 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:ring-2 focus:ring-white/20 focus:border-transparent transition"
                  placeholder="••••••••"
                  disabled={isPending}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  disabled={isPending}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-white/40 hover:text-white/60 transition" />
                  ) : (
                    <Eye className="h-5 w-5 text-white/40 hover:text-white/60 transition" />
                  )}
                </button>
              </div>
              <p className="mt-2 text-xs text-white/40">
                Must be at least 6 characters
              </p>
            </div>

            <button
              type="submit"
              disabled={isPending}
              className="w-full bg-white text-black py-3 px-4 rounded-xl font-semibold hover:bg-white/90 focus:outline-none focus:ring-2 focus:ring-white/20 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center shadow-lg shadow-white/10"
            >
              {isPending ? (
                <>
                  <Loader className="animate-spin h-5 w-5 mr-2" />
                  Creating Account...
                </>
              ) : (
                "Create Account"
              )}
            </button>
          </form>

          <div className="mt-8">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/10"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-3 bg-transparent text-white/60">
                  Already have an account?
                </span>
              </div>
            </div>
          </div>

          <div className="mt-6 text-center">
            <Link
              to="/login"
              className="text-white hover:text-white/80 font-medium text-sm transition"
            >
              Sign in instead →
            </Link>
          </div>
        </div>

        <p className="text-center text-sm text-white/40 mt-6 mb-5">
          By signing up, you agree to our{" "}
          <a href="#" className="text-white/60 hover:text-white/80 transition">
            Terms
          </a>{" "}
          and{" "}
          <a href="#" className="text-white/60 hover:text-white/80 transition">
            Privacy Policy
          </a>
        </p>
      </div>
    </div>
  );
};

export default SignupPage;
