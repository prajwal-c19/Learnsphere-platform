import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowLeft,
  GraduationCap,
  BookOpen,
  Layout,
  Loader2,
} from "lucide-react";

import { loginUser } from "../../services/authService";

function Login() {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      navigate("/dashboard");
    }
  }, [navigate]);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    if (!email || !password) {
      setErrorMessage("Please enter both email and password.");
      return;
    }

    setIsSubmitting(true);

    try {
      const data = await loginUser(email, password);

      localStorage.setItem("token", data.access_token);

      navigate("/dashboard");
    } catch (err) {
      setErrorMessage("Invalid email or password. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col md:flex-row">
      {/* Left panel — brand / illustration */}
      <div
        className="hidden md:flex md:w-[40%] lg:w-[45%] relative overflow-hidden
          bg-[url('/images/auth-bg.jpg')] bg-cover bg-center"
      >
        {/* Dark purple gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-950/90 via-purple-950/85 to-violet-900/80" />

        {/* Floating decorative icons */}
        <div className="absolute inset-0 pointer-events-none">
          <GraduationCap className="absolute top-[14%] left-[18%] w-10 h-10 text-white/20 animate-fade-in" />
          <BookOpen className="absolute top-[62%] left-[10%] w-8 h-8 text-white/15" />
          <Layout className="absolute top-[40%] right-[14%] w-9 h-9 text-white/15" />
        </div>

        <div className="relative z-10 flex flex-col justify-between w-full p-12 lg:p-16">
          <img src="/logo.svg" alt="LearnSphere" className="h-9 w-auto" />

          <div className="max-w-md">
            <h1 className="text-h1 text-white font-extrabold leading-tight tracking-tight">
              Learn. Grow. Succeed.
            </h1>
            <p className="mt-5 text-body-lg text-white/70 leading-relaxed">
              Master new skills with personalized learning experiences.
            </p>
          </div>

          <p className="text-caption text-white/40">
            &copy; {new Date().getFullYear()} LearnSphere. All rights reserved.
          </p>
        </div>
      </div>

      {/* Right panel — authentication card */}
      <div className="w-full md:w-[60%] lg:w-[55%] flex items-center justify-center px-6 py-12 sm:px-10">
        <div className="glass w-full max-w-[480px] rounded-3xl shadow-2xl backdrop-blur-xl p-8 sm:p-10 animate-fade-up relative">
          <button
            type="button"
            onClick={() => navigate(-1)}
            aria-label="Go back"
            className="w-10 h-10 rounded-full glass-subtle flex items-center justify-center text-muted hover:text-primary transition mb-6"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          {/* Mobile-only logo */}
          <img
            src="/logo.svg"
            alt="LearnSphere"
            className="h-8 w-auto mx-auto mb-8 md:hidden"
          />

          <h2 className="text-h3 font-bold text-center">Welcome back</h2>
          <p className="text-muted text-center mt-2">
            Sign in to continue your learning journey
          </p>

          <form onSubmit={handleLogin} className="mt-8 space-y-5" noValidate>
            <div>
              <label htmlFor="email" className="input-label">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted pointer-events-none" />
                <input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  className="input h-[52px] pl-11"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="input-label">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted pointer-events-none" />
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className="input h-[52px] pl-11 pr-11"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted hover:text-primary transition"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-caption">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded accent-[var(--color-primary)]"
                />
                <span className="text-muted">Remember me</span>
              </label>

              <button
                type="button"
                className="text-primary font-medium hover:underline"
              >
                Forgot password?
              </button>
            </div>

            {errorMessage && (
              <p className="text-caption text-danger bg-red-50 border border-red-200 rounded-lg px-4 py-2.5">
                {errorMessage}
              </p>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="btn btn-primary w-full h-[52px] rounded-full disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Signing in...
                </>
              ) : (
                "Login"
              )}
            </button>
          </form>

          <div className="flex items-center gap-4 my-7">
            <span className="divider" />
            <span className="text-tiny text-muted whitespace-nowrap tracking-wide">
              OR CONTINUE WITH
            </span>
            <span className="divider" />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <button
              type="button"
              className="btn-secondary rounded-xl h-12 flex items-center justify-center"
              aria-label="Continue with Google"
            >
              <img src="/icons/google.svg" alt="" className="w-5 h-5" />
            </button>
            <button
              type="button"
              className="btn-secondary rounded-xl h-12 flex items-center justify-center"
              aria-label="Continue with Microsoft"
            >
              <img src="/icons/microsoft.svg" alt="" className="w-5 h-5" />
            </button>
            <button
              type="button"
              className="btn-secondary rounded-xl h-12 flex items-center justify-center"
              aria-label="Continue with Apple"
            >
              <img src="/icons/apple.svg" alt="" className="w-5 h-5" />
            </button>
          </div>

          <p className="text-center mt-8 text-caption text-muted">
            Don't have an account?
            <Link to="/register" className="text-primary font-semibold ml-1.5 hover:underline">
              Create Account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;