import { useEffect, useState } from "react";
import {
  HiOutlineCalendarDays,
  HiOutlineClipboardDocumentList,
  HiOutlineBanknotes,
  HiOutlineStar,
} from "react-icons/hi2";
import DashboardPageHeader from "../../components/DashboardPageHeader";
import StatCard from "../../components/StatCard";
import SimpleTable from "../../components/SimpleTable";
import { VerifiedBadge } from "../../components/Badge";
import { apiFetch } from "../../lib/api";

export default function Overview() {
  const [dashboard, setDashboard] = useState({
    profile: { headline: "Expert" },
    stats: { totalServices: 0, totalBookings: 0, totalEarnings: 0, rating: 0 },
    bookings: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const result = await apiFetch("/expert-dashboard");
        setDashboard(result?.data || dashboard);
      } catch (err) {
        console.error("Expert dashboard fetch failed", err);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const upcoming = (dashboard.bookings || []).slice(0, 3).map((booking) => [
    booking.userId?.name || "Client",
    booking.serviceId?.title || "Consultation",
    booking.date ? new Date(booking.date).toLocaleString() : "TBD",
    <VerifiedBadge key={booking._id} label={booking.status || "Confirmed"} />,
  ]);

  return (
    <div>
      <DashboardPageHeader
        title={`Welcome back, ${dashboard.profile?.headline || "Expert"}`}
        description="Here's what's happening with your advisory practice."
      />

      {loading ? (
        <div className="mt-8 text-sm text-muted">Loading dashboard...</div>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard icon={HiOutlineCalendarDays} label="Today's Sessions" value={String(dashboard.bookings?.length || 0)} />
            <StatCard icon={HiOutlineClipboardDocumentList} label="Total Sessions" value={String(dashboard.stats?.totalBookings || 0)} trend="+0%" />
            <StatCard icon={HiOutlineBanknotes} label="Total Earnings" value={`₹${Number(dashboard.stats?.totalEarnings || 0).toLocaleString()}`} trend="+0%" />
            <StatCard icon={HiOutlineStar} label="Average Rating" value={String(dashboard.stats?.rating || 0)} />
          </div>

          <div className="mt-10">
            <h2 className="mb-4 font-display text-lg font-semibold text-ink">
              Upcoming Sessions
            </h2>
            <SimpleTable columns={["Client", "Session", "Date & Time", "Status"]} rows={upcoming.length ? upcoming : [["No sessions yet", "-", "-", <VerifiedBadge key="none" label="None" />]]} />
          </div>
        </>
      )}
    </div>
  );
}
