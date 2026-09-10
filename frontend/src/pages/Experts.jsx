import { useEffect, useMemo, useState } from "react";
import { HiOutlineMagnifyingGlass } from "react-icons/hi2";
import ExpertCard from "../components/ExpertCard";
import Badge from "../components/Badge";
import categories from "../data/categories";
import { apiFetch } from "../lib/api";

const sortOptions = [
  "Recommended",
  "Highest Rated",
  "Most Experienced",
  "Price: Low to High",
  "Price: High to Low",
];

export default function Experts() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [sort, setSort] = useState(sortOptions[0]);
  const [query, setQuery] = useState("");
  const [experts, setExperts] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchExperts = async () => {
      setLoading(true);
      try {
        const data = await apiFetch("/services");
        const items = (data?.data || []).map((service) => ({
          id: service._id,
          name: service.expertId?.headline || "Expert",
          title: service.title,
          category: service.categoryId?.name || "General",
          photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=900&q=80",
          rating: service.expertId?.rating || 4.8,
          years: service.expertId?.experienceYears || 5,
          sessions: 800,
          price: service.price || 0,
          location: "India",
          languages: service.expertId?.languages || ["English"],
          verified: true,
          available: true,
          bio: service.description,
          expertise: [service.title],
          education: [],
          experience: [],
          sessionOptions: [{ label: service.title, price: service.price || 0 }],
        }));
        setExperts(items);
      } catch (err) {
        console.error("Failed to load experts", err);
      } finally {
        setLoading(false);
      }
    };

    fetchExperts();
  }, []);

  const filtered = useMemo(() => {
    let list = experts.filter((e) => {
      const matchesCategory = activeCategory === "All" || e.category === activeCategory;
      const matchesQuery =
        query.trim() === "" ||
        e.name.toLowerCase().includes(query.toLowerCase()) ||
        e.title.toLowerCase().includes(query.toLowerCase());
      return matchesCategory && matchesQuery;
    });

    if (sort === "Highest Rated") list = [...list].sort((a, b) => b.rating - a.rating);
    if (sort === "Most Experienced") list = [...list].sort((a, b) => b.years - a.years);
    if (sort === "Price: Low to High") list = [...list].sort((a, b) => a.price - b.price);
    if (sort === "Price: High to Low") list = [...list].sort((a, b) => b.price - a.price);

    return list;
  }, [activeCategory, sort, query, experts]);

  return (
    <div className="bg-surface">
      <section className="border-b border-line bg-card py-16">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <h1 className="font-display text-3xl font-bold text-ink sm:text-4xl">
            Find Your Expert
          </h1>
          <p className="mt-3 max-w-xl text-muted">
            Browse verified professionals across every advisory category and
            filter by experience, rating and price.
          </p>

          <div className="mt-8 flex items-center gap-3 rounded-2xl border border-line bg-surface px-4 py-3">
            <HiOutlineMagnifyingGlass className="h-5 w-5 text-muted" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              type="text"
              placeholder="Search for an expert, service or topic..."
              className="w-full bg-transparent text-sm focus:outline-none"
            />
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="flex flex-col gap-6 lg:flex-row">
            <aside className="w-full flex-none space-y-6 lg:w-64">
              <div className="rounded-xl2 border border-line bg-card p-5">
                <p className="text-xs font-semibold uppercase tracking-wide text-muted">
                  Category
                </p>
                <div className="mt-4 flex flex-wrap gap-2 lg:flex-col lg:items-start">
                  <button
                    onClick={() => setActiveCategory("All")}
                    className={`rounded-full px-3 py-1.5 text-sm font-medium transition-colors ${
                      activeCategory === "All"
                        ? "bg-emerald/10 text-emerald"
                        : "text-muted hover:bg-ink/5"
                    }`}
                  >
                    All Categories
                  </button>
                  {categories.map((cat) => (
                    <button
                      key={cat.slug}
                      onClick={() => setActiveCategory(cat.name)}
                      className={`rounded-full px-3 py-1.5 text-sm font-medium transition-colors ${
                        activeCategory === cat.name
                          ? "bg-emerald/10 text-emerald"
                          : "text-muted hover:bg-ink/5"
                      }`}
                    >
                      {cat.name}
                    </button>
                  ))}
                </div>
              </div>

              <div className="rounded-xl2 border border-line bg-card p-5">
                <p className="text-xs font-semibold uppercase tracking-wide text-muted">
                  Filters
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {["Experience", "Price", "Availability", "Rating", "Session Type"].map(
                    (f) => (
                      <Badge key={f} tone="outline">
                        {f}
                      </Badge>
                    )
                  )}
                </div>
              </div>
            </aside>

            <div className="flex-1">
              <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
                <p className="text-sm text-muted">
                  Showing <span className="font-semibold text-ink">{filtered.length}</span>{" "}
                  experts
                </p>
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value)}
                  className="rounded-full border border-line bg-card px-4 py-2 text-sm text-ink focus:outline-none"
                >
                  {sortOptions.map((opt) => (
                    <option key={opt} value={opt}>
                      Sort: {opt}
                    </option>
                  ))}
                </select>
              </div>

              {loading ? (
                <div className="mt-10 text-sm text-muted">Loading experts...</div>
              ) : (
                <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
                  {filtered.map((expert) => (
                    <ExpertCard key={expert.id} expert={expert} />
                  ))}
                </div>
              )}

              {!loading && filtered.length === 0 && (
                <div className="mt-16 rounded-xl2 border border-dashed border-line py-16 text-center">
                  <p className="text-muted">No experts match your filters yet.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
