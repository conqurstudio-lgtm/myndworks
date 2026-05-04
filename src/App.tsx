import { useState, useEffect, useRef } from "react";

const C = {
  sage:      "#4A90D9",
  sageLight: "#EBF4FF",
  sageDark:  "#1a5fa8",
  cream:     "#ffffff",
  warm:      "#f4f7fb",
  stone:     "#6b7a99",
  ink:       "#1a2340",
  mist:      "#dce6f5",
  blush:     "#e8f5e9",
  gold:      "#5cb87a",
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
  { name: "Sarah M.",       role: "Individual Therapy",  initials: "SM", text: "After years of struggling with anxiety, I finally have the tools to manage my thoughts and live fully. Truly life-changing." },
  { name: "James & Priya", role: "Couples Counselling", initials: "JP", text: "We came on the brink of separation. Through counselling, we rediscovered what brought us together." },
  { name: "Tom R.",         role: "Mindfulness",         initials: "TR", text: "My stress levels have dropped dramatically. I learned to pause, breathe, and respond rather than react." },
  { name: "Leila H.",       role: "Online Sessions",     initials: "LH", text: "The flexibility of online sessions meant I could finally prioritise my mental health without disrupting my family." },
];

const FAQS: FaqItem[] = [
  { q: "Do I need to be in crisis to start therapy?",    a: "Not at all. Therapy benefits anyone wanting to improve their wellbeing, work through challenges, or simply understand themselves better." },
  { q: "What happens in the first session?",            a: "We get to know you — what brings you here, your background, and your goals. There's no pressure. It's a conversation." },
  { q: "Is everything confidential?",                   a: "Yes. What you share stays between you and your therapist, with very limited exceptions explained clearly upfront." },
  { q: "Do you offer online and in-person sessions?",   a: "We offer both. Many clients mix and match depending on their schedule and preference." },
  { q: "Do you offer corporate packages?",              a: "Yes — tailored corporate wellness programmes including team building, workshops, and debriefing sessions." },
];

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

function Reveal({ children, delay = 0, className = "", y = 24 }: { children: React.ReactNode; delay?: number; className?: string; y?: number }) {
  const { ref, visible } = useReveal();
  return (
    <div ref={ref} className={className} style={{ opacity: visible ? 1 : 0, transform: visible ? "none" : `translateY(${y}px)`, transition: `opacity 0.7s cubic-bezier(.16,1,.3,1) ${delay}ms, transform 0.7s cubic-bezier(.16,1,.3,1) ${delay}ms` }}>
      {children}
    </div>
  );
}

const GlobalStyles = () => (
  <style>{`
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    html { scroll-behavior: smooth; }
    body { background: ${C.cream}; font-family: 'DM Sans', system-ui, sans-serif; }
    ::selection { background: ${C.sageLight}; color: ${C.sageDark}; }

    .sans  { font-family: 'DM Sans', system-ui, sans-serif; }

    .nav-link {
      background: none; border: none; cursor: pointer;
      font-family: 'DM Sans', system-ui, sans-serif;
      font-size: 0.875rem; font-weight: 500; color: ${C.stone};
      padding: 8px 16px; border-radius: 999px; transition: all 0.2s;
    }
    .nav-link:hover { color: ${C.ink}; background: ${C.warm}; }

    .btn-primary {
      display: inline-flex; align-items: center; gap: 8px;
      padding: 14px 28px; border-radius: 999px;
      background: ${C.sageDark}; color: #fff; border: none; cursor: pointer;
      font-family: 'DM Sans', system-ui, sans-serif;
      font-size: 0.9rem; font-weight: 700; letter-spacing: 0.01em;
      transition: all 0.25s;
    }
    .btn-primary:hover { background: ${C.sage}; transform: translateY(-1px); box-shadow: 0 8px 24px ${C.sage}55; }

    .btn-ghost {
      display: inline-flex; align-items: center; gap: 8px;
      padding: 14px 28px; border-radius: 999px;
      background: transparent; color: ${C.sageDark};
      border: 1.5px solid ${C.mist}; cursor: pointer;
      font-family: 'DM Sans', system-ui, sans-serif;
      font-size: 0.9rem; font-weight: 600; transition: all 0.25s;
    }
    .btn-ghost:hover { border-color: ${C.sage}; background: ${C.sageLight}; }

    .card {
      background: #fff; border-radius: 20px;
      border: 1px solid ${C.mist}; transition: all 0.3s cubic-bezier(.16,1,.3,1);
    }
    .card:hover { transform: translateY(-4px); box-shadow: 0 20px 48px rgba(74,144,217,0.13); border-color: ${C.sage}55; }

    .tag {
      display: inline-block;
      font-family: 'DM Sans', system-ui, sans-serif;
      font-size: 0.7rem; font-weight: 700;
      text-transform: uppercase; letter-spacing: 0.12em;
      color: ${C.sageDark}; background: ${C.sageLight};
      padding: 6px 14px; border-radius: 999px; margin-bottom: 18px;
    }

    .section-title {
      font-family: 'DM Sans', system-ui, sans-serif;
      font-weight: 800;
      font-size: clamp(2rem, 4vw, 3rem);
      color: ${C.ink}; line-height: 1.15; letter-spacing: -0.02em;
    }

    @keyframes float   { 0%,100%{transform:translateY(0)}   50%{transform:translateY(-8px)} }
    @keyframes breathe { 0%,100%{transform:scale(1)}         50%{transform:scale(1.03)} }
    .float   { animation: float   6s ease-in-out infinite; }
    .breathe { animation: breathe 8s ease-in-out infinite; }

    @media (max-width: 768px) {
      .hide-mobile { display: none !important; }
      .hero-grid, .about-grid, .contact-grid { grid-template-columns: 1fr !important; }
      .services-grid  { grid-template-columns: 1fr !important; }
      .stats-grid     { grid-template-columns: repeat(2,1fr) !important; }
      .footer-grid    { grid-template-columns: 1fr !important; }
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
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);
  const go = (href: string) => { setOpen(false); document.querySelector(href)?.scrollIntoView({ behavior: "smooth" }); };

  return (
    <>
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        transition: "all 0.4s",
        background: scrolled ? "rgba(255,255,255,0.97)" : "rgba(255,255,255,0.85)",
        backdropFilter: "blur(16px)",
        borderBottom: scrolled ? `1px solid ${C.mist}` : "1px solid transparent",
        boxShadow: scrolled ? "0 2px 20px rgba(74,144,217,0.08)" : "none",
      }}>
        <div style={{ maxWidth: "1160px", margin: "0 auto", padding: "0 28px", height: "72px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          {/* Logo */}
          <button onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: "10px" }}>
            <div style={{ width: "36px", height: "36px", borderRadius: "10px", background: `linear-gradient(135deg, ${C.sageDark}, ${C.sage})`, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: `0 4px 12px ${C.sage}44` }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round">
                <path d="M12 3C7 3 3 7 3 12s4 9 9 9 9-4 9-9-4-9-9-9z"/>
                <path d="M8 14s1.5 2 4 2 4-2 4-2"/>
                <circle cx="9" cy="10" r="1.2" fill="white" stroke="none"/>
                <circle cx="15" cy="10" r="1.2" fill="white" stroke="none"/>
              </svg>
            </div>
            <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "1.2rem", fontWeight: 800, color: C.ink, letterSpacing: "-0.02em" }}>
              <span style={{ color: C.sageDark }}>Mynd</span>Works
            </span>
          </button>

          {/* Desktop */}
          <div className="hide-mobile" style={{ display: "flex", alignItems: "center", gap: "4px" }}>
            {[["Services","#services"],["About","#about"],["FAQ","#faq"]].map(([l,h]) => (
              <button key={l} onClick={() => go(h)} className="nav-link">{l}</button>
            ))}
            <button onClick={() => go("#contact")} className="btn-primary" style={{ marginLeft: "8px", padding: "10px 22px", fontSize: "0.85rem" }}>
              Book Session
            </button>
          </div>

          {/* Mobile toggle */}
          <button onClick={() => setOpen(!open)}
            style={{ background: "none", border: "none", cursor: "pointer", padding: "6px" }}
            className="show-mobile">
            <svg width="22" height="22" fill="none" stroke={C.ink} viewBox="0 0 24 24">
              {open
                ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/>
                : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16"/>}
            </svg>
          </button>
        </div>

        {open && (
          <div style={{ background: C.cream, borderTop: `1px solid ${C.mist}`, padding: "20px 28px 28px" }}>
            {[["Services","#services"],["About","#about"],["FAQ","#faq"]].map(([l,h]) => (
              <button key={l} onClick={() => go(h)} style={{ display: "block", width: "100%", textAlign: "left", padding: "14px 0", background: "none", border: "none", borderBottom: `1px solid ${C.mist}`, fontFamily: "'DM Sans', sans-serif", fontSize: "1rem", fontWeight: 500, color: C.ink, cursor: "pointer" }}>{l}</button>
            ))}
            <button onClick={() => go("#contact")} className="btn-primary" style={{ width: "100%", marginTop: "16px", justifyContent: "center" }}>Book a Session</button>
          </div>
        )}
      </nav>
      <style>{`
        .show-mobile { display: none !important; }
        @media(max-width:768px){
          .show-mobile { display: flex !important; }
          .hide-mobile { display: none !important; }
        }
      `}</style>
    </>
  );
}

// ─── Hero ─────────────────────────────────────────────────────────────────────
function Hero() {
  return (
    <section style={{ minHeight: "100vh", background: `linear-gradient(160deg, #ffffff 0%, ${C.warm} 50%, ${C.sageLight} 100%)`, display: "flex", alignItems: "center", position: "relative", overflow: "hidden" }}>
      {/* Background blobs */}
      <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
        <div className="breathe" style={{ position: "absolute", top: "-100px", right: "-60px", width: "500px", height: "500px", borderRadius: "50%", background: `radial-gradient(circle, ${C.sageLight} 0%, transparent 70%)`, opacity: 0.8 }}/>
        <div style={{ position: "absolute", bottom: "-80px", left: "-40px", width: "360px", height: "360px", borderRadius: "50%", background: `radial-gradient(circle, ${C.blush} 0%, transparent 70%)`, opacity: 0.6 }}/>
        {/* Decorative circles */}
        <div style={{ position: "absolute", top: "15%", left: "8%", width: "160px", height: "160px", borderRadius: "50%", border: `1.5px solid ${C.mist}`, opacity: 0.5 }}/>
        <div style={{ position: "absolute", top: "20%", left: "11%", width: "100px", height: "100px", borderRadius: "50%", border: `1.5px solid ${C.mist}`, opacity: 0.4 }}/>
      </div>

      <div style={{ maxWidth: "1160px", margin: "0 auto", padding: "120px 28px 80px", width: "100%" }}>
        <div className="hero-grid" style={{ display: "grid", gridTemplateColumns: "1.1fr 0.9fr", gap: "60px", alignItems: "center" }}>
          {/* Left */}
          <div>
            <Reveal>
              <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: C.sageLight, border: `1px solid ${C.mist}`, borderRadius: "999px", padding: "8px 16px", marginBottom: "28px" }}>
                <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: C.gold, display: "inline-block", boxShadow: `0 0 0 3px ${C.gold}33` }}/>
                <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.8rem", fontWeight: 600, color: C.sageDark, letterSpacing: "0.03em" }}>Professional Mental Health Support</span>
              </div>
            </Reveal>

            <Reveal delay={80}>
              <h1 style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 900, fontSize: "clamp(2.6rem, 5vw, 4.2rem)", color: C.ink, lineHeight: 1.08, letterSpacing: "-0.03em", marginBottom: "8px" }}>
                Your health
              </h1>
              <h1 style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 900, fontSize: "clamp(2.6rem, 5vw, 4.2rem)", lineHeight: 1.08, letterSpacing: "-0.03em", marginBottom: "8px", background: `linear-gradient(135deg, ${C.sageDark}, ${C.sage})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                is our priority.
              </h1>
            </Reveal>

            <Reveal delay={150}>
              <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "1.05rem", color: C.stone, lineHeight: 1.8, maxWidth: "440px", margin: "24px 0 36px" }}>
                Compassionate, evidence-based therapy — in person or online. Book therapy, talk to a professional, or get the guidance you need — whenever you need it.
              </p>
            </Reveal>

            <Reveal delay={210}>
              <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", marginBottom: "40px" }}>
                <button className="btn-primary" onClick={() => document.querySelector("#contact")?.scrollIntoView({ behavior: "smooth" })}>
                  Book Appointment
                  <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3"/></svg>
                </button>
                <button className="btn-ghost" onClick={() => document.querySelector("#services")?.scrollIntoView({ behavior: "smooth" })}>
                  Learn more
                </button>
              </div>
            </Reveal>

            <Reveal delay={270}>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "20px" }}>
                {["Fully Confidential","In-Person & Online","Free First Consultation"].map(t => (
                  <div key={t} style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <div style={{ width: "20px", height: "20px", borderRadius: "50%", background: C.blush, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <svg width="10" height="10" fill="none" stroke={C.gold} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7"/></svg>
                    </div>
                    <span style={{ fontSize: "0.82rem", color: C.stone, fontWeight: 500 }}>{t}</span>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>

          {/* Right image */}
          <Reveal delay={100} className="hide-mobile" y={40}>
            <div style={{ position: "relative" }}>
              {/* Green blob behind image */}
              <div style={{ position: "absolute", top: "40px", right: "20px", width: "280px", height: "280px", borderRadius: "50%", background: `linear-gradient(135deg, ${C.sageLight}, ${C.blush})`, zIndex: 0 }}/>

              <div style={{ position: "relative", zIndex: 1, borderRadius: "32px", overflow: "hidden", height: "520px", boxShadow: `0 32px 80px rgba(74,144,217,0.15)` }}>
                <img
                  src="https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=800&auto=format&fit=crop&q=80"
                  alt="Therapist"
                  style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "top center" }}
                />
              </div>

              {/* Floating confidential badge */}
              <div style={{ position: "absolute", top: "36px", left: "-24px", zIndex: 2, background: "#fff", borderRadius: "16px", padding: "14px 18px", boxShadow: "0 12px 32px rgba(0,0,0,0.1)", border: `1px solid ${C.mist}`, display: "flex", alignItems: "center", gap: "10px" }}>
                <div style={{ width: "28px", height: "28px", borderRadius: "50%", background: C.sageLight, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <svg width="13" height="13" fill="none" stroke={C.sageDark} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7"/></svg>
                </div>
                <span style={{ fontSize: "0.875rem", fontWeight: 700, color: C.ink }}>Fully confidential</span>
              </div>

              {/* Floating stat */}
              <div className="float" style={{ position: "absolute", bottom: "32px", left: "-28px", zIndex: 2, background: "#fff", borderRadius: "18px", padding: "16px 22px", boxShadow: "0 16px 40px rgba(0,0,0,0.1)", border: `1px solid ${C.mist}` }}>
                <p style={{ fontSize: "1.9rem", fontWeight: 900, color: C.sageDark, lineHeight: 1, fontFamily: "'DM Sans', sans-serif" }}>2,000+</p>
                <p style={{ fontSize: "0.75rem", color: C.stone, marginTop: "3px" }}>Lives transformed</p>
              </div>

              {/* Small floating dot */}
              <div style={{ position: "absolute", top: "12px", right: "-12px", zIndex: 2, width: "48px", height: "48px", borderRadius: "50%", background: C.sage, boxShadow: `0 8px 20px ${C.sage}55`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <span style={{ fontSize: "1.2rem" }}>✕</span>
              </div>
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
    { value: "2,000+", label: "Clients Supported" },
    { value: "15+",    label: "Years Experience" },
    { value: "98%",    label: "Satisfaction Rate" },
    { value: "6",      label: "Specialist Therapists" },
  ];
  return (
    <section style={{ background: C.warm, padding: "60px 0", borderTop: `1px solid ${C.mist}`, borderBottom: `1px solid ${C.mist}` }}>
      <div style={{ maxWidth: "1160px", margin: "0 auto", padding: "0 28px" }}>
        <div className="stats-grid" style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "24px" }}>
          {items.map((s, i) => (
            <Reveal key={s.label} delay={i * 80}>
              <div style={{ textAlign: "center", padding: "32px 20px", background: "#fff", borderRadius: "20px", border: `1px solid ${C.mist}`, boxShadow: "0 2px 12px rgba(74,144,217,0.06)" }}>
                <p style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 900, fontSize: "2.4rem", color: i % 2 === 0 ? C.sageDark : C.gold, lineHeight: 1, marginBottom: "8px" }}>{s.value}</p>
                <p style={{ fontSize: "0.75rem", color: C.stone, textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 600 }}>{s.label}</p>
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
    <section id="services" style={{ background: C.cream, padding: "100px 0" }}>
      <div style={{ maxWidth: "1160px", margin: "0 auto", padding: "0 28px" }}>
        <Reveal>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "56px", gap: "24px", flexWrap: "wrap" }}>
            <div>
              <div className="tag">What We Offer</div>
              <h2 className="section-title">
                Support for every <span style={{ color: C.sage }}>journey</span>
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
              <div className="card" style={{ padding: "28px", cursor: "pointer" }}>
                <div style={{ width: "48px", height: "48px", borderRadius: "14px", background: i % 2 === 0 ? C.sageLight : C.blush, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.3rem", color: i % 2 === 0 ? C.sageDark : C.gold, marginBottom: "18px" }}>
                  {s.icon}
                </div>
                <h3 style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: "1.05rem", color: C.ink, marginBottom: "10px" }}>{s.title}</h3>
                <p style={{ fontSize: "0.875rem", color: C.stone, lineHeight: 1.75 }}>{s.desc}</p>
                <div style={{ marginTop: "20px", display: "flex", alignItems: "center", gap: "6px", color: C.sageDark, fontSize: "0.82rem", fontWeight: 700 }}>
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
    <section id="about" style={{ background: C.warm, padding: "100px 0", overflow: "hidden" }}>
      <div style={{ maxWidth: "1160px", margin: "0 auto", padding: "0 28px" }}>
        <div className="about-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "72px", alignItems: "center" }}>
          <Reveal y={40}>
            <div style={{ position: "relative" }}>
              <div style={{ borderRadius: "32px", overflow: "hidden", height: "500px", boxShadow: `0 32px 80px rgba(74,144,217,0.13)` }}>
                <img
                  src="https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=800&auto=format&fit=crop&q=80"
                  alt="Therapy space"
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              </div>
              {/* Floating card */}
              <div className="float" style={{ position: "absolute", bottom: "-20px", right: "-20px", background: C.sageDark, borderRadius: "20px", padding: "20px 24px", boxShadow: `0 16px 40px ${C.sageDark}44` }}>
                <p style={{ fontSize: "0.68rem", fontWeight: 700, color: "rgba(255,255,255,0.65)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "4px" }}>Est.</p>
                <p style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 900, fontSize: "2rem", color: "#fff", lineHeight: 1 }}>2009</p>
              </div>
              <div style={{ position: "absolute", top: "-16px", right: "48px", width: "72px", height: "72px", borderRadius: "50%", background: C.blush, opacity: 0.7 }}/>
            </div>
          </Reveal>

          <Reveal delay={120}>
            <div className="tag">About MyndWorks</div>
            <h2 className="section-title" style={{ marginBottom: "24px" }}>
              Rooted in empathy,<br/>
              <span style={{ color: C.sage }}>driven by science.</span>
            </h2>
            <p style={{ fontSize: "0.95rem", color: C.stone, lineHeight: 1.85, marginBottom: "16px" }}>
              MyndWorks was founded on a simple belief — everyone deserves access to compassionate, high-quality mental health care.
            </p>
            <p style={{ fontSize: "0.95rem", color: C.stone, lineHeight: 1.85, marginBottom: "36px" }}>
              We combine CBT, EMDR, and mindfulness with a deeply human style of care. Our goal is not just symptom relief, but lasting transformation.
            </p>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "36px" }}>
              {[
                { icon: "🌱", label: "Evidence-Based",     bg: C.sageLight },
                { icon: "🔒", label: "Fully Confidential", bg: C.blush },
                { icon: "🌍", label: "In-Person & Online", bg: C.sageLight },
                { icon: "💬", label: "Free Consultation",  bg: C.blush },
              ].map(v => (
                <div key={v.label} style={{ display: "flex", alignItems: "center", gap: "10px", padding: "13px 16px", borderRadius: "14px", background: v.bg, border: `1px solid ${C.mist}` }}>
                  <span>{v.icon}</span>
                  <span style={{ fontSize: "0.82rem", fontWeight: 600, color: C.ink }}>{v.label}</span>
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
  useEffect(() => {
    const t = setInterval(() => setActive(a => (a + 1) % TESTIMONIALS.length), 5500);
    return () => clearInterval(t);
  }, []);

  return (
    <section id="testimonials" style={{ background: `linear-gradient(160deg, ${C.sageDark} 0%, #0d3d70 100%)`, padding: "100px 0", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", top: "-80px", right: "-80px", width: "350px", height: "350px", borderRadius: "50%", background: "rgba(255,255,255,0.04)", pointerEvents: "none" }}/>
      <div style={{ position: "absolute", bottom: "-60px", left: "-40px", width: "250px", height: "250px", borderRadius: "50%", background: "rgba(255,255,255,0.03)", pointerEvents: "none" }}/>

      <div style={{ maxWidth: "1160px", margin: "0 auto", padding: "0 28px" }}>
        <Reveal>
          <div style={{ marginBottom: "56px" }}>
            <div style={{ display: "inline-block", fontSize: "0.7rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", color: "rgba(255,255,255,0.6)", background: "rgba(255,255,255,0.1)", padding: "6px 14px", borderRadius: "999px", marginBottom: "18px" }}>
              Client Stories
            </div>
            <h2 style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 800, fontSize: "clamp(2rem, 4vw, 3rem)", color: "#fff", letterSpacing: "-0.02em" }}>
              Real people, <span style={{ color: `${C.gold}` }}>real change.</span>
            </h2>
          </div>
        </Reveal>

        <div className="testimonials-grid" style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr", gap: "24px" }}>
          <Reveal>
            <div style={{ background: "rgba(255,255,255,0.08)", borderRadius: "24px", padding: "44px", border: "1px solid rgba(255,255,255,0.12)", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
              <div>
                <div style={{ display: "flex", gap: "4px", marginBottom: "24px" }}>
                  {[...Array(5)].map((_,i) => <span key={i} style={{ color: "#f59e0b", fontSize: "1.1rem" }}>★</span>)}
                </div>
                <p style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 500, fontSize: "clamp(1rem, 2vw, 1.25rem)", color: "#fff", lineHeight: 1.7, fontStyle: "italic", marginBottom: "36px" }}>
                  "{TESTIMONIALS[active].text}"
                </p>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                <div style={{ width: "48px", height: "48px", borderRadius: "50%", background: `linear-gradient(135deg, ${C.sage}, ${C.gold})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.8rem", fontWeight: 800, color: "#fff", flexShrink: 0 }}>
                  {TESTIMONIALS[active].initials}
                </div>
                <div>
                  <p style={{ fontSize: "0.9rem", fontWeight: 700, color: "#fff" }}>{TESTIMONIALS[active].name}</p>
                  <p style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.5)" }}>{TESTIMONIALS[active].role}</p>
                </div>
              </div>
            </div>
          </Reveal>

          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {TESTIMONIALS.map((t, i) => (
              <Reveal key={t.name} delay={i * 60}>
                <button onClick={() => setActive(i)} style={{
                  width: "100%", textAlign: "left", padding: "18px 20px", borderRadius: "16px",
                  cursor: "pointer", border: "none", transition: "all 0.3s",
                  background: active === i ? "#fff" : "rgba(255,255,255,0.07)",
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    <div style={{ width: "38px", height: "38px", borderRadius: "50%", background: active === i ? C.sageDark : "rgba(255,255,255,0.15)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.72rem", fontWeight: 800, color: active === i ? "#fff" : "rgba(255,255,255,0.7)", flexShrink: 0, transition: "all 0.3s" }}>
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
            <div style={{ display: "flex", gap: "8px", paddingTop: "8px", paddingLeft: "4px" }}>
              {TESTIMONIALS.map((_, i) => (
                <button key={i} onClick={() => setActive(i)} style={{ border: "none", cursor: "pointer", borderRadius: "999px", height: "4px", transition: "all 0.3s", background: active === i ? "#fff" : "rgba(255,255,255,0.25)", width: active === i ? "24px" : "8px" }}/>
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
    <section id="faq" style={{ background: C.warm, padding: "100px 0" }}>
      <div style={{ maxWidth: "760px", margin: "0 auto", padding: "0 28px" }}>
        <Reveal>
          <div className="tag">Common Questions</div>
          <h2 className="section-title" style={{ marginBottom: "52px" }}>
            Got <span style={{ color: C.sage }}>questions?</span>
          </h2>
        </Reveal>

        <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
          {FAQS.map((f, i) => (
            <Reveal key={i} delay={i * 40}>
              <div style={{ borderBottom: `1px solid ${C.mist}` }}>
                <button onClick={() => setOpen(open === i ? null : i)}
                  style={{ width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center", padding: "22px 0", background: "none", border: "none", cursor: "pointer", textAlign: "left", gap: "16px" }}>
                  <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.95rem", fontWeight: 600, color: open === i ? C.sageDark : C.ink, transition: "color 0.2s" }}>{f.q}</span>
                  <div style={{ width: "32px", height: "32px", borderRadius: "50%", background: open === i ? C.sageDark : C.sageLight, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, transition: "all 0.3s", color: open === i ? "#fff" : C.sageDark, fontSize: "1.2rem", lineHeight: 1 }}>
                    {open === i ? "−" : "+"}
                  </div>
                </button>
                {open === i && (
                  <p style={{ fontSize: "0.9rem", color: C.stone, lineHeight: 1.85, paddingBottom: "22px", paddingRight: "48px" }}>{f.a}</p>
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
      const res = await fetch("https://formspree.io/f/xeenerab", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(form),
      });
      setStatus(res.ok ? "success" : "error");
    } catch { setStatus("error"); }
  };

  const inp: React.CSSProperties = {
    width: "100%", padding: "14px 18px", borderRadius: "12px",
    border: `1.5px solid ${C.mist}`, background: "#fff",
    fontSize: "0.9rem", color: C.ink, outline: "none",
    fontFamily: "'DM Sans', system-ui, sans-serif", transition: "border-color 0.2s",
  };

  return (
    <section id="contact" style={{ background: C.cream, padding: "100px 0" }}>
      <div style={{ maxWidth: "1160px", margin: "0 auto", padding: "0 28px" }}>
        <div className="contact-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1.3fr", gap: "72px", alignItems: "start" }}>
          {/* Info */}
          <Reveal>
            <div className="tag">Get in Touch</div>
            <h2 className="section-title" style={{ marginBottom: "20px" }}>
              Take the<br/>
              <span style={{ color: C.sage }}>first step.</span>
            </h2>
            <p style={{ fontSize: "0.95rem", color: C.stone, lineHeight: 1.85, marginBottom: "40px", maxWidth: "320px" }}>
              Book a free 15-minute consultation. No commitment, no pressure — just a conversation.
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: "22px", marginBottom: "44px" }}>
              {[
                { label: "Phone",     value: "(076) 122-8682",              href: "tel:+27761228682" },
                { label: "Email",     value: "myndworkspractice@gmail.com", href: "mailto:myndworkspractice@gmail.com" },
                { label: "Instagram", value: "@myndworkspsychology",        href: "https://instagram.com/myndworkspsychology" },
              ].map(c => (
                <div key={c.label}>
                  <p style={{ fontSize: "0.67rem", fontWeight: 700, color: C.mist, textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: "4px" }}>{c.label}</p>
                  <a href={c.href} style={{ fontSize: "0.95rem", color: C.ink, fontWeight: 600, textDecoration: "none", transition: "color 0.2s" }}
                    onMouseEnter={e => (e.currentTarget.style.color = C.sageDark)}
                    onMouseLeave={e => (e.currentTarget.style.color = C.ink)}>
                    {c.value}
                  </a>
                </div>
              ))}
            </div>
            <div style={{ padding: "18px 22px", borderRadius: "16px", background: C.sageLight, border: `1px solid ${C.mist}` }}>
              <p style={{ fontSize: "0.82rem", fontWeight: 700, color: C.sageDark, marginBottom: "4px" }}>🆘 In crisis right now?</p>
              <p style={{ fontSize: "0.82rem", color: C.stone, lineHeight: 1.65 }}>Please contact your local emergency services or a crisis helpline immediately. You are not alone.</p>
            </div>
          </Reveal>

          {/* Form */}
          <Reveal delay={120}>
            <div style={{ background: "#fff", borderRadius: "28px", padding: "40px", boxShadow: `0 20px 60px rgba(74,144,217,0.1)`, border: `1px solid ${C.mist}` }}>
              {status === "success" ? (
                <div style={{ textAlign: "center", padding: "48px 0" }}>
                  <div style={{ fontSize: "3.5rem", marginBottom: "20px" }}>🌿</div>
                  <h3 style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 800, fontSize: "1.6rem", color: C.ink, marginBottom: "12px" }}>
                    Thank you, {form.name.split(" ")[0]}!
                  </h3>
                  <p style={{ color: C.stone, fontSize: "0.9rem", lineHeight: 1.7 }}>We'll be in touch within 24 hours.<br/>You've taken a brave step.</p>
                </div>
              ) : (
                <>
                  <h3 style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 800, fontSize: "1.3rem", color: C.ink, marginBottom: "28px" }}>
                    Book a Free Consultation
                  </h3>
                  <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                      {[
                        { label: "Full Name", type: "text",  key: "name",  placeholder: "Jane Smith",         required: true },
                        { label: "Email",     type: "email", key: "email", placeholder: "jane@example.com",   required: true },
                      ].map(f => (
                        <div key={f.key}>
                          <label style={{ display: "block", fontSize: "0.68rem", fontWeight: 700, color: C.stone, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "7px" }}>{f.label}{f.required && " *"}</label>
                          <input required={f.required} type={f.type} placeholder={f.placeholder}
                            value={form[f.key as keyof typeof form]}
                            onChange={e => setForm({ ...form, [f.key]: e.target.value })}
                            style={inp}
                            onFocus={e => (e.target.style.borderColor = C.sageDark)}
                            onBlur={e => (e.target.style.borderColor = C.mist)}/>
                        </div>
                      ))}
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                      <div>
                        <label style={{ display: "block", fontSize: "0.68rem", fontWeight: 700, color: C.stone, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "7px" }}>Phone</label>
                        <input type="tel" placeholder="076 122 8682" value={form.phone}
                          onChange={e => setForm({...form, phone: e.target.value})} style={inp}
                          onFocus={e => (e.target.style.borderColor = C.sageDark)}
                          onBlur={e => (e.target.style.borderColor = C.mist)}/>
                      </div>
                      <div>
                        <label style={{ display: "block", fontSize: "0.68rem", fontWeight: 700, color: C.stone, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "7px" }}>Service</label>
                        <select value={form.service} onChange={e => setForm({...form, service: e.target.value})}
                          style={{ ...inp, appearance: "none" as const }}
                          onFocus={e => (e.target.style.borderColor = C.sageDark)}
                          onBlur={e => (e.target.style.borderColor = C.mist)}>
                          <option value="">Select…</option>
                          {SERVICES.map(s => <option key={s.title} value={s.title}>{s.title}</option>)}
                        </select>
                      </div>
                    </div>
                    <div>
                      <label style={{ display: "block", fontSize: "0.68rem", fontWeight: 700, color: C.stone, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "7px" }}>Message</label>
                      <textarea rows={4} placeholder="Tell us what brings you here…" value={form.message}
                        onChange={e => setForm({...form, message: e.target.value})}
                        style={{ ...inp, resize: "none" as const }}
                        onFocus={e => (e.target.style.borderColor = C.sageDark)}
                        onBlur={e => (e.target.style.borderColor = C.mist)}/>
                    </div>
                    {status === "error" && <p style={{ color: "#dc2626", fontSize: "0.82rem", textAlign: "center" }}>Something went wrong. Please try again.</p>}
                    <button type="submit" disabled={status === "sending"} className="btn-primary"
                      style={{ justifyContent: "center", padding: "16px", fontSize: "0.95rem", opacity: status === "sending" ? 0.6 : 1 }}>
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
    <footer style={{ background: C.ink, color: "#64748b", padding: "72px 0 36px" }}>
      <div style={{ maxWidth: "1160px", margin: "0 auto", padding: "0 28px" }}>
        <div className="footer-grid" style={{ display: "grid", gridTemplateColumns: "1.6fr 1fr 1fr", gap: "56px", marginBottom: "56px" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "18px" }}>
              <div style={{ width: "32px", height: "32px", borderRadius: "10px", background: `linear-gradient(135deg, ${C.sageDark}, ${C.sage})`, display: "flex", alignItems: "center", justifyContent: "center" }}>
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
            <p style={{ fontSize: "0.85rem", lineHeight: 1.8, maxWidth: "280px", marginBottom: "28px" }}>
              Professional mental wellbeing support. Compassionate, evidence-based care for every stage of life.
            </p>
            <div style={{ display: "flex", gap: "10px" }}>
              {[{l:"I",h:"https://instagram.com/myndworkspsychology"},{l:"F",h:"#"},{l:"L",h:"#"}].map(s => (
                <a key={s.l} href={s.h} style={{ width: "36px", height: "36px", borderRadius: "50%", background: "rgba(255,255,255,0.06)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.75rem", fontWeight: 700, color: "#64748b", textDecoration: "none", transition: "all 0.2s" }}
                  onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.background = C.sageDark; (e.currentTarget as HTMLAnchorElement).style.color = "#fff"; }}
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
                { v: "@myndworkspsychology",        h: "https://instagram.com/myndworkspsychology" },
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