import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import { HiOutlineUser, HiOutlineBriefcase, HiOutlineEye, HiOutlineEyeSlash } from "react-icons/hi2";
import Button from "../components/Button";
import { signupSideImage } from "../assets/images";
import { apiFetch } from "../lib/api";
import { firebaseAuth } from "../lib/firebase";
import { createUserWithEmailAndPassword, sendEmailVerification, GoogleAuthProvider, getRedirectResult, signInWithRedirect } from "firebase/auth";

export default function Signup() {
  const [type, setType] = useState("advice");
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    role: "USER",
  });
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();
  const googleSignupHandled = useRef(false);
  const passwordRules = [
    { label: "8+ characters", valid: form.password.length >= 8 },
    { label: "Uppercase letter", valid: /[A-Z]/.test(form.password) },
    { label: "Lowercase letter", valid: /[a-z]/.test(form.password) },
    { label: "Number or symbol", valid: /[0-9\W]/.test(form.password) },
  ];
  const passwordScore = passwordRules.filter((rule) => rule.valid).length;
  const strengthLabel = passwordScore <= 1 ? "Weak" : passwordScore <= 3 ? "Getting stronger" : "Strong";
  const strengthColor = passwordScore <= 1 ? "bg-red-500" : passwordScore <= 3 ? "bg-amber-500" : "bg-emerald";

  const finishGoogleSignup = async (credential) => {
    const result = await apiFetch("/auth/firebase-login", {
      method: "POST",
      body: JSON.stringify({
        firebaseIdToken: await credential.user.getIdToken(),
        role: localStorage.getItem("pendingGoogleRole") || "USER",
      }),
    });
    localStorage.removeItem("pendingGoogleRole");
    localStorage.setItem("token", result.token);
    localStorage.setItem("userRole", result.role || "USER");
    localStorage.setItem("userId", result.userId);
    localStorage.setItem("userName", result.userName);
    localStorage.setItem("userEmail", result.email);
    navigate(result.role === "EXPERT" ? "/expert-dashboard" : "/dashboard");
  };

  useEffect(() => {
    const complete = async (user) => {
      if (!user || googleSignupHandled.current || !user.providerData.some(({ providerId }) => providerId === "google.com")) return;
      googleSignupHandled.current = true;
      try {
        await finishGoogleSignup({ user });
      } catch (err) {
        setError(err.message || "Google sign-up failed");
      }
    };

    const unsubscribe = firebaseAuth.onAuthStateChanged(complete);
    getRedirectResult(firebaseAuth).then((credential) => credential && complete(credential.user)).catch((err) => setError(err.message || "Google sign-up failed"));
    return unsubscribe;
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    if (form.password !== confirmPassword) {
      setError("Passwords do not match.");
      setLoading(false);
      return;
    }

    if (passwordScore < 4) {
      setError("Please create a stronger password using all the requirements below.");
      setLoading(false);
      return;
    }

    try {
      const payload = {
        ...form,
        role: type === "expert" ? "EXPERT" : "USER",
      };

      const firebaseCredential = await createUserWithEmailAndPassword(
        firebaseAuth,
        form.email,
        form.password,
      );
      await sendEmailVerification(firebaseCredential.user);
      const firebaseIdToken = await firebaseCredential.user.getIdToken();

      const result = await apiFetch("/auth/signup", {
        method: "POST",
        headers: { Authorization: `Bearer ${firebaseIdToken}` },
        body: JSON.stringify({
          ...payload,
          firebaseUid: firebaseCredential.user.uid,
          firebaseIdToken,
        }),
      });

      setSuccess(result.message || "Account created successfully.");
      navigate("/verify-otp", { state: { email: form.email } });
    } catch (err) {
      const message = err.code === "auth/email-already-in-use"
        ? "This email is already registered. Please log in."
        : err.message || "Signup failed";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    setLoading(true);
    setError("");
    try {
      localStorage.setItem("pendingGoogleRole", type === "expert" ? "EXPERT" : "USER");
      await signInWithRedirect(firebaseAuth, new GoogleAuthProvider());
    } catch (err) {
      setError(err.message || "Google sign-up failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid min-h-screen grid-cols-1 lg:grid-cols-2">
      <div className="flex items-center justify-center px-6 py-16 order-2 lg:order-1">
        <div className="w-full max-w-sm">
          <Link to="/" className="font-display text-xl font-bold text-ink">
            Advisory
          </Link>
          <h1 className="mt-6 font-display text-3xl font-bold text-ink">Create your account</h1>
          <p className="mt-2 text-sm text-muted">Choose how you'd like to use Advisory.</p>

          <div className="mt-6 grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setType("advice")}
              className={`flex flex-col items-center gap-2 rounded-xl2 border p-5 text-center transition-colors ${
                type === "advice" ? "border-emerald bg-emerald/5" : "border-line hover:border-emerald/30"
              }`}
            >
              <HiOutlineUser className={`h-6 w-6 ${type === "advice" ? "text-emerald" : "text-muted"}`} />
              <span className="text-sm font-semibold text-ink">I want advice</span>
            </button>
            <button
              type="button"
              onClick={() => setType("expert")}
              className={`flex flex-col items-center gap-2 rounded-xl2 border p-5 text-center transition-colors ${
                type === "expert" ? "border-emerald bg-emerald/5" : "border-line hover:border-emerald/30"
              }`}
            >
              <HiOutlineBriefcase className={`h-6 w-6 ${type === "expert" ? "text-emerald" : "text-muted"}`} />
              <span className="text-sm font-semibold text-ink">I want to become an expert</span>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <Input name="name" label="Full Name" placeholder="Your full name" value={form.name} onChange={handleChange} />
            <Input name="email" label="Email" type="email" placeholder="you@example.com" value={form.email} onChange={handleChange} />
            <div>
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold uppercase tracking-wide text-muted">Password</label>
                {form.password && <span className={`text-xs font-semibold ${passwordScore <= 1 ? "text-red-600" : passwordScore <= 3 ? "text-amber-600" : "text-emerald"}`}>{strengthLabel}</span>}
              </div>
              <div className="relative mt-2">
                <input name="password" type={showPassword ? "text" : "password"} required value={form.password} onChange={handleChange} placeholder="Create a strong password" className="w-full rounded-xl border border-line px-4 py-3 pr-12 text-sm focus:border-emerald focus:outline-none" />
                <button type="button" onClick={() => setShowPassword((visible) => !visible)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-ink" aria-label={showPassword ? "Hide password" : "Show password"}>
                  {showPassword ? <HiOutlineEyeSlash className="h-5 w-5" /> : <HiOutlineEye className="h-5 w-5" />}
                </button>
              </div>
              <div className="mt-2 flex gap-1.5" aria-label={`Password strength: ${strengthLabel}`}>
                {[0, 1, 2, 3].map((bar) => <span key={bar} className={`h-1.5 flex-1 rounded-full ${bar < passwordScore ? strengthColor : "bg-line"}`} />)}
              </div>
              <div className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2 rounded-xl bg-surface px-3 py-3">
                {passwordRules.map((rule) => (
                  <span key={rule.label} className={`flex items-center gap-2 text-xs ${rule.valid ? "text-emerald" : "text-muted"}`}>
                    <span className={`flex h-4 w-4 items-center justify-center rounded-full text-[10px] ${rule.valid ? "bg-emerald/15" : "bg-line"}`}>{rule.valid ? "✓" : ""}</span>
                    {rule.label}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold uppercase tracking-wide text-muted">Confirm Password</label>
              <div className="relative mt-2">
                <input name="confirmPassword" type={showConfirmPassword ? "text" : "password"} required value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Repeat your password" className={`w-full rounded-xl border px-4 py-3 pr-12 text-sm focus:outline-none ${confirmPassword && confirmPassword !== form.password ? "border-red-400 focus:border-red-500" : "border-line focus:border-emerald"}`} />
                <button type="button" onClick={() => setShowConfirmPassword((visible) => !visible)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-ink" aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}>
                  {showConfirmPassword ? <HiOutlineEyeSlash className="h-5 w-5" /> : <HiOutlineEye className="h-5 w-5" />}
                </button>
              </div>
              {confirmPassword && confirmPassword !== form.password && <p className="mt-2 text-xs text-red-600">Passwords do not match.</p>}
            </div>

            {type === "advice" ? (
              <>
                <Input name="phone" label="Phone" placeholder="+91 98765 43210" value={form.phone} onChange={handleChange} />
              </>
            ) : (
              <>
                <Input label="Profession" placeholder="e.g. Career Advisor" />
                <Input label="Category" placeholder="e.g. Career, Legal, Business" />
                <Input label="Years of Experience" type="number" placeholder="e.g. 8" />
              </>
            )}

            {error && <p className="text-sm text-red-600">{error}</p>}
            {success && <p className="text-sm text-emerald-600">{success}</p>}

            <Button type="submit" variant="accent" size="lg" className="w-full" disabled={loading}>
              {loading ? "Creating..." : type === "expert" ? "Apply as an Expert" : "Create Account"}
            </Button>
          </form>

          <div className="my-6 flex items-center gap-3">
            <div className="h-px flex-1 bg-line" />
            <span className="text-xs text-muted">or</span>
            <div className="h-px flex-1 bg-line" />
          </div>

          <button type="button" onClick={handleGoogleSignup} disabled={loading} className="flex w-full items-center justify-center gap-3 rounded-full border border-line py-3 text-sm font-semibold text-ink hover:bg-ink/5 disabled:opacity-70">
            <FcGoogle className="h-5 w-5" />
            Continue with Google
          </button>

          <p className="mt-8 text-center text-sm text-muted">
            Already have an account?{" "}
            <Link to="/login" className="font-semibold text-emerald hover:underline">
              Login
            </Link>
          </p>
        </div>
      </div>

      <div className="relative hidden bg-navy lg:block order-1 lg:order-2">
        <img src={signupSideImage} alt="" className="absolute inset-0 h-full w-full object-cover opacity-40" />
        <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/70 to-navy/40" />
        <div className="relative flex h-full flex-col justify-end p-12">
          <p className="font-display text-3xl font-bold leading-tight text-white">
            Whatever decision you're facing, there is a qualified person who can help.
          </p>
        </div>
      </div>
    </div>
  );
}

function Input({ label, type = "text", name, placeholder, value, onChange }) {
  return (
    <div>
      <label className="text-xs font-semibold uppercase tracking-wide text-muted">{label}</label>
      <input
        name={name}
        type={type}
        required
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="mt-2 w-full rounded-xl border border-line px-4 py-3 text-sm focus:border-emerald focus:outline-none"
      />
    </div>
  );
}
