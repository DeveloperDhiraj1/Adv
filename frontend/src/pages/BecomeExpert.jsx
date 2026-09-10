import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  HiOutlineUserGroup,
  HiOutlineCalendarDays,
  HiOutlineBanknotes,
  HiOutlineIdentification,
  HiOutlineVideoCamera,
  HiOutlineArrowTrendingUp,
} from "react-icons/hi2";
import Button from "../components/Button";
import SectionHeading from "../components/SectionHeading";
import { becomeExpertHero } from "../assets/images";
import { apiFetch } from "../lib/api";

const benefits = [
  { title: "Reach New Clients", icon: HiOutlineUserGroup },
  { title: "Set Your Own Availability", icon: HiOutlineCalendarDays },
  { title: "Set Your Session Pricing", icon: HiOutlineBanknotes },
  { title: "Build Your Professional Profile", icon: HiOutlineIdentification },
  { title: "Conduct Online Sessions", icon: HiOutlineVideoCamera },
  { title: "Track Earnings", icon: HiOutlineArrowTrendingUp },
];

const steps = ["Apply", "Submit credentials", "Get verified", "Create your profile", "Start accepting sessions"];

export default function BecomeExpert() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    headline: "",
    qualification: "",
    experienceYears: "",
    languages: "English",
    expertise: "Career Coaching",
    bio: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const payload = {
        headline: form.headline,
        bio: form.bio,
        expertise: form.expertise
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean),
        qualification: form.qualification,
        experienceYears: Number(form.experienceYears),
        languages: form.languages
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean),
      };

      const result = await apiFetch("/experts/profile", {
        method: "POST",
        body: JSON.stringify(payload),
      });

      setSuccess(result.message || "Expert profile created successfully.");
      navigate("/expert-dashboard/profile");
    } catch (err) {
      setError(err.message || "Unable to create expert profile.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <section className="relative overflow-hidden bg-navy py-28">
        <img src={becomeExpertHero} alt="" className="absolute inset-0 h-full w-full object-cover opacity-25" />
        <div className="absolute inset-0 bg-gradient-to-b from-navy/70 to-navy" />
        <div className="relative mx-auto max-w-3xl px-6 text-center lg:px-8">
          <h1 className="font-display text-4xl font-semibold leading-tight tracking-tight text-white sm:text-5xl">
            Turn Your Expertise Into Impact.
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-white/70">
            Help people make better decisions while building your professional presence.
          </p>
          <Button to="/signup" variant="accent" size="lg" className="mt-8">
            Apply as an Expert
          </Button>
        </div>
      </section>

      <section className="py-20">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <SectionHeading eyebrow="Why Join" title="Benefits of advising on Advisory" align="center" className="mx-auto text-center" />
          <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {benefits.map((b) => (
              <div key={b.title} className="flex items-center gap-4 rounded-xl2 border border-line bg-card p-6 shadow-card">
                <div className="flex h-11 w-11 flex-none items-center justify-center rounded-full bg-emerald/10 text-emerald">
                  <b.icon className="h-5 w-5" />
                </div>
                <p className="font-medium text-ink">{b.title}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-card py-20">
        <div className="mx-auto max-w-5xl px-6 lg:px-8">
          <SectionHeading eyebrow="Getting Started" title="How becoming an expert works" align="center" className="mx-auto text-center" />
          <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-5">
            {steps.map((step, i) => (
              <div key={step} className="text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-navy font-display text-lg font-bold text-white">
                  {i + 1}
                </div>
                <p className="mt-4 text-sm font-medium text-ink">{step}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="mx-auto max-w-4xl rounded-xl2 border border-line bg-card p-8 shadow-card">
          <h2 className="font-display text-3xl font-bold text-ink">Complete your expert profile</h2>
          <p className="mt-2 text-sm text-muted">Tell clients what you help with and how you can support them.</p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <Field label="Professional headline" name="headline" value={form.headline} onChange={handleChange} placeholder="Career Coach for Growth Leaders" />
              <Field label="Qualification" name="qualification" value={form.qualification} onChange={handleChange} placeholder="MBA, CFP, LLB" />
              <Field label="Years of experience" name="experienceYears" type="number" value={form.experienceYears} onChange={handleChange} placeholder="8" />
              <Field label="Languages" name="languages" value={form.languages} onChange={handleChange} placeholder="English, Hindi" />
            </div>

            <Field label="Expertise tags" name="expertise" value={form.expertise} onChange={handleChange} placeholder="Career, Leadership, Business" />

            <div>
              <label className="text-xs font-semibold uppercase tracking-wide text-muted">About you</label>
              <textarea
                name="bio"
                rows={5}
                required
                value={form.bio}
                onChange={handleChange}
                placeholder="Write a short summary of your advisory experience and the kind of clients you help."
                className="mt-2 w-full rounded-xl border border-line px-4 py-3 text-sm focus:border-emerald focus:outline-none"
              />
            </div>

            {error && <p className="text-sm text-red-600">{error}</p>}
            {success && <p className="text-sm text-emerald-600">{success}</p>}

            <Button type="submit" variant="accent" size="lg" className="w-full" disabled={loading}>
              {loading ? "Submitting..." : "Create Expert Profile"}
            </Button>
          </form>
        </div>
      </section>
    </div>
  );
}

function Field({ label, name, value, onChange, type = "text", placeholder }) {
  return (
    <div>
      <label className="text-xs font-semibold uppercase tracking-wide text-muted">{label}</label>
      <input
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required
        className="mt-2 w-full rounded-xl border border-line px-4 py-3 text-sm focus:border-emerald focus:outline-none"
      />
    </div>
  );
}
