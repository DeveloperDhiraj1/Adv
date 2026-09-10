import { useEffect, useState } from "react";
import {
  HiOutlineBell,
  HiOutlineCheckCircle,
  HiOutlineCreditCard,
  HiOutlineChatBubbleLeftRight,
  HiOutlineCalendarDays,
  HiOutlineXMark,
} from "react-icons/hi2";
import DashboardPageHeader from "../../components/DashboardPageHeader";
import Button from "../../components/Button";
import { apiFetch } from "../../lib/api";

const notificationIcons = {
  BOOKING: HiOutlineCalendarDays,
  PAYMENT: HiOutlineCreditCard,
  MESSAGE: HiOutlineChatBubbleLeftRight,
  CALL: HiOutlineBell,
  SYSTEM: HiOutlineBell,
  DISPUTE: HiOutlineXMark,
  PAYOUT: HiOutlineCreditCard,
};

const notificationColors = {
  BOOKING: "bg-blue-50 text-blue-900",
  PAYMENT: "bg-emerald-50 text-emerald-900",
  MESSAGE: "bg-purple-50 text-purple-900",
  CALL: "bg-orange-50 text-orange-900",
  SYSTEM: "bg-gray-50 text-gray-900",
  DISPUTE: "bg-red-50 text-red-900",
  PAYOUT: "bg-emerald-50 text-emerald-900",
};

export default function NotificationsExpert() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all"); // all, unread
  const [marking, setMarking] = useState(null);

  useEffect(() => {
    const loadNotifications = async () => {
      try {
        const result = await apiFetch("/notifications");
        setNotifications(result?.data || []);
      } catch (err) {
        console.error("Failed to load notifications", err);
      } finally {
        setLoading(false);
      }
    };

    loadNotifications();
  }, []);

  const filteredNotifications = notifications.filter((notif) => {
    if (filter === "unread") return !notif.isRead;
    return true;
  });

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const handleMarkAsRead = async (notifId) => {
    setMarking(notifId);
    try {
      await apiFetch(`/notifications/${notifId}/read`, {
        method: "PATCH",
      });

      setNotifications((prev) =>
        prev.map((n) => (n._id === notifId ? { ...n, isRead: true } : n))
      );
    } catch (err) {
      console.error("Failed to mark as read", err);
    } finally {
      setMarking(null);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await apiFetch("/notifications/read-all", {
        method: "PATCH",
      });

      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    } catch (err) {
      console.error("Failed to mark all as read", err);
    }
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now - date;
    const mins = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (mins < 1) return "just now";
    if (mins < 60) return `${mins}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  return (
    <div>
      <DashboardPageHeader
        title="Notifications"
        description="Get notified about new bookings, payments, and messages."
      />

      <div className="space-y-4">
        {/* Filter and Actions */}
        <div className="flex items-center justify-between">
          <div className="flex gap-2">
            <button
              onClick={() => setFilter("all")}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                filter === "all"
                  ? "bg-emerald text-navy"
                  : "bg-ink/5 text-muted hover:bg-ink/10"
              }`}
            >
              All Notifications
            </button>
            <button
              onClick={() => setFilter("unread")}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                filter === "unread"
                  ? "bg-emerald text-navy"
                  : "bg-ink/5 text-muted hover:bg-ink/10"
              }`}
            >
              Unread ({unreadCount})
            </button>
          </div>
          {unreadCount > 0 && (
            <Button variant="outline" size="sm" onClick={handleMarkAllAsRead}>
              Mark all as read
            </Button>
          )}
        </div>

        {/* Notifications List */}
        {loading ? (
          <div className="text-sm text-muted">Loading notifications...</div>
        ) : filteredNotifications.length === 0 ? (
          <div className="rounded-xl2 border border-dashed border-line bg-card p-10 text-center">
            <HiOutlineBell className="mx-auto h-12 w-12 text-muted/30" />
            <p className="mt-3 text-muted">
              {filter === "unread"
                ? "No unread notifications"
                : "No notifications yet"}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredNotifications.map((notif) => {
              const IconComponent = notificationIcons[notif.type] || HiOutlineBell;
              const colorClass = notificationColors[notif.type] || "bg-gray-50";

              return (
                <div
                  key={notif._id}
                  className={`rounded-xl2 border p-4 transition-all ${
                    notif.isRead
                      ? "border-line bg-card"
                      : "border-emerald/30 bg-emerald/5"
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div
                      className={`flex h-12 w-12 flex-none items-center justify-center rounded-full ${colorClass}`}
                    >
                      <IconComponent className="h-6 w-6" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h3 className="font-display font-semibold text-ink">
                            {notif.title}
                          </h3>
                          <p className="mt-1 text-sm text-muted">
                            {notif.message}
                          </p>
                        </div>
                        {!notif.isRead && (
                          <div className="h-2 w-2 flex-none rounded-full bg-emerald mt-2" />
                        )}
                      </div>

                      <div className="mt-3 flex items-center justify-between">
                        <p className="text-xs text-muted">
                          {formatTime(notif.createdAt)}
                        </p>
                        {!notif.isRead && (
                          <button
                            onClick={() => handleMarkAsRead(notif._id)}
                            disabled={marking === notif._id}
                            className="text-xs font-medium text-emerald hover:underline disabled:opacity-50"
                          >
                            {marking === notif._id ? "Marking..." : "Mark as read"}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
