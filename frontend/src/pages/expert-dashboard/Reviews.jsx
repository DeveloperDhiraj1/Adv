import { useEffect, useState } from "react";
import DashboardPageHeader from "../../components/DashboardPageHeader";
import RatingStars from "../../components/RatingStars";
import { apiFetch } from "../../lib/api";

export default function Reviews() {
  const [reviews, setReviews] = useState([]);
  const [stats, setStats] = useState({ rating: 0, totalReviews: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const result = await apiFetch("/expert-dashboard");
        setReviews(result?.data?.reviews || []);
        setStats({
          rating: result?.data?.stats?.rating || 0,
          totalReviews: result?.data?.stats?.totalReviews || 0,
        });
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
        title="Reviews"
        description="What clients are saying about your sessions."
      />

      <div className="mb-6 flex items-center gap-4 rounded-xl2 border border-line bg-card p-5 shadow-card">
        <RatingStars rating={Number(stats.rating || 0)} size="md" />
        <span className="text-sm text-muted">
          {stats.totalReviews} review{stats.totalReviews === 1 ? "" : "s"} overall
        </span>
      </div>

      {loading ? (
        <div className="text-sm text-muted">Loading reviews...</div>
      ) : reviews.length === 0 ? (
        <div className="rounded-xl2 border border-dashed border-line py-16 text-center text-muted">
          No reviews yet.
        </div>
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => (
            <div
              key={review._id}
              className="rounded-xl2 border border-line bg-card p-5 shadow-card"
            >
              <div className="flex items-center justify-between">
                <p className="font-medium text-ink">{review.userId?.name || "Client"}</p>
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
