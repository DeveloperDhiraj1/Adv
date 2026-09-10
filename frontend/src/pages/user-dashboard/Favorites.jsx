import { useEffect, useState } from "react";
import DashboardPageHeader from "../../components/DashboardPageHeader";
import ExpertCard from "../../components/ExpertCard";
import { getFavoriteIds } from "../../lib/favorites";
import { apiFetch } from "../../lib/api";

const FALLBACK_PHOTO =
  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=900&q=80";

export default function Favorites() {
  const [experts, setExperts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const favoriteIds = getFavoriteIds();
      if (favoriteIds.length === 0) {
        setLoading(false);
        return;
      }

      try {
        const results = await Promise.all(
          favoriteIds.map((id) =>
            apiFetch(`/services/${id}`).catch(() => null)
          )
        );

        const mapped = results
          .filter(Boolean)
          .map((r) => r.data)
          .filter(Boolean)
          .map((service) => ({
            id: service._id,
            name: service.expertId?.headline || "Expert",
            title: service.title,
            category: service.categoryId?.name || "General",
            photo: FALLBACK_PHOTO,
            rating: service.expertId?.rating || 0,
            years: service.expertId?.experienceYears || 0,
            sessions: 0,
            price: service.price || 0,
            location: "India",
            languages: service.expertId?.languages || ["English"],
            verified: Boolean(service.expertId?.isVerified),
            available: service.status === "ACTIVE",
          }));

        setExperts(mapped);
      } catch (err) {
        console.error("Failed to load favorites", err);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  return (
    <div>
      <DashboardPageHeader
        title="Favorites"
        description="Experts you've saved for later. Tap the heart on an expert card to save one."
      />

      {loading ? (
        <div className="text-sm text-muted">Loading favorites...</div>
      ) : experts.length === 0 ? (
        <div className="rounded-xl2 border border-dashed border-line py-16 text-center text-muted">
          You haven't saved any experts yet. Browse experts and tap the heart icon to save them here.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {experts.map((expert) => (
            <ExpertCard key={expert.id} expert={expert} />
          ))}
        </div>
      )}
    </div>
  );
}
