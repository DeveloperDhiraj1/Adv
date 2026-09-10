import { useState } from "react";
import { HiOutlineMapPin, HiHeart, HiOutlineHeart } from "react-icons/hi2";
import RatingStars from "./RatingStars";
import { VerifiedBadge, AvailabilityDot } from "./Badge";
import Button from "./Button";
import { isFavorite, toggleFavorite } from "../lib/favorites";

export default function ExpertCard({ expert }) {
  const [favorite, setFavorite] = useState(() => isFavorite(expert.id));

  const handleToggleFavorite = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite(expert.id);
    setFavorite((prev) => !prev);
  };

  return (
    <div className="group flex flex-col overflow-hidden rounded-xl2 border border-line bg-card shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-cardHover">
      <div className="relative">
        <img
          src={expert.photo}
          alt={expert.name}
          className="h-56 w-full object-cover"
        />
        {expert.verified && (
          <VerifiedBadge className="absolute left-3 top-3 bg-card shadow-card" />
        )}
        <button
          type="button"
          onClick={handleToggleFavorite}
          aria-label={favorite ? "Remove from favorites" : "Add to favorites"}
          className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-card shadow-card"
        >
          {favorite ? (
            <HiHeart className="h-5 w-5 text-red-500" />
          ) : (
            <HiOutlineHeart className="h-5 w-5 text-ink/60" />
          )}
        </button>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <p className="text-xs font-semibold uppercase tracking-wide text-emerald">
          {expert.category}
        </p>
        <h3 className="mt-1 font-display text-lg font-semibold text-ink">
          {expert.name}
        </h3>
        <p className="text-sm text-muted">{expert.title}</p>

        <div className="mt-3 flex items-center justify-between">
          <RatingStars rating={expert.rating} />
          <AvailabilityDot available={expert.available} />
        </div>

        <div className="mt-3 flex items-center gap-1 text-xs text-muted">
          <HiOutlineMapPin className="h-4 w-4" />
          {expert.location}
        </div>

        <div className="mt-4 flex items-center justify-between border-t border-line pt-4 text-xs text-muted">
          <span>{expert.years}+ Years Experience</span>
          <span>{expert.sessions.toLocaleString()}+ Sessions</span>
        </div>

        <div className="mt-4 flex items-center justify-between">
          <p className="font-display text-lg font-bold text-ink">
            ₹{expert.price.toLocaleString()}
            <span className="text-xs font-normal text-muted"> /session</span>
          </p>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-2">
          <Button to={`/experts/${expert.id}`} variant="outline" size="sm">
            View Profile
          </Button>
          <Button to={`/book/${expert.id}`} variant="accent" size="sm">
            Book Session
          </Button>
        </div>
      </div>
    </div>
  );
}
