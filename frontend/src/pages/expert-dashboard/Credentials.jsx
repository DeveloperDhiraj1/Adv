import { useEffect, useState } from "react";
import { HiOutlineDocumentCheck, HiOutlineClock, HiOutlineXCircle } from "react-icons/hi2";
import DashboardPageHeader from "../../components/DashboardPageHeader";
import { VerifiedBadge } from "../../components/Badge";
import { apiFetch } from "../../lib/api";

export default function Credentials() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const result = await apiFetch("/expert-dashboard");
        setProfile(result?.data?.profile || null);
      } catch (err) {
        console.error("Failed to load profile", err);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const status = profile?.verificationStatus || "PENDING";

  const statusMeta = {
    VERIFIED: {
      icon: HiOutlineDocumentCheck,
      color: "text-emerald",
      text: "Your profile has been reviewed and verified by our team.",
    },
    PENDING: {
      icon: HiOutlineClock,
      color: "text-amber-500",
      text: "Your profile is awaiting review by our admin team.",
    },
    REJECTED: {
      icon: HiOutlineXCircle,
      color: "text-red-500",
      text: "Your verification was rejected. Please update your qualification details and contact support.",
    },
  }[status];

  const Icon = statusMeta.icon;

  return (
    <div>
      <DashboardPageHeader
        title="Credentials & Verification"
        description="Your verification status, as reviewed by the Advisory team."
      />

      {loading ? (
        <div className="text-sm text-muted">Loading verification status...</div>
      ) : (
        <div className="rounded-xl2 border border-line bg-card p-6 shadow-card">
          <div className="flex items-center gap-3">
            <span className={`flex h-11 w-11 items-center justify-center rounded-full bg-ink/5 ${statusMeta.color}`}>
              <Icon className="h-6 w-6" />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <p className="font-display text-lg font-semibold text-ink">{status}</p>
                {profile?.isVerified && <VerifiedBadge />}
              </div>
              <p className="text-sm text-muted">{statusMeta.text}</p>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-4 border-t border-line pt-6 sm:grid-cols-2">
            <div>
              <p className="text-xs uppercase tracking-wide text-muted">Qualification</p>
              <p className="mt-1 text-sm text-ink">{profile?.qualification || "Not provided"}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wide text-muted">Experience</p>
              <p className="mt-1 text-sm text-ink">{profile?.experienceYears || 0} years</p>
            </div>
          </div>

          <p className="mt-6 text-xs text-muted">
            Document uploads aren't available yet — verification is currently handled by the
            admin team based on your profile details.
          </p>
        </div>
      )}
    </div>
  );
}
