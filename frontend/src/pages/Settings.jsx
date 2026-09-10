import DashboardPageHeader from "../components/DashboardPageHeader";
import Button from "../components/Button";

export default function Settings() {
  return (
    <div className="max-w-2xl">
      <DashboardPageHeader
        title="Settings"
        description="Manage your account preferences and security."
        action={<Button variant="accent">Save Changes</Button>}
      />

      <div className="space-y-6">
        <div className="rounded-xl2 border border-line bg-card p-6 shadow-card">
          <h3 className="font-display text-base font-semibold text-ink">Account</h3>
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="Email Address" defaultValue="you@example.com" type="email" />
            <Field label="Phone Number" defaultValue="+91 98765 43210" />
          </div>
        </div>

        <div className="rounded-xl2 border border-line bg-card p-6 shadow-card">
          <h3 className="font-display text-base font-semibold text-ink">Password</h3>
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="New Password" type="password" placeholder="••••••••" />
            <Field label="Confirm Password" type="password" placeholder="••••••••" />
          </div>
        </div>

        <div className="rounded-xl2 border border-line bg-card p-6 shadow-card">
          <h3 className="font-display text-base font-semibold text-ink">Notifications</h3>
          <div className="mt-4 space-y-3">
            {["Email notifications", "SMS reminders", "Marketing updates"].map((label) => (
              <label key={label} className="flex items-center justify-between text-sm text-ink">
                {label}
                <input type="checkbox" defaultChecked className="h-4 w-4 accent-emerald" />
              </label>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({ label, defaultValue, type = "text", placeholder }) {
  return (
    <div>
      <label className="text-xs font-semibold uppercase tracking-wide text-muted">{label}</label>
      <input
        type={type}
        defaultValue={defaultValue}
        placeholder={placeholder}
        className="mt-2 w-full rounded-xl border border-line px-4 py-2.5 text-sm focus:border-emerald focus:outline-none"
      />
    </div>
  );
}
