import { useState } from "react";
import { HiOutlineEnvelope, HiOutlinePhone, HiOutlineMapPin } from "react-icons/hi2";
import { FaLinkedinIn, FaTwitter, FaInstagram } from "react-icons/fa";
import Button from "../components/Button";
import { apiFetch } from "../lib/api";

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", subject: "", message: "" });
  const [status, setStatus] = useState("");
  const [sending, setSending] = useState(false);
  const update = (field) => (event) => setForm((current) => ({ ...current, [field]: event.target.value }));
  const submit = async (event) => {
    event.preventDefault();
    setSending(true);
    setStatus("");
    try {
      const result = await apiFetch("/public/contact", { method: "POST", body: JSON.stringify(form) });
      setStatus(result.message || "Message sent successfully.");
      setForm({ name: "", email: "", phone: "", subject: "", message: "" });
    } catch (error) { setStatus(error.message || "Unable to send message."); }
    finally { setSending(false); }
  };

  return (
    <div className="bg-surface py-20">
      <div className="mx-auto max-w-6xl px-6 lg:px-8">
        <div className="max-w-xl">
          <h1 className="font-display text-3xl font-bold text-ink sm:text-4xl">Get in Touch</h1>
          <p className="mt-3 text-muted">
            Have a question about booking, becoming an expert, or anything
            else? We'd love to hear from you.
          </p>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-10 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <div className="space-y-6">
              <ContactRow icon={HiOutlineEnvelope} label="Email" value="hello@advisorygroup.in" />
              <ContactRow icon={HiOutlinePhone} label="Phone" value="+91 80000 12345" />
              <ContactRow icon={HiOutlineMapPin} label="Office" value="BKC, Mumbai, Maharashtra, India" />
            </div>

            <div className="mt-10 flex items-center gap-3">
              {[FaLinkedinIn, FaTwitter, FaInstagram].map((Icon, i) => (
                <a key={i} href="#" className="flex h-10 w-10 items-center justify-center rounded-full border border-line text-muted hover:border-emerald hover:text-emerald">
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          <form onSubmit={submit} className="space-y-5 rounded-xl2 border border-line bg-card p-8 shadow-card lg:col-span-3">
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <Field label="Name" name="name" value={form.name} onChange={update("name")} placeholder="Your full name" />
              <Field label="Email" name="email" type="email" value={form.email} onChange={update("email")} placeholder="you@example.com" />
            </div>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <Field label="Phone" name="phone" value={form.phone} onChange={update("phone")} placeholder="+91 98765 43210" />
              <Field label="Subject" name="subject" value={form.subject} onChange={update("subject")} placeholder="What is this about?" />
            </div>
            <div>
              <label className="text-xs font-semibold uppercase tracking-wide text-muted">Message</label>
              <textarea
                rows={5}
                name="message"
                value={form.message}
                onChange={update("message")}
                placeholder="Tell us more..."
                className="mt-2 w-full rounded-xl border border-line px-4 py-3 text-sm focus:border-emerald focus:outline-none"
              />
            </div>
            {status && <p className="text-sm text-emerald">{status}</p>}
            <Button type="submit" variant="accent" size="lg" disabled={sending}>
              {sending ? "Sending..." : "Send Message"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}

function ContactRow({ icon: Icon, label, value }) {
  return (
    <div className="flex items-start gap-4">
      <div className="flex h-10 w-10 flex-none items-center justify-center rounded-full bg-emerald/10 text-emerald">
        <Icon className="h-5 w-5" />
      </div>
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-muted">{label}</p>
        <p className="mt-0.5 text-sm font-medium text-ink">{value}</p>
      </div>
    </div>
  );
}

function Field({ label, type = "text", name, value, onChange, placeholder }) {
  return (
    <div>
      <label className="text-xs font-semibold uppercase tracking-wide text-muted">{label}</label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        required
        placeholder={placeholder}
        className="mt-2 w-full rounded-xl border border-line px-4 py-3 text-sm focus:border-emerald focus:outline-none"
      />
    </div>
  );
}
