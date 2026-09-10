import { useEffect, useState } from "react";
import { useParams, Navigate } from "react-router-dom";
import {
  HiOutlineLanguage,
  HiOutlineAcademicCap,
  HiOutlineDocumentCheck,
} from "react-icons/hi2";
import RatingStars from "../components/RatingStars";
import { VerifiedBadge, AvailabilityDot } from "../components/Badge";
import Button from "../components/Button";
import { apiFetch } from "../lib/api";

const FALLBACK_PHOTO =
  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=900&q=80";

export default function ExpertProfile() {
  const { id } = useParams();
  const [service, setService] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      setLoading(true);
      setNotFound(false);
      try {
        const result = await apiFetch(`/services/${id}`);
        if (cancelled) return;
        const data = result?.data;
        if (!data) {
          setNotFound(true);
          return;
        }
        setService(data);

        const expertId = data.expertId?._id;
        if (expertId) {
          try {
            const reviewResult = await apiFetch(`/reviews/expert/${expertId}`);
            if (!cancelled) setReviews(reviewResult?.data || []);
          } catch (err) {
            console.error("Failed to load reviews", err);
          }
        }
      } catch (err) {
        console.error("Failed to load expert profile", err);
        if (!cancelled) setNotFound(true);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, [id]);

  if (!loading && (notFound || !service)) return <Navigate to="/experts" replace />;

  if (loading) {
    return (
      <div className="bg-surface py-24 text-center text-sm text-muted">
        Loading expert profile...
      </div>
    );
  }

  const expert = service.expertId || {};
  const name = expert.headline || service.title || "Expert";
  const rating = Number(expert.rating || 0);
  const totalReviews = expert.totalReviews ?? reviews.length;
  const languages = expert.languages?.length ? expert.languages : ["English"];
  const expertise = expert.expertise?.length ? expert.expertise : [service.title];

  return (
    <div className="bg-surface">
      {/* Header */}
      <section className="border-b border-line bg-card py-14">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="flex flex-col gap-8 sm:flex-row sm:items-start">
            <img
              src={FALLBACK_PHOTO}
              alt={name}
              className="h-32 w-32 flex-none rounded-2xl object-cover shadow-card sm:h-40 sm:w-40"
            />
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="font-display text-2xl font-bold text-ink sm:text-3xl">
                  {name}
                </h1>
                {expert.isVerified && <VerifiedBadge />}
              </div>
              <p className="mt-1 text-muted">{service.title}</p>

              <div className="mt-4 flex flex-wrap items-center gap-5 text-sm text-muted">
                <RatingStars rating={rating} />
                <span>{expert.experienceYears || 0}+ Years Experience</span>
                <span>{totalReviews} Reviews</span>
                <span className="inline-flex items-center gap-1">
                  <HiOutlineLanguage className="h-4 w-4" /> {languages.join(", ")}
                </span>
              </div>

              <div className="mt-5">
                <AvailabilityDot available={service.status === "ACTIVE"} />
              </div>
            </div>

            <div className="flex w-full flex-none flex-col gap-3 sm:w-auto">
              <Button to={`/book/${service._id}`} variant="accent" size="lg">
                Book Session
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="py-14">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-6 lg:grid-cols-3 lg:px-8">
          {/* Left column */}
          <div className="space-y-10 lg:col-span-2">
            <div>
              <h2 className="font-display text-xl font-semibold text-ink">About</h2>
              <p className="mt-3 leading-relaxed text-muted">
                {expert.bio || service.description}
              </p>
            </div>

            <div>
              <h2 className="font-display text-xl font-semibold text-ink">Expertise</h2>
              <div className="mt-3 flex flex-wrap gap-2">
                {expertise.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-emerald/10 px-3 py-1.5 text-sm font-medium text-emerald"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {expert.qualification && (
              <div>
                <h2 className="flex items-center gap-2 font-display text-xl font-semibold text-ink">
                  <HiOutlineAcademicCap className="h-5 w-5 text-emerald" /> Qualification
                </h2>
                <p className="mt-3 text-sm text-muted">{expert.qualification}</p>
              </div>
            )}

            <div>
              <h2 className="flex items-center gap-2 font-display text-xl font-semibold text-ink">
                <HiOutlineDocumentCheck className="h-5 w-5 text-emerald" /> Verification
              </h2>
              <p className="mt-3 text-sm text-muted">
                {expert.isVerified
                  ? "This expert's credentials have been reviewed and verified by the Advisory team."
                  : "This expert's verification is currently pending review."}
              </p>
            </div>

            <div>
              <h2 className="font-display text-xl font-semibold text-ink">
                Reviews ({reviews.length})
              </h2>
              {reviews.length === 0 ? (
                <p className="mt-4 text-sm text-muted">No reviews yet for this expert.</p>
              ) : (
                <div className="mt-4 space-y-4">
                  {reviews.slice(0, 6).map((review) => (
                    <div
                      key={review._id}
                      className="rounded-xl2 border border-line bg-card p-5 shadow-card"
                    >
                      <div className="flex items-center justify-between">
                        <p className="font-medium text-ink">{review.userId?.name || "Client"}</p>
                        <RatingStars rating={review.rating} showValue={false} />
                      </div>
                      <p className="mt-2 text-sm text-muted">{review.comment}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right column - session details */}
          <div>
            <div className="sticky top-24 rounded-xl2 border border-line bg-card p-6 shadow-card">
              <h3 className="font-display text-lg font-semibold text-ink">
                Session Details
              </h3>
              <div className="mt-4 space-y-3">
                <div className="flex items-center justify-between rounded-xl border border-line px-4 py-3">
                  <span className="text-sm font-medium text-ink">{service.title}</span>
                  <span className="font-display font-semibold text-ink">
                    ₹{Number(service.price || 0).toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm text-muted">
                  <span>Duration</span>
                  <span>{service.duration} min</span>
                </div>
                <div className="flex items-center justify-between text-sm text-muted">
                  <span>Format</span>
                  <span>{service.consultationType}</span>
                </div>
              </div>
              <Button to={`/book/${service._id}`} variant="accent" size="lg" className="mt-6 w-full">
                Book Session
              </Button>
              <p className="mt-4 text-center text-xs text-muted">
                Free rescheduling up to 12 hours before your session.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
