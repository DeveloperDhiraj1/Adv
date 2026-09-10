import { HiOutlineShieldCheck, HiOutlineGlobeAlt, HiOutlineSparkles, HiOutlineEye, HiOutlineHandRaised } from "react-icons/hi2";
import SectionHeading from "../components/SectionHeading";
import { aboutHero } from "../assets/images";

const values = [
  { title: "Trust", description: "Every expert is verified before they can offer sessions.", icon: HiOutlineShieldCheck },
  { title: "Accessibility", description: "Quality guidance should be within reach for everyone.", icon: HiOutlineGlobeAlt },
  { title: "Professionalism", description: "We hold experts and our platform to a high standard.", icon: HiOutlineHandRaised },
  { title: "Transparency", description: "Clear pricing and credentials, with nothing hidden.", icon: HiOutlineEye },
  { title: "Impact", description: "We measure success by the decisions we help people make.", icon: HiOutlineSparkles },
];

export default function About() {
  return (
    <div>
      <section className="relative overflow-hidden bg-navy py-28">
        <img src={aboutHero} alt="" className="absolute inset-0 h-full w-full object-cover opacity-25" />
        <div className="absolute inset-0 bg-gradient-to-b from-navy/70 to-navy" />
        <div className="relative mx-auto max-w-4xl px-6 text-center lg:px-8">
          <h1 className="font-display text-4xl font-semibold leading-tight tracking-tight text-white sm:text-5xl">
            Making Expert Guidance Accessible to Everyone.
          </h1>
        </div>
      </section>

      <section className="py-20">
        <div className="mx-auto max-w-3xl px-6 text-center lg:px-8">
          <p className="text-lg leading-relaxed text-muted">
            Advisory Group of India exists to connect people with qualified
            professionals who can provide meaningful, personalized guidance —
            whether that's a career decision, a financial plan, or a moment
            that needs an expert's perspective.
          </p>
        </div>
      </section>

      <section className="bg-card py-20">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
            <div className="rounded-xl2 border border-line p-8">
              <h3 className="font-display text-xl font-semibold text-ink">Our Mission</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted">
                Give every person facing an important decision access to a
                verified expert who can guide them with confidence.
              </p>
            </div>
            <div className="rounded-xl2 border border-line p-8">
              <h3 className="font-display text-xl font-semibold text-ink">Our Vision</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted">
                A world where quality advice is never gated by who you know —
                only by what you need.
              </p>
            </div>
            <div className="rounded-xl2 border border-line p-8">
              <h3 className="font-display text-xl font-semibold text-ink">How We Verify Experts</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted">
                Every advisor passes identity checks, credential review and
                profile approval before they can accept a single booking.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <SectionHeading eyebrow="What We Stand For" title="Our values" align="center" className="mx-auto text-center" />
          <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-5">
            {values.map((v) => (
              <div key={v.title} className="rounded-xl2 border border-line bg-card p-6 text-center shadow-card">
                <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-emerald/10 text-emerald">
                  <v.icon className="h-5 w-5" />
                </div>
                <h3 className="mt-4 font-display text-base font-semibold text-ink">{v.title}</h3>
                <p className="mt-2 text-xs leading-relaxed text-muted">{v.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
