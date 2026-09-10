import { useEffect, useState } from "react";
import DashboardPageHeader from "../../components/DashboardPageHeader";
import { apiFetch } from "../../lib/api";

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ name: "", description: "", icon: "" });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const loadCategories = async () => {
    try {
      const result = await apiFetch("/categories");
      setCategories(result?.data || []);
    } catch (err) {
      console.error("Failed to load categories", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      await apiFetch("/categories/add", {
        method: "POST",
        body: JSON.stringify(form),
      });
      setForm({ name: "", description: "", icon: "" });
      loadCategories();
    } catch (err) {
      setError(err.message || "Failed to create category");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this category? Services using it may be affected.")) return;
    try {
      await apiFetch(`/categories/${id}`, { method: "DELETE" });
      loadCategories();
    } catch (err) {
      alert(err.message || "Failed to delete category");
    }
  };

  return (
    <div>
      <DashboardPageHeader
        title="Categories"
        description="Manage the categories experts can assign to their services."
      />

      <form
        onSubmit={handleSubmit}
        className="mb-8 grid grid-cols-1 gap-4 rounded-xl2 border border-line bg-card p-6 shadow-card sm:grid-cols-4"
      >
        <div className="sm:col-span-1">
          <label className="mb-1.5 block text-sm font-medium text-ink">Name</label>
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            required
            placeholder="e.g. Career Coaching"
            className="w-full rounded-xl border border-line px-4 py-2.5 text-sm focus:border-emerald focus:outline-none"
          />
        </div>
        <div className="sm:col-span-2">
          <label className="mb-1.5 block text-sm font-medium text-ink">Description</label>
          <input
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Short description"
            className="w-full rounded-xl border border-line px-4 py-2.5 text-sm focus:border-emerald focus:outline-none"
          />
        </div>
        <div className="sm:col-span-1">
          <label className="mb-1.5 block text-sm font-medium text-ink">Icon (optional)</label>
          <input
            name="icon"
            value={form.icon}
            onChange={handleChange}
            placeholder="icon name/url"
            className="w-full rounded-xl border border-line px-4 py-2.5 text-sm focus:border-emerald focus:outline-none"
          />
        </div>
        {error && <p className="text-sm text-red-500 sm:col-span-4">{error}</p>}
        <div className="sm:col-span-4">
          <button
            type="submit"
            disabled={saving}
            className="rounded-full bg-emerald px-6 py-2.5 text-sm font-semibold text-white disabled:opacity-60"
          >
            {saving ? "Adding..." : "+ Add Category"}
          </button>
        </div>
      </form>

      {loading ? (
        <div className="text-sm text-muted">Loading categories...</div>
      ) : categories.length === 0 ? (
        <div className="rounded-xl2 border border-dashed border-line py-16 text-center text-muted">
          No categories yet. Add one above — experts need at least one category to create a service.
        </div>
      ) : (
        <div className="space-y-3">
          {categories.map((category) => (
            <div
              key={category._id}
              className="flex items-center justify-between rounded-xl2 border border-line bg-card p-4 shadow-card"
            >
              <div>
                <p className="font-medium text-ink">{category.name}</p>
                {category.description && (
                  <p className="text-xs text-muted">{category.description}</p>
                )}
              </div>
              <button
                onClick={() => handleDelete(category._id)}
                className="rounded-full border border-red-200 px-4 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-50"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
