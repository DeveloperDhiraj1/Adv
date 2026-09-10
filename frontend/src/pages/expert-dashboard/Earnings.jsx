import { useEffect, useState } from "react";
import { HiOutlineBanknotes, HiOutlineClock, HiOutlineCheckCircle } from "react-icons/hi2";
import DashboardPageHeader from "../../components/DashboardPageHeader";
import StatCard from "../../components/StatCard";
import SimpleTable from "../../components/SimpleTable";
import Badge from "../../components/Badge";
import { apiFetch } from "../../lib/api";

export default function Earnings() {
  const [totalEarnings, setTotalEarnings] = useState(0);
  const [payouts, setPayouts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [dashboardResult, payoutResult] = await Promise.all([
          apiFetch("/expert-dashboard"),
          apiFetch("/payouts/my-payouts"),
        ]);
        setTotalEarnings(dashboardResult?.data?.stats?.totalEarnings || 0);
        setPayouts(payoutResult?.data || []);
      } catch (err) {
        console.error("Failed to load earnings", err);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const pendingAmount = payouts
    .filter((p) => p.status === "PENDING")
    .reduce((acc, p) => acc + (p.amount || 0), 0);
  const paidAmount = payouts
    .filter((p) => p.status === "PAID")
    .reduce((acc, p) => acc + (p.amount || 0), 0);

  const rows = payouts.map((payout) => [
    payout.bookingId?.scheduledAt
      ? new Date(payout.bookingId.scheduledAt).toLocaleDateString()
      : "—",
    `₹${Number(payout.amount || 0).toLocaleString()}`,
    <Badge key={payout._id} tone={payout.status === "PAID" ? "accent" : "outline"}>
      {payout.status}
    </Badge>,
  ]);

  return (
    <div>
      <DashboardPageHeader
        title="Earnings"
        description="Track your total earnings and payout status."
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard
          icon={HiOutlineBanknotes}
          label="Total Earnings"
          value={`₹${Number(totalEarnings).toLocaleString()}`}
        />
        <StatCard
          icon={HiOutlineClock}
          label="Pending Payout"
          value={`₹${Number(pendingAmount).toLocaleString()}`}
        />
        <StatCard
          icon={HiOutlineCheckCircle}
          label="Paid Out"
          value={`₹${Number(paidAmount).toLocaleString()}`}
        />
      </div>

      <div className="mt-8">
        <h2 className="mb-4 font-display text-lg font-semibold text-ink">Payout History</h2>
        {loading ? (
          <div className="text-sm text-muted">Loading payouts...</div>
        ) : payouts.length === 0 ? (
          <div className="rounded-xl2 border border-dashed border-line py-16 text-center text-muted">
            No payouts yet. Payouts are created after a session is completed and paid.
          </div>
        ) : (
          <SimpleTable columns={["Session Date", "Amount", "Status"]} rows={rows} />
        )}
      </div>
    </div>
  );
}
