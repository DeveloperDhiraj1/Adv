import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { apiFetch } from "../lib/api";

export default function VerifyOtp() {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || "";
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const result = await apiFetch("/auth/verify-otp", {
        method: "POST",
        body: JSON.stringify({ email, otp }),
      });

      setSuccess(result.message || "OTP verified successfully.");
      setTimeout(() => navigate("/login"), 1200);
    } catch (err) {
      setError(err.message || "OTP verification failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-surface px-6 py-16">
      <div className="w-full max-w-md rounded-2xl border border-line bg-card p-8 shadow-card">
        <Link to="/signup" className="text-sm font-medium text-emerald hover:underline">
          ← Back to signup
        </Link>
        <h1 className="mt-6 font-display text-3xl font-bold text-ink">Verify your email</h1>
        <p className="mt-2 text-sm text-muted">
          Enter the 6-digit OTP sent to <span className="font-semibold text-ink">{email || "your email"}</span>.
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <div>
            <label className="text-xs font-semibold uppercase tracking-wide text-muted">OTP</label>
            <input
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              type="text"
              inputMode="numeric"
              maxLength={6}
              required
              placeholder="123456"
              className="mt-2 w-full rounded-xl border border-line px-4 py-3 text-sm focus:border-emerald focus:outline-none"
            />
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}
          {success && <p className="text-sm text-emerald-600">{success}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full bg-emerald px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-light disabled:opacity-70"
          >
            {loading ? "Verifying..." : "Verify OTP"}
          </button>
        </form>
      </div>
    </div>
  );
}
