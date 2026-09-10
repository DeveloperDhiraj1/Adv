export default function LegalPage({ title }) {
  return (
    <div className="mx-auto max-w-3xl px-6 py-20 lg:px-8">
      <h1 className="font-display text-3xl font-bold text-ink">{title}</h1>
      <p className="mt-4 text-muted">
        This is placeholder legal copy for the {title.toLowerCase()} page. Replace
        this section with your actual policy content before launch.
      </p>
      <div className="mt-8 space-y-6 text-sm leading-relaxed text-muted">
        <p>
          Advisory Group of India ("we", "our", "us") is committed to
          protecting the privacy and rights of everyone who uses this
          platform, including people seeking advice and the experts who
          provide it.
        </p>
        <p>
          For any questions about this {title.toLowerCase()}, please reach out
          via the Contact page.
        </p>
      </div>
    </div>
  );
}
