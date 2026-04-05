import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      setLoading(true);
      await register(name, email, password);
      navigate("/products");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-[#16213e]">
      <form className="bg-white p-10 rounded-lg w-96 shadow-lg" onSubmit={handleSubmit}>
        <h2 className="mb-5 text-center text-[#16213e] text-2xl font-semibold">Register</h2>
        {error && <p className="text-[#e94560] text-center mb-3 text-sm">{error}</p>}

        <label className="block mb-1 text-sm text-gray-600">Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="w-full px-3 py-2 mb-4 border border-gray-300 rounded text-sm"
        />

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
              : 'bg-[#0f3460] text-white hover:bg-[#0a2647]'
          }`}
        >
          {loading ? "Creating account..." : "Create Account"}
        </button>

        <p className="text-center mt-4 text-sm">
          Already have an account? <Link to="/login" className="text-[#0f3460] font-semibold hover:underline">Login</Link>
        </p>
      </form>
    </div>
  );
}

export default RegisterPage;
