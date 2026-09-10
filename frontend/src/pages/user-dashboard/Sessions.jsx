import { useEffect, useState } from "react";
import DashboardPageHeader from "../../components/DashboardPageHeader";
import Button from "../../components/Button";
import { VerifiedBadge } from "../../components/Badge";
import { HiOutlineVideoCamera, HiOutlineCalendarDays } from "react-icons/hi2";
import { apiFetch } from "../../lib/api";

export default function Sessions() {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadSessions = async () => {
      try {
        const result = await apiFetch("/user-dashboard");
        const upcoming = (result?.data?.bookings || []).filter((booking) => {
          const status = booking.bookingStatus || booking.status || "PENDING";
          return status !== "CANCELLED" && status !== "COMPLETED";
        });
        setSessions(upcoming);
      } catch (err) {
        console.error("Failed to load sessions", err);
      } finally {
        setLoading(false);
      }
    };

    loadSessions();
  }, []);

  return (
    <div>
      <DashboardPageHeader title="Upcoming Sessions" description="Sessions you have booked that haven't happened yet." />

      {loading ? (
        <div className="mt-6 text-sm text-muted">Loading sessions...</div>
      ) : sessions.length === 0 ? (
        <p className="rounded-xl2 border border-dashed border-line bg-card p-10 text-center text-muted">
          No upcoming sessions. Find an expert to book your next one.
        </p>
      ) : (
        <div className="space-y-4">
          {sessions.map((session, i) => {
            const expertName = session.expertId?.name || session.expertId?.headline || "Expert";
            const expertTitle = session.serviceId?.title || "Consultation";
            const formattedDate = session.scheduledAt
              ? new Date(session.scheduledAt).toLocaleString()
              : "TBD";
            const formatLabel = session.serviceId?.consultationType || "Video Call";

            return (
              <div key={session._id || i} className="flex flex-col gap-4 rounded-xl2 border border-line bg-card p-5 shadow-card sm:flex-row sm:items-center">
                <img
                  src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=900&q=80"
                  alt={expertName}
                  className="h-16 w-16 rounded-xl object-cover"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className="font-display font-semibold text-ink">{expertName}</p>
                    <VerifiedBadge />
                  </div>
                  <p className="text-sm text-muted">{expertTitle}</p>
                  <div className="mt-2 flex flex-wrap items-center gap-4 text-xs text-muted">
                    <span className="inline-flex items-center gap-1">
                      <HiOutlineCalendarDays className="h-4 w-4" /> {formattedDate}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <HiOutlineVideoCamera className="h-4 w-4" /> {formatLabel}
                    </span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled
                    title="Rescheduling isn't available yet — please contact support."
                  >
                    Reschedule
                  </Button>
                  <Button
                    variant="accent"
                    size="sm"
                    onClick={() => {
                      if (session.meetingLink) {
                        window.open(session.meetingLink, "_blank", "noopener,noreferrer");
                      } else {
                        alert("The meeting link isn't ready yet. It appears once the expert confirms your session.");
                      }
                    }}
                  >
                    Join Session
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
