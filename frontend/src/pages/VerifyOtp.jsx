import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { apiFetch } from "../lib/api";
import { firebaseAuth } from "../lib/firebase";
import { reload, sendEmailVerification } from "firebase/auth";

export default function VerifyOtp() {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || "";
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const firebaseUser = firebaseAuth.currentUser;
      if (!firebaseUser) {
        throw new Error("Please open this page in the same browser used for signup.");
      }

      await reload(firebaseUser);
      if (!firebaseUser.emailVerified) {
        throw new Error("Please click the verification link in your email first.");
      }

      const firebaseIdToken = await firebaseUser.getIdToken(true);
      const result = await apiFetch("/auth/verify-firebase-email", {
        method: "POST",
        headers: { Authorization: `Bearer ${firebaseIdToken}` },
      });

      setSuccess(result.message || "OTP verified successfully.");
      setTimeout(() => navigate("/login"), 1200);
    } catch (err) {
      setError(err.message || "OTP verification failed");
    } finally {
      setLoading(false);
    }
  };

  const resendVerificationEmail = async () => {
    setError("");
    try {
      if (!firebaseAuth.currentUser) throw new Error("Signup session not found.");
      await sendEmailVerification(firebaseAuth.currentUser);
      setSuccess("Verification email sent again.");
    } catch (err) {
      setError(err.message || "Unable to resend verification email");
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
          We sent a verification link to <span className="font-semibold text-ink">{email || "your email"}</span>. Open it, then return here.
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          {error && <p className="text-sm text-red-600">{error}</p>}
          {success && <p className="text-sm text-emerald-600">{success}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full bg-emerald px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-light disabled:opacity-70"
          >
            {loading ? "Checking..." : "I have verified my email"}
          </button>
          <button type="button" onClick={resendVerificationEmail} className="w-full text-sm font-semibold text-emerald hover:underline">
            Resend verification email
          </button>
        </form>
      </div>
    </div>
  );
}
