import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import { HiOutlineEnvelope, HiOutlineLockClosed } from "react-icons/hi2";
import Button from "../components/Button";
import { loginSideImage } from "../assets/images";
import { apiFetch } from "../lib/api";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const result = await apiFetch("/auth/login", {
        method: "POST",
        body: JSON.stringify(form),
      });

      if (result.token) {
        localStorage.setItem("token", result.token);
        localStorage.setItem("userRole", result.role || "USER");
        localStorage.setItem("userId", result.userId);
        localStorage.setItem("userName", result.userName);
        localStorage.setItem("userEmail", result.email);
      }

      if (result.role === "ADMIN") {
        navigate("/admin");
      } else if (result.role === "EXPERT") {
        navigate("/expert-dashboard");
      } else {
        navigate("/dashboard");
      }
    } catch (err) {
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid min-h-screen grid-cols-1 lg:grid-cols-2">
      <div className="relative hidden bg-navy lg:block">
        <img src={loginSideImage} alt="" className="absolute inset-0 h-full w-full object-cover opacity-40" />
        <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/70 to-navy/40" />
        <div className="relative flex h-full flex-col justify-between p-12">
          <Link to="/" className="font-display text-xl font-bold text-white">
            Advisory
          </Link>
          <div className="max-w-md">
            <p className="font-display text-3xl font-bold leading-tight text-white">
              Real Experts. Real Sessions. Real Growth.
            </p>
            <p className="mt-4 text-white/70">
              Connect with verified professionals and get personalized advice
              for the decisions that matter most.
            </p>
          </div>
          <p className="text-xs text-white/40">© 2026 Advisory Group. All rights reserved.</p>
        </div>
      </div>

      <div className="flex items-center justify-center px-6 py-16">
        <div className="w-full max-w-sm">
          <Link to="/" className="font-display text-xl font-bold text-ink lg:hidden">
            Advisory
          </Link>
          <h1 className="mt-6 font-display text-3xl font-bold text-ink">Welcome back</h1>
          <p className="mt-2 text-sm text-muted">Log in to manage your bookings and sessions.</p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-4">
            <div>
              <label className="text-xs font-semibold uppercase tracking-wide text-muted">Email</label>
              <div className="mt-2 flex items-center gap-2 rounded-xl border border-line px-4 py-3 focus-within:border-emerald">
                <HiOutlineEnvelope className="h-5 w-5 text-muted" />
                <input name="email" type="email" required value={form.email} onChange={handleChange} placeholder="you@example.com" className="w-full bg-transparent text-sm focus:outline-none" />
              </div>
            </div>
            <div>
              <label className="text-xs font-semibold uppercase tracking-wide text-muted">Password</label>
              <div className="mt-2 flex items-center gap-2 rounded-xl border border-line px-4 py-3 focus-within:border-emerald">
                <HiOutlineLockClosed className="h-5 w-5 text-muted" />
                <input name="password" type="password" required value={form.password} onChange={handleChange} placeholder="••••••••" className="w-full bg-transparent text-sm focus:outline-none" />
              </div>
            </div>

            {error && (
              <p className="text-sm text-red-600">{error}</p>
            )}

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 text-muted">
                <input type="checkbox" className="h-4 w-4 accent-emerald" />
                Remember me
              </label>
              <Link to="/forgot-password" className="font-medium text-emerald hover:underline">
                Forgot password?
              </Link>
            </div>

            <Button type="submit" variant="accent" size="lg" className="w-full" disabled={loading}>
              {loading ? "Logging in..." : "Login"}
            </Button>
          </form>

          <div className="my-6 flex items-center gap-3">
            <div className="h-px flex-1 bg-line" />
            <span className="text-xs text-muted">or</span>
            <div className="h-px flex-1 bg-line" />
          </div>

          <button className="flex w-full items-center justify-center gap-3 rounded-full border border-line py-3 text-sm font-semibold text-ink hover:bg-ink/5">
            <FcGoogle className="h-5 w-5" />
            Continue with Google
          </button>

          <p className="mt-8 text-center text-sm text-muted">
            Don't have an account?{" "}
            <Link to="/signup" className="font-semibold text-emerald hover:underline">
              Create Account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
