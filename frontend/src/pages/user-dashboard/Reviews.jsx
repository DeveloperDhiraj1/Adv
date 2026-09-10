import { useEffect, useState } from "react";
import DashboardPageHeader from "../../components/DashboardPageHeader";
import RatingStars from "../../components/RatingStars";
import { apiFetch } from "../../lib/api";

export default function Reviews() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const result = await apiFetch("/user-dashboard");
        setReviews(result?.data?.reviews || []);
      } catch (err) {
        console.error("Failed to load reviews", err);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  return (
    <div>
      <DashboardPageHeader
        title="My Reviews"
        description="Reviews you've left for experts you've worked with."
      />

      {loading ? (
        <div className="text-sm text-muted">Loading reviews...</div>
      ) : reviews.length === 0 ? (
        <div className="rounded-xl2 border border-dashed border-line py-16 text-center text-muted">
          You haven't left any reviews yet.
        </div>
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => (
            <div
              key={review._id}
              className="rounded-xl2 border border-line bg-card p-5 shadow-card"
            >
              <div className="flex items-center justify-between">
                <p className="font-medium text-ink">
                  {review.expertId?.headline || review.serviceId?.title || "Expert"}
                </p>
                <RatingStars rating={review.rating} showValue={false} />
              </div>
              <p className="mt-2 text-sm text-muted">{review.comment}</p>
              {review.createdAt && (
                <p className="mt-2 text-xs text-muted">
                  {new Date(review.createdAt).toLocaleDateString()}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
