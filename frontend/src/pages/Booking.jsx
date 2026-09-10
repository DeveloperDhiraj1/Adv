import { useEffect, useMemo, useState } from "react";
import { useParams, Navigate, useNavigate } from "react-router-dom";
import {
  HiOutlineVideoCamera,
  HiOutlineChatBubbleLeftRight,
  HiCheckCircle,
} from "react-icons/hi2";
import RatingStars from "../components/RatingStars";
import { VerifiedBadge } from "../components/Badge";
import Button from "../components/Button";
import { apiFetch } from "../lib/api";

const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const platformFee = 49;

// Generate next 7 days with dates
function getNextSevenDays() {
  const days = [];
  const today = new Date();
  for (let i = 0; i < 7; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() + i);
    const dayOfWeek = dayNames[date.getDay()];
    const dateStr = date.toLocaleDateString("en-IN", { month: "short", day: "numeric" });
    days.push({
      date: dateStr,
      dayOfWeek,
      fullDate: date
    });
  }
  return days;
}

export default function Booking() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [expert, setExpert] = useState(null);
  const [error, setError] = useState("");
  const [availableDays, setAvailableDays] = useState([]);
  const [availableTimes, setAvailableTimes] = useState([]);

  const [dayIdx, setDayIdx] = useState(0);
  const [timeIdx, setTimeIdx] = useState(0);
  const [sessionIdx, setSessionIdx] = useState(0);
  const [sessionType, setSessionType] = useState("Video Call");
  const [confirmed, setConfirmed] = useState(false);
  const [bookingData, setBookingData] = useState(null);
  const [bookingLoading, setBookingLoading] = useState(false);

  useEffect(() => {
    const loadExpert = async () => {
      try {
        const result = await apiFetch(`/services/${id}`);
        const service = result?.data;

        if (!service) {
          setError("This booking is unavailable right now.");
          return;
        }

        const expertId = service.expertId?._id;
        const mappedExpert = {
          id: service._id,
          serviceId: service._id,
          expertId,
          name: service.expertId?.headline || "Expert",
          title: service.title,
          category: service.categoryId?.name || "General",
          photo:
            "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=900&q=80",
          rating: service.expertId?.rating || 4.8,
          years: service.expertId?.experienceYears || 5,
          location: "India",
          languages: service.expertId?.languages || ["English"],
          verified: true,
          available: true,
          bio: service.description,
          expertise: [service.title],
          education: [],
          experience: [],
          sessionOptions: [{ label: service.title, price: service.price || 0 }],
        };

        setExpert(mappedExpert);

        // Load availability for this expert
        try {
          const availResult = await apiFetch(`/availability/${expertId}`);
          const availability = availResult?.data || [];

          // Group availability by day of week
          const availByDay = {};
          availability.forEach((slot) => {
            if (!availByDay[slot.dayOfWeek]) {
              availByDay[slot.dayOfWeek] = [];
            }
            availByDay[slot.dayOfWeek].push(slot.startTime);
          });

          // Get next 7 days and filter by availability
          const days = getNextSevenDays();
          const daysWithAvail = days.filter((day) => availByDay[day.dayOfWeek]);
          setAvailableDays(daysWithAvail);

          // Set available times for first day
          if (daysWithAvail.length > 0) {
            setAvailableTimes(availByDay[daysWithAvail[0].dayOfWeek] || []);
          }
        } catch (err) {
          console.error("Failed to load availability, using fallback", err);
          // Fallback: show all days with default times
          setAvailableDays(getNextSevenDays());
          setAvailableTimes(["09:00", "10:00", "14:00", "15:00", "17:00", "18:00"]);
        }
      } catch (err) {
        setError(err.message || "Failed to load booking details.");
      } finally {
        setLoading(false);
      }
    };

    loadExpert();
  }, [id]);

  const session = expert?.sessionOptions[sessionIdx];
  const selectedDay = availableDays[dayIdx];
  const selectedTime = availableTimes[timeIdx];
  const total = useMemo(() => (session ? session.price + platformFee : 0), [session]);

  const handleDayChange = (newDayIdx) => {
    setDayIdx(newDayIdx);
    const newDayOfWeek = availableDays[newDayIdx].dayOfWeek;
    // Load times for this day (simplified - in real app would fetch per day)
    setTimeIdx(0);
  };

  const handleConfirm = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    setBookingLoading(true);
    setError("");

    try {
      if (!selectedDay || !selectedTime) {
        setError("Please select a date and time.");
        setBookingLoading(false);
        return;
      }

      const scheduledAt = buildScheduledAtFromSlot(selectedDay.fullDate, selectedTime);
      const orderData = await apiFetch("/payments/create-order", {
        method: "POST",
        body: JSON.stringify({
          serviceId: expert.serviceId,
          scheduledAt,
        }),
      });

      if (!window.Razorpay) {
        await loadRazorpayScript();
      }

      const razorpay = new window.Razorpay({
        key: orderData.keyId,
        amount: orderData.amount,
        currency: orderData.currency,
        name: "Advisory",
        description: "Session Booking",
        order_id: orderData.orderId,
        handler: async function (response) {
          try {
            await apiFetch("/payments/verify-payment", {
              method: "POST",
              body: JSON.stringify({
                bookingId: orderData.bookingId,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              }),
            });
            setBookingData({
              bookingId: orderData.bookingId,
              expertId: expert.expertId,
              expertName: expert.name,
              serviceTitle: session.label,
              amount: total,
              scheduledAt: buildScheduledAtFromSlot(selectedDay.fullDate, selectedTime),
              sessionType: sessionType,
            });
            setConfirmed(true);
          } catch (verifyErr) {
            setError(verifyErr.message || "Payment verification failed.");
          } finally {
            setBookingLoading(false);
          }
        },
        prefill: {
          name: localStorage.getItem("userName") || "",
          email: localStorage.getItem("userEmail") || "",
        },
        theme: {
          color: "#10b981",
        },
      });

      razorpay.open();
    } catch (err) {
      setError(err.message || "Booking could not be created.");
      setBookingLoading(false);
    }
  };

  if (!loading && !expert) return <Navigate to="/experts" replace />;

  if (confirmed) {
    const scheduledDate = bookingData?.scheduledAt ? new Date(bookingData.scheduledAt).toLocaleString() : "Scheduled";
    const refNum = bookingData?.bookingId?.slice(-8)?.toUpperCase() || "BOOKING";

    return (
      <div className="bg-surface py-14">
        <div className="mx-auto max-w-2xl px-6 lg:px-8">
          <div className="rounded-xl2 border border-emerald bg-card p-8 shadow-card">
            <div className="text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald/10">
                <HiCheckCircle className="h-10 w-10 text-emerald" />
              </div>
              <h1 className="mt-6 font-display text-3xl font-bold text-ink">
                Session Confirmed!
              </h1>
              <p className="mt-2 text-muted">
                Your booking has been confirmed and payment received.
              </p>
            </div>

            <div className="mt-8 space-y-4 rounded-xl border border-line bg-surface p-6">
              <div>
                <p className="text-sm text-muted">Booking Reference</p>
                <p className="font-display text-lg font-bold text-ink">{refNum}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted">Expert</p>
                  <p className="font-medium text-ink">{bookingData?.expertName}</p>
                </div>
                <div>
                  <p className="text-sm text-muted">Session Type</p>
                  <p className="font-medium text-ink">{bookingData?.serviceTitle}</p>
                </div>
                <div>
                  <p className="text-sm text-muted">Scheduled</p>
                  <p className="font-medium text-ink">{scheduledDate}</p>
                </div>
                <div>
                  <p className="text-sm text-muted">Total Paid</p>
                  <p className="font-display font-bold text-emerald">₹{bookingData?.amount?.toLocaleString()}</p>
                </div>
              </div>
            </div>

            <div className="mt-6 bg-blue-50 border border-blue-200 rounded-xl p-4">
              <p className="text-sm text-blue-900">
                <strong>Next Steps:</strong> A confirmation email has been sent to you. Join your session at the scheduled time. The expert will share the video call or chat link 15 minutes before the session starts.
              </p>
            </div>

            <div className="mt-8 grid grid-cols-3 gap-3">
              <Button
                variant="accent"
                onClick={() => navigate("/dashboard/messages")}
                className="col-span-1"
              >
                Message Expert
              </Button>
              <Button
                variant="outline"
                onClick={() => navigate("/dashboard/sessions")}
                className="col-span-1"
              >
                View Sessions
              </Button>
              <Button
                variant="outline"
                onClick={() => navigate("/experts")}
                className="col-span-1"
              >
                Book Another
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-surface py-14">
      <div className="mx-auto max-w-6xl px-6 lg:px-8">
        <h1 className="font-display text-3xl font-bold text-ink">Book a Session</h1>
        <p className="mt-2 text-muted">Complete the steps below to confirm your booking.</p>

        {loading ? (
          <div className="mt-10 text-sm text-muted">Loading booking details...</div>
        ) : (
          <>
            {error && <p className="mt-6 text-sm text-red-600">{error}</p>}
            <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-3">
              <div className="lg:col-span-1">
                <div className="sticky top-24 rounded-xl2 border border-line bg-card p-6 shadow-card">
                  <img
                    src={expert.photo}
                    alt={expert.name}
                    className="h-20 w-20 rounded-xl object-cover"
                  />
                  <div className="mt-4 flex items-center gap-2">
                    <h2 className="font-display text-lg font-semibold text-ink">
                      {expert.name}
                    </h2>
                    {expert.verified && <VerifiedBadge />}
                  </div>
                  <p className="text-sm text-muted">{expert.title}</p>
                  <div className="mt-3">
                    <RatingStars rating={expert.rating} />
                  </div>

                  <div className="mt-6 space-y-3 border-t border-line pt-5 text-sm">
                    <div className="flex justify-between text-muted">
                      <span>Session</span>
                      <span className="font-medium text-ink">{session?.label || "Select"}</span>
                    </div>
                    <div className="flex justify-between text-muted">
                      <span>Date</span>
                      <span className="font-medium text-ink">{selectedDay?.date || "Select"}</span>
                    </div>
                    <div className="flex justify-between text-muted">
                      <span>Time</span>
                      <span className="font-medium text-ink">{selectedTime || "Select"}</span>
                    </div>
                    <div className="flex justify-between text-muted">
                      <span>Format</span>
                      <span className="font-medium text-ink">{sessionType}</span>
                    </div>
                  </div>

                  <div className="mt-5 space-y-2 border-t border-line pt-5 text-sm">
                    <div className="flex justify-between text-muted">
                      <span>Session price</span>
                      <span>₹{session.price.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-muted">
                      <span>Platform fee</span>
                      <span>₹{platformFee}</span>
                    </div>
                    <div className="flex justify-between border-t border-line pt-2 font-display text-base font-bold text-ink">
                      <span>Total</span>
                      <span>₹{total.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-8 lg:col-span-2">
                <div className="rounded-xl2 border border-line bg-card p-6 shadow-card">
                  <h3 className="font-display text-lg font-semibold text-ink">
                    1. Select Session
                  </h3>
                  <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                    {expert.sessionOptions.map((opt, idx) => (
                      <button
                        key={opt.label}
                        onClick={() => setSessionIdx(idx)}
                        className={`rounded-xl border p-4 text-left transition-colors ${
                          sessionIdx === idx
                            ? "border-emerald bg-emerald/5"
                            : "border-line hover:border-emerald/40"
                        }`}
                      >
                        <p className="font-medium text-ink">{opt.label}</p>
                        <p className="mt-1 font-display text-lg font-bold text-ink">
                          ₹{opt.price.toLocaleString()}
                        </p>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="rounded-xl2 border border-line bg-card p-6 shadow-card">
                  <h3 className="font-display text-lg font-semibold text-ink">
                    2. Select Date
                  </h3>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {availableDays.map((d, idx) => (
                      <button
                        key={d.date}
                        onClick={() => handleDayChange(idx)}
                        className={`rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
                          dayIdx === idx
                            ? "border-emerald bg-emerald text-navy"
                            : "border-line text-muted hover:border-emerald/40"
                        }`}
                      >
                        {d.date}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="rounded-xl2 border border-line bg-card p-6 shadow-card">
                  <h3 className="font-display text-lg font-semibold text-ink">
                    3. Select Time
                  </h3>
                  {availableTimes.length === 0 ? (
                    <p className="mt-4 text-sm text-muted">No available times for this day.</p>
                  ) : (
                    <div className="mt-4 flex flex-wrap gap-2">
                      {availableTimes.map((t, idx) => (
                        <button
                          key={t}
                          onClick={() => setTimeIdx(idx)}
                          className={`rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
                            timeIdx === idx
                              ? "border-emerald bg-emerald text-navy"
                              : "border-line text-muted hover:border-emerald/40"
                          }`}
                        >
                          {t}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <div className="rounded-xl2 border border-line bg-card p-6 shadow-card">
                  <h3 className="font-display text-lg font-semibold text-ink">
                    4. Select Session Type
                  </h3>
                  <div className="mt-4 grid grid-cols-2 gap-3">
                    {[
                      { label: "Video Call", icon: HiOutlineVideoCamera },
                      { label: "Chat", icon: HiOutlineChatBubbleLeftRight },
                    ].map((t) => (
                      <button
                        key={t.label}
                        onClick={() => setSessionType(t.label)}
                        className={`flex items-center justify-center gap-2 rounded-xl border p-4 text-sm font-medium transition-colors ${
                          sessionType === t.label
                            ? "border-emerald bg-emerald/5 text-emerald"
                            : "border-line text-muted hover:border-emerald/40"
                        }`}
                      >
                        <t.icon className="h-5 w-5" />
                        {t.label}
                      </button>
                    ))}
                  </div>
                </div>

                <Button
                  variant="accent"
                  size="lg"
                  className="w-full"
                  onClick={handleConfirm}
                  disabled={bookingLoading}
                >
                  {bookingLoading ? "Booking..." : `Confirm & Pay ₹${total.toLocaleString()}`}
                </Button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function buildScheduledAtFromSlot(fullDate, timeSlot) {
  // timeSlot is in format "HH:MM" (24-hour)
  const [hour, minute] = timeSlot.split(':').map(Number);
  const date = new Date(fullDate);
  date.setHours(hour, minute, 0, 0);
  return date.toISOString();
}

function loadRazorpayScript() {
  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Failed to load Razorpay checkout."));
    document.body.appendChild(script);
  });
}
