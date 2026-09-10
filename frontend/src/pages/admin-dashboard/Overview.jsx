import { useEffect, useState } from "react";
import {
  HiOutlineUsers,
  HiOutlineBriefcase,
  HiOutlineShoppingCart,
  HiOutlineCreditCard,
  HiOutlineExclamationTriangle,
} from "react-icons/hi2";
import DashboardPageHeader from "../../components/DashboardPageHeader";
import StatCard from "../../components/StatCard";
import { apiFetch } from "../../lib/api";

export default function AdminOverview() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const result = await apiFetch("/admin/stats");
        setStats(result?.stats);
      } catch (err) {
        console.error("Failed to load stats", err);
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, []);

  if (loading) {
    return <div className="text-sm text-muted">Loading dashboard...</div>;
  }

  const statItems = [
    {
      label: "Total Users",
      value: stats?.totalUsers || 0,
      icon: HiOutlineUsers,
      color: "bg-blue-50 text-blue-900",
    },
    {
      label: "Active Experts",
      value: stats?.totalExperts || 0,
      icon: HiOutlineBriefcase,
      color: "bg-emerald-50 text-emerald-900",
    },
    {
      label: "Total Bookings",
      value: stats?.totalBookings || 0,
      icon: HiOutlineShoppingCart,
      color: "bg-purple-50 text-purple-900",
    },
    {
      label: "Total Revenue",
      value: `₹${(stats?.totalRevenue || 0).toLocaleString()}`,
      icon: HiOutlineCreditCard,
      color: "bg-yellow-50 text-yellow-900",
    },
  ];

  return (
    <div>
      <DashboardPageHeader
        title="Admin Dashboard"
        description="Platform overview and management tools."
      />

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        {statItems.map((stat, idx) => (
          <StatCard key={idx} {...stat} />
        ))}
      </div>

      {/* Alert Section */}
      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-xl2 border border-red-200 bg-red-50 p-6">
          <div className="flex items-center gap-3">
            <HiOutlineExclamationTriangle className="h-6 w-6 text-red-900" />
            <div>
              <h3 className="font-display font-semibold text-red-900">
                Open Disputes
              </h3>
              <p className="text-2xl font-bold text-red-900">
                {stats?.openDisputes || 0}
              </p>
              <p className="text-sm text-red-800">Require attention</p>
            </div>
          </div>
        </div>

        <div className="rounded-xl2 border border-orange-200 bg-orange-50 p-6">
          <div className="flex items-center gap-3">
            <HiOutlineUsers className="h-6 w-6 text-orange-900" />
            <div>
              <h3 className="font-display font-semibold text-orange-900">
                Unverified Experts
              </h3>
              <p className="text-2xl font-bold text-orange-900">
                {stats?.unverifiedExperts || 0}
              </p>
              <p className="text-sm text-orange-800">Waiting for approval</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Bookings */}
      <div className="mt-8 rounded-xl2 border border-line bg-card p-6 shadow-card">
        <h3 className="font-display text-lg font-semibold text-ink">
          Recent Bookings
        </h3>
        <div className="mt-6 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-line">
                <th className="px-4 py-3 text-left font-medium text-muted">
                  User
                </th>
                <th className="px-4 py-3 text-left font-medium text-muted">
                  Expert
                </th>
                <th className="px-4 py-3 text-left font-medium text-muted">
                  Amount
                </th>
                <th className="px-4 py-3 text-left font-medium text-muted">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {stats?.recentBookings?.map((booking) => (
                <tr key={booking._id} className="border-b border-line/50">
                  <td className="px-4 py-3">
                    <p className="font-medium text-ink">{booking.userId.name}</p>
                    <p className="text-xs text-muted">{booking.userId.email}</p>
                  </td>
                  <td className="px-4 py-3 text-ink">
                    {booking.expertId?.headline || "N/A"}
                  </td>
                  <td className="px-4 py-3 font-display font-semibold text-emerald">
                    ₹{booking.amount?.toLocaleString()}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
                        booking.bookingStatus === "CONFIRMED"
                          ? "bg-emerald/10 text-emerald"
                          : booking.bookingStatus === "COMPLETED"
                            ? "bg-blue-50 text-blue-900"
                            : "bg-yellow-50 text-yellow-900"
                      }`}
                    >
                      {booking.bookingStatus}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
