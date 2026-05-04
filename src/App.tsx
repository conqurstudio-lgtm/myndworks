import { useState, useEffect, useRef } from "react";

// ─── Design tokens ────────────────────────────────────────────────────────────
const C = {
  sage:    "#6b8f71",
  sageLight: "#e8f0e9",
  sageDark: "#3d5440",
  cream:   "#faf7f2",
  warm:    "#f0ebe1",
  stone:   "#8c7b6b",
  ink:     "#1c1917",
  mist:    "#d4ddd5",
  blush:   "#e8d5cb",
  gold:    "#c9a96e",
};

interface Service  { icon: string; title: string; desc: string; }
interface Testimonial { name: string; role: string; text: string; initials: string; }
interface FaqItem  { q: string; a: string; }

const SERVICES: Service[] = [
  { icon: "◎", title: "Individual Therapy",    desc: "One-on-one sessions for anxiety, depression, trauma and life transitions in a safe, confidential space." },
  { icon: "◈", title: "Couples Counselling",   desc: "Rebuild trust, improve communication and reconnect using evidence-based tools." },
  { icon: "◉", title: "Mindfulness & Stress",  desc: "Practical techniques to manage stress and cultivate lasting calm in daily life." },
  { icon: "◐", title: "Corporate Wellness",    desc: "Team building, workshops, debriefing and wellness programmes for organisations." },
  { icon: "◑", title: "Child & Adolescent",    desc: "Specialised support for young people navigating emotional challenges and growth." },
  { icon: "◒", title: "Online Sessions",       desc: "Secure, confidential video sessions from wherever you are — flexible and professional." },
];

const TESTIMONIALS: Testimonial[] = [
  { name: "Sarah M.",      role: "Individual Therapy",   initials: "SM", text: "After years of struggling with anxiety, I finally have the tools to manage my thoughts and live fully. Truly life-changing." },
  { name: "James & Priya", role: "Couples Counselling",  initials: "JP", text: "We came on the brink of separation. Through counselling, we rediscovered what brought us together." },
  { name: "Tom R.",        role: "Mindfulness",          initials: "TR", text: "My stress levels have dropped dramatically. I learned to pause, breathe, and respond rather than react." },
  { name: "Leila H.",      role: "Online Sessions",      initials: "LH", text: "The flexibility of online sessions meant I could finally prioritise my mental health without disrupting my family." },
];

const FAQS: FaqItem[] = [
  { q: "Do I need to be in crisis to start therapy?",      a: "Not at all. Therapy benefits anyone wanting to improve their wellbeing, work through challenges, or simply understand themselves better." },
  { q: "What happens in the first session?",              a: "We get to know you — what brings you here, your background, and your goals. There's no pressure. It's a conversation." },
  { q: "Is everything confidential?",                     a: "Yes. What you share stays between you and your therapist, with very limited exceptions explained clearly upfront." },
  { q: "Do you offer online and in-person sessions?",     a: "We offer both. Many clients mix and match depending on their schedule and preference." },
  { q: "Do you offer corporate packages?",                a: "Yes — tailored corporate wellness programmes including team building, workshops, and debriefing sessions." },
];

// ─── Scroll reveal ────────────────────────────────────────────────────────────
function useReveal(threshold = 0.1) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } }, { threshold });
    obs.observe(el); return () => obs.disconnect();
  }, []);
  return { ref, visible };
}

function Reveal({ children, delay = 0, className = "", y = 28 }: { children: React.ReactNode; delay?: number; className?: string; y?: number }) {
  const { ref, visible } = useReveal();
  return (
    <div ref={ref} className={className} style={{ opacity: visible ? 1 : 0, transform: visible ? "none" : `translateY(${y}px)`, transition: `opacity 0.75s cubic-bezier(.16,1,.3,1) ${delay}ms, transform 0.75s cubic-bezier(.16,1,.3,1) ${delay}ms` }}>
      {children}
    </div>
  );
}

// ─── Global styles ────────────────────────────────────────────────────────────
const GlobalStyles = () => (
  <style>{`
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    html { scroll-behavior: smooth; }
    body { background: ${C.cream}; }
    ::selection { background: ${C.sageLight}; color: ${C.sageDark}; }

    .serif { font-family: 'DM Serif Display', Georgia, serif; }
    .sans  { font-family: 'DM Sans', system-ui, sans-serif; }

    .nav-link { background: none; border: none; cursor: pointer; font-family: 'DM Sans', sans-serif; font-size: 0.875rem; font-weight: 500; color: ${C.stone}; padding: 8px 16px; border-radius: 999px; transition: all 0.2s; }
    .nav-link:hover { color: ${C.ink}; background: ${C.warm}; }

    .btn-primary { display: inline-flex; align-items: center; gap: 8px; padding: 14px 28px; border-radius: 999px; background: ${C.sageDark}; color: #fff; border: none; cursor: pointer; font-family: 'DM Sans', sans-serif; font-size: 0.9rem; font-weight: 600; letter-spacing: 0.01em; transition: all 0.25s; }
    .btn-primary:hover { background: ${C.sage}; transform: translateY(-1px); box-shadow: 0 8px 24px ${C.sageDark}33; }

    .btn-ghost { display: inline-flex; align-items: center; gap: 8px; padding: 14px 28px; border-radius: 999px; background: transparent; color: ${C.sageDark}; border: 1.5px solid ${C.mist}; cursor: pointer; font-family: 'DM Sans', sans-serif; font-size: 0.9rem; font-weight: 600; transition: all 0.25s; }
    .btn-ghost:hover { border-color: ${C.sage}; background: ${C.sageLight}; }

    .card { background: #fff; border-radius: 24px; border: 1px solid ${C.mist}; transition: all 0.3s cubic-bezier(.16,1,.3,1); }
    .card:hover { transform: translateY(-4px); box-shadow: 0 20px 60px rgba(107,143,113,0.12); border-color: ${C.sage}44; }

    .tag { display: inline-block; font-family: 'DM Sans', sans-serif; font-size: 0.7rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.12em; color: ${C.sage}; background: ${C.sageLight}; padding: 6px 14px; border-radius: 999px; margin-bottom: 20px; }

    .section-title { font-family: 'DM Serif Display', Georgia, serif; font-size: clamp(2.2rem, 4vw, 3.2rem); color: ${C.ink}; line-height: 1.1; letter-spacing: -0.02em; }

    input, textarea, select { font-family: 'DM Sans', sans-serif; }

    @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
    @keyframes breathe { 0%,100%{transform:scale(1)} 50%{transform:scale(1.03)} }

    .float { animation: float 6s ease-in-out infinite; }
    .breathe { animation: breathe 8s ease-in-out infinite; }

    @media (max-width: 768px) {
      .hide-mobile { display: none !important; }
      .hero-grid, .about-grid, .contact-grid { grid-template-columns: 1fr !important; }
      .services-grid { grid-template-columns: 1fr !important; }
      .stats-grid { grid-template-columns: repeat(2,1fr) !important; }
      .footer-grid { grid-template-columns: 1fr !important; }
      .testimonials-grid { grid-template-columns: 1fr !important; }
    }
    @media (min-width: 640px) and (max-width: 900px) {
      .services-grid { grid-template-columns: repeat(2,1fr) !important; }
    }
  `}</style>
);

// ─── Navbar ───────────────────────────────────────────────────────────────────
function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => { const fn = () => setScrolled(window.scrollY > 30); window.addEventListener("scroll", fn); return () => window.removeEventListener("scroll", fn); }, []);
  const go = (href: string) => { setOpen(false); document.querySelector(href)?.scrollIntoView({ behavior: "smooth" }); };

  return (
    <>
      <nav style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 100, transition: "all 0.4s", background: scrolled ? "rgba(250,247,242,0.95)" : "rgba(250,247,242,0.8)", backdropFilter: "blur(16px)", borderBottom: scrolled ? `1px solid ${C.mist}` : "1px solid transparent" }}>
        <div style={{ maxWidth: "1160px", margin: "0 auto", padding: "0 28px", height: "72px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          {/* Logo */}
          <button onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: "10px" }}>
            <div style={{ width: "36px", height: "36px", borderRadius: "12px", background: C.sageDark, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round">
                <path d="M12 3C7 3 3 7 3 12s4 9 9 9 9-4 9-9-4-9-9-9z"/>
                <path d="M8 14s1.5 2 4 2 4-2 4-2"/>
                <circle cx="9" cy="10" r="1.2" fill="white" stroke="none"/>
                <circle cx="15" cy="10" r="1.2" fill="white" stroke="none"/>
              </svg>
            </div>
            <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "1.2rem", fontWeight: 800, color: C.ink, letterSpacing: "-0.02em" }}>
              <span style={{ color: C.sage }}>Mynd</span>Works
            </span>
          </button>

          {/* Desktop nav */}
          <div className="hide-mobile" style={{ display: "flex", alignItems: "center", gap: "4px" }}>
            {[["Services","#services"],["About","#about"],["FAQ","#faq"]].map(([l,h]) => (
              <button key={l} onClick={() => go(h)} className="nav-link">{l}</button>
            ))}
            <button onClick={() => go("#contact")} className="btn-primary" style={{ marginLeft: "8px", padding: "10px 22px", fontSize: "0.85rem" }}>
              Book Session
            </button>
          </div>

          {/* Mobile toggle */}
          <button onClick={() => setOpen(!open)} style={{ background: "none", border: "none", cursor: "pointer", display: "none" }} className="show-mobile-flex">
            <svg width="22" height="22" fill="none" stroke={C.ink} viewBox="0 0 24 24">
              {open ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/> : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16"/>}
            </svg>
          </button>
        </div>

        {/* Mobile menu */}
        {open && (
          <div style={{ background: C.cream, borderTop: `1px solid ${C.mist}`, padding: "20px 28px 28px" }}>
            {[["Services","#services"],["About","#about"],["FAQ","#faq"]].map(([l,h]) => (
              <button key={l} onClick={() => go(h)} style={{ display: "block", width: "100%", textAlign: "left", padding: "14px 0", background: "none", border: "none", borderBottom: `1px solid ${C.mist}`, fontFamily: "'DM Sans', sans-serif", fontSize: "1rem", fontWeight: 500, color: C.ink, cursor: "pointer" }}>{l}</button>
            ))}
            <button onClick={() => go("#contact")} className="btn-primary" style={{ width: "100%", marginTop: "16px", justifyContent: "center" }}>Book a Session</button>
          </div>
        )}
      </nav>
      <style>{`.show-mobile-flex { display: none !important; } @media(max-width:768px){.show-mobile-flex{display:flex !important;}.hide-mobile{display:none !important;}}`}</style>
    </>
  );
}

// ─── Hero ─────────────────────────────────────────────────────────────────────
function Hero() {
  return (
    <section style={{ minHeight: "100vh", background: C.cream, display: "flex", alignItems: "center", position: "relative", overflow: "hidden", fontFamily: "'DM Sans', sans-serif" }}>
      {/* Organic background shapes */}
      <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
        <div className="breathe" style={{ position: "absolute", top: "-120px", right: "-80px", width: "600px", height: "600px", borderRadius: "50%", background: `radial-gradient(circle, ${C.sageLight} 0%, transparent 70%)`, opacity: 0.7 }}/>
        <div style={{ position: "absolute", bottom: "-100px", left: "-60px", width: "400px", height: "400px", borderRadius: "50%", background: `radial-gradient(circle, ${C.blush}88 0%, transparent 70%)` }}/>
        <svg style={{ position: "absolute", top: "20%", left: "5%", opacity: 0.06 }} width="200" height="200" viewBox="0 0 200 200">
          <circle cx="100" cy="100" r="80" stroke={C.sageDark} strokeWidth="1" fill="none"/>
          <circle cx="100" cy="100" r="55" stroke={C.sageDark} strokeWidth="1" fill="none"/>
          <circle cx="100" cy="100" r="30" stroke={C.sageDark} strokeWidth="1" fill="none"/>
        </svg>
      </div>

      <div style={{ maxWidth: "1160px", margin: "0 auto", padding: "120px 28px 80px", width: "100%" }}>
        <div className="hero-grid" style={{ display: "grid", gridTemplateColumns: "1.1fr 0.9fr", gap: "60px", alignItems: "center" }}>
          {/* Left */}
          <div>
            <Reveal>
              <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: C.sageLight, border: `1px solid ${C.mist}`, borderRadius: "999px", padding: "8px 16px", marginBottom: "32px" }}>
                <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: C.sage, display: "inline-block" }}/>
                <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.8rem", fontWeight: 600, color: C.sageDark, letterSpacing: "0.04em" }}>Professional Mental Health Support</span>
              </div>
            </Reveal>

            <Reveal delay={80}>
              <h1 className="serif" style={{ fontSize: "clamp(3rem, 5.5vw, 5rem)", color: C.ink, lineHeight: 1.05, letterSpacing: "-0.03em", marginBottom: "12px" }}>
                Feel better.
              </h1>
              <h1 className="serif" style={{ fontSize: "clamp(3rem, 5.5vw, 5rem)", color: C.sage, lineHeight: 1.05, letterSpacing: "-0.03em", marginBottom: "12px", fontStyle: "italic" }}>
                Think clearer.
              </h1>
              <h1 className="serif" style={{ fontSize: "clamp(1.8rem, 3vw, 2.6rem)", color: C.stone, lineHeight: 1.2, letterSpacing: "-0.02em", fontWeight: 400, marginBottom: "32px" }}>
                Mental wellness support that fits your life.
              </h1>
            </Reveal>

            <Reveal delay={160}>
              <p style={{ fontSize: "1.05rem", color: C.stone, lineHeight: 1.8, maxWidth: "440px", marginBottom: "44px" }}>
                Compassionate, evidence-based therapy — in person or online. Take the first step toward lasting change.
              </p>
            </Reveal>

            <Reveal delay={220}>
              <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", marginBottom: "48px" }}>
                <button className="btn-primary" onClick={() => document.querySelector("#contact")?.scrollIntoView({ behavior: "smooth" })}>
                  Book Free Consultation
                  <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3"/></svg>
                </button>
                <button className="btn-ghost" onClick={() => document.querySelector("#services")?.scrollIntoView({ behavior: "smooth" })}>
                  Our Services
                </button>
              </div>
            </Reveal>

            <Reveal delay={280}>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "20px" }}>
                {["Fully Confidential", "In-Person & Online", "First Session Free"].map(t => (
                  <div key={t} style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <div style={{ width: "18px", height: "18px", borderRadius: "50%", background: C.sageLight, border: `1px solid ${C.mist}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <svg width="9" height="9" fill="none" stroke={C.sage} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7"/></svg>
                    </div>
                    <span style={{ fontSize: "0.82rem", color: C.stone, fontWeight: 500 }}>{t}</span>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>

          {/* Right — image + floating cards */}
          <Reveal delay={100} className="hide-mobile" y={40}>
            <div style={{ position: "relative" }}>
              {/* Main image */}
              <div style={{ borderRadius: "40px 40px 120px 40px", overflow: "hidden", height: "560px", boxShadow: `0 40px 80px rgba(107,143,113,0.18)` }}>
                <img
                  src="https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=800&auto=format&fit=crop&q=80"
                  alt="Therapist"
                  style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "top center" }}
                />
                <div style={{ position: "absolute", inset: 0, background: `linear-gradient(to top, ${C.sageDark}22, transparent 50%)`, borderRadius: "inherit" }}/>
              </div>

              {/* Floating stat */}
              <div className="float" style={{ position: "absolute", bottom: "40px", left: "-32px", background: "#fff", borderRadius: "20px", padding: "18px 22px", boxShadow: "0 20px 48px rgba(0,0,0,0.1)", border: `1px solid ${C.mist}` }}>
                <p style={{ fontSize: "2rem", fontWeight: 900, color: C.sageDark, lineHeight: 1, fontFamily: "'DM Serif Display', serif" }}>2,000+</p>
                <p style={{ fontSize: "0.75rem", color: C.stone, marginTop: "4px", fontFamily: "'DM Sans', sans-serif" }}>Lives transformed</p>
              </div>

              {/* Floating badge */}
              <div style={{ position: "absolute", top: "32px", right: "-20px", background: C.sageDark, borderRadius: "16px", padding: "14px 18px", boxShadow: `0 12px 32px ${C.sageDark}44` }}>
                <p style={{ fontSize: "0.72rem", fontWeight: 700, color: "rgba(255,255,255,0.7)", letterSpacing: "0.08em", textTransform: "uppercase", fontFamily: "'DM Sans', sans-serif" }}>Satisfaction</p>
                <p style={{ fontSize: "1.5rem", fontWeight: 900, color: "#fff", lineHeight: 1, fontFamily: "'DM Serif Display', serif" }}>98%</p>
              </div>

              {/* Decorative ring */}
              <div style={{ position: "absolute", top: "-20px", left: "-20px", width: "100px", height: "100px", borderRadius: "50%", border: `2px solid ${C.mist}`, opacity: 0.6 }}/>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

// ─── Stats ────────────────────────────────────────────────────────────────────
function Stats() {
  const items = [
    { value: "2,000+", label: "Clients Supported", icon: "◎" },
    { value: "15+",    label: "Years Experience",   icon: "◈" },
    { value: "98%",    label: "Satisfaction Rate",  icon: "◉" },
    { value: "6",      label: "Specialist Therapists", icon: "◐" },
  ];
  return (
    <section style={{ background: C.sageDark, fontFamily: "'DM Sans', sans-serif", padding: "64px 0" }}>
      <div style={{ maxWidth: "1160px", margin: "0 auto", padding: "0 28px" }}>
        <div className="stats-grid" style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "1px", background: "rgba(255,255,255,0.1)", borderRadius: "24px", overflow: "hidden" }}>
          {items.map((s, i) => (
            <Reveal key={s.label} delay={i * 80}>
              <div style={{ padding: "40px 32px", background: i % 2 === 0 ? C.sageDark : "#3a5040", textAlign: "center" }}>
                <p style={{ fontSize: "0.9rem", color: C.mist, marginBottom: "8px" }}>{s.icon}</p>
                <p style={{ fontFamily: "'DM Serif Display', serif", fontSize: "2.8rem", color: "#fff", lineHeight: 1, marginBottom: "8px" }}>{s.value}</p>
                <p style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.55)", textTransform: "uppercase", letterSpacing: "0.1em" }}>{s.label}</p>
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
    <section id="services" style={{ background: C.warm, padding: "112px 0", fontFamily: "'DM Sans', sans-serif" }}>
      <div style={{ maxWidth: "1160px", margin: "0 auto", padding: "0 28px" }}>
        <Reveal>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "64px", gap: "24px", flexWrap: "wrap" }}>
            <div>
              <div className="tag">What We Offer</div>
              <h2 className="section-title">
                Support for<br/>
                <span className="serif" style={{ color: C.sage, fontStyle: "italic" }}>every journey</span>
              </h2>
            </div>
            <button className="btn-ghost" onClick={() => document.querySelector("#contact")?.scrollIntoView({ behavior: "smooth" })}>
              Book a session →
            </button>
          </div>
        </Reveal>

        <div className="services-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "20px" }}>
          {SERVICES.map((s, i) => (
            <Reveal key={s.title} delay={i * 60}>
              <div className="card" style={{ padding: "32px", background: "#fff", cursor: "pointer" }}>
                <div style={{ width: "48px", height: "48px", borderRadius: "16px", background: C.sageLight, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.4rem", color: C.sage, marginBottom: "20px", fontWeight: 300 }}>
                  {s.icon}
                </div>
                <h3 style={{ fontFamily: "'DM Serif Display', serif", fontSize: "1.25rem", color: C.ink, marginBottom: "12px" }}>{s.title}</h3>
                <p style={{ fontSize: "0.875rem", color: C.stone, lineHeight: 1.75 }}>{s.desc}</p>
                <div style={{ marginTop: "24px", display: "flex", alignItems: "center", gap: "6px", color: C.sage, fontSize: "0.82rem", fontWeight: 600 }}>
                  Learn more
                  <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3"/></svg>
                </div>
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
    <section id="about" style={{ background: C.cream, padding: "112px 0", overflow: "hidden", fontFamily: "'DM Sans', sans-serif" }}>
      <div style={{ maxWidth: "1160px", margin: "0 auto", padding: "0 28px" }}>
        <div className="about-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "80px", alignItems: "center" }}>
          <Reveal y={40}>
            <div style={{ position: "relative" }}>
              <div style={{ borderRadius: "48px 48px 48px 120px", overflow: "hidden", height: "520px", boxShadow: `0 32px 80px rgba(107,143,113,0.15)` }}>
                <img
                  src="https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=800&auto=format&fit=crop&q=80"
                  alt="Therapy space"
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              </div>
              {/* Floating card */}
              <div className="float" style={{ position: "absolute", bottom: "-24px", right: "-24px", background: C.gold, borderRadius: "20px", padding: "20px 24px", boxShadow: "0 16px 40px rgba(201,169,110,0.35)" }}>
                <p style={{ fontSize: "0.68rem", fontWeight: 700, color: "rgba(255,255,255,0.8)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "4px" }}>Est.</p>
                <p style={{ fontFamily: "'DM Serif Display', serif", fontSize: "2rem", color: "#fff", lineHeight: 1 }}>2009</p>
              </div>
              {/* Decorative element */}
              <div style={{ position: "absolute", top: "-16px", right: "40px", width: "80px", height: "80px", borderRadius: "50%", background: C.blush, opacity: 0.6 }}/>
            </div>
          </Reveal>

          <Reveal delay={120}>
            <div className="tag">About MyndWorks</div>
            <h2 className="section-title" style={{ marginBottom: "24px" }}>
              Rooted in empathy,<br/>
              <span style={{ color: C.sage, fontStyle: "italic" }}>driven by science.</span>
            </h2>
            <p style={{ fontSize: "0.95rem", color: C.stone, lineHeight: 1.85, marginBottom: "16px" }}>
              MyndWorks was founded on a simple belief — everyone deserves access to compassionate, high-quality mental health care.
            </p>
            <p style={{ fontSize: "0.95rem", color: C.stone, lineHeight: 1.85, marginBottom: "40px" }}>
              We combine CBT, EMDR, and mindfulness with a deeply human style of care. Our goal is not just symptom relief, but lasting transformation.
            </p>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "40px" }}>
              {[
                { icon: "🌱", label: "Evidence-Based" },
                { icon: "🔒", label: "Fully Confidential" },
                { icon: "🌍", label: "In-Person & Online" },
                { icon: "💬", label: "Free Consultation" },
              ].map(v => (
                <div key={v.label} style={{ display: "flex", alignItems: "center", gap: "10px", padding: "14px 16px", borderRadius: "14px", background: C.sageLight, border: `1px solid ${C.mist}` }}>
                  <span>{v.icon}</span>
                  <span style={{ fontSize: "0.82rem", fontWeight: 600, color: C.sageDark }}>{v.label}</span>
                </div>
              ))}
            </div>

            <button className="btn-primary" onClick={() => document.querySelector("#contact")?.scrollIntoView({ behavior: "smooth" })}>
              Start Your Journey
              <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3"/></svg>
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
  useEffect(() => { const t = setInterval(() => setActive(a => (a + 1) % TESTIMONIALS.length), 5500); return () => clearInterval(t); }, []);

  return (
    <section id="testimonials" style={{ background: C.sageDark, padding: "112px 0", fontFamily: "'DM Sans', sans-serif", position: "relative", overflow: "hidden" }}>
      {/* Decorative */}
      <div style={{ position: "absolute", top: "-100px", right: "-100px", width: "400px", height: "400px", borderRadius: "50%", background: "rgba(255,255,255,0.03)", pointerEvents: "none" }}/>

      <div style={{ maxWidth: "1160px", margin: "0 auto", padding: "0 28px" }}>
        <Reveal>
          <div style={{ marginBottom: "60px" }}>
            <div style={{ display: "inline-block", fontSize: "0.7rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", color: C.mist, background: "rgba(255,255,255,0.08)", padding: "6px 14px", borderRadius: "999px", marginBottom: "20px" }}>
              Client Stories
            </div>
            <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: "clamp(2.2rem, 4vw, 3.2rem)", color: "#fff", letterSpacing: "-0.02em" }}>
              Real people, <span style={{ fontStyle: "italic", color: C.mist }}>real change.</span>
            </h2>
          </div>
        </Reveal>

        <div className="testimonials-grid" style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr", gap: "28px" }}>
          {/* Featured quote */}
          <Reveal>
            <div style={{ background: "rgba(255,255,255,0.06)", borderRadius: "28px", padding: "48px", border: "1px solid rgba(255,255,255,0.1)", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
              <div>
                <div style={{ display: "flex", gap: "4px", marginBottom: "28px" }}>
                  {[...Array(5)].map((_,i) => <span key={i} style={{ color: C.gold, fontSize: "1.1rem" }}>★</span>)}
                </div>
                <p style={{ fontFamily: "'DM Serif Display', serif", fontSize: "clamp(1.1rem, 2vw, 1.4rem)", color: "#fff", lineHeight: 1.65, fontStyle: "italic", marginBottom: "40px" }}>
                  "{TESTIMONIALS[active].text}"
                </p>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                <div style={{ width: "48px", height: "48px", borderRadius: "50%", background: C.sage, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.8rem", fontWeight: 800, color: "#fff", flexShrink: 0 }}>
                  {TESTIMONIALS[active].initials}
                </div>
                <div>
                  <p style={{ fontSize: "0.9rem", fontWeight: 700, color: "#fff" }}>{TESTIMONIALS[active].name}</p>
                  <p style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.5)" }}>{TESTIMONIALS[active].role}</p>
                </div>
              </div>
            </div>
          </Reveal>

          {/* Selector list */}
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {TESTIMONIALS.map((t, i) => (
              <Reveal key={t.name} delay={i * 60}>
                <button onClick={() => setActive(i)} style={{
                  width: "100%", textAlign: "left", padding: "20px 22px", borderRadius: "18px", cursor: "pointer", border: "none", transition: "all 0.3s",
                  background: active === i ? "#fff" : "rgba(255,255,255,0.06)",
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    <div style={{ width: "40px", height: "40px", borderRadius: "50%", background: active === i ? C.sageDark : "rgba(255,255,255,0.15)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.72rem", fontWeight: 800, color: active === i ? "#fff" : "rgba(255,255,255,0.7)", flexShrink: 0, transition: "all 0.3s" }}>
                      {t.initials}
                    </div>
                    <div>
                      <p style={{ fontSize: "0.875rem", fontWeight: 700, color: active === i ? C.ink : "#fff" }}>{t.name}</p>
                      <p style={{ fontSize: "0.72rem", color: active === i ? C.stone : "rgba(255,255,255,0.5)" }}>{t.role}</p>
                    </div>
                  </div>
                </button>
              </Reveal>
            ))}
            {/* Progress dots */}
            <div style={{ display: "flex", gap: "8px", paddingTop: "8px", paddingLeft: "4px" }}>
              {TESTIMONIALS.map((_, i) => (
                <button key={i} onClick={() => setActive(i)} style={{ border: "none", cursor: "pointer", borderRadius: "999px", height: "4px", transition: "all 0.3s", background: active === i ? C.mist : "rgba(255,255,255,0.2)", width: active === i ? "24px" : "8px" }}/>
              ))}
            </div>
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
    <section id="faq" style={{ background: C.warm, padding: "112px 0", fontFamily: "'DM Sans', sans-serif" }}>
      <div style={{ maxWidth: "780px", margin: "0 auto", padding: "0 28px" }}>
        <Reveal>
          <div className="tag">Common Questions</div>
          <h2 className="section-title" style={{ marginBottom: "56px" }}>
            Got <span style={{ color: C.sage, fontStyle: "italic" }}>questions?</span>
          </h2>
        </Reveal>

        <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
          {FAQS.map((f, i) => (
            <Reveal key={i} delay={i * 40}>
              <div style={{ borderBottom: `1px solid ${C.mist}` }}>
                <button onClick={() => setOpen(open === i ? null : i)} style={{ width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center", padding: "24px 0", background: "none", border: "none", cursor: "pointer", textAlign: "left", gap: "16px" }}>
                  <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.95rem", fontWeight: 600, color: open === i ? C.sageDark : C.ink, transition: "color 0.2s" }}>{f.q}</span>
                  <div style={{ width: "32px", height: "32px", borderRadius: "50%", background: open === i ? C.sageDark : C.sageLight, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, transition: "all 0.3s", color: open === i ? "#fff" : C.sage, fontSize: "1.2rem", lineHeight: 1 }}>
                    {open === i ? "−" : "+"}
                  </div>
                </button>
                {open === i && (
                  <p style={{ fontSize: "0.9rem", color: C.stone, lineHeight: 1.85, paddingBottom: "24px", paddingRight: "48px" }}>{f.a}</p>
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
  const [status, setStatus] = useState<"idle"|"sending"|"success"|"error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setStatus("sending");
    try {
      const res = await fetch("https://formspree.io/f/xeenerab", { method: "POST", headers: { "Content-Type": "application/json", Accept: "application/json" }, body: JSON.stringify(form) });
      setStatus(res.ok ? "success" : "error");
    } catch { setStatus("error"); }
  };

  const inp: React.CSSProperties = { width: "100%", padding: "14px 18px", borderRadius: "14px", border: `1.5px solid ${C.mist}`, background: "#fff", fontSize: "0.9rem", color: C.ink, outline: "none", fontFamily: "'DM Sans', sans-serif", transition: "border-color 0.2s" };

  return (
    <section id="contact" style={{ background: C.cream, padding: "112px 0", fontFamily: "'DM Sans', sans-serif" }}>
      <div style={{ maxWidth: "1160px", margin: "0 auto", padding: "0 28px" }}>
        <div className="contact-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1.3fr", gap: "80px", alignItems: "start" }}>
          {/* Left info */}
          <Reveal>
            <div className="tag">Get in Touch</div>
            <h2 className="section-title" style={{ marginBottom: "20px" }}>
              Take the<br/>
              <span style={{ color: C.sage, fontStyle: "italic" }}>first step.</span>
            </h2>
            <p style={{ fontSize: "0.95rem", color: C.stone, lineHeight: 1.85, marginBottom: "44px", maxWidth: "340px" }}>
              Book a free 15-minute consultation. No commitment, no pressure — just a conversation.
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: "24px", marginBottom: "48px" }}>
              {[
                { label: "Phone",     value: "(076) 122-8682",              href: "tel:+27761228682" },
                { label: "Email",     value: "myndworkspractice@gmail.com", href: "mailto:myndworkspractice@gmail.com" },
                { label: "Instagram", value: "@myndworkspsychology",        href: "https://instagram.com/myndworkspsychology" },
              ].map(c => (
                <div key={c.label}>
                  <p style={{ fontSize: "0.67rem", fontWeight: 700, color: C.mist, textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: "4px" }}>{c.label}</p>
                  <a href={c.href} style={{ fontSize: "0.95rem", color: C.ink, fontWeight: 600, textDecoration: "none", transition: "color 0.2s" }}
                    onMouseEnter={e => (e.currentTarget.style.color = C.sage)}
                    onMouseLeave={e => (e.currentTarget.style.color = C.ink)}>
                    {c.value}
                  </a>
                </div>
              ))}
            </div>
            <div style={{ padding: "20px 24px", borderRadius: "18px", background: C.sageLight, border: `1px solid ${C.mist}` }}>
              <p style={{ fontSize: "0.82rem", fontWeight: 700, color: C.sageDark, marginBottom: "4px" }}>🆘 In crisis right now?</p>
              <p style={{ fontSize: "0.82rem", color: C.stone, lineHeight: 1.6 }}>Please contact your local emergency services or a crisis helpline immediately. You are not alone.</p>
            </div>
          </Reveal>

          {/* Form */}
          <Reveal delay={120}>
            <div style={{ background: "#fff", borderRadius: "32px", padding: "44px", boxShadow: "0 24px 64px rgba(107,143,113,0.1)", border: `1px solid ${C.mist}` }}>
              {status === "success" ? (
                <div style={{ textAlign: "center", padding: "48px 0" }}>
                  <div style={{ fontSize: "4rem", marginBottom: "20px" }}>🌿</div>
                  <h3 style={{ fontFamily: "'DM Serif Display', serif", fontSize: "1.8rem", color: C.ink, marginBottom: "12px" }}>Thank you, {form.name.split(" ")[0]}!</h3>
                  <p style={{ color: C.stone, fontSize: "0.9rem", lineHeight: 1.7 }}>We'll be in touch within 24 hours.<br/>You've taken a brave step.</p>
                </div>
              ) : (
                <>
                  <h3 style={{ fontFamily: "'DM Serif Display', serif", fontSize: "1.5rem", color: C.ink, marginBottom: "28px" }}>Book a Free Consultation</h3>
                  <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
                      {[
                        { label: "Full Name", type: "text", key: "name", placeholder: "Jane Smith", required: true },
                        { label: "Email", type: "email", key: "email", placeholder: "jane@example.com", required: true },
                      ].map(f => (
                        <div key={f.key}>
                          <label style={{ display: "block", fontSize: "0.68rem", fontWeight: 700, color: C.stone, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "8px" }}>{f.label}{f.required && " *"}</label>
                          <input required={f.required} type={f.type} placeholder={f.placeholder} value={form[f.key as keyof typeof form]}
                            onChange={e => setForm({ ...form, [f.key]: e.target.value })} style={inp}
                            onFocus={e => (e.target.style.borderColor = C.sage)}
                            onBlur={e => (e.target.style.borderColor = C.mist)}/>
                        </div>
                      ))}
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
                      <div>
                        <label style={{ display: "block", fontSize: "0.68rem", fontWeight: 700, color: C.stone, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "8px" }}>Phone</label>
                        <input type="tel" placeholder="076 122 8682" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} style={inp}
                          onFocus={e => (e.target.style.borderColor = C.sage)} onBlur={e => (e.target.style.borderColor = C.mist)}/>
                      </div>
                      <div>
                        <label style={{ display: "block", fontSize: "0.68rem", fontWeight: 700, color: C.stone, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "8px" }}>Service</label>
                        <select value={form.service} onChange={e => setForm({...form, service: e.target.value})} style={{ ...inp, appearance: "none" as const }}
                          onFocus={e => (e.target.style.borderColor = C.sage)} onBlur={e => (e.target.style.borderColor = C.mist)}>
                          <option value="">Select…</option>
                          {SERVICES.map(s => <option key={s.title} value={s.title}>{s.title}</option>)}
                        </select>
                      </div>
                    </div>
                    <div>
                      <label style={{ display: "block", fontSize: "0.68rem", fontWeight: 700, color: C.stone, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "8px" }}>Message</label>
                      <textarea rows={4} placeholder="Tell us what brings you here…" value={form.message} onChange={e => setForm({...form, message: e.target.value})}
                        style={{ ...inp, resize: "none" as const }}
                        onFocus={e => (e.target.style.borderColor = C.sage)} onBlur={e => (e.target.style.borderColor = C.mist)}/>
                    </div>
                    {status === "error" && <p style={{ color: "#dc2626", fontSize: "0.82rem", textAlign: "center" }}>Something went wrong. Please try again.</p>}
                    <button type="submit" disabled={status === "sending"} className="btn-primary" style={{ justifyContent: "center", padding: "16px", fontSize: "0.95rem", opacity: status === "sending" ? 0.6 : 1 }}>
                      {status === "sending" ? "Sending…" : "Book Free Consultation"}
                    </button>
                    <p style={{ fontSize: "0.72rem", color: C.mist, textAlign: "center" }}>Strictly confidential. We never share your information.</p>
                  </form>
                </>
              )}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

// ─── Footer ───────────────────────────────────────────────────────────────────
function Footer() {
  return (
    <footer style={{ background: C.ink, fontFamily: "'DM Sans', sans-serif", color: "#64748b", padding: "72px 0 36px" }}>
      <div style={{ maxWidth: "1160px", margin: "0 auto", padding: "0 28px" }}>
        <div className="footer-grid" style={{ display: "grid", gridTemplateColumns: "1.6fr 1fr 1fr", gap: "56px", marginBottom: "56px" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "18px" }}>
              <div style={{ width: "32px", height: "32px", borderRadius: "10px", background: C.sage, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round">
                  <path d="M12 3C7 3 3 7 3 12s4 9 9 9 9-4 9-9-4-9-9-9z"/>
                  <path d="M8 14s1.5 2 4 2 4-2 4-2"/>
                  <circle cx="9" cy="10" r="1.2" fill="white" stroke="none"/>
                  <circle cx="15" cy="10" r="1.2" fill="white" stroke="none"/>
                </svg>
              </div>
              <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "1.1rem", fontWeight: 800, color: "#fff" }}>
                <span style={{ color: C.sage }}>Mynd</span>Works
              </span>
            </div>
            <p style={{ fontSize: "0.85rem", lineHeight: 1.8, maxWidth: "280px", marginBottom: "28px" }}>Professional mental wellbeing support. Compassionate, evidence-based care for every stage of life.</p>
            <div style={{ display: "flex", gap: "10px" }}>
              {[{l:"I",h:"https://instagram.com/myndworkspsychology"},{l:"F",h:"#"},{l:"L",h:"#"}].map(s => (
                <a key={s.l} href={s.h} style={{ width: "36px", height: "36px", borderRadius: "50%", background: "rgba(255,255,255,0.06)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.75rem", fontWeight: 700, color: "#64748b", textDecoration: "none", transition: "all 0.2s" }}
                  onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.background = C.sage; (e.currentTarget as HTMLAnchorElement).style.color = "#fff"; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.background = "rgba(255,255,255,0.06)"; (e.currentTarget as HTMLAnchorElement).style.color = "#64748b"; }}>
                  {s.l}
                </a>
              ))}
            </div>
          </div>
          <div>
            <p style={{ fontSize: "0.68rem", fontWeight: 700, color: "#475569", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "18px" }}>Services</p>
            <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "10px" }}>
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
            <p style={{ fontSize: "0.68rem", fontWeight: 700, color: "#475569", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "18px" }}>Contact</p>
            <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "12px" }}>
              <li style={{ fontSize: "0.83rem" }}>(076) 122-8682</li>
              {[
                { v: "myndworkspractice@gmail.com", h: "mailto:myndworkspractice@gmail.com" },
                { v: "@myndworkspsychology", h: "https://instagram.com/myndworkspsychology" },
              ].map(c => (
                <li key={c.v}>
                  <a href={c.h} style={{ fontSize: "0.83rem", color: "#64748b", textDecoration: "none", transition: "color 0.2s" }}
                    onMouseEnter={e => (e.currentTarget.style.color = "#fff")}
                    onMouseLeave={e => (e.currentTarget.style.color = "#64748b")}>
                    {c.v}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div style={{ borderTop: "1px solid #1e293b", paddingTop: "28px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px" }}>
          <p style={{ fontSize: "0.75rem" }}>© {new Date().getFullYear()} MyndWorks. All rights reserved.</p>
          <p style={{ fontSize: "0.75rem", color: "#334155" }}>Designed with care for mental wellbeing.</p>
        </div>
      </div>
    </footer>
  );
}

// ─── App ──────────────────────────────────────────────────────────────────────
export default function App() {
  return (
    <>
      <GlobalStyles/>
      <Navbar/>
      <Hero/>
      <Stats/>
      <Services/>
      <About/>
      <Testimonials/>
      <FAQ/>
      <Contact/>
      <Footer/>
    </>
  );
}