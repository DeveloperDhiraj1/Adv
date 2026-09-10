export default function StatCard({ icon: Icon, label, value, trend }) {
  return (
    <div className="rounded-xl2 border border-line bg-card p-5 shadow-card">
      <div className="flex items-center justify-between">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald/10 text-emerald">
          <Icon className="h-5 w-5" />
        </div>
        {trend && (
          <span className="text-xs font-semibold text-emerald">{trend}</span>
        )}
      </div>
      <p className="mt-4 font-display text-2xl font-bold text-ink">{value}</p>
      <p className="mt-1 text-sm text-muted">{label}</p>
    </div>
  );
}
