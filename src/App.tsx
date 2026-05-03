import { useState, useEffect, useRef } from "react";

interface Service { icon: string; title: string; desc: string; }
interface Testimonial { name: string; role: string; text: string; avatar: string; }
interface FaqItem { q: string; a: string; }

const BLUE = "#0ea5e9";
const DARK = "#0c1a2e";
const PINK = "#e91e8c";

const SERVICES: Service[] = [
  { icon: "🧠", title: "Individual Therapy", desc: "One-on-one sessions for anxiety, depression, trauma, and life transitions in a safe, confidential space." },
  { icon: "💑", title: "Couples Counselling", desc: "Rebuild trust, improve communication, and reconnect using evidence-based tools." },
  { icon: "🌿", title: "Mindfulness & Stress", desc: "Practical techniques to manage stress and cultivate lasting calm in daily life." },
  { icon: "🏢", title: "Corporate Wellness", desc: "Team building, workshops, debriefing, and wellness programmes for organisations." },
  { icon: "🧒", title: "Child & Adolescent", desc: "Specialised support for young people navigating emotional challenges and growth." },
  { icon: "💻", title: "Online Sessions", desc: "Secure, confidential video sessions from wherever you are — flexible and professional." },
];

const TESTIMONIALS: Testimonial[] = [
  { name: "Sarah M.", role: "Individual Therapy", text: "After years of struggling with anxiety, I finally have the tools to manage my thoughts and live fully. Truly life-changing.", avatar: "SM" },
  { name: "James & Priya", role: "Couples Counselling", text: "We came on the brink of separation. Through counselling, we rediscovered what brought us together.", avatar: "JP" },
  { name: "Tom R.", role: "Mindfulness", text: "My stress levels have dropped dramatically. I learned to pause, breathe, and respond rather than react.", avatar: "TR" },
  { name: "Leila H.", role: "Online Sessions", text: "The flexibility of online sessions meant I could finally prioritise my mental health without disrupting my family.", avatar: "LH" },
];

const FAQS: FaqItem[] = [
  { q: "Do I need to be in crisis to start therapy?", a: "Not at all. Therapy benefits anyone wanting to improve their wellbeing, work through challenges, or simply understand themselves better." },
  { q: "What happens in the first session?", a: "We get to know you — what brings you here, your background, and your goals. There's no pressure. It's a conversation." },
  { q: "Is everything confidential?", a: "Yes. What you share stays between you and your therapist, with very limited exceptions explained upfront." },
  { q: "Do you offer online and in-person sessions?", a: "We offer both. Many clients mix and match depending on their schedule and preference." },
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
      transition: `opacity 0.6s ease ${delay}ms, transform 0.6s ease ${delay}ms`,
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
    <nav style={{
      fontFamily: "'DM Sans', sans-serif",
      background: scrolled ? "rgba(255,255,255,0.97)" : "rgba(255,255,255,0.92)",
      backdropFilter: "blur(12px)",
      boxShadow: scrolled ? "0 1px 20px rgba(0,0,0,0.06)" : "none",
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 50,
      transition: "all 0.3s ease",
    }}>
      <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "0 24px", height: "68px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <button onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          style={{ background: "none", border: "none", cursor: "pointer", padding: 0 }}>
          <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "1.4rem", fontWeight: 900, letterSpacing: "-0.03em", color: DARK }}>
            <span style={{ color: PINK }}>Mynd</span>Works
          </span>
        </button>

        <div className="hidden md:flex" style={{ alignItems: "center", gap: "8px" }}>
          {[["Services","#services"],["About","#about"],["FAQ","#faq"]].map(([label, href]) => (
            <button key={label} onClick={() => go(href)}
              style={{ background: "none", border: "none", cursor: "pointer", padding: "8px 16px", borderRadius: "999px", fontSize: "0.875rem", fontWeight: 500, color: "#555", transition: "all 0.2s" }}
              onMouseEnter={e => { e.currentTarget.style.color = DARK; e.currentTarget.style.background = "#f5f5f5"; }}
              onMouseLeave={e => { e.currentTarget.style.color = "#555"; e.currentTarget.style.background = "none"; }}>
              {label}
            </button>
          ))}
          <button onClick={() => go("#contact")}
            style={{ marginLeft: "8px", padding: "10px 22px", borderRadius: "999px", background: BLUE, color: "#fff", border: "none", cursor: "pointer", fontSize: "0.875rem", fontWeight: 700, transition: "all 0.2s", boxShadow: `0 4px 14px ${BLUE}55` }}
            onMouseEnter={e => { e.currentTarget.style.transform = "scale(1.04)"; }}
            onMouseLeave={e => { e.currentTarget.style.transform = "scale(1)"; }}>
            Book Session
          </button>
        </div>

        <button className="md:hidden" onClick={() => setOpen(!open)}
          style={{ background: "none", border: "none", cursor: "pointer", padding: "8px", color: DARK }}>
          <svg width="22" height="22" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {open ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/> : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16"/>}
          </svg>
        </button>
      </div>

      {open && (
        <div style={{ background: "#fff", borderTop: "1px solid #f0f0f0", padding: "16px 24px" }}>
          {[["Services","#services"],["About","#about"],["FAQ","#faq"]].map(([label, href]) => (
            <button key={label} onClick={() => go(href)}
              style={{ display: "block", width: "100%", textAlign: "left", padding: "12px 0", background: "none", border: "none", borderBottom: "1px solid #f5f5f5", fontSize: "0.9rem", fontWeight: 500, color: DARK, cursor: "pointer" }}>
              {label}
            </button>
          ))}
          <button onClick={() => go("#contact")}
            style={{ width: "100%", marginTop: "12px", padding: "14px", borderRadius: "999px", background: BLUE, color: "#fff", border: "none", cursor: "pointer", fontSize: "0.9rem", fontWeight: 700 }}>
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
    <section style={{ background: BLUE, minHeight: "100vh", fontFamily: "'DM Sans', sans-serif", position: "relative", overflow: "hidden", display: "flex", alignItems: "center" }}>
      {/* Background circles */}
      <div style={{ position: "absolute", top: "-80px", right: "-80px", width: "400px", height: "400px", borderRadius: "50%", background: "rgba(255,255,255,0.07)", pointerEvents: "none" }}/>
      <div style={{ position: "absolute", bottom: "-60px", left: "-60px", width: "300px", height: "300px", borderRadius: "50%", background: "rgba(255,255,255,0.05)", pointerEvents: "none" }}/>

      <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "0 24px", width: "100%", paddingTop: "100px", paddingBottom: "60px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "48px", alignItems: "center" }} className="hero-grid">
          {/* Left */}
          <div>
            {/* Stars */}
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "24px" }}>
              {[...Array(5)].map((_, i) => (
                <svg key={i} width="18" height="18" fill="#f59e0b" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                </svg>
              ))}
              <span style={{ color: "rgba(255,255,255,0.9)", fontSize: "0.875rem", fontWeight: 600 }}>4.9/5 Average Rating</span>
            </div>

            <h1 style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "clamp(2.4rem, 4.5vw, 3.6rem)", fontWeight: 900, color: "#fff", lineHeight: 1.1, marginBottom: "20px", letterSpacing: "-0.02em" }}>
              Feel better.<br/>Think clearer.<br/>
              <span style={{ fontWeight: 900 }}>Mental wellness</span>{" "}
              <span style={{ fontWeight: 400 }}>support<br/>that fits your life.</span>
            </h1>

            <p style={{ color: "rgba(255,255,255,0.8)", fontSize: "1rem", lineHeight: 1.7, marginBottom: "36px", maxWidth: "400px" }}>
              Book therapy, talk to a professional, or get the guidance you need — whenever you need it.
            </p>

            <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
              <button onClick={() => document.querySelector("#contact")?.scrollIntoView({ behavior: "smooth" })}
                style={{ padding: "16px 36px", borderRadius: "999px", background: "#fff", color: DARK, border: "none", cursor: "pointer", fontSize: "1rem", fontWeight: 800, transition: "all 0.2s", boxShadow: "0 8px 24px rgba(0,0,0,0.15)" }}
                onMouseEnter={e => { e.currentTarget.style.transform = "scale(1.03)"; }}
                onMouseLeave={e => { e.currentTarget.style.transform = "scale(1)"; }}>
                Start your session
              </button>
              <button onClick={() => document.querySelector("#services")?.scrollIntoView({ behavior: "smooth" })}
                style={{ padding: "16px 28px", borderRadius: "999px", background: "rgba(255,255,255,0.15)", color: "#fff", border: "2px solid rgba(255,255,255,0.3)", cursor: "pointer", fontSize: "1rem", fontWeight: 600, transition: "all 0.2s" }}
                onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.25)"; }}
                onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.15)"; }}>
                Our services →
              </button>
            </div>
          </div>

          {/* Right */}
          <div style={{ position: "relative" }} className="hero-image-col">
            <div style={{ borderRadius: "28px", overflow: "hidden", height: "500px", position: "relative" }}>
              <img
                src="https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=700&auto=format&fit=crop&q=80"
                alt="Therapist"
                style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "top" }}
              />
            </div>
            {/* Floating confidential badge */}
            <div style={{ position: "absolute", top: "40%", left: "-20px", background: "#fff", borderRadius: "16px", padding: "14px 18px", boxShadow: "0 8px 24px rgba(0,0,0,0.12)", display: "flex", alignItems: "center", gap: "10px" }}>
              <div style={{ width: "28px", height: "28px", borderRadius: "50%", background: "#f0e6ff", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <svg width="14" height="14" fill="#7c3aed" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                </svg>
              </div>
              <span style={{ fontSize: "0.875rem", fontWeight: 700, color: DARK }}>Fully confidential</span>
            </div>
            {/* Floating rating card */}
            <div style={{ position: "absolute", bottom: "-16px", right: "-16px", background: "#fff", borderRadius: "16px", padding: "14px 20px", boxShadow: "0 8px 24px rgba(0,0,0,0.12)" }}>
              <p style={{ fontSize: "1.8rem", fontWeight: 900, color: DARK, lineHeight: 1 }}>2,000+</p>
              <p style={{ fontSize: "0.75rem", color: "#888", marginTop: "2px" }}>Lives transformed</p>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .hero-grid { grid-template-columns: 1fr !important; }
          .hero-image-col { display: none; }
        }
      `}</style>
    </section>
  );
}

// ─── Stats ────────────────────────────────────────────────────────────────────
function Stats() {
  const items = [
    { value: "2,000+", label: "Clients Supported" },
    { value: "15+", label: "Years Experience" },
    { value: "98%", label: "Satisfaction Rate" },
    { value: "6", label: "Therapists" },
  ];
  return (
    <section style={{ background: "#fff", fontFamily: "'DM Sans', sans-serif", padding: "60px 0", borderBottom: "1px solid #f0f0f0" }}>
      <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "0 24px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "32px" }} className="stats-grid">
          {items.map((s, i) => (
            <Reveal key={s.label} delay={i * 80}>
              <div style={{ textAlign: "center", padding: "24px", borderRadius: "20px", background: i % 2 === 0 ? BLUE : DARK, color: "#fff" }}>
                <p style={{ fontSize: "2.4rem", fontWeight: 900, lineHeight: 1, marginBottom: "6px" }}>{s.value}</p>
                <p style={{ fontSize: "0.78rem", color: "rgba(255,255,255,0.7)", textTransform: "uppercase", letterSpacing: "0.06em" }}>{s.label}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
      <style>{`
        @media (max-width: 640px) { .stats-grid { grid-template-columns: repeat(2,1fr) !important; } }
      `}</style>
    </section>
  );
}

// ─── Services ─────────────────────────────────────────────────────────────────
function Services() {
  return (
    <section id="services" style={{ background: "#f0f9ff", fontFamily: "'DM Sans', sans-serif", padding: "96px 0" }}>
      <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "0 24px" }}>
        <Reveal>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "56px", flexWrap: "wrap", gap: "16px" }}>
            <div>
              <p style={{ fontSize: "0.72rem", fontWeight: 700, color: BLUE, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "10px" }}>What We Offer</p>
              <h2 style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "clamp(1.8rem, 3vw, 2.6rem)", fontWeight: 900, color: DARK, lineHeight: 1.1, letterSpacing: "-0.02em" }}>
                Our Services
              </h2>
            </div>
            <button onClick={() => document.querySelector("#contact")?.scrollIntoView({ behavior: "smooth" })}
              style={{ padding: "12px 24px", borderRadius: "999px", background: BLUE, color: "#fff", border: "none", cursor: "pointer", fontSize: "0.875rem", fontWeight: 700, boxShadow: `0 4px 14px ${BLUE}44` }}>
              Explore the services →
            </button>
          </div>
        </Reveal>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "20px" }} className="services-grid">
          {SERVICES.map((s, i) => (
            <Reveal key={s.title} delay={i * 60}>
              <div style={{
                background: "#fff",
                borderRadius: "20px",
                padding: "28px",
                boxShadow: "0 2px 16px rgba(14,165,233,0.08)",
                border: "1px solid rgba(14,165,233,0.12)",
                cursor: "pointer",
                transition: "all 0.25s",
                height: "100%",
              }}
                onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.transform = "translateY(-4px)"; (e.currentTarget as HTMLDivElement).style.boxShadow = `0 12px 32px ${BLUE}22`; }}
                onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)"; (e.currentTarget as HTMLDivElement).style.boxShadow = "0 2px 16px rgba(14,165,233,0.08)"; }}>
                <div style={{ width: "48px", height: "48px", borderRadius: "14px", background: "#e0f2fe", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.5rem", marginBottom: "16px" }}>
                  {s.icon}
                </div>
                <h3 style={{ fontSize: "1rem", fontWeight: 800, color: DARK, marginBottom: "8px", letterSpacing: "-0.01em" }}>{s.title}</h3>
                <p style={{ fontSize: "0.85rem", color: "#64748b", lineHeight: 1.7 }}>{s.desc}</p>
                <p style={{ fontSize: "0.8rem", color: BLUE, fontWeight: 700, marginTop: "16px" }}>Learn more →</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
      <style>{`
        @media (max-width: 768px) { .services-grid { grid-template-columns: 1fr !important; } }
        @media (min-width: 640px) and (max-width: 768px) { .services-grid { grid-template-columns: repeat(2,1fr) !important; } }
      `}</style>
    </section>
  );
}

// ─── About ────────────────────────────────────────────────────────────────────
function About() {
  return (
    <section id="about" style={{ background: "#fff", fontFamily: "'DM Sans', sans-serif", padding: "96px 0", overflow: "hidden" }}>
      <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "0 24px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "64px", alignItems: "center" }} className="about-grid">
          <Reveal>
            <div style={{ position: "relative" }}>
              <div style={{ borderRadius: "28px", overflow: "hidden", height: "480px" }}>
                <img
                  src="https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=700&auto=format&fit=crop&q=80"
                  alt="Therapy space"
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              </div>
              {/* Floating card */}
              <div style={{ position: "absolute", bottom: "-20px", right: "-20px", background: BLUE, borderRadius: "20px", padding: "20px 24px", boxShadow: "0 12px 32px rgba(14,165,233,0.35)" }}>
                <p style={{ fontSize: "2rem", fontWeight: 900, color: "#fff", lineHeight: 1 }}>98%</p>
                <p style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.8)", marginTop: "2px" }}>Client satisfaction</p>
              </div>
            </div>
          </Reveal>

          <Reveal delay={150}>
            <p style={{ fontSize: "0.72rem", fontWeight: 700, color: BLUE, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "14px" }}>About MyndWorks</p>
            <h2 style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "clamp(1.8rem, 3vw, 2.6rem)", fontWeight: 900, color: DARK, lineHeight: 1.1, letterSpacing: "-0.02em", marginBottom: "20px" }}>
              Rooted in empathy,<br/>driven by science.
            </h2>
            <p style={{ color: "#64748b", lineHeight: 1.8, marginBottom: "14px", fontSize: "0.95rem" }}>
              MyndWorks was founded on a simple belief — everyone deserves access to compassionate, high-quality mental health care.
            </p>
            <p style={{ color: "#64748b", lineHeight: 1.8, marginBottom: "32px", fontSize: "0.95rem" }}>
              We combine CBT, EMDR, and mindfulness with a deeply human style of care. Our goal is not just symptom relief, but lasting transformation.
            </p>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "32px" }}>
              {[
                { icon: "🔬", label: "Evidence-Based", bg: "#e0f2fe" },
                { icon: "🔒", label: "Fully Confidential", bg: "#ffe4f0" },
                { icon: "🌍", label: "In-Person & Online", bg: "#e0fdf4" },
                { icon: "💬", label: "Free Consultation", bg: "#fef3c7" },
              ].map(v => (
                <div key={v.label} style={{ display: "flex", alignItems: "center", gap: "10px", padding: "12px 16px", borderRadius: "14px", background: v.bg }}>
                  <span style={{ fontSize: "1.1rem" }}>{v.icon}</span>
                  <span style={{ fontSize: "0.82rem", fontWeight: 700, color: DARK }}>{v.label}</span>
                </div>
              ))}
            </div>

            <button onClick={() => document.querySelector("#contact")?.scrollIntoView({ behavior: "smooth" })}
              style={{ padding: "14px 32px", borderRadius: "999px", background: DARK, color: "#fff", border: "none", cursor: "pointer", fontSize: "0.9rem", fontWeight: 700, transition: "all 0.2s" }}
              onMouseEnter={e => { e.currentTarget.style.background = BLUE; }}
              onMouseLeave={e => { e.currentTarget.style.background = DARK; }}>
              Start Your Journey
            </button>
          </Reveal>
        </div>
      </div>
      <style>{`@media (max-width: 768px) { .about-grid { grid-template-columns: 1fr !important; } }`}</style>
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
    <section id="testimonials" style={{ background: BLUE, fontFamily: "'DM Sans', sans-serif", padding: "96px 0" }}>
      <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "0 24px" }}>
        <Reveal>
          <p style={{ fontSize: "0.72rem", fontWeight: 700, color: "rgba(255,255,255,0.7)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "10px" }}>Client Stories</p>
          <h2 style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "clamp(1.8rem, 3vw, 2.6rem)", fontWeight: 900, color: "#fff", letterSpacing: "-0.02em", marginBottom: "48px" }}>
            Real people, real change.
          </h2>
        </Reveal>

        <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: "24px", alignItems: "start" }} className="testimonials-grid">
          <Reveal>
            <div style={{ background: "rgba(255,255,255,0.12)", backdropFilter: "blur(10px)", borderRadius: "24px", padding: "40px", border: "1px solid rgba(255,255,255,0.2)" }}>
              <div style={{ display: "flex", gap: "4px", marginBottom: "24px" }}>
                {[...Array(5)].map((_, i) => (
                  <svg key={i} width="18" height="18" fill="#f59e0b" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                  </svg>
                ))}
              </div>
              <p style={{ fontSize: "1.1rem", color: "#fff", lineHeight: 1.75, fontStyle: "italic", marginBottom: "28px" }}>
                "{TESTIMONIALS[active].text}"
              </p>
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <div style={{ width: "44px", height: "44px", borderRadius: "50%", background: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.8rem", fontWeight: 800, color: BLUE }}>
                  {TESTIMONIALS[active].avatar}
                </div>
                <div>
                  <p style={{ fontSize: "0.9rem", fontWeight: 800, color: "#fff" }}>{TESTIMONIALS[active].name}</p>
                  <p style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.65)" }}>{TESTIMONIALS[active].role}</p>
                </div>
              </div>
            </div>
          </Reveal>

          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {TESTIMONIALS.map((t, i) => (
              <Reveal key={t.name} delay={i * 60}>
                <button onClick={() => setActive(i)}
                  style={{
                    width: "100%", textAlign: "left", padding: "16px 20px", borderRadius: "16px", cursor: "pointer", transition: "all 0.2s", border: "none",
                    background: active === i ? "#fff" : "rgba(255,255,255,0.1)",
                  }}
                  onMouseEnter={e => { if (active !== i) (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.18)"; }}
                  onMouseLeave={e => { if (active !== i) (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.1)"; }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <div style={{ width: "36px", height: "36px", borderRadius: "50%", background: active === i ? BLUE : "rgba(255,255,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.72rem", fontWeight: 800, color: "#fff", flexShrink: 0 }}>
                      {t.avatar}
                    </div>
                    <div>
                      <p style={{ fontSize: "0.85rem", fontWeight: 700, color: active === i ? DARK : "#fff" }}>{t.name}</p>
                      <p style={{ fontSize: "0.72rem", color: active === i ? "#888" : "rgba(255,255,255,0.6)" }}>{t.role}</p>
                    </div>
                  </div>
                </button>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
      <style>{`@media (max-width: 768px) { .testimonials-grid { grid-template-columns: 1fr !important; } }`}</style>
    </section>
  );
}

// ─── FAQ ──────────────────────────────────────────────────────────────────────
function FAQ() {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <section id="faq" style={{ background: "#f0f9ff", fontFamily: "'DM Sans', sans-serif", padding: "96px 0" }}>
      <div style={{ maxWidth: "760px", margin: "0 auto", padding: "0 24px" }}>
        <Reveal style={{ marginBottom: "56px" }}>
          <p style={{ fontSize: "0.72rem", fontWeight: 700, color: BLUE, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "10px" }}>FAQ</p>
          <h2 style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "clamp(1.8rem, 3vw, 2.6rem)", fontWeight: 900, color: DARK, letterSpacing: "-0.02em" }}>
            Got questions?
          </h2>
        </Reveal>
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {FAQS.map((f, i) => (
            <Reveal key={i} delay={i * 40}>
              <div style={{
                borderRadius: "16px", overflow: "hidden",
                background: "#fff",
                boxShadow: open === i ? `0 4px 20px ${BLUE}18` : "0 1px 4px rgba(0,0,0,0.04)",
                border: `1px solid ${open === i ? BLUE + "44" : "#e5e5e5"}`,
                transition: "all 0.2s",
              }}>
                <button onClick={() => setOpen(open === i ? null : i)}
                  style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "20px 24px", background: "none", border: "none", cursor: "pointer", textAlign: "left" }}>
                  <span style={{ fontSize: "0.95rem", fontWeight: 700, color: open === i ? BLUE : DARK, paddingRight: "16px" }}>
                    {f.q}
                  </span>
                  <div style={{ width: "28px", height: "28px", borderRadius: "50%", background: open === i ? BLUE : "#f0f9ff", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, transition: "all 0.2s" }}>
                    <span style={{ color: open === i ? "#fff" : BLUE, fontSize: "1rem", lineHeight: 1, fontWeight: 700 }}>
                      {open === i ? "−" : "+"}
                    </span>
                  </div>
                </button>
                {open === i && (
                  <div style={{ padding: "0 24px 20px" }}>
                    <p style={{ fontSize: "0.875rem", color: "#64748b", lineHeight: 1.8 }}>{f.a}</p>
                  </div>
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

  const inp = { width: "100%", padding: "13px 16px", borderRadius: "12px", border: "1.5px solid #e2e8f0", background: "#fff", fontSize: "0.875rem", color: DARK, outline: "none", boxSizing: "border-box" as const, fontFamily: "'DM Sans', sans-serif" };

  return (
    <section id="contact" style={{ background: "#fff", fontFamily: "'DM Sans', sans-serif", padding: "96px 0" }}>
      <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "0 24px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1.2fr", gap: "64px", alignItems: "start" }} className="contact-grid">
          <Reveal>
            <p style={{ fontSize: "0.72rem", fontWeight: 700, color: BLUE, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "14px" }}>Get in Touch</p>
            <h2 style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "clamp(1.8rem, 3vw, 2.6rem)", fontWeight: 900, color: DARK, letterSpacing: "-0.02em", lineHeight: 1.1, marginBottom: "20px" }}>
              Take the<br/>first step.
            </h2>
            <p style={{ color: "#64748b", lineHeight: 1.8, marginBottom: "40px", fontSize: "0.95rem" }}>
              Book a free 15-minute consultation. No commitment, no pressure.
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              {[
                { label: "Phone", value: "(076) 122-8682", href: "tel:+27761228682" },
                { label: "Email", value: "myndworkspractice@gmail.com", href: "mailto:myndworkspractice@gmail.com" },
                { label: "Instagram", value: "@myndworkspsychology", href: "https://instagram.com/myndworkspsychology" },
              ].map(c => (
                <div key={c.label}>
                  <p style={{ fontSize: "0.68rem", color: "#aaa", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "3px" }}>{c.label}</p>
                  <a href={c.href} style={{ fontSize: "0.95rem", color: DARK, fontWeight: 600, textDecoration: "none", transition: "color 0.2s" }}
                    onMouseEnter={e => (e.currentTarget.style.color = BLUE)}
                    onMouseLeave={e => (e.currentTarget.style.color = DARK)}>
                    {c.value}
                  </a>
                </div>
              ))}
            </div>
          </Reveal>

          <Reveal delay={150}>
            <div style={{ background: "#f0f9ff", borderRadius: "28px", padding: "40px", border: "1px solid #bae6fd" }}>
              {status === "success" ? (
                <div style={{ textAlign: "center", padding: "48px 0" }}>
                  <p style={{ fontSize: "3rem", marginBottom: "16px" }}>🌿</p>
                  <h3 style={{ fontSize: "1.4rem", fontWeight: 800, color: DARK, marginBottom: "8px" }}>Thank you, {form.name.split(" ")[0]}!</h3>
                  <p style={{ color: "#64748b", fontSize: "0.9rem" }}>We'll be in touch within 24 hours.</p>
                </div>
              ) : (
                <>
                  <h3 style={{ fontSize: "1.1rem", fontWeight: 800, color: DARK, marginBottom: "24px" }}>Book a Free Consultation</h3>
                  <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                      <div>
                        <label style={{ display: "block", fontSize: "0.68rem", color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "6px" }}>Full Name *</label>
                        <input required type="text" placeholder="Jane Smith" value={form.name}
                          onChange={e => setForm({ ...form, name: e.target.value })} style={inp}
                          onFocus={e => (e.target.style.borderColor = BLUE)}
                          onBlur={e => (e.target.style.borderColor = "#e2e8f0")}/>
                      </div>
                      <div>
                        <label style={{ display: "block", fontSize: "0.68rem", color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "6px" }}>Email *</label>
                        <input required type="email" placeholder="jane@example.com" value={form.email}
                          onChange={e => setForm({ ...form, email: e.target.value })} style={inp}
                          onFocus={e => (e.target.style.borderColor = BLUE)}
                          onBlur={e => (e.target.style.borderColor = "#e2e8f0")}/>
                      </div>
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                      <div>
                        <label style={{ display: "block", fontSize: "0.68rem", color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "6px" }}>Phone</label>
                        <input type="tel" placeholder="076 122 8682" value={form.phone}
                          onChange={e => setForm({ ...form, phone: e.target.value })} style={inp}
                          onFocus={e => (e.target.style.borderColor = BLUE)}
                          onBlur={e => (e.target.style.borderColor = "#e2e8f0")}/>
                      </div>
                      <div>
                        <label style={{ display: "block", fontSize: "0.68rem", color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "6px" }}>Service</label>
                        <select value={form.service} onChange={e => setForm({ ...form, service: e.target.value })}
                          style={{ ...inp, appearance: "none" as const }}
                          onFocus={e => (e.target.style.borderColor = BLUE)}
                          onBlur={e => (e.target.style.borderColor = "#e2e8f0")}>
                          <option value="">Select…</option>
                          {SERVICES.map(s => <option key={s.title} value={s.title}>{s.title}</option>)}
                        </select>
                      </div>
                    </div>
                    <div>
                      <label style={{ display: "block", fontSize: "0.68rem", color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "6px" }}>Message</label>
                      <textarea rows={4} placeholder="Tell us what brings you here…" value={form.message}
                        onChange={e => setForm({ ...form, message: e.target.value })}
                        style={{ ...inp, resize: "none" as const }}
                        onFocus={e => (e.target.style.borderColor = BLUE)}
                        onBlur={e => (e.target.style.borderColor = "#e2e8f0")}/>
                    </div>
                    {status === "error" && <p style={{ color: "#ef4444", fontSize: "0.82rem", textAlign: "center" }}>Something went wrong. Please try again.</p>}
                    <button type="submit" disabled={status === "sending"}
                      style={{ padding: "15px", borderRadius: "999px", background: BLUE, color: "#fff", border: "none", cursor: "pointer", fontSize: "0.95rem", fontWeight: 800, boxShadow: `0 6px 20px ${BLUE}44`, transition: "all 0.2s", opacity: status === "sending" ? 0.6 : 1 }}
                      onMouseEnter={e => { e.currentTarget.style.transform = "scale(1.02)"; }}
                      onMouseLeave={e => { e.currentTarget.style.transform = "scale(1)"; }}>
                      {status === "sending" ? "Sending…" : "Book Free Consultation"}
                    </button>
                    <p style={{ fontSize: "0.72rem", color: "#94a3b8", textAlign: "center" }}>Strictly confidential. We never share your information.</p>
                  </form>
                </>
              )}
            </div>
          </Reveal>
        </div>
      </div>
      <style>{`@media (max-width: 768px) { .contact-grid { grid-template-columns: 1fr !important; } }`}</style>
    </section>
  );
}

// ─── Footer ───────────────────────────────────────────────────────────────────
function Footer() {
  return (
    <footer style={{ background: DARK, fontFamily: "'DM Sans', sans-serif", color: "#64748b", padding: "64px 0 32px" }}>
      <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "0 24px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr 1fr", gap: "48px", marginBottom: "48px" }} className="footer-grid">
          <div>
            <p style={{ fontSize: "1.3rem", fontWeight: 900, color: "#fff", marginBottom: "14px", letterSpacing: "-0.02em" }}>
              <span style={{ color: PINK }}>Mynd</span>Works
            </p>
            <p style={{ fontSize: "0.85rem", lineHeight: 1.75, maxWidth: "260px" }}>
              Professional mental wellbeing support. Compassionate, evidence-based care for every stage of life.
            </p>
          </div>
          <div>
            <p style={{ fontSize: "0.68rem", fontWeight: 700, color: "#475569", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "16px" }}>Services</p>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "10px" }}>
              {SERVICES.map(s => (
                <li key={s.title}>
                  <a href="#services" style={{ fontSize: "0.83rem", color: "#64748b", textDecoration: "none", transition: "color 0.2s" }}
                    onMouseEnter={e => (e.currentTarget.style.color = "#fff")}
                    onMouseLeave={e => (e.currentTarget.style.color = "#64748b")}>
                    {s.title}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p style={{ fontSize: "0.68rem", fontWeight: 700, color: "#475569", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "16px" }}>Contact</p>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "12px" }}>
              <li style={{ fontSize: "0.83rem" }}>(076) 122-8682</li>
              <li><a href="mailto:myndworkspractice@gmail.com" style={{ fontSize: "0.83rem", color: "#64748b", textDecoration: "none" }}
                onMouseEnter={e => (e.currentTarget.style.color = "#fff")}
                onMouseLeave={e => (e.currentTarget.style.color = "#64748b")}>
                myndworkspractice@gmail.com
              </a></li>
              <li><a href="https://instagram.com/myndworkspsychology" style={{ fontSize: "0.83rem", color: "#64748b", textDecoration: "none" }}
                onMouseEnter={e => (e.currentTarget.style.color = BLUE)}
                onMouseLeave={e => (e.currentTarget.style.color = "#64748b")}>
                @myndworkspsychology
              </a></li>
            </ul>
          </div>
        </div>
        <div style={{ borderTop: "1px solid #1e293b", paddingTop: "28px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px" }}>
          <p style={{ fontSize: "0.75rem" }}>© {new Date().getFullYear()} MyndWorks. All rights reserved.</p>
          <p style={{ fontSize: "0.75rem", color: "#334155" }}>Designed with care for mental wellbeing.</p>
        </div>
      </div>
      <style>{`@media (max-width: 768px) { .footer-grid { grid-template-columns: 1fr !important; } }`}</style>
    </footer>
  );
}

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