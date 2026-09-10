/**
 * Centralized image sources.
 * -----------------------------------------------------------------
 * Every image used across the site is declared here so you can swap
 * in your own photography/assets from one place. Replace any URL
 * below with a local import (e.g. `import hero from "./hero.jpg"`)
 * or your own hosted URL — nothing elsewhere in the app needs to change.
 * -----------------------------------------------------------------
 */

// Hero / marketing imagery (generic placeholders — replace with real photography)
export const heroImage =
  "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&w=1400&q=80";

export const becomeExpertHero =
  "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1200&q=80";

export const aboutHero =
  "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1400&q=80";

export const loginSideImage =
  "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=1000&q=80";

export const signupSideImage =
  "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=1000&q=80";

// Expert portrait placeholders — deterministic avatar service, swap with real headshots
export const expertAvatar = (seed) => `https://i.pravatar.cc/400?img=${seed}`;

// Brand logos shown in the "Trusted by" strip (text-based placeholders)
export const trustedLogos = ["subtle.", "Netflix", "Zoom", "Spotify", "Notion"];
