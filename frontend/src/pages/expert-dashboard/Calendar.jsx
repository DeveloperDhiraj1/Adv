import { useState, Fragment, useEffect } from "react";
import { HiOutlineCheckCircle, HiOutlineExclamationTriangle } from "react-icons/hi2";
import DashboardPageHeader from "../../components/DashboardPageHeader";
import Button from "../../components/Button";
import { apiFetch } from "../../lib/api";

const dayLabels = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const dayShort = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const timeSlots = ["09:00", "10:00", "11:00", "14:00", "15:00", "16:00", "17:00", "18:00"];
const timeDisplay = ["9:00 AM", "10:00 AM", "11:00 AM", "2:00 PM", "3:00 PM", "4:00 PM", "5:00 PM", "6:00 PM"];

export default function Calendar() {
  const [availability, setAvailability] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  // Load existing availability on mount
  useEffect(() => {
    const loadAvailability = async () => {
      try {
        const result = await apiFetch("/availability/my");
        if (result?.data) {
          const availabilityMap = {};
          result.data.forEach((slot) => {
            const key = `${slot.dayOfWeek}-${slot.startTime}`;
            availabilityMap[key] = true;
          });
          setAvailability(availabilityMap);
        }
      } catch (err) {
        console.error("Failed to load availability", err);
      } finally {
        setLoading(false);
      }
    };

    loadAvailability();
  }, []);

  const toggleSlot = (dayLabel, time) => {
    const key = `${dayLabel}-${time}`;
    setAvailability((prev) => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage("");

    try {
      // Collect all selected slots
      const slotsToSave = [];
      Object.entries(availability).forEach(([key, isAvailable]) => {
        if (isAvailable) {
          const [dayLabel, startTime] = key.split("-");
          slotsToSave.push({
            dayOfWeek: dayLabel,
            startTime,
            endTime: startTime // Can be enhanced to set proper end time
          });
        }
      });

      // Save each slot (or delete if not available)
      const savePromises = dayLabels.flatMap((day) =>
        timeSlots.map((time) => {
          const key = `${day}-${time}`;
          const isAvailable = availability[key] || false;

          return apiFetch("/availability/set", {
            method: "POST",
            body: JSON.stringify({
              dayOfWeek: day,
              startTime: time,
              endTime: time,
              isAvailable
            })
          });
        })
      );

      await Promise.all(savePromises);

      setMessage({ type: "success", text: "Availability updated successfully!" });
      setTimeout(() => setMessage(""), 3000);
    } catch (err) {
      setMessage({ type: "error", text: err.message || "Failed to save availability" });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <DashboardPageHeader
        title="Availability"
        description="Set your available time slots for consultations each week."
      />

      {loading ? (
        <div className="mt-6 text-sm text-muted">Loading your availability...</div>
      ) : (
        <>
          {message && (
            <div
              className={`mb-6 flex items-center gap-3 rounded-xl p-4 ${
                message.type === "success"
                  ? "bg-emerald/10 text-emerald"
                  : "bg-red-50 text-red-900"
              }`}
            >
              {message.type === "success" ? (
                <HiOutlineCheckCircle className="h-5 w-5 flex-none" />
              ) : (
                <HiOutlineExclamationTriangle className="h-5 w-5 flex-none" />
              )}
              <p className="text-sm">{message.text}</p>
            </div>
          )}

          <div className="overflow-x-auto rounded-xl2 border border-line bg-card p-6 shadow-card">
            <div className="grid min-w-[800px] grid-cols-8 gap-2">
              <div />
              {dayShort.map((d, i) => (
                <div key={d} className="text-center text-xs font-semibold uppercase tracking-wide text-muted">
                  {d}
                </div>
              ))}
              {timeSlots.map((time, timeIdx) => (
                <Fragment key={time}>
                  <div className="flex items-center justify-center text-xs font-medium text-muted min-w-[60px]">
                    {timeDisplay[timeIdx]}
                  </div>
                  {dayLabels.map((day, dayIdx) => {
                    const key = `${day}-${time}`;
                    const isAvailable = availability[key] || false;
                    return (
                      <button
                        key={key}
                        onClick={() => toggleSlot(day, time)}
                        className={`h-12 rounded-lg border text-xs font-medium transition-colors ${
                          isAvailable
                            ? "border-emerald bg-emerald/10 text-emerald hover:bg-emerald/20"
                            : "border-line text-muted hover:border-emerald/30 hover:bg-ink/[0.03]"
                        }`}
                      >
                        {isAvailable ? "✓" : ""}
                      </button>
                    );
                  })}
                </Fragment>
              ))}
            </div>
          </div>

          <div className="mt-6 flex gap-3">
            <Button
              variant="accent"
              onClick={handleSave}
              disabled={saving}
            >
              {saving ? "Saving..." : "Save Availability"}
            </Button>
            <p className="flex items-center text-sm text-muted">
              Click slots to toggle availability. Click "Save" when done.
            </p>
          </div>
        </>
      )}
    </div>
  );
}
