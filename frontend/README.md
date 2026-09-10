# Advisory Group of India — Frontend

A React + Tailwind CSS frontend for an expert-advisory booking platform,
matching the provided design brief and reference screenshots.

## Tech Stack
- **React 19** + **Vite**
- **React Router v7** — all page groups are wired with layouts using `<Outlet />`
- **Tailwind CSS** — utility-first styling, no custom CSS files
- **react-icons** — all icons (`react-icons/hi2`, `react-icons/fa`, `react-icons/fc`)

## Getting Started
```bash
npm install
npm run dev       # start local dev server
npm run build     # production build → dist/
```

## Project Structure
```
src/
  assets/
    images.js          <- ALL image URLs live here. Replace with your own
                          photography/URLs and nothing else needs to change.
  data/
    experts.js          Sample expert profiles
    categories.js        Advisory categories
    content.js           Testimonials, "how it works", "why choose us" content
  components/            Reusable UI: Navbar, Footer, Button, ExpertCard,
                          CategoryCard, TestimonialCard, RatingStars, Badge,
                          SearchBar, StatCard, SimpleTable, DashboardSidebar, etc.
  layouts/
    MainLayout.jsx              Public site shell (Navbar + <Outlet /> + Footer)
    ExpertDashboardLayout.jsx   Expert sidebar shell + <Outlet />
    UserDashboardLayout.jsx     User sidebar shell + <Outlet />
  pages/                  One file per route (Home, Experts, ExpertProfile,
                          Booking, Login, Signup, About, Contact,
                          BecomeExpert, CategoryListing, HowItWorks, etc.)
  pages/expert-dashboard/ Expert-side dashboard pages
  pages/user-dashboard/   User-side dashboard pages
  App.jsx                 Full route tree
```

## Swapping Images
Open `src/assets/images.js`. Every image used across the site — hero
banners, login/signup side images, expert avatars — is declared there.
Replace a URL (or swap in a local import) and it updates everywhere that
image is used.

## Pages Included
- Home (hero, search, categories, featured experts, verification steps,
  how it works, why choose us, testimonials, CTA)
- Experts listing (search, category filter, sort)
- Category listing (per-category expert list)
- Expert profile (bio, expertise, experience, education, reviews, booking sidebar)
- Booking flow (session type -> date -> time -> format -> confirm)
- Login / Signup (with "I want advice" vs "I want to become an expert" toggle)
- About, Contact, How It Works, Become an Expert
- Expert Dashboard: overview, profile, calendar, appointments, messages,
  reviews, earnings, credentials, settings
- User Dashboard: overview, bookings, sessions, messages, favorites,
  reviews, payments, profile, settings
- Privacy Policy / Terms placeholder pages, 404 page

## Notes
- All data (experts, categories, testimonials, bookings, etc.) is static
  sample data in `src/data/` -- wire this up to your real API/backend.
- Forms (login, signup, contact, booking) call `e.preventDefault()` and
  don't submit anywhere yet -- hook them up to your backend as needed.
