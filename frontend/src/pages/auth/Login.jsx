import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";

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

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const data = await loginUser(email, password);

      localStorage.setItem("token", data.access_token);

      navigate("/dashboard");
    } catch (err) {
      alert("Invalid email or password");
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center">
      <div className="bg-white rounded-2xl shadow-xl p-10 w-[420px]">
        <h1 className="text-3xl font-bold text-center">
          LearnSphere
        </h1>

        <p className="text-slate-500 text-center mt-2">
          Sign in to continue learning
        </p>

        <form onSubmit={handleLogin} className="space-y-5 mt-8">
          <input
            type="email"
            placeholder="Email"
            className="w-full border rounded-xl p-3"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full border rounded-xl p-3"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button className="w-full bg-indigo-600 text-white rounded-xl p-3 hover:bg-indigo-700 transition">
            Login
          </button>
        </form>

        <p className="text-center mt-6">
          Don't have an account?

          <Link
            to="/register"
            className="text-indigo-600 ml-2"
          >
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
