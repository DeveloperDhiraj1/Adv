import { HiOutlineMagnifyingGlass, HiOutlineAdjustmentsHorizontal } from "react-icons/hi2";
import Button from "./Button";

export default function SearchBar({ compact = false, onSearch }) {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSearch?.();
      }}
      className={`w-full rounded-2xl border border-line bg-card shadow-cardHover ${
        compact ? "p-2" : "p-3"
      }`}
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="flex flex-1 items-center gap-3 rounded-xl px-4 py-3">
          <HiOutlineMagnifyingGlass className="h-5 w-5 flex-none text-muted" />
          <input
            type="text"
            placeholder="Search for an expert, service or topic..."
            className="w-full bg-transparent text-sm text-ink placeholder:text-muted focus:outline-none"
          />
        </div>
        <div className="hidden h-8 w-px bg-line sm:block" />
        <button
          type="button"
          className="hidden items-center gap-2 px-3 text-sm font-medium text-muted hover:text-ink sm:flex"
        >
          <HiOutlineAdjustmentsHorizontal className="h-5 w-5" />
          Filters
        </button>
        <Button type="submit" variant="accent" size="md" className="w-full sm:w-auto">
          Search Experts
        </Button>
      </div>
    </form>
  );
}
