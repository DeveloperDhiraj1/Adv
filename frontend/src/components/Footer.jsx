import { Link } from "react-router-dom";
import {
  HiArrowUp,
  HiOutlinePaperAirplane,
} from "react-icons/hi2";
import { FaLinkedinIn, FaTwitter, FaInstagram } from "react-icons/fa";
import Button from "./Button";

const sitemap = [
  { label: "Home", to: "/" },
  { label: "About Us", to: "/about" },
  { label: "Experts", to: "/experts" },
  { label: "Contact", to: "/contact" },
];

const usefulLinks = [
  { label: "Become an Expert", to: "/become-an-expert" },
  { label: "How It Works", to: "/how-it-works" },
  { label: "Login", to: "/login" },
  { label: "Sign Up", to: "/signup" },
];

export default function Footer() {
  const scrollTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <footer className="bg-navy text-white">
      <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <Link to="/" className="font-display text-xl font-bold text-white">
              Advisory
            </Link>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-white/60">
              Providing you a platform to connect with the best experts in India.
            </p>
            <div className="mt-6 flex items-center gap-3">
              {[FaLinkedinIn, FaTwitter, FaInstagram].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 text-white/70 transition-colors hover:border-emerald hover:text-emerald"
                  aria-label="Social link"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8 lg:col-span-4 lg:grid-cols-2">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-white/40">
                Sitemap
              </p>
              <ul className="mt-4 space-y-3">
                {sitemap.map((item) => (
                  <li key={item.to}>
                    <Link to={item.to} className="text-sm text-white/70 hover:text-emerald-light">
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-white/40">
                Useful Links
              </p>
              <ul className="mt-4 space-y-3">
                {usefulLinks.map((item) => (
                  <li key={item.to}>
                    <Link to={item.to} className="text-sm text-white/70 hover:text-emerald-light">
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="lg:col-span-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-white/40">
              Newsletter
            </p>
            <p className="mt-4 text-sm text-white/70">
              Get our best expert advice in your interested field.
            </p>
            <form
              onSubmit={(e) => e.preventDefault()}
              className="mt-4 flex items-center gap-2"
            >
              <input
                type="email"
                required
                placeholder="Enter your email"
                className="w-full rounded-full border border-white/15 bg-card/5 px-4 py-2.5 text-sm text-white placeholder:text-white/40 focus:border-emerald focus:outline-none"
              />
              <button
                type="submit"
                className="flex h-10 w-10 flex-none items-center justify-center rounded-full bg-emerald text-navy transition-colors hover:bg-emerald-light"
                aria-label="Subscribe"
              >
                <HiOutlinePaperAirplane className="h-4 w-4" />
              </button>
            </form>
          </div>
        </div>

        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 sm:flex-row">
          <p className="text-xs text-white/50">
            © 2026 Advisory Group. All rights reserved.
          </p>
          <div className="flex items-center gap-6 text-xs text-white/50">
            <Link to="/privacy" className="hover:text-white">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-white">Terms of Service</Link>
            <button
              onClick={scrollTop}
              className="flex items-center gap-1 rounded-full border border-white/15 px-3 py-1.5 hover:border-emerald hover:text-emerald"
            >
              <HiArrowUp className="h-3.5 w-3.5" />
              Top
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
