import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import toast from "react-hot-toast";
import loginImage from "../assets/login-image.png";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!username || !password) {
      toast.error("Please enter username and password");
      return;
    }

    try {
      setLoading(true);
      const res = await api.post("/auth/login", { username, password });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", res.data.role);

      toast.success("Welcome back 👋");
      navigate("/home");
    } catch {
      toast.error("Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
<div className="min-h-screen bg-gradient-to-b from-gray-100 to-gray-50 flex items-center justify-center px-4">

      {/* MAIN CARD */}
      <div className="w-full max-w-5xl rounded-3xl shadow-2xl overflow-hidden grid grid-cols-1 md:grid-cols-2">
        
        {/* LEFT – FORM (Card now has blue gradient) */}
        <div className="bg-gradient-to-br from-blue-400 via-sky-300 to-blue-100 p-12 lg:p-14 flex flex-col justify-center">
          <div className="max-w-md mx-auto space-y-6">
            
            {/* Header */}
            <div>
              <h1 className="text-2xl font-semibold text-slate-900">
                Login to your account
              </h1>
              <p className="text-sm text-slate-700 mt-2">
                Welcome back! Please enter your details.
              </p>
            </div>

            {/* Username */}
            <div>
              <label className="text-sm text-slate-700">Username</label>
              <input
                className="mt-2 w-full rounded-full border border-blue-300 bg-white text-slate-900 placeholder-slate-400 px-5 py-3.5 focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="Enter username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>

            {/* Password */}
            <div>
              <label className="text-sm text-slate-700">Password</label>
              <input
                type="password"
                className="mt-2 w-full rounded-full border border-blue-300 bg-white text-slate-900 placeholder-slate-400 px-5 py-3.5 focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            {/* Button */}
            <button
              onClick={handleLogin}
              disabled={loading}
              className={`w-full rounded-full py-3.5 font-medium text-white transition ${
                loading
                  ? "bg-blue-300 cursor-not-allowed"
                  : "bg-slate-900 hover:bg-slate-800"
              }`}
            >
              {loading ? "Signing in..." : "Submit"}
            </button>

          </div>
        </div>

        {/* RIGHT – IMAGE */}
        <div className="hidden md:block bg-white">
          <img
            src={loginImage}
            alt="Login illustration"
            className="w-full h-full object-cover"
          />
        </div>

      </div>
    </div>
  );
}
