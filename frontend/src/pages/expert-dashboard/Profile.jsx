import { useEffect, useState } from "react";
import DashboardPageHeader from "../../components/DashboardPageHeader";
import Button from "../../components/Button";
import { apiFetch } from "../../lib/api";

export default function Profile() {
  const [profile, setProfile] = useState({
    headline: "",
    qualification: "",
    experienceYears: "",
    languages: [],
    expertise: [],
    bio: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isNewProfile, setIsNewProfile] = useState(false);

  useEffect(() => {
        const loadProfile = async () => {
      try {
        const result = await apiFetch("/expert-dashboard");
        const data = result?.data?.profile || {};
        setProfile({
          headline: data.headline || "",
          qualification: data.qualification || "",
          experienceYears: data.experienceYears || "",
          languages: data.languages || [],
          expertise: data.expertise || [],
          bio: data.bio || "",
        });
      } catch (err) {
        // No profile exists yet for this expert — that's expected for a
        // brand new account, not a real error. Let them fill the form
        // and create it on save instead of showing a scary error.
        setIsNewProfile(true);
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const payload = {
        headline: profile.headline,
        qualification: profile.qualification,
        experienceYears: Number(profile.experienceYears || 0),
        languages: Array.isArray(profile.languages)
          ? profile.languages
          : String(profile.languages || "")
              .split(",")
              .map((val) => val.trim())
              .filter(Boolean),
        expertise: Array.isArray(profile.expertise)
          ? profile.expertise
          : String(profile.expertise || "")
              .split(",")
              .map((val) => val.trim())
              .filter(Boolean),
        bio: profile.bio,
      };

        const result = await apiFetch("/experts/profile", {
        method: isNewProfile ? "POST" : "PUT",
        body: JSON.stringify(payload),
      });

      setIsNewProfile(false);
      setSuccess(result.message || "Profile saved successfully.");
    } catch (err) {
      setError(err.message || "Unable to save profile.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <DashboardPageHeader
        title="My Profile"
        description="This information is shown to clients on your public expert profile."
        action={
          <Button variant="accent" onClick={handleSave} disabled={saving}>
            {saving ? "Saving..." : "Save Changes"}
          </Button>
        }
      />

      {loading ? (
        <div className="text-sm text-muted">Loading profile...</div>
      ) : (
        <div className="rounded-xl2 border border-line bg-card p-6 shadow-card">
          {error && <p className="mb-4 text-sm text-red-600">{error}</p>}
          {success && <p className="mb-4 text-sm text-emerald-600">{success}</p>}

          <div className="mt-2 grid grid-cols-1 gap-6 sm:grid-cols-2">
            <Field label="Professional Title" name="headline" value={profile.headline} onChange={handleChange} />
            <Field label="Qualification" name="qualification" value={profile.qualification} onChange={handleChange} />
            <Field label="Years of Experience" name="experienceYears" type="number" value={profile.experienceYears} onChange={handleChange} />
            <Field label="Languages" name="languages" value={Array.isArray(profile.languages) ? profile.languages.join(", ") : profile.languages} onChange={(e) => setProfile((prev) => ({ ...prev, languages: e.target.value }))} />
          </div>

          <div className="mt-6">
            <label className="text-xs font-semibold uppercase tracking-wide text-muted">
              About
            </label>
            <textarea
              name="bio"
              value={profile.bio}
              onChange={handleChange}
              rows={4}
              className="mt-2 w-full rounded-xl border border-line px-4 py-3 text-sm focus:border-emerald focus:outline-none"
            />
          </div>

          <div className="mt-6">
            <label className="text-xs font-semibold uppercase tracking-wide text-muted">
              Expertise Tags
            </label>
            <input
              name="expertise"
              value={Array.isArray(profile.expertise) ? profile.expertise.join(", ") : profile.expertise}
              onChange={(e) => setProfile((prev) => ({ ...prev, expertise: e.target.value }))}
              className="mt-2 w-full rounded-xl border border-line px-4 py-2.5 text-sm focus:border-emerald focus:outline-none"
            />
          </div>
        </div>
      )}
    </div>
  );
}

function Field({ label, name, value, onChange, type = "text" }) {
  return (
    <div>
      <label className="text-xs font-semibold uppercase tracking-wide text-muted">
        {label}
      </label>
      <input
        name={name}
        type={type}
        value={value || ""}
        onChange={onChange}
        className="mt-2 w-full rounded-xl border border-line px-4 py-2.5 text-sm focus:border-emerald focus:outline-none"
      />
    </div>
  );
}
