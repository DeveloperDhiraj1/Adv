import { useEffect, useState } from "react";
import DashboardPageHeader from "../../components/DashboardPageHeader";
import Badge from "../../components/Badge";
import { apiFetch } from "../../lib/api";

const EMPTY_FORM = {
  categoryId: "",
  title: "",
  description: "",
  duration: 30,
  price: "",
  consultationType: "VIDEO",
};

export default function Services() {
  const [services, setServices] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

    const loadData = async () => {
    try {
      const categoryResult = await apiFetch("/categories");
      setCategories(categoryResult?.data || []);
    } catch (err) {
      console.error("Failed to load categories", err);
    }

    try {
      const serviceResult = await apiFetch("/services/my-services");
      setServices(serviceResult?.data || []);
    } catch (err) {
      console.error("Failed to load services", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const openCreateForm = () => {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setError("");
    setShowForm(true);
  };

  const openEditForm = (service) => {
    setEditingId(service._id);
    setForm({
      categoryId: service.categoryId?._id || service.categoryId || "",
      title: service.title || "",
      description: service.description || "",
      duration: service.duration || 30,
      price: service.price || "",
      consultationType: service.consultationType || "VIDEO",
    });
    setError("");
    setShowForm(true);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      const payload = {
        ...form,
        duration: Number(form.duration),
        price: Number(form.price),
      };

      if (editingId) {
        await apiFetch(`/services/${editingId}`, {
          method: "PUT",
          body: JSON.stringify(payload),
        });
      } else {
        await apiFetch("/services", {
          method: "POST",
          body: JSON.stringify(payload),
        });
      }

      setShowForm(false);
      loadData();
    } catch (err) {
      setError(err.message || "Failed to save service. Make sure your expert profile is set up first.");
    } finally {
      setSaving(false);
    }
  };

  const handleDeactivate = async (id) => {
    if (!confirm("Deactivate this service? It will no longer be visible to clients.")) return;
    try {
      await apiFetch(`/services/${id}`, { method: "DELETE" });
      loadData();
    } catch (err) {
      alert(err.message || "Failed to deactivate service");
    }
  };

  const handleReactivate = async (id) => {
    try {
      await apiFetch(`/services/${id}`, {
        method: "PUT",
        body: JSON.stringify({ status: "ACTIVE" }),
      });
      loadData();
    } catch (err) {
      alert(err.message || "Failed to reactivate service");
    }
  };

  return (
    <div>
      <DashboardPageHeader
        title="My Services"
        description="Create and manage the sessions clients can book with you."
        action={
          <button
            onClick={openCreateForm}
            className="rounded-full bg-emerald px-5 py-2 text-sm font-semibold text-white hover:bg-emerald-light"
          >
            + Add Service
          </button>
        }
      />

      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="mb-8 space-y-4 rounded-xl2 border border-line bg-card p-6 shadow-card"
        >
          <h3 className="font-display text-lg font-semibold text-ink">
            {editingId ? "Edit Service" : "New Service"}
          </h3>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-ink">Title</label>
              <input
                name="title"
                value={form.title}
                onChange={handleChange}
                required
                placeholder="e.g. Career Strategy Session"
                className="w-full rounded-xl border border-line px-4 py-2.5 text-sm focus:border-emerald focus:outline-none"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-ink">Category</label>
              <select
                name="categoryId"
                value={form.categoryId}
                onChange={handleChange}
                required
                className="w-full rounded-xl border border-line px-4 py-2.5 text-sm focus:border-emerald focus:outline-none"
              >
                <option value="">Select a category</option>
                {categories.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-ink">Duration (minutes)</label>
              <input
                name="duration"
                type="number"
                min="15"
                step="15"
                value={form.duration}
                onChange={handleChange}
                required
                className="w-full rounded-xl border border-line px-4 py-2.5 text-sm focus:border-emerald focus:outline-none"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-ink">Price (₹)</label>
              <input
                name="price"
                type="number"
                min="0"
                value={form.price}
                onChange={handleChange}
                required
                className="w-full rounded-xl border border-line px-4 py-2.5 text-sm focus:border-emerald focus:outline-none"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-ink">Consultation Type</label>
              <select
                name="consultationType"
                value={form.consultationType}
                onChange={handleChange}
                className="w-full rounded-xl border border-line px-4 py-2.5 text-sm focus:border-emerald focus:outline-none"
              >
                <option value="CHAT">Chat</option>
                <option value="AUDIO">Audio</option>
                <option value="VIDEO">Video</option>
                <option value="ALL">All</option>
              </select>
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-ink">Description</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              required
              rows={3}
              placeholder="What will clients get from this session?"
              className="w-full rounded-xl border border-line px-4 py-2.5 text-sm focus:border-emerald focus:outline-none"
            />
          </div>

          {error && <p className="text-sm text-red-500">{error}</p>}

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={saving}
              className="rounded-full bg-emerald px-6 py-2.5 text-sm font-semibold text-white disabled:opacity-60"
            >
              {saving ? "Saving..." : editingId ? "Save Changes" : "Create Service"}
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="rounded-full border border-line px-6 py-2.5 text-sm font-semibold text-ink"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {loading ? (
        <div className="text-sm text-muted">Loading services...</div>
      ) : services.length === 0 ? (
        <div className="rounded-xl2 border border-dashed border-line py-16 text-center text-muted">
          You haven't added any services yet. Click "+ Add Service" to create your first bookable session.
        </div>
      ) : (
        <div className="space-y-3">
          {services.map((service) => (
            <div
              key={service._id}
              className="flex flex-wrap items-center justify-between gap-3 rounded-xl2 border border-line bg-card p-4 shadow-card"
            >
              <div>
                <div className="flex items-center gap-2">
                  <p className="font-medium text-ink">{service.title}</p>
                  <Badge tone={service.status === "ACTIVE" ? "accent" : "outline"}>
                    {service.status}
                  </Badge>
                </div>
                <p className="text-xs text-muted">
                  {service.categoryId?.name || "Uncategorized"} · {service.duration} min · ₹
                  {Number(service.price).toLocaleString()} · {service.consultationType}
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => openEditForm(service)}
                  className="rounded-full border border-line px-4 py-1.5 text-xs font-semibold text-ink"
                >
                  Edit
                </button>
                {service.status === "ACTIVE" ? (
                  <button
                    onClick={() => handleDeactivate(service._id)}
                    className="rounded-full border border-red-200 px-4 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-50"
                  >
                    Deactivate
                  </button>
                ) : (
                  <button
                    onClick={() => handleReactivate(service._id)}
                    className="rounded-full border border-emerald/30 px-4 py-1.5 text-xs font-semibold text-emerald"
                  >
                    Reactivate
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
