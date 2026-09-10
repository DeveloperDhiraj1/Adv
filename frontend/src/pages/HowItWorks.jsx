import Button from "../components/Button";
import SectionHeading from "../components/SectionHeading";
import { howItWorks, whyChooseUs } from "../data/content";

export default function HowItWorks() {
  return (
    <div>
      <section className="bg-navy py-24">
        <div className="mx-auto max-w-3xl px-6 text-center lg:px-8">
          <h1 className="font-display text-4xl font-bold text-white">How Advisory Works</h1>
          <p className="mx-auto mt-4 max-w-xl text-white/70">
            Four simple steps stand between you and expert guidance.
          </p>
        </div>
      </section>

      <section className="py-20">
        <div className="mx-auto max-w-6xl px-6 lg:px-8">
          <div className="relative grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
            {howItWorks.map((item) => (
              <div key={item.step} className="rounded-xl2 border border-line bg-card p-6 shadow-card">
                <item.icon className="h-8 w-8 text-emerald" />
                <p className="mt-6 font-display text-3xl font-bold text-ink/10">{item.step}</p>
                <h3 className="mt-2 font-display text-lg font-semibold text-ink">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-card py-20">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <SectionHeading eyebrow="Why Advisory" title="Why choose Advisory" align="center" className="mx-auto text-center" />
          <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {whyChooseUs.map((item) => (
              <div key={item.title} className="rounded-xl2 border border-line p-6">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-emerald/10 text-emerald">
                  <item.icon className="h-5 w-5" />
                </div>
                <h3 className="mt-5 font-display text-lg font-semibold text-ink">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 text-center">
        <Button to="/experts" variant="accent" size="lg">
          Find an Expert
        </Button>
      </section>
    </div>
  );
}
