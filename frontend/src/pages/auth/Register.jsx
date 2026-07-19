import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowLeft,
  GraduationCap,
  Layout,
  Loader2,
} from "lucide-react";

import API from "../../api/axios";

function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (!acceptTerms) {
      setError("Please accept the Terms & Conditions to continue.");
      return;
    }

    try {
      setLoading(true);

      await API.post("/auth/register", {
        name: formData.name,
        email: formData.email,
        password: formData.password,
      });

      setSuccess(true);

      setTimeout(() => {
        navigate("/");
      }, 1200);
    } catch (err) {
      setError(err.response?.data?.detail || "Registration failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col md:flex-row">
      {/* Left panel — brand / illustration (same as Login) */}
      <div
        className="hidden md:flex md:w-[40%] lg:w-[45%] relative overflow-hidden
          bg-[url('/images/auth-bg.jpg')] bg-cover bg-center"
      >
        {/* Dark purple gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-950/90 via-purple-950/85 to-violet-900/80" />

        {/* Floating decorative icons */}
        <div className="absolute inset-0 pointer-events-none">
          <GraduationCap className="absolute top-[14%] left-[18%] w-10 h-10 text-white/20 animate-fade-in" />
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

      {/* Right panel — registration card */}
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

          <h2 className="text-h3 font-bold text-center">Create your account</h2>
          <p className="text-muted text-center mt-2">
            Join LearnSphere and start learning today
          </p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-5" noValidate>
            <div>
              <label htmlFor="name" className="input-label">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted pointer-events-none" />
                <input
                  id="name"
                  type="text"
                  name="name"
                  placeholder="Jane Doe"
                  className="input h-[52px] pl-11"
                  value={formData.name}
                  onChange={handleChange}
                  autoComplete="name"
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="input-label">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted pointer-events-none" />
                <input
                  id="email"
                  type="email"
                  name="email"
                  placeholder="you@example.com"
                  className="input h-[52px] pl-11"
                  value={formData.email}
                  onChange={handleChange}
                  autoComplete="email"
                  required
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
                  name="password"
                  placeholder="••••••••"
                  className="input h-[52px] pl-11 pr-11"
                  value={formData.password}
                  onChange={handleChange}
                  autoComplete="new-password"
                  required
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

            <div>
              <label htmlFor="confirmPassword" className="input-label">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted pointer-events-none" />
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  placeholder="••••••••"
                  className="input h-[52px] pl-11 pr-11"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  autoComplete="new-password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword((prev) => !prev)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted hover:text-primary transition"
                  aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            <label className="flex items-start gap-2.5 cursor-pointer select-none text-caption">
              <input
                type="checkbox"
                checked={acceptTerms}
                onChange={(e) => setAcceptTerms(e.target.checked)}
                className="w-4 h-4 mt-0.5 rounded accent-[var(--color-primary)]"
              />
              <span className="text-muted">
                I agree to the{" "}
                <span className="text-primary font-medium">Terms &amp; Conditions</span>{" "}
                and{" "}
                <span className="text-primary font-medium">Privacy Policy</span>
              </span>
            </label>

            {error && (
              <p className="text-caption text-danger bg-red-50 border border-red-200 rounded-lg px-4 py-2.5">
                {error}
              </p>
            )}

            {success && (
              <p className="text-caption text-success bg-green-50 border border-green-200 rounded-lg px-4 py-2.5">
                Account created! Redirecting you to sign in...
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary w-full h-[52px] rounded-full disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Creating Account...
                </>
              ) : (
                "Create Account"
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
            Already have an account?
            <Link to="/" className="text-primary font-semibold ml-1.5 hover:underline">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Register;