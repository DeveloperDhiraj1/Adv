import { useEffect, useMemo, useState } from "react";
import { useParams, Navigate } from "react-router-dom";
import { HiOutlineMagnifyingGlass } from "react-icons/hi2";
import ExpertCard from "../components/ExpertCard";
import { apiFetch } from "../lib/api";

const FALLBACK_PHOTO =
  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=900&q=80";

export default function CategoryListing() {
  const { slug } = useParams();
  const [query, setQuery] = useState("");
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState(null);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      setLoading(true);
      try {
        const categoryResult = await apiFetch("/categories");
        const matchedCategory = (categoryResult?.data || []).find((c) => c.slug === slug);
        if (!matchedCategory) { setCategory(null); return; }
        setCategory(matchedCategory);

        const serviceResult = await apiFetch(`/services?category=${matchedCategory._id}&limit=50`);
        const items = serviceResult?.data || [];

        if (!cancelled) setServices(items);
      } catch (err) {
        console.error("Failed to load category services", err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, [slug]);

  const mapped = useMemo(
    () =>
      services.map((service) => ({
        id: service._id,
        name: service.expertId?.userId?.name || service.expertId?.headline || "Expert",
        title: service.title,
        category: service.categoryId?.name || category?.name || "General",
        photo: FALLBACK_PHOTO,
        rating: service.expertId?.rating || 0,
        years: service.expertId?.experienceYears || 0,
        sessions: Number(service.expertId?.totalReviews || 0),
        price: service.price || 0,
        location: "India",
        languages: service.expertId?.languages || ["English"],
        verified: Boolean(service.expertId?.isVerified),
        available: service.status === "ACTIVE",
      })),
    [services, category]
  );

  const filtered = mapped.filter(
    (e) =>
      query.trim() === "" ||
      e.name.toLowerCase().includes(query.toLowerCase()) ||
      e.title.toLowerCase().includes(query.toLowerCase())
  );

  if (!category) return <Navigate to="/experts" replace />;

  return (
    <div className="bg-surface">
      <section className="border-b border-line bg-card py-16">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <p className="text-xs font-semibold uppercase tracking-wide text-emerald">
            {category.name}
          </p>
          <h1 className="mt-2 font-display text-3xl font-bold text-ink sm:text-4xl">
            Find the Right {category.name} Expert
          </h1>
          <p className="mt-3 max-w-xl text-muted">{category.description}</p>

          <div className="mt-8 flex items-center gap-3 rounded-2xl border border-line bg-surface px-4 py-3 sm:max-w-md">
            <HiOutlineMagnifyingGlass className="h-5 w-5 text-muted" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={`Search ${category.name.toLowerCase()} experts...`}
              className="w-full bg-transparent text-sm focus:outline-none"
            />
          </div>
        </div>
      </section>

      <section className="py-14">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          {loading ? (
            <div className="text-sm text-muted">Loading experts...</div>
          ) : (
            <>
              <p className="mb-6 text-sm text-muted">
                <span className="font-semibold text-ink">{filtered.length}</span> experts found
              </p>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
                {filtered.map((e) => (
                  <ExpertCard key={e.id} expert={e} />
                ))}
              </div>
              {filtered.length === 0 && (
                <div className="rounded-xl2 border border-dashed border-line py-16 text-center text-muted">
                  No experts found in this category yet.
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </div>
  );
}
