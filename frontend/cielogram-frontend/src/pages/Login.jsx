import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Login() {
    const [form, setForm] = useState({ username: "", password: "" });
    const [error, setError] = useState("");
    const navigate = useNavigate();
    const { login: loginContext } = useAuth();

    const handleChange = e => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async e => {
        e.preventDefault();
        setError("");
        try {
            const res = await axios.post("http://localhost:8000/api/token/", form);
            loginContext(res.data.access, res.data.refresh); // Actualiza el usuario en el contexto
            navigate("/");
        } catch (err) {
            setError("Invalid credentials.");
        }
    };

    return (
        <div className="flex items-center justify-center w-full h-full min-h-[calc(100vh-80px)] bg-gradient-to-br from-blue-50 to-blue-200">
            <div className="w-full h-full flex flex-col items-center justify-center">
                <h1 className="text-4xl font-bold text-gray-800 mb-2 text-center">Login</h1>
                <p className="text-gray-500 mb-6 text-center">Access your account.</p>
                <form className="bg-white rounded-lg shadow-md p-10 w-full max-w-xl flex flex-col gap-6" onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor="username" className="block text-gray-700 font-semibold mb-1">Username</label>
                        <input
                            name="username"
                            id="username"
                            type="text"
                            placeholder="Username"
                            value={form.username}
                            onChange={handleChange}
                            className="border border-gray-400 rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white text-gray-900 placeholder-gray-400"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="password" className="block text-gray-700 font-semibold mb-1">Password</label>
                        <input
                            name="password"
                            id="password"
                            type="password"
                            placeholder="Password"
                            value={form.password}
                            onChange={handleChange}
                            className="border border-gray-400 rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white text-gray-900 placeholder-gray-400"
                            required
                        />
                    </div>
                    <button type="submit" className="bg-blue-600 text-white rounded py-2 font-semibold hover:bg-blue-700 transition">Login</button>
                    {error && <div className="text-red-500 text-sm">{error}</div>}
                </form>
            </div>
        </div>
    );
}

export default Login;