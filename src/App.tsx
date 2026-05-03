import { useState, useEffect, useRef } from "react";

interface Service { icon: string; title: string; desc: string; }
interface Testimonial { name: string; role: string; text: string; avatar: string; }
interface FaqItem { q: string; a: string; }

const SERVICES: Service[] = [
  { icon: "🧠", title: "Individual Therapy", desc: "One-on-one sessions for anxiety, depression, trauma, and life transitions in a safe, confidential space." },
  { icon: "💑", title: "Couples Counselling", desc: "Rebuild trust, improve communication, and reconnect with your partner using evidence-based tools." },
  { icon: "🌿", title: "Mindfulness & Stress", desc: "Practical mindfulness techniques to manage stress and cultivate lasting calm in daily life." },
  { icon: "🏢", title: "Corporate Wellness", desc: "Team building, workshops, debriefing, and wellness programmes tailored for organisations." },
  { icon: "🧒", title: "Child & Adolescent", desc: "Specialised support for young people navigating emotional challenges and identity development." },
  { icon: "💻", title: "Online Sessions", desc: "Secure, confidential video sessions from wherever you are — flexible and fully professional." },
];

const TESTIMONIALS: Testimonial[] = [
  { name: "Sarah M.", role: "Individual Therapy", text: "After years of struggling with anxiety, I finally have the tools to manage my thoughts and live fully. Truly life-changing.", avatar: "SM" },
  { name: "James & Priya", role: "Couples Counselling", text: "We came on the brink of separation. Through counselling, we rediscovered what brought us together.", avatar: "JP" },
  { name: "Tom R.", role: "Mindfulness Programme", text: "My stress levels have dropped dramatically. I learned to pause, breathe, and respond rather than react.", avatar: "TR" },
  { name: "Leila H.", role: "Online Sessions", text: "The flexibility of online sessions meant I could finally prioritise my mental health without disrupting my family.", avatar: "LH" },
];

const FAQS: FaqItem[] = [
  { q: "Do I need to be in crisis to start therapy?", a: "Not at all. Therapy benefits anyone wanting to improve their wellbeing, work through challenges, or simply understand themselves better." },
  { q: "What happens in the first session?", a: "We get to know you — what brings you here, your background, and your goals. There's no pressure. It's a conversation." },
  { q: "How long will I need therapy?", a: "It varies. Some benefit from 6–12 sessions, others prefer ongoing support. We review progress together regularly." },
  { q: "Is everything confidential?", a: "Yes. What you share stays between you and your therapist, with very limited exceptions explained upfront." },
  { q: "Do you offer corporate packages?", a: "Yes — tailored corporate wellness programmes including team building, workshops, and debriefing sessions." },
];

function useReveal() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.08 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return { ref, visible };
}

function Reveal({ children, delay = 0, className = "" }: {
  children: React.ReactNode; delay?: number; className?: string;
}) {
  const { ref, visible } = useReveal();
  return (
    <div ref={ref} className={className} style={{
      opacity: visible ? 1 : 0,
      transform: visible ? "translateY(0)" : "translateY(20px)",
      transition: `opacity 0.65s ease ${delay}ms, transform 0.65s ease ${delay}ms`,
    }}>
      {children}
    </div>
  );
}

// ─── Navbar ───────────────────────────────────────────────────────────────────
function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);
  const go = (href: string) => {
    setOpen(false);
    document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
  };
  return (
    <nav style={{ fontFamily: "'DM Sans', sans-serif", background: scrolled ? "#fff" : "rgba(255,255,255,0.92)", backdropFilter: "blur(12px)" }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? "shadow-sm" : ""}`}>
      <div className="max-w-6xl mx-auto px-6 flex items-center justify-between" style={{ height: "68px" }}>
        <button onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="text-xl font-bold tracking-tight" style={{ color: "#111" }}>
          <span style={{ color: "#e91e8c" }}>Mynd</span>Works
          <span style={{ fontSize: "10px", verticalAlign: "super", color: "#999", fontWeight: 400 }}>™</span>
        </button>

        <div className="hidden md:flex items-center gap-6">
          {[["Services","#services"],["About","#about"],["FAQ","#faq"]].map(([label, href]) => (
            <button key={label} onClick={() => go(href)}
              className="text-sm font-medium transition-colors"
              style={{ color: "#555" }}
              onMouseEnter={e => (e.currentTarget.style.color = "#111")}
              onMouseLeave={e => (e.currentTarget.style.color = "#555")}>
              {label}
            </button>
          ))}
          <button onClick={() => go("#contact")}
            className="px-5 py-2.5 rounded-full text-white text-sm font-semibold transition-all hover:opacity-90"
            style={{ background: "#111" }}>
            Book Session
          </button>
        </div>

        <button className="md:hidden p-2" style={{ color: "#111" }} onClick={() => setOpen(!open)}>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {open
              ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/>
              : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16"/>}
          </svg>
        </button>
      </div>

      {open && (
        <div className="md:hidden bg-white border-t border-slate-100 px-6 py-5 space-y-2">
          {[["Services","#services"],["About","#about"],["FAQ","#faq"]].map(([label, href]) => (
            <button key={label} onClick={() => go(href)}
              className="block w-full text-left py-2.5 text-sm font-medium border-b border-slate-50" style={{ color: "#444" }}>
              {label}
            </button>
          ))}
          <button onClick={() => go("#contact")}
            className="w-full mt-3 py-3 rounded-full text-white text-sm font-semibold"
            style={{ background: "#111" }}>
            Book a Session
          </button>
        </div>
      )}
    </nav>
  );
}

// ─── Hero ─────────────────────────────────────────────────────────────────────
function Hero() {
  return (
    <section style={{ background: "#f8f6f1", minHeight: "100vh", fontFamily: "'DM Sans', sans-serif" }}
      className="relative flex items-center overflow-hidden">
      <div className="max-w-6xl mx-auto px-6 w-full py-32 md:py-0" style={{ minHeight: "100vh", display: "flex", alignItems: "center" }}>
        <div className="grid md:grid-cols-2 gap-10 items-center w-full">
          {/* Left */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest mb-6" style={{ color: "#e91e8c" }}>
              Mental Wellness Support
            </p>
            <h1 style={{ fontFamily: "'DM Serif Display', serif", fontSize: "clamp(2.8rem, 5vw, 4.2rem)", lineHeight: 1.1, color: "#111", marginBottom: "1.5rem" }}>
              Feel better.<br/>
              <span style={{ fontStyle: "italic", color: "#e91e8c" }}>Think clearer.</span>
            </h1>
            <p style={{ color: "#666", fontSize: "1.1rem", lineHeight: 1.7, maxWidth: "420px", marginBottom: "2.5rem" }}>
              Compassionate, evidence-based therapy that fits your life — in person or online.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <button onClick={() => document.querySelector("#contact")?.scrollIntoView({ behavior: "smooth" })}
                className="px-7 py-3.5 rounded-full text-white text-sm font-semibold transition-all hover:opacity-90"
                style={{ background: "#111" }}>
                Book Free Consultation
              </button>
              <button onClick={() => document.querySelector("#services")?.scrollIntoView({ behavior: "smooth" })}
                className="px-7 py-3.5 rounded-full text-sm font-semibold border transition-all hover:bg-white"
                style={{ color: "#111", borderColor: "#ddd", background: "transparent" }}>
                Our Services →
              </button>
            </div>
          </div>

          {/* Right image */}
          <div className="relative hidden md:block">
            <div className="rounded-3xl overflow-hidden" style={{ height: "540px" }}>
              <img
                src="https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=700&auto=format&fit=crop&q=80"
                alt="Therapist"
                className="w-full h-full object-cover"
                style={{ objectPosition: "top" }}
              />
            </div>
            {/* Floating card */}
            <div className="absolute -bottom-5 -left-5 bg-white rounded-2xl shadow-lg p-5"
              style={{ minWidth: "180px" }}>
              <p style={{ fontSize: "2rem", fontWeight: 700, color: "#111", lineHeight: 1 }}>98%</p>
              <p style={{ fontSize: "0.8rem", color: "#888", marginTop: "4px" }}>Client satisfaction rate</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Stats ────────────────────────────────────────────────────────────────────
function Stats() {
  const items = [
    { value: "2,000+", label: "Clients supported" },
    { value: "15+", label: "Years of experience" },
    { value: "98%", label: "Satisfaction rate" },
    { value: "6", label: "Specialist therapists" },
  ];
  return (
    <section style={{ background: "#1a1a1a", fontFamily: "'DM Sans', sans-serif" }} className="py-14">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {items.map((s, i) => (
            <Reveal key={s.label} delay={i * 80}>
              <div style={{ borderRight: i < 3 ? "1px solid rgba(255,255,255,0.08)" : "none" }} className="pr-8">
                <p style={{ fontSize: "2.2rem", fontWeight: 700, color: "#fff", lineHeight: 1 }}>{s.value}</p>
                <p style={{ fontSize: "0.8rem", color: "#888", marginTop: "6px", textTransform: "uppercase", letterSpacing: "0.05em" }}>{s.label}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Services ─────────────────────────────────────────────────────────────────
function Services() {
  return (
    <section id="services" style={{ background: "#fff", fontFamily: "'DM Sans', sans-serif" }} className="py-24">
      <div className="max-w-6xl mx-auto px-6">
        <Reveal>
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: "#e91e8c" }}>What We Offer</p>
              <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: "clamp(2rem, 4vw, 3rem)", color: "#111", lineHeight: 1.1 }}>
                Our Services
              </h2>
            </div>
            <button onClick={() => document.querySelector("#contact")?.scrollIntoView({ behavior: "smooth" })}
              className="self-start md:self-auto px-6 py-3 rounded-full text-sm font-semibold border transition-all hover:bg-slate-50"
              style={{ color: "#111", borderColor: "#ddd" }}>
              Book a session →
            </button>
          </div>
        </Reveal>

        <div className="grid md:grid-cols-3 gap-px" style={{ background: "#eee" }}>
          {SERVICES.map((s, i) => (
            <Reveal key={s.title} delay={i * 50}>
              <div className="p-8 group cursor-pointer transition-all" style={{ background: "#fff" }}
                onMouseEnter={e => (e.currentTarget.style.background = "#f8f6f1")}
                onMouseLeave={e => (e.currentTarget.style.background = "#fff")}>
                <p style={{ fontSize: "1.6rem", marginBottom: "1rem" }}>{s.icon}</p>
                <h3 style={{ fontSize: "1.05rem", fontWeight: 700, color: "#111", marginBottom: "0.6rem" }}>{s.title}</h3>
                <p style={{ fontSize: "0.875rem", color: "#777", lineHeight: 1.7 }}>{s.desc}</p>
                <p style={{ fontSize: "0.8rem", color: "#e91e8c", marginTop: "1.2rem", fontWeight: 600 }}>Learn more →</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── About ────────────────────────────────────────────────────────────────────
function About() {
  return (
    <section id="about" style={{ background: "#f8f6f1", fontFamily: "'DM Sans', sans-serif" }} className="py-24">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <Reveal className="relative">
            <div className="rounded-3xl overflow-hidden" style={{ height: "480px" }}>
              <img
                src="https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=700&auto=format&fit=crop&q=80"
                alt="Therapy space"
                className="w-full h-full object-cover"
              />
            </div>
          </Reveal>

          <Reveal delay={150}>
            <p className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: "#e91e8c" }}>About MyndWorks</p>
            <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: "clamp(2rem, 3.5vw, 2.8rem)", color: "#111", lineHeight: 1.15, marginBottom: "1.5rem" }}>
              Rooted in empathy,<br/>
              <span style={{ fontStyle: "italic" }}>driven by science.</span>
            </h2>
            <p style={{ color: "#666", lineHeight: 1.8, marginBottom: "1.2rem", fontSize: "0.95rem" }}>
              MyndWorks was founded on a simple belief — everyone deserves access to compassionate, high-quality mental health care.
            </p>
            <p style={{ color: "#666", lineHeight: 1.8, marginBottom: "2rem", fontSize: "0.95rem" }}>
              We combine CBT, EMDR, and mindfulness approaches with a deeply human style of care. Our goal is not just symptom relief, but lasting transformation.
            </p>
            <div className="grid grid-cols-2 gap-3 mb-8">
              {["Evidence-Based","Fully Confidential","In-Person & Online","Free Consultation"].map(v => (
                <div key={v} className="flex items-center gap-2.5 py-3 px-4 rounded-xl"
                  style={{ background: "#fff", border: "1px solid #eee" }}>
                  <span style={{ color: "#e91e8c", fontSize: "0.7rem" }}>✦</span>
                  <span style={{ fontSize: "0.82rem", fontWeight: 600, color: "#333" }}>{v}</span>
                </div>
              ))}
            </div>
            <button onClick={() => document.querySelector("#contact")?.scrollIntoView({ behavior: "smooth" })}
              className="px-7 py-3.5 rounded-full text-white text-sm font-semibold transition-all hover:opacity-90"
              style={{ background: "#111" }}>
              Start Your Journey
            </button>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

// ─── Testimonials ─────────────────────────────────────────────────────────────
function Testimonials() {
  const [active, setActive] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setActive(a => (a + 1) % TESTIMONIALS.length), 5000);
    return () => clearInterval(t);
  }, []);
  return (
    <section id="testimonials" style={{ background: "#fff", fontFamily: "'DM Sans', sans-serif" }} className="py-24">
      <div className="max-w-6xl mx-auto px-6">
        <Reveal className="mb-16">
          <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: "#e91e8c" }}>Client Stories</p>
          <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: "clamp(2rem, 4vw, 3rem)", color: "#111" }}>
            Real people, <span style={{ fontStyle: "italic" }}>real change.</span>
          </h2>
        </Reveal>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Featured */}
          <Reveal>
            <div className="rounded-2xl p-8 h-full flex flex-col justify-between" style={{ background: "#f8f6f1", minHeight: "260px" }}>
              <p style={{ fontSize: "1.05rem", color: "#333", lineHeight: 1.75, fontStyle: "italic" }}>
                "{TESTIMONIALS[active].text}"
              </p>
              <div className="flex items-center gap-3 mt-6">
                <div className="w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold text-white"
                  style={{ background: "#e91e8c" }}>
                  {TESTIMONIALS[active].avatar}
                </div>
                <div>
                  <p style={{ fontSize: "0.875rem", fontWeight: 700, color: "#111" }}>{TESTIMONIALS[active].name}</p>
                  <p style={{ fontSize: "0.75rem", color: "#999" }}>{TESTIMONIALS[active].role}</p>
                </div>
              </div>
            </div>
          </Reveal>

          {/* List */}
          <div className="space-y-3">
            {TESTIMONIALS.map((t, i) => (
              <Reveal key={t.name} delay={i * 60}>
                <button onClick={() => setActive(i)} className="w-full text-left p-5 rounded-2xl border transition-all"
                  style={{
                    borderColor: active === i ? "#e91e8c" : "#eee",
                    background: active === i ? "#fff0f7" : "#fff",
                  }}>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold"
                      style={{ background: active === i ? "#e91e8c" : "#f1f1f1", color: active === i ? "#fff" : "#555" }}>
                      {t.avatar}
                    </div>
                    <div>
                      <p style={{ fontSize: "0.82rem", fontWeight: 700, color: "#111" }}>{t.name}</p>
                      <p style={{ fontSize: "0.72rem", color: "#999" }}>{t.role}</p>
                    </div>
                  </div>
                </button>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── FAQ ──────────────────────────────────────────────────────────────────────
function FAQ() {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <section id="faq" style={{ background: "#f8f6f1", fontFamily: "'DM Sans', sans-serif" }} className="py-24">
      <div className="max-w-3xl mx-auto px-6">
        <Reveal className="mb-14">
          <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: "#e91e8c" }}>FAQ</p>
          <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: "clamp(2rem, 4vw, 3rem)", color: "#111" }}>
            Got questions?
          </h2>
        </Reveal>
        <div className="divide-y" style={{ borderColor: "#e5e5e5" }}>
          {FAQS.map((f, i) => (
            <Reveal key={i} delay={i * 40}>
              <div>
                <button onClick={() => setOpen(open === i ? null : i)}
                  className="w-full flex items-center justify-between py-5 text-left">
                  <span style={{ fontSize: "0.95rem", fontWeight: 600, color: open === i ? "#e91e8c" : "#111" }}>
                    {f.q}
                  </span>
                  <span style={{ color: open === i ? "#e91e8c" : "#999", fontSize: "1.2rem", lineHeight: 1, marginLeft: "1rem" }}>
                    {open === i ? "−" : "+"}
                  </span>
                </button>
                {open === i && (
                  <p style={{ fontSize: "0.875rem", color: "#666", lineHeight: 1.8, paddingBottom: "1.25rem" }}>
                    {f.a}
                  </p>
                )}
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Contact ──────────────────────────────────────────────────────────────────
function Contact() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", service: "", message: "" });
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");
    try {
      const res = await fetch("https://formspree.io/f/xeenerab", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(form),
      });
      setStatus(res.ok ? "success" : "error");
    } catch { setStatus("error"); }
  };

  const inputStyle = {
    width: "100%", padding: "12px 16px", borderRadius: "12px",
    border: "1px solid #e5e5e5", background: "#fff",
    fontSize: "0.875rem", color: "#111", outline: "none",
  };

  return (
    <section id="contact" style={{ background: "#fff", fontFamily: "'DM Sans', sans-serif" }} className="py-24">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16">
          {/* Left */}
          <Reveal>
            <p className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: "#e91e8c" }}>Get in Touch</p>
            <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: "clamp(2rem, 3.5vw, 2.8rem)", color: "#111", lineHeight: 1.15, marginBottom: "1.5rem" }}>
              Take the<br/><span style={{ fontStyle: "italic" }}>first step.</span>
            </h2>
            <p style={{ color: "#666", lineHeight: 1.8, marginBottom: "2.5rem", fontSize: "0.95rem" }}>
              Book a free 15-minute consultation. No commitment, no pressure — just a conversation.
            </p>
            <div className="space-y-4">
              {[
                { label: "Phone", value: "(076) 122-8682", href: "tel:+27761228682" },
                { label: "Email", value: "myndworkspractice@gmail.com", href: "mailto:myndworkspractice@gmail.com" },
                { label: "Instagram", value: "@myndworkspsychology", href: "https://instagram.com/myndworkspsychology" },
              ].map(c => (
                <div key={c.label}>
                  <p style={{ fontSize: "0.7rem", color: "#aaa", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "2px" }}>{c.label}</p>
                  <a href={c.href} style={{ fontSize: "0.95rem", color: "#111", fontWeight: 500, textDecoration: "none" }}
                    onMouseEnter={e => (e.currentTarget.style.color = "#e91e8c")}
                    onMouseLeave={e => (e.currentTarget.style.color = "#111")}>
                    {c.value}
                  </a>
                </div>
              ))}
            </div>
          </Reveal>

          {/* Form */}
          <Reveal delay={150}>
            {status === "success" ? (
              <div className="flex flex-col items-center justify-center h-full text-center py-16">
                <p style={{ fontSize: "3rem", marginBottom: "1rem" }}>🌿</p>
                <h3 style={{ fontSize: "1.5rem", fontWeight: 700, color: "#111", marginBottom: "0.5rem" }}>
                  Thank you, {form.name.split(" ")[0]}!
                </h3>
                <p style={{ color: "#888", fontSize: "0.9rem" }}>We'll be in touch within 24 hours.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label style={{ display: "block", fontSize: "0.7rem", color: "#aaa", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "6px" }}>Full Name *</label>
                    <input required type="text" placeholder="Jane Smith" value={form.name}
                      onChange={e => setForm({ ...form, name: e.target.value })}
                      style={inputStyle}
                      onFocus={e => (e.target.style.borderColor = "#e91e8c")}
                      onBlur={e => (e.target.style.borderColor = "#e5e5e5")}/>
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: "0.7rem", color: "#aaa", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "6px" }}>Email *</label>
                    <input required type="email" placeholder="jane@example.com" value={form.email}
                      onChange={e => setForm({ ...form, email: e.target.value })}
                      style={inputStyle}
                      onFocus={e => (e.target.style.borderColor = "#e91e8c")}
                      onBlur={e => (e.target.style.borderColor = "#e5e5e5")}/>
                  </div>
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label style={{ display: "block", fontSize: "0.7rem", color: "#aaa", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "6px" }}>Phone</label>
                    <input type="tel" placeholder="076 122 8682" value={form.phone}
                      onChange={e => setForm({ ...form, phone: e.target.value })}
                      style={inputStyle}
                      onFocus={e => (e.target.style.borderColor = "#e91e8c")}
                      onBlur={e => (e.target.style.borderColor = "#e5e5e5")}/>
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: "0.7rem", color: "#aaa", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "6px" }}>Service</label>
                    <select value={form.service} onChange={e => setForm({ ...form, service: e.target.value })}
                      style={{ ...inputStyle, appearance: "none" as const }}>
                      <option value="">Select…</option>
                      {SERVICES.map(s => <option key={s.title} value={s.title}>{s.title}</option>)}
                    </select>
                  </div>
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "0.7rem", color: "#aaa", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "6px" }}>Message</label>
                  <textarea rows={4} placeholder="Tell us what brings you here…" value={form.message}
                    onChange={e => setForm({ ...form, message: e.target.value })}
                    style={{ ...inputStyle, resize: "none" as const }}
                    onFocus={e => (e.target.style.borderColor = "#e91e8c")}
                    onBlur={e => (e.target.style.borderColor = "#e5e5e5")}/>
                </div>
                {status === "error" && (
                  <p style={{ color: "#e91e8c", fontSize: "0.82rem", textAlign: "center" }}>Something went wrong. Please try again.</p>
                )}
                <button type="submit" disabled={status === "sending"}
                  className="w-full py-4 rounded-full text-white text-sm font-semibold transition-all hover:opacity-90 disabled:opacity-50"
                  style={{ background: "#111" }}>
                  {status === "sending" ? "Sending…" : "Book Free Consultation"}
                </button>
                <p style={{ fontSize: "0.72rem", color: "#bbb", textAlign: "center" }}>
                  Strictly confidential. We never share your information.
                </p>
              </form>
            )}
          </Reveal>
        </div>
      </div>
    </section>
  );
}

// ─── Footer ───────────────────────────────────────────────────────────────────
function Footer() {
  return (
    <footer style={{ background: "#111", fontFamily: "'DM Sans', sans-serif", color: "#666" }} className="py-14">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex flex-col md:flex-row items-start justify-between gap-10 mb-12">
          <div style={{ maxWidth: "280px" }}>
            <p className="text-lg font-bold mb-3" style={{ color: "#fff" }}>
              <span style={{ color: "#e91e8c" }}>Mynd</span>Works
            </p>
            <p style={{ fontSize: "0.85rem", lineHeight: 1.7 }}>
              Professional mental wellbeing support. Compassionate, evidence-based care for every stage of life.
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-10">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: "#555" }}>Services</p>
              <ul className="space-y-2">
                {SERVICES.map(s => (
                  <li key={s.title}>
                    <a href="#services" style={{ fontSize: "0.82rem", color: "#666", textDecoration: "none" }}
                      onMouseEnter={e => (e.currentTarget.style.color = "#fff")}
                      onMouseLeave={e => (e.currentTarget.style.color = "#666")}>
                      {s.title}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: "#555" }}>Contact</p>
              <ul className="space-y-2">
                <li style={{ fontSize: "0.82rem" }}>(076) 122-8682</li>
                <li>
                  <a href="mailto:myndworkspractice@gmail.com" style={{ fontSize: "0.82rem", color: "#666", textDecoration: "none" }}
                    onMouseEnter={e => (e.currentTarget.style.color = "#fff")}
                    onMouseLeave={e => (e.currentTarget.style.color = "#666")}>
                    myndworkspractice@gmail.com
                  </a>
                </li>
                <li>
                  <a href="https://instagram.com/myndworkspsychology" style={{ fontSize: "0.82rem", color: "#666", textDecoration: "none" }}
                    onMouseEnter={e => (e.currentTarget.style.color = "#e91e8c")}
                    onMouseLeave={e => (e.currentTarget.style.color = "#666")}>
                    @myndworkspsychology
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4"
          style={{ borderTop: "1px solid #222", fontSize: "0.75rem" }}>
          <p>© {new Date().getFullYear()} MyndWorks. All rights reserved.</p>
          <p style={{ color: "#444" }}>Designed with care for mental wellbeing.</p>
        </div>
      </div>
    </footer>
  );
}

// ─── App ──────────────────────────────────────────────────────────────────────
export default function App() {
  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <Navbar/>
      <Hero/>
      <Stats/>
      <Services/>
      <About/>
      <Testimonials/>
      <FAQ/>
      <Contact/>
      <Footer/>
    </div>
  );
}