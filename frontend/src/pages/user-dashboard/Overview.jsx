import { useEffect, useState } from "react";
import {
  HiOutlineCalendarDays,
  HiOutlineClipboardDocumentList,
  HiOutlineHeart,
  HiOutlineChatBubbleLeftRight,
} from "react-icons/hi2";
import DashboardPageHeader from "../../components/DashboardPageHeader";
import StatCard from "../../components/StatCard";
import SimpleTable from "../../components/SimpleTable";
import Badge from "../../components/Badge";
import { apiFetch } from "../../lib/api";
import { getFavoriteIds } from "../../lib/favorites";

export default function Overview() {
  const [dashboard, setDashboard] = useState({
    profile: { name: "User" },
    totalBookings: 0,
    bookings: [],
    reviews: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const result = await apiFetch("/user-dashboard");
        setDashboard(result?.data || dashboard);
      } catch (err) {
        console.error("User dashboard fetch failed", err);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const recentBookings = (dashboard.bookings || []).slice(0, 3).map((booking) => [
    booking.expertId?.headline || "Expert",
    booking.serviceId?.title || "Session",
    booking.createdAt ? new Date(booking.createdAt).toLocaleDateString() : "-",
    <Badge key={booking._id} tone={/CONFIRMED|COMPLETED/.test(booking.bookingStatus) ? "accent" : "outline"}>
      {booking.bookingStatus || "Pending"}
    </Badge>,
  ]);

  return (
    <div>
      <DashboardPageHeader
        title={`Welcome back, ${dashboard.profile?.name || "User"}`}
        description="Here's an overview of your advisory sessions."
        action={
          <a
            href="/experts"
            className="rounded-full bg-emerald px-5 py-2 text-sm font-semibold text-white hover:bg-emerald-light"
          >
            + Find an Expert
          </a>
        }
      />

      {loading ? (
        <div className="mt-8 text-sm text-muted">Loading dashboard...</div>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard icon={HiOutlineCalendarDays} label="Upcoming Session" value={dashboard.bookings?.length ? "1" : "0"} />
            <StatCard icon={HiOutlineClipboardDocumentList} label="Total Bookings" value={String(dashboard.totalBookings || 0)} />
            <StatCard icon={HiOutlineHeart} label="Favorite Experts" value={String(getFavoriteIds().length)} />
            <StatCard icon={HiOutlineChatBubbleLeftRight} label="Unread Messages" value="0" />
          </div>

          <div className="mt-10">
            <h2 className="mb-4 font-display text-lg font-semibold text-ink">Recent Bookings</h2>
            <SimpleTable columns={["Expert", "Category", "Date", "Status"]} rows={recentBookings.length ? recentBookings : [["No bookings yet", "-", "-", <Badge key="none" tone="outline">None</Badge>]]} />
          </div>
        </>
      )}
    </div>
  );
}
