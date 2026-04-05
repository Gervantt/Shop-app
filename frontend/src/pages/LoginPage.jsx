import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      setLoading(true);
      await login(email, password);
      navigate("/products");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-[#1a1a2e]">
      <form className="bg-white p-10 rounded-lg w-96 shadow-lg" onSubmit={handleSubmit}>
        <h2 className="mb-5 text-center text-[#1a1a2e] text-2xl font-semibold">Login</h2>
        {error && <p className="text-[#e94560] text-center mb-3 text-sm">{error}</p>}

        <label className="block mb-1 text-sm text-gray-600">Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full px-3 py-2 mb-4 border border-gray-300 rounded text-sm"
        />

        <label className="block mb-1 text-sm text-gray-600">Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full px-3 py-2 mb-4 border border-gray-300 rounded text-sm"
        />

        <button 
          type="submit" 
          disabled={loading}
          className={`w-full py-3 rounded text-base cursor-pointer transition-colors ${
            loading
              ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
              : 'bg-[#e94560] text-white hover:bg-[#c73652]'
          }`}
        >
          {loading ? "Signing in..." : "Sign In"}
        </button>

        <p className="text-center mt-4 text-sm">
          Don't have an account? <Link to="/register" className="text-[#e94560] font-semibold hover:underline">Register</Link>
        </p>
      </form>
    </div>
  );
}

export default LoginPage;
