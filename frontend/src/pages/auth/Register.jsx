import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, GraduationCap } from "lucide-react";

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

    const [loading, setLoading] = useState(false);

    const [error, setError] = useState("");

    const handleChange = (e) => {

        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });

    };

    const handleSubmit = async (e) => {

        e.preventDefault();

        setError("");

        if (
            formData.password !== formData.confirmPassword
        ) {

            setError("Passwords do not match.");

            return;

        }

        try {

            setLoading(true);

            await API.post("/auth/register", {
                name: formData.name,
                email: formData.email,
                password: formData.password,
            });

            alert("Registration successful!");

            navigate("/");

        }

        catch (err) {

            setError(
                err.response?.data?.detail ||
                "Registration failed."
            );

        }

        finally {

            setLoading(false);

        }

    };

    return (

        <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-white to-indigo-200 flex items-center justify-center px-4">

            <div className="bg-white shadow-2xl rounded-3xl w-full max-w-md p-10">

                <div className="flex justify-center">

                    <div className="bg-indigo-600 rounded-full p-4">

                        <GraduationCap
                            size={40}
                            className="text-white"
                        />

                    </div>

                </div>

                <h1 className="text-3xl font-bold text-center mt-6">

                    Create Account

                </h1>

                <p className="text-center text-slate-500 mt-2">

                    Join LearnSphere and start learning today.

                </p>

                {error && (

                    <div className="bg-red-100 text-red-700 rounded-lg p-3 mt-5">

                        {error}

                    </div>

                )}

                <form
                    onSubmit={handleSubmit}
                    className="space-y-5 mt-8"
                >

                    <div>

                        <label className="font-medium">

                            Full Name

                        </label>

                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            className="w-full mt-2 border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500"
                        />

                    </div>

                    <div>

                        <label className="font-medium">

                            Email

                        </label>

                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            className="w-full mt-2 border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500"
                        />

                    </div>
                                        <div>

                        <label className="font-medium">

                            Password

                        </label>

                        <div className="relative mt-2">

                            <input
                                type={
                                    showPassword
                                        ? "text"
                                        : "password"
                                }
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                                className="w-full border rounded-xl px-4 py-3 pr-12 outline-none focus:ring-2 focus:ring-indigo-500"
                            />

                            <button
                                type="button"
                                onClick={() =>
                                    setShowPassword(!showPassword)
                                }
                                className="absolute right-4 top-4 text-slate-500"
                            >

                                {
                                    showPassword
                                        ? <EyeOff size={20} />
                                        : <Eye size={20} />
                                }

                            </button>

                        </div>

                    </div>

                    <div>

                        <label className="font-medium">

                            Confirm Password

                        </label>

                        <div className="relative mt-2">

                            <input
                                type={
                                    showConfirmPassword
                                        ? "text"
                                        : "password"
                                }
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                required
                                className="w-full border rounded-xl px-4 py-3 pr-12 outline-none focus:ring-2 focus:ring-indigo-500"
                            />

                            <button
                                type="button"
                                onClick={() =>
                                    setShowConfirmPassword(
                                        !showConfirmPassword
                                    )
                                }
                                className="absolute right-4 top-4 text-slate-500"
                            >

                                {
                                    showConfirmPassword
                                        ? <EyeOff size={20} />
                                        : <Eye size={20} />
                                }

                            </button>

                        </div>

                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-indigo-600 text-white py-3 rounded-xl font-semibold hover:bg-indigo-700 transition disabled:opacity-60"
                    >

                        {
                            loading
                                ? "Creating Account..."
                                : "Create Account"
                        }

                    </button>

                </form>

                <p className="text-center text-slate-600 mt-8">

                    Already have an account?{" "}

                    <Link
                        to="/"
                        className="text-indigo-600 font-semibold hover:underline"
                    >

                        Login

                    </Link>

                </p>

            </div>

        </div>

    );

}

export default Register;