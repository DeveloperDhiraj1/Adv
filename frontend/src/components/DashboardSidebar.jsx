import { NavLink, Link, useNavigate } from "react-router-dom";
import { HiOutlineArrowLeftOnRectangle } from "react-icons/hi2";

export default function DashboardSidebar({ items, basePath, roleLabel }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userRole");
    localStorage.removeItem("userId");
    localStorage.removeItem("userName");
    localStorage.removeItem("userEmail");
    navigate("/login");
  };

  return (
    <aside className="flex h-full w-64 flex-none flex-col border-r border-line bg-card">
      <div className="border-b border-line px-6 py-6">
        <Link to="/" className="font-display text-lg font-bold text-ink">
          Advisory
        </Link>
        <p className="mt-1 text-xs font-medium uppercase tracking-wide text-muted">
          {roleLabel}
        </p>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-6">
        {items.map((item) => (
          <NavLink
            key={item.to}
            to={item.external ? item.to : `${basePath}${item.to}`}
            end={item.to === ""}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                isActive
                  ? "bg-emerald/10 text-emerald"
                  : "text-muted hover:bg-ink/5 hover:text-ink"
              }`
            }
          >
            <item.icon className="h-5 w-5" />
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="border-t border-line p-3">
        <button
          type="button"
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-medium text-muted hover:bg-ink/5 hover:text-ink"
        >
          <HiOutlineArrowLeftOnRectangle className="h-5 w-5" />
          Log Out
        </button>
      </div>
    </aside>
  );
}
