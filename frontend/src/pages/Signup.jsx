import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import { HiOutlineUser, HiOutlineBriefcase } from "react-icons/hi2";
import Button from "../components/Button";
import { signupSideImage } from "../assets/images";
import { apiFetch } from "../lib/api";

export default function Signup() {
  const [type, setType] = useState("advice");
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    role: "USER",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const payload = {
        ...form,
        role: type === "expert" ? "EXPERT" : "USER",
      };

      const result = await apiFetch("/auth/signup", {
        method: "POST",
        body: JSON.stringify(payload),
      });

      setSuccess(result.message || "Account created successfully.");
      navigate("/verify-otp", { state: { email: form.email } });
    } catch (err) {
      setError(err.message || "Signup failed");
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
            <Input name="password" label="Password" type="password" placeholder="••••••••" value={form.password} onChange={handleChange} />

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

          <button className="flex w-full items-center justify-center gap-3 rounded-full border border-line py-3 text-sm font-semibold text-ink hover:bg-ink/5">
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
