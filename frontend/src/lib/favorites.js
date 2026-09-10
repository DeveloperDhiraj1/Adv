// Favorites are stored client-side (per browser) since the backend has no
// favorites/wishlist model. Keyed by service id (the same id used across
// Experts / ExpertProfile / Booking pages).
const KEY = "favoriteServiceIds";

export function getFavoriteIds() {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function isFavorite(id) {
  return getFavoriteIds().includes(id);
}

export function toggleFavorite(id) {
  const current = getFavoriteIds();
  const next = current.includes(id)
    ? current.filter((item) => item !== id)
    : [...current, id];
  localStorage.setItem(KEY, JSON.stringify(next));
  return next;
}
