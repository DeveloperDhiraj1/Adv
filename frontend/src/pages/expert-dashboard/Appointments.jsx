import { useEffect, useState } from "react";
import DashboardPageHeader from "../../components/DashboardPageHeader";
import SimpleTable from "../../components/SimpleTable";
import Badge from "../../components/Badge";
import { apiFetch } from "../../lib/api";

export default function Appointments() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [meetingLinks, setMeetingLinks] = useState({});
  const [savingLink, setSavingLink] = useState({});

  useEffect(() => {
    const loadBookings = async () => {
      try {
        const result = await apiFetch("/expert-dashboard");
        setBookings(result?.data?.bookings || []);
      } catch (err) {
        console.error("Failed to load appointments", err);
      } finally {
        setLoading(false);
      }
    };

    loadBookings();
  }, []);

  const shareMeetingLink = async (bookingId) => {
  const meetingLink = meetingLinks[bookingId]?.trim();

  if (!meetingLink) {
    alert("Please enter a meeting link");
    return;
  }

  try {
    setSavingLink((prev) => ({
      ...prev,
      [bookingId]: true,
    }));

    const result = await apiFetch(
      `/bookings/${bookingId}/meeting-link`,
      {
        method: "PATCH",
        body: JSON.stringify({ meetingLink }),
      }
    );

    setBookings((prev) =>
      prev.map((booking) =>
        booking._id === bookingId
          ? { ...booking, meetingLink: result.booking.meetingLink }
          : booking
      )
    );

    alert("Meeting link shared successfully");
  } catch (err) {
    console.error("Failed to share meeting link", err);
    alert("Failed to share meeting link");
  } finally {
    setSavingLink((prev) => ({
      ...prev,
      [bookingId]: false,
    }));
  }
 }; 

  const rows = bookings.map((booking) => {
    const status = booking.bookingStatus || "PENDING";
    const tone = /CONFIRMED|COMPLETED/.test(status) ? "accent" : "outline";

    return [
      booking.userId?.name || "Client",
      booking.serviceId?.title || "Consultation",
      booking.scheduledAt ? new Date(booking.scheduledAt).toLocaleString() : "TBD",
    <div className="flex items-center gap-2">
      <input
        type="url"
        placeholder="Meeting link"
        value={meetingLinks[booking._id] ?? booking.meetingLink ?? ""}
        onChange={(e) =>
          setMeetingLinks((prev) => ({
            ...prev,
            [booking._id]: e.target.value,
          }))
        }
        className="w-48 rounded-lg border border-line bg-transparent px-3 py-2 text-sm outline-none"
      />

      <button
        type="button"
        onClick={() => shareMeetingLink(booking._id)}
        disabled={savingLink[booking._id]}
        className="rounded-lg bg-emerald px-3 py-2 text-sm font-medium text-white disabled:opacity-50"
      >
        {savingLink[booking._id] ? "Sharing..." : "Share"}
      </button>
    </div>,
      <Badge key={booking._id || status} tone={tone}>
        {status}
      </Badge>,
    ];
  });

  return (
    <div>
      <DashboardPageHeader
        title="Appointments"
        description="All your upcoming and past sessions in one place."
      />
      {loading ? (
        <div className="mt-6 text-sm text-muted">Loading appointments...</div>
      ) : bookings.length === 0 ? (
        <div className="mt-6 rounded-xl2 border border-dashed border-line py-16 text-center text-muted">
          No appointments yet.
        </div>
      ) : (
        <SimpleTable
          columns={["Client", "Session", "Date & Time", "Meeting", "Status"]}
          rows={rows}
        />
      )}
    </div>
  );
}
