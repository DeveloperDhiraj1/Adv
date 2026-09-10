import { useEffect, useState } from "react";
import DashboardPageHeader from "../../components/DashboardPageHeader";
import { apiFetch } from "../../lib/api";

export default function Profile() {
  const [form, setForm] = useState({ name: "", email: "", phone: "" });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const result = await apiFetch("/user-dashboard");
        const profile = result?.data?.profile;
        if (profile) {
          setForm({
            name: profile.name || "",
            email: profile.email || "",
            phone: profile.phone || "",
          });
        }
      } catch (err) {
        console.error("Failed to load profile", err);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage("");
    try {
      await apiFetch("/user-dashboard/profile", {
        method: "PUT",
        body: JSON.stringify({ name: form.name, phone: form.phone }),
      });
      localStorage.setItem("userName", form.name);
      setMessage("Profile updated successfully.");
    } catch (err) {
      console.error("Failed to update profile", err);
      setMessage(err.message || "Failed to update profile.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="text-sm text-muted">Loading profile...</div>;
  }

  return (
    <div>
      <DashboardPageHeader title="Profile" description="Manage your personal information." />

      <form
        onSubmit={handleSave}
        className="max-w-lg space-y-5 rounded-xl2 border border-line bg-card p-6 shadow-card"
      >
        <div>
          <label className="mb-1.5 block text-sm font-medium text-ink">Full Name</label>
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            className="w-full rounded-xl border border-line px-4 py-2.5 text-sm focus:border-emerald focus:outline-none"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-ink">Email</label>
          <input
            name="email"
            value={form.email}
            disabled
            className="w-full rounded-xl border border-line bg-ink/5 px-4 py-2.5 text-sm text-muted"
          />
          <p className="mt-1 text-xs text-muted">Email cannot be changed.</p>
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-ink">Phone</label>
          <input
            name="phone"
            value={form.phone}
            onChange={handleChange}
            className="w-full rounded-xl border border-line px-4 py-2.5 text-sm focus:border-emerald focus:outline-none"
          />
        </div>

        {message && <p className="text-sm text-emerald">{message}</p>}

        <button
          type="submit"
          disabled={saving}
          className="rounded-full bg-emerald px-6 py-2.5 text-sm font-semibold text-white hover:bg-emerald-light disabled:opacity-60"
        >
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </form>
    </div>
  );
}
