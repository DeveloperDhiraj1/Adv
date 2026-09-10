import { useEffect, useState } from "react";
import {
  HiOutlineDocumentCheck,
  HiOutlineFingerPrint,
  HiOutlineIdentification,
  HiOutlineCheckCircle,
  HiOutlineRocketLaunch,
  HiArrowUpRight,
  HiStar,
  HiOutlineVideoCamera,
  HiOutlineChatBubbleLeftRight,
} from "react-icons/hi2";
import Button from "../components/Button";
import SearchBar from "../components/SearchBar";
import SectionHeading from "../components/SectionHeading";
import CategoryCard from "../components/CategoryCard";
import ExpertCard from "../components/ExpertCard";
import TestimonialCard from "../components/TestimonialCard";
import categories from "../data/categories";
import { howItWorks, whyChooseUs, testimonials } from "../data/content";
import { heroImage, trustedLogos } from "../assets/images";
import { apiFetch } from "../lib/api";

const FALLBACK_PHOTO =
  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=900&q=80";

const verificationSteps = [
  { icon: HiOutlineDocumentCheck, label: "Submit credentials" },
  { icon: HiOutlineFingerPrint, label: "Identity verification" },
  { icon: HiOutlineIdentification, label: "Professional verification" },
  { icon: HiOutlineCheckCircle, label: "Profile approval" },
  { icon: HiOutlineRocketLaunch, label: "Start advising" },
];

const stats = [
  { value: "500+", label: "Verified Experts" },
  { value: "40K+", label: "Sessions Completed" },
  { value: "4.9", label: "Average Rating" },
];

export default function Home() {
  const [experts, setExperts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadExperts = async () => {
      try {
        const result = await apiFetch("/services?limit=6");
        const items = (result?.data || []).map((service) => ({
          id: service._id,
          name: service.expertId?.headline || "Expert",
          title: service.title,
          category: service.categoryId?.name || "General",
          photo: FALLBACK_PHOTO,
          rating: service.expertId?.rating || 0,
          years: service.expertId?.experienceYears || 0,
          sessions: 0,
          price: service.price || 0,
          location: "India",
          languages: service.expertId?.languages || ["English"],
          verified: Boolean(service.expertId?.isVerified),
          available: service.status === "ACTIVE",
        }));
        setExperts(items);
      } catch (err) {
        console.error("Failed to load featured experts", err);
      } finally {
        setLoading(false);
      }
    };

    loadExperts();
  }, []);

  const spotlight = experts[0];

  return (
    <>
      {/* Hero */}
      <section className="border-b border-line">
        <div className="mx-auto max-w-7xl px-6 pb-16 pt-14 lg:px-8 lg:pt-20">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
            <div className="lg:col-span-7">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted">
                Real Experts · Real Sessions · Real Growth
              </p>
              <h1 className="mt-5 font-display text-4xl font-semibold leading-[1.05] tracking-tight text-ink sm:text-5xl lg:text-6xl">
                Expert Advisory
                <br />
                for Every Big Decision.
              </h1>
            </div>
            <div className="flex flex-col justify-end gap-5 lg:col-span-5">
              <p className="max-w-sm text-muted lg:ml-auto lg:text-right">
                Advisory connects you with verified professionals across
                career, money, legal and personal decisions — vetted, rated
                and ready to talk today.
              </p>
              <div className="flex flex-wrap gap-3 lg:justify-end">
                <Button to="/experts" variant="accent" size="lg">
                  Book a Call
                </Button>
                <Button to="/become-an-expert" variant="outline" size="lg">
                  Become an Expert
                </Button>
              </div>
            </div>
          </div>

          {/* Floating spec card, echoing the Payload reference */}
          {spotlight && (
            <div className="relative mt-14">
              <div className="overflow-hidden rounded-xl2 border border-line bg-card shadow-cardHover">
                <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.3fr]">
                  <div className="flex flex-col justify-between p-7">
                    <div className="flex items-center gap-3">
                      <span className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald text-white">
                        <HiStar className="h-4 w-4" />
                      </span>
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wide text-muted">
                          Featured Advisor
                        </p>
                        <p className="font-display text-lg font-semibold text-ink">
                          {spotlight.name}
                        </p>
                      </div>
                    </div>

                    <p className="mt-5 text-sm leading-relaxed text-muted">
                      {spotlight.title} — helping professionals navigate career
                      transitions with a decade of hands-on leadership experience.
                    </p>

                    <div className="mt-6 grid grid-cols-3 gap-3">
                      <div className="rounded-xl border border-line px-3 py-2.5">
                        <p className="text-[11px] uppercase tracking-wide text-muted">Rating</p>
                        <p className="mt-1 font-display text-base font-semibold text-ink">
                          {spotlight.rating.toFixed(1)}
                        </p>
                      </div>
                      <div className="rounded-xl border border-line px-3 py-2.5">
                        <p className="text-[11px] uppercase tracking-wide text-muted">Price</p>
                        <p className="mt-1 font-display text-base font-semibold text-ink">
                          ₹{spotlight.price.toLocaleString()}
                        </p>
                      </div>
                      <div className="rounded-xl border border-line px-3 py-2.5">
                        <p className="text-[11px] uppercase tracking-wide text-muted">Experience</p>
                        <p className="mt-1 font-display text-base font-semibold text-ink">
                          {spotlight.years}y
                        </p>
                      </div>
                    </div>

                    <Button to={`/experts/${spotlight.id}`} variant="primary" size="md" className="mt-6 w-fit">
                      View Profile
                      <HiArrowUpRight className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="relative min-h-[280px]">
                    <img src={heroImage} alt="" className="h-full w-full object-cover" />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Static logo strip */}
      <section className="border-b border-line py-10">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <p className="text-center text-xs font-semibold uppercase tracking-widest text-muted">
            Trusted by teams at
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-x-14 gap-y-4">
            {trustedLogos.map((logo) => (
              <span key={logo} className="font-display text-xl font-semibold text-ink/30">
                {logo}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
            <SectionHeading
              eyebrow="What Do You Need Help With?"
              title="Explore advisory categories"
              description="Find the right kind of expert for your specific situation — from career moves to legal questions."
            />
            <Button to="/experts" variant="outline">
              View All Categories
            </Button>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((category, i) => (
              <CategoryCard key={category.slug} category={category} dark={i === 1} />
            ))}
          </div>
        </div>
      </section>

      {/* Bold stat band — echoing OHIO's black stats block */}
      <section className="bg-navy py-16">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid grid-cols-1 items-center gap-10 sm:grid-cols-2 lg:grid-cols-4">
            <p className="font-display text-2xl font-semibold leading-snug text-white">
              Numbers that reflect real trust, not just traffic.
            </p>
            {stats.map((s) => (
              <div key={s.label} className="border-t border-white/10 pt-4 sm:border-t-0 sm:border-l sm:pl-6">
                <p className="font-display text-4xl font-semibold text-white">{s.value}</p>
                <p className="mt-1 text-sm text-white/50">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Experts */}
      <section className="py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
            <SectionHeading
              eyebrow="Featured Advisors"
              title="Meet our top experts"
              description="High-rated professionals ready to help, chosen from thousands of verified advisors."
            />
            <Button to="/experts" variant="outline">
              View All Experts
            </Button>
          </div>

          {loading ? (
            <div className="mt-12 text-sm text-muted">Loading experts...</div>
          ) : experts.length === 0 ? (
            <div className="mt-12 rounded-xl2 border border-dashed border-line py-16 text-center text-muted">
              No experts available yet.
            </div>
          ) : (
            <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {experts.slice(0, 3).map((expert) => (
                <ExpertCard key={expert.id} expert={expert} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* App preview / device mockup */}
      <section className="border-y border-line bg-card py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid grid-cols-1 items-center gap-14 lg:grid-cols-2">
            <div>
              <SectionHeading
                eyebrow="Book From Anywhere"
                title="Your session, one tap away."
                description="Browse experts, check real-time availability, and join a video call or chat — from your phone or desktop."
              />
              <ul className="mt-8 space-y-4">
                {[
                  "Real-time availability, no back-and-forth",
                  "Secure video call or chat sessions",
                  "Instant confirmation and reminders",
                ].map((line) => (
                  <li key={line} className="flex items-center gap-3 text-sm text-muted">
                    <HiOutlineCheckCircle className="h-5 w-5 flex-none text-emerald" />
                    {line}
                  </li>
                ))}
              </ul>
              <Button to="/experts" variant="accent" size="lg" className="mt-8">
                Find an Expert
              </Button>
            </div>

            {/* Phone mockup */}
            <div className="mx-auto w-full max-w-[300px]">
              <div className="rounded-[2.25rem] border border-line bg-navy p-2 shadow-cardHover">
                <div className="overflow-hidden rounded-[1.75rem] bg-white">
                  <div className="flex items-center justify-between px-5 pt-5">
                    <p className="font-display text-sm font-semibold text-ink">Advisory</p>
                    <div className="h-2 w-2 rounded-full bg-emerald" />
                  </div>

                  <div className="mt-5 px-4">
                    <div className="rounded-2xl border border-line p-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={spotlight?.photo || FALLBACK_PHOTO}
                          alt={spotlight?.name || "Expert"}
                          className="h-10 w-10 rounded-full object-cover"
                        />
                        <div className="min-w-0">
                          <p className="truncate text-xs font-semibold text-ink">
                            {spotlight?.name || "Advisory Expert"}
                          </p>
                          <p className="truncate text-[10px] text-muted">{spotlight?.title || "Consultation"}</p>
                        </div>
                      </div>
                      <div className="mt-3 flex items-center gap-1 text-[11px] text-muted">
                        <HiStar className="h-3 w-3 text-emerald" /> {(spotlight?.rating || 0).toFixed(1)} rating
                      </div>
                    </div>

                    <p className="mt-5 text-[10px] font-semibold uppercase tracking-wider text-muted">
                      Today
                    </p>
                    <div className="mt-2 grid grid-cols-3 gap-2">
                      {["9:00", "11:00", "3:00"].map((t, i) => (
                        <div
                          key={t}
                          className={`rounded-lg border py-2 text-center text-[11px] font-medium ${
                            i === 1
                              ? "border-emerald bg-emerald/10 text-emerald"
                              : "border-line text-muted"
                          }`}
                        >
                          {t}
                        </div>
                      ))}
                    </div>

                    <div className="mt-5 flex items-center justify-between rounded-xl bg-emerald px-4 py-3">
                      <span className="text-xs font-semibold text-white">Confirm Session</span>
                      <HiArrowUpRight className="h-4 w-4 text-white" />
                    </div>

                    <div className="mt-4 mb-6 flex items-center justify-center gap-6 text-ink/25">
                      <HiOutlineVideoCamera className="h-5 w-5" />
                      <HiOutlineChatBubbleLeftRight className="h-5 w-5" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Verification */}
      <section className="py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
            <SectionHeading
              eyebrow="Built On Trust"
              title="Every expert is reviewed before joining our platform."
              description="We verify credentials, identity and professional history so you can book with complete confidence — no guesswork, no risk."
            />
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {verificationSteps.map((step, i) => (
                <div
                  key={step.label}
                  className="flex items-center gap-4 rounded-xl2 border border-line bg-card p-5 shadow-card"
                >
                  <div className="flex h-10 w-10 flex-none items-center justify-center rounded-full bg-navy text-sm font-bold text-white">
                    {i + 1}
                  </div>
                  <div className="flex items-center gap-2">
                    <step.icon className="h-5 w-5 text-emerald" />
                    <span className="text-sm font-medium text-ink">{step.label}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="bg-card py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <SectionHeading
            eyebrow="Simple Process"
            title="How Advisory works"
            description="Four simple steps stand between you and expert guidance."
          />

          <div className="mt-14 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {howItWorks.map((item) => (
              <div key={item.step} className="relative rounded-xl2 border border-line p-6">
                <item.icon className="h-8 w-8 text-emerald" />
                <p className="mt-6 font-display text-3xl font-semibold text-ink/10">
                  {item.step}
                </p>
                <h3 className="mt-2 font-display text-lg font-semibold text-ink">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why choose us */}
      <section className="py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <SectionHeading
            eyebrow="Why Advisory"
            title="Why choose Advisory"
            align="center"
            className="mx-auto text-center"
          />

          <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {whyChooseUs.map((item) => (
              <div key={item.title} className="rounded-xl2 border border-line bg-card p-6 shadow-card">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-emerald/10 text-emerald">
                  <item.icon className="h-5 w-5" />
                </div>
                <h3 className="mt-5 font-display text-lg font-semibold text-ink">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-card py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <SectionHeading
            eyebrow="Testimonials"
            title="Trusted by people making real decisions"
            align="center"
            className="mx-auto text-center"
          />
          <div className="mt-14 grid grid-cols-1 gap-6 lg:grid-cols-3">
            {testimonials.map((t) => (
              <TestimonialCard key={t.name} testimonial={t} />
            ))}
          </div>
        </div>
      </section>

      {/* Closing CTA */}
      <section className="bg-navy py-24">
        <div className="mx-auto max-w-4xl px-6 text-center lg:px-8">
          <h2 className="font-display text-3xl font-semibold text-white sm:text-4xl">
            Whatever decision you're facing,
            <br />
            there's a qualified person who can help.
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-white/60">
            Book your first session today and get guidance built around your situation.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Button to="/experts" variant="accent" size="lg">
              Find an Expert
            </Button>
            <Button to="/become-an-expert" variant="outlineLight" size="lg">
              Become an Expert
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
