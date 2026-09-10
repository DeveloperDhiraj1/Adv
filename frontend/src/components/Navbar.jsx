import { useState, useEffect } from "react";
import { NavLink, Link, useLocation, useNavigate } from "react-router-dom";
import { HiBars3, HiXMark, HiOutlineBell } from "react-icons/hi2";
import Button from "./Button";
import { apiFetch } from "../lib/api";

const links = [
  { label: "Home", to: "/" },
  { label: "About Us", to: "/about" },
  { label: "Experts", to: "/experts" },
  { label: "How It Works", to: "/how-it-works" },
  { label: "Contact", to: "/contact" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const location = useLocation();
  const navigate = useNavigate();
  const isAuthenticated = Boolean(localStorage.getItem("token"));
  const userRole = localStorage.getItem("userRole");
  const userName = localStorage.getItem("userName");

  useEffect(() => setOpen(false), [location.pathname]);

  useEffect(() => {
    if (!isAuthenticated) return;

    const loadUnreadCount = async () => {
      try {
        const data = await apiFetch("/notifications");
        setUnreadCount(data?.unreadCount || 0);
      } catch (err) {
        console.error("Failed to load unread count", err);
      }
    };

    loadUnreadCount();
    const interval = setInterval(loadUnreadCount, 30000); // Refresh every 30s
    return () => clearInterval(interval);
  }, [isAuthenticated]);

  const getDashboardPath = () => {
    if (userRole === "ADMIN") return "/admin";
    if (userRole === "EXPERT") return "/expert-dashboard";
    return "/dashboard";
  };

  const getNotificationPath = () => {
    if (userRole === "EXPERT") return "/expert-dashboard/notifications";
    if (userRole === "ADMIN") return "/admin";
    return "/dashboard/notifications";
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userRole");
    localStorage.removeItem("userId");
    localStorage.removeItem("userName");
    localStorage.removeItem("userEmail");
    navigate("/");
  };

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-surface/90 backdrop-blur-md">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-8">
        <Link to="/" className="flex items-center gap-2 font-display text-lg font-semibold text-ink">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-navy text-sm font-bold text-white">
            A
          </span>
          Advisory
        </Link>

        <div className="hidden items-center gap-8 lg:flex">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `text-sm font-medium transition-colors ${
                  isActive ? "text-emerald" : "text-ink/70 hover:text-ink"
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </div>

        <div className="hidden items-center gap-3 lg:flex">
          {isAuthenticated && (
            <Link
              to={getNotificationPath()}
              className="relative inline-flex items-center justify-center rounded-full p-2 text-ink hover:bg-ink/5"
              aria-label="Notifications"
            >
              <HiOutlineBell className="h-6 w-6" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">
                  {unreadCount > 9 ? "9+" : unreadCount}
                </span>
              )}
            </Link>
          )}
          {isAuthenticated ? (
            <>
              <Button to={getDashboardPath()} variant="ghost" size="sm">
                {userName ? `Hi, ${userName.split(" ")[0]}` : "Dashboard"}
              </Button>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                Logout
              </Button>
            </>
          ) : (
            <Button to="/login" variant="ghost" size="sm">
              Login
            </Button>
          )}
          <Button to="/experts" variant="primary" size="sm">
            Find an Expert
          </Button>
        </div>

        <button
          className="inline-flex items-center justify-center rounded-full p-2 text-ink lg:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          {open ? <HiXMark className="h-6 w-6" /> : <HiBars3 className="h-6 w-6" />}
        </button>
      </nav>

      {open && (
        <div className="border-t border-line bg-surface px-6 py-5 lg:hidden">
          <div className="flex flex-col gap-4">
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `text-sm font-medium ${isActive ? "text-emerald" : "text-ink/80"}`
                }
              >
                {link.label}
              </NavLink>
            ))}
            <div className="mt-2 flex flex-col gap-3">
              {isAuthenticated ? (
                <>
                  <Button to={getDashboardPath()} variant="outline" size="sm" className="w-full">
                    Dashboard
                  </Button>
                  <Button variant="outline" size="sm" className="w-full" onClick={handleLogout}>
                    Logout
                  </Button>
                </>
              ) : (
                <Button to="/login" variant="outline" size="sm" className="w-full">
                  Login
                </Button>
              )}
              <Button to="/experts" variant="primary" size="sm" className="w-full">
                Find an Expert
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
