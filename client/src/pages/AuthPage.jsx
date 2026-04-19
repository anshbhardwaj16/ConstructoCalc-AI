import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import api from "../api/client";
import { useAuth } from "../context/AuthContext";

const AuthPage = ({ mode }) => {
  const isSignup = mode === "signup";
  const { handleAuth } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    try {
      const endpoint = isSignup ? "/auth/signup" : "/auth/login";
      const payload = isSignup ? form : { email: form.email, password: form.password };
      const response = await api.post(endpoint, payload);
      handleAuth(response.data);
      navigate(location.state?.from?.pathname || "/");
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Authentication failed");
    }
  };

  return (
    <div className="mx-auto max-w-md rounded-[2rem] border border-white/10 bg-slate-900/80 p-8 shadow-soft">
      <p className="text-sm uppercase tracking-[0.2em] text-orange-300">
        {isSignup ? "Create account" : "Welcome back"}
      </p>
      <h1 className="mt-3 text-4xl font-bold text-white">
        {isSignup ? "Start estimating" : "Login to continue"}
      </h1>
      <form onSubmit={handleSubmit} className="mt-8 space-y-4">
        {isSignup && (
          <input
            name="name"
            placeholder="Full name"
            value={form.name}
            onChange={handleChange}
            className="w-full rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3 text-slate-100 outline-none placeholder:text-slate-500"
          />
        )}
        <input
          name="email"
          type="email"
          placeholder="Email address"
          value={form.email}
          onChange={handleChange}
          className="w-full rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3 text-slate-100 outline-none placeholder:text-slate-500"
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          className="w-full rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3 text-slate-100 outline-none placeholder:text-slate-500"
        />
        {error && <p className="text-sm text-rose-300">{error}</p>}
        <button type="submit" className="w-full rounded-2xl bg-orange-500 px-4 py-3 font-semibold text-white hover:bg-orange-400">
          {isSignup ? "Create account" : "Login"}
        </button>
      </form>
      <p className="mt-5 text-sm text-slate-400">
        {isSignup ? "Already have an account?" : "Need an account?"}{" "}
        <Link className="text-orange-300 hover:text-orange-200" to={isSignup ? "/login" : "/signup"}>
          {isSignup ? "Login" : "Sign up"}
        </Link>
      </p>
    </div>
  );
};

export default AuthPage;
