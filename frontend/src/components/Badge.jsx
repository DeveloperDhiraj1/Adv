import { HiCheckBadge } from "react-icons/hi2";

export function VerifiedBadge({ label = "Verified", className = "" }) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full bg-emerald/10 px-2.5 py-1 text-xs font-semibold text-emerald ${className}`}
    >
      <HiCheckBadge className="h-3.5 w-3.5" />
      {label}
    </span>
  );
}

export function AvailabilityDot({ available = true }) {
  return (
    <span className="inline-flex items-center gap-1.5 text-xs font-medium text-muted">
      <span
        className={`h-2 w-2 rounded-full ${
          available ? "bg-emerald" : "bg-ink/15"
        }`}
      />
      {available ? "Available this week" : "Fully booked"}
    </span>
  );
}

export default function Badge({ children, tone = "neutral", className = "" }) {
  const tones = {
    neutral: "bg-ink/5 text-ink",
    accent: "bg-emerald/10 text-emerald",
    outline: "border border-line text-muted",
  };
  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${tones[tone]} ${className}`}
    >
      {children}
    </span>
  );
}
