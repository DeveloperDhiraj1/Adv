import { HiStar } from "react-icons/hi2";

export default function RatingStars({ rating = 5, showValue = true, size = "sm" }) {
  const iconSize = size === "sm" ? "h-3.5 w-3.5" : "h-4.5 w-4.5";
  const full = Math.round(rating);

  return (
    <div className="inline-flex items-center gap-1">
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((i) => (
          <HiStar
            key={i}
            className={`${iconSize} ${i <= full ? "text-emerald" : "text-line"}`}
          />
        ))}
      </div>
      {showValue && (
        <span className="text-xs font-semibold text-ink">{rating.toFixed(1)}</span>
      )}
    </div>
  );
}
