import { useEffect, useState } from "react";
import DashboardPageHeader from "../../components/DashboardPageHeader";
import Badge from "../../components/Badge";
import { apiFetch } from "../../lib/api";

function ReviewForm({ bookingId, onSubmitted }) {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const submit = async () => {
    setSubmitting(true);
    setError("");
    try {
      await apiFetch("/reviews", {
        method: "POST",
        body: JSON.stringify({ bookingId, rating, comment }),
      });
      onSubmitted();
    } catch (err) {
      setError(err.message || "Failed to submit review");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mt-2 flex flex-col gap-2 rounded-xl border border-line bg-surface p-3 sm:flex-row sm:items-center">
      <select
        value={rating}
        onChange={(e) => setRating(Number(e.target.value))}
        className="rounded-lg border border-line px-2 py-1.5 text-xs"
      >
        {[5, 4, 3, 2, 1].map((r) => (
          <option key={r} value={r}>
            {r} star{r === 1 ? "" : "s"}
          </option>
        ))}
      </select>
      <input
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Share your experience..."
        className="flex-1 rounded-lg border border-line px-3 py-1.5 text-xs focus:border-emerald focus:outline-none"
      />
      <button
        onClick={submit}
        disabled={submitting || !comment.trim()}
        className="rounded-full bg-emerald px-4 py-1.5 text-xs font-semibold text-white disabled:opacity-60"
      >
        {submitting ? "Submitting..." : "Submit"}
      </button>
      {error && <span className="text-xs text-red-500">{error}</span>}
    </div>
  );
}

export default function Bookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reviewingId, setReviewingId] = useState(null);
  const [reviewedIds, setReviewedIds] = useState([]);

  const loadBookings = async () => {
    try {
      const result = await apiFetch("/user-dashboard");
      setBookings(result?.data?.bookings || []);
      const existingReviewBookingIds = (result?.data?.reviews || []).map((r) => r.bookingId);
      setReviewedIds(existingReviewBookingIds);
    } catch (err) {
      console.error("Failed to load bookings", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBookings();
  }, []);

  return (
    <div>
      <DashboardPageHeader title="My Bookings" description="Every session you've booked, past and upcoming." />

      {loading ? (
        <div className="mt-6 text-sm text-muted">Loading bookings...</div>
      ) : bookings.length === 0 ? (
        <div className="mt-6 rounded-xl2 border border-dashed border-line py-16 text-center text-muted">
          No bookings yet.
        </div>
      ) : (
        <div className="space-y-3">
          {bookings.map((booking) => {
            const status = booking.bookingStatus || "PENDING";
            const tone = /CONFIRMED|COMPLETED/.test(status) ? "accent" : "outline";
            const canReview =
              status === "COMPLETED" && !reviewedIds.includes(booking._id);

            return (
              <div
                key={booking._id}
                className="rounded-xl2 border border-line bg-card p-4 shadow-card"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <p className="font-medium text-ink">
                      {booking.expertId?.headline || "Expert"} —{" "}
                      {booking.serviceId?.title || "Consultation"}
                    </p>
                    <p className="text-xs text-muted">
                      {booking.scheduledAt
                        ? new Date(booking.scheduledAt).toLocaleString()
                        : "TBD"}
                    </p>
                  </div>
                  <Badge tone={tone}>{status}</Badge>
                </div>

                {canReview && (
                  <>
                    {reviewingId === booking._id ? (
                      <ReviewForm
                        bookingId={booking._id}
                        onSubmitted={() => {
                          setReviewingId(null);
                          loadBookings();
                        }}
                      />
                    ) : (
                      <button
                        onClick={() => setReviewingId(booking._id)}
                        className="mt-2 text-xs font-semibold text-emerald hover:underline"
                      >
                        Leave a review
                      </button>
                    )}
                  </>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
