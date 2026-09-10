import { Link } from "react-router-dom";
import { HiArrowRight } from "react-icons/hi2";

export default function CategoryCard({ category, dark = false }) {
  const Icon = category.icon;

  if (dark) {
    return (
      <Link
        to={`/categories/${category.slug}`}
        className="group flex h-full flex-col justify-between rounded-xl2 bg-navy p-6 transition-transform duration-300 hover:-translate-y-1"
      >
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-emerald-light">
          <Icon className="h-6 w-6" />
        </div>
        <div>
          <h3 className="mt-5 font-display text-lg font-semibold text-white">
            The platform offers a{" "}
            <span className="text-emerald-light">{category.name.toLowerCase()}</span>-first
            experience for every client.
          </h3>
          <div className="mt-5 flex items-center justify-between border-t border-white/10 pt-4 text-sm">
            <span className="text-white/50">{category.experts} experts</span>
            <span className="inline-flex items-center gap-1 font-semibold text-white">
              Explore
              <HiArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </span>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link
      to={`/categories/${category.slug}`}
      className="group flex h-full flex-col rounded-xl2 border border-line bg-card p-6 shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-cardHover"
    >
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald/10 text-emerald transition-colors group-hover:bg-emerald group-hover:text-white">
        <Icon className="h-6 w-6" />
      </div>
      <h3 className="mt-5 font-display text-lg font-semibold text-ink">
        {category.name}
      </h3>
      <p className="mt-2 text-sm leading-relaxed text-muted">
        {category.description}
      </p>
      <div className="mt-4 flex items-center justify-between text-sm">
        <span className="text-muted">{category.experts} experts</span>
        <span className="inline-flex items-center gap-1 font-semibold text-emerald">
          Explore
          <HiArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </span>
      </div>
    </Link>
  );
}
