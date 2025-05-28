import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Register() {
    const [form, setForm] = useState({
        username: "",
        email: "",
        password: "",
        first_name: "",
        last_name: ""
    });
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const navigate = useNavigate();

    const handleChange = e => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async e => {
        e.preventDefault();
        setError("");
        setSuccess("");
        try {
            const res = await axios.post("http://localhost:8000/users/register/", form);
            setSuccess("Registration successful! Redirecting to login...");
            setTimeout(() => navigate("/login"), 1500);
        } catch (err) {
            setError(err.response?.data?.username?.[0] || err.response?.data?.email?.[0] || "Registration failed.");
        }
    };

    return (
        <div className="flex items-center justify-center w-full h-full min-h-[calc(100vh-80px)] bg-gradient-to-br from-blue-50 to-blue-200">
            <div className="w-full h-full flex flex-col items-center justify-center">
                <h1 className="text-2xl font-bold text-gray-800 mb-2 text-center">Register</h1>
                <p className="text-gray-500 mb-6 text-center">Create a new account.</p>
                <form className="bg-white rounded-lg shadow-md p-6 w-full max-w-sm flex flex-col gap-6" onSubmit={handleSubmit}>
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
                        <label htmlFor="email" className="block text-gray-700 font-semibold mb-1">Email</label>
                        <input
                            name="email"
                            id="email"
                            type="email"
                            placeholder="Email"
                            value={form.email}
                            onChange={handleChange}
                            className="border border-gray-400 rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white text-gray-900 placeholder-gray-400"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="first_name" className="block text-gray-700 font-semibold mb-1">First Name</label>
                        <input
                            name="first_name"
                            id="first_name"
                            type="text"
                            placeholder="First Name"
                            value={form.first_name}
                            onChange={handleChange}
                            className="border border-gray-400 rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white text-gray-900 placeholder-gray-400"
                        />
                    </div>
                    <div>
                        <label htmlFor="last_name" className="block text-gray-700 font-semibold mb-1">Last Name</label>
                        <input
                            name="last_name"
                            id="last_name"
                            type="text"
                            placeholder="Last Name"
                            value={form.last_name}
                            onChange={handleChange}
                            className="border border-gray-400 rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white text-gray-900 placeholder-gray-400"
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
                    <button type="submit" className="bg-blue-600 text-white rounded py-2 font-semibold hover:bg-blue-700 transition">Register</button>
                    {error && <div className="text-red-500 text-sm">{error}</div>}
                    {success && <div className="text-green-600 text-sm">{success}</div>}
                </form>
            </div>
        </div>
    );
}

export default Register;