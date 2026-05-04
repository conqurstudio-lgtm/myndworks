import { useState, useEffect, useRef } from "react";

// ─── Tokens ───────────────────────────────────────────────────────────────────
const B = {
  pink:     "#e91e8c",
  orange:   "#f97316",
  teal:     "#0891b2",
  blue:     "#3b82f6",
  ink:      "#0f172a",
  slate:    "#475569",
  muted:    "#94a3b8",
  border:   "#e8edf5",
  bg:       "#ffffff",
  soft:     "#f8fafc",
  pinkBg:   "#fdf2f8",
  blueBg:   "#eff6ff",
  tealBg:   "#f0f9ff",
  orangeBg: "#fff7ed",
};

interface Service     { icon: string; title: string; desc: string; }
interface Testimonial { name: string; role: string; text: string; initials: string; }
interface FaqItem     { q: string; a: string; }

const SERVICES: Service[] = [
  { icon: `<svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.7" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>`, title: "Individual Therapy", desc: "One-on-one sessions for anxiety, depression, trauma and life transitions in a safe, confidential space." },
  { icon: `<svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.7" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/></svg>`, title: "Couples Counselling", desc: "Rebuild trust, improve communication and reconnect using evidence-based tools." },
  { icon: `<svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.7" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3"/></svg>`, title: "Mindfulness & Stress", desc: "Practical techniques to manage stress and cultivate lasting calm in daily life." },
  { icon: `<svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.7" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"/></svg>`, title: "Group Therapy", desc: "Connect and heal with others in a safe, facilitated group environment." },
  { icon: `<svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.7" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/></svg>`, title: "Corporate Wellness", desc: "Team building, workshops, debriefing and wellness programmes for organisations." },
  { icon: `<svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.7" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>`, title: "Online Sessions", desc: "Secure, confidential video sessions from wherever you are — flexible and professional." },
  { icon: `<svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.7" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"/></svg>`, title: "Child & Adolescent", desc: "Specialised support for young people navigating emotional challenges and growth." },
  { icon: `<svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.7" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z"/></svg>`, title: "Workshops & Training", desc: "Engaging wellness workshops and professional training programmes for lasting resilience." },
];

const SERVICE_COLORS = [
  { bg: B.pinkBg,   color: B.pink },
  { bg: B.orangeBg, color: B.orange },
  { bg: B.blueBg,   color: B.blue },
  { bg: B.tealBg,   color: B.teal },
  { bg: B.pinkBg,   color: B.pink },
  { bg: B.orangeBg, color: B.orange },
  { bg: B.blueBg,   color: B.blue },
  { bg: B.tealBg,   color: B.teal },
];

const TESTIMONIALS: Testimonial[] = [
  { name: "Sarah M.",      role: "Individual Therapy",  initials: "SM", text: "After years of struggling with anxiety, I finally have the tools to manage my thoughts and live fully. MyndWorks truly changed my life." },
  { name: "James & Priya", role: "Couples Counselling", initials: "JP", text: "We came on the brink of separation. Through counselling, we rediscovered what brought us together and built something even stronger." },
  { name: "Tom R.",        role: "Mindfulness",         initials: "TR", text: "My stress levels have dropped dramatically. I learned to pause, breathe, and respond rather than react. Completely transformative." },
  { name: "Leila H.",      role: "Online Sessions",     initials: "LH", text: "The flexibility of online sessions meant I could finally prioritise my mental health without disrupting my family. Excellent care." },
];

const FAQS: FaqItem[] = [
  { q: "Do I need to be in crisis to start therapy?",  a: "Not at all. Therapy benefits anyone wanting to improve their wellbeing, work through challenges, or simply understand themselves better." },
  { q: "What happens in the first session?",          a: "We get to know you — what brings you here, your background, and your goals. There's no pressure. It's simply a conversation." },
  { q: "Is everything confidential?",                 a: "Yes. What you share stays between you and your therapist, with very limited exceptions explained clearly upfront." },
  { q: "Do you offer online and in-person sessions?", a: "We offer both. Many clients mix and match depending on their schedule and preference." },
  { q: "Do you offer corporate packages?",            a: "Yes — tailored corporate wellness programmes including team building, workshops, debriefing and public speaking in wellness." },
];

// ─── Reveal ───────────────────────────────────────────────────────────────────
function useReveal() {
  const ref = useRef<HTMLDivElement>(null);
  const [v, setV] = useState(false);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setV(true); obs.disconnect(); } }, { threshold: 0.07 });
    obs.observe(el); return () => obs.disconnect();
  }, []);
  return { ref, v };
}

function Reveal({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  const { ref, v } = useReveal();
  return (
    <div ref={ref} className={className} style={{ opacity: v ? 1 : 0, transform: v ? "none" : "translateY(20px)", transition: `opacity 0.65s ease ${delay}ms, transform 0.65s ease ${delay}ms` }}>
      {children}
    </div>
  );
}

// ─── Global styles ────────────────────────────────────────────────────────────
const GS = () => (
  <style>{`
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    html { scroll-behavior: smooth; }
    body { background: #fff; font-family: 'DM Sans', system-ui, sans-serif; color: ${B.ink}; -webkit-font-smoothing: antialiased; }
    ::selection { background: ${B.pinkBg}; }
    input, textarea, select { font-family: 'DM Sans', sans-serif; }

    .wrap { max-width: 1160px; margin: 0 auto; padding: 0 24px; }

    /* Buttons — flat, no gradients */
    .btn-main {
      display: inline-flex; align-items: center; gap: 8px;
      padding: 13px 26px; border-radius: 10px;
      background: ${B.pink}; color: #fff; border: none; cursor: pointer;
      font-family: 'DM Sans', sans-serif; font-size: 0.88rem; font-weight: 700;
      transition: all 0.2s; letter-spacing: 0.01em;
    }
    .btn-main:hover { background: #d01880; transform: translateY(-1px); box-shadow: 0 6px 20px rgba(233,30,140,0.2); }

    .btn-out {
      display: inline-flex; align-items: center; gap: 8px;
      padding: 12px 24px; border-radius: 10px;
      background: transparent; color: ${B.ink}; border: 1.5px solid ${B.border}; cursor: pointer;
      font-family: 'DM Sans', sans-serif; font-size: 0.88rem; font-weight: 600;
      transition: all 0.2s;
    }
    .btn-out:hover { border-color: ${B.pink}; color: ${B.pink}; }

    .btn-blue {
      display: inline-flex; align-items: center; gap: 8px;
      padding: 13px 26px; border-radius: 10px;
      background: ${B.blue}; color: #fff; border: none; cursor: pointer;
      font-family: 'DM Sans', sans-serif; font-size: 0.88rem; font-weight: 700;
      transition: all 0.2s;
    }
    .btn-blue:hover { background: #2563eb; transform: translateY(-1px); box-shadow: 0 6px 20px rgba(59,130,246,0.2); }

    /* Cards */
    .card {
      background: #fff; border-radius: 16px; border: 1px solid ${B.border};
      transition: all 0.25s;
    }
    .card:hover { box-shadow: 0 12px 40px rgba(0,0,0,0.07); transform: translateY(-3px); }

    /* Label pill */
    .label-pill {
      display: inline-flex; align-items: center; gap: 6px;
      font-size: 0.72rem; font-weight: 700; text-transform: uppercase;
      letter-spacing: 0.1em; color: ${B.pink};
      background: ${B.pinkBg}; padding: 5px 12px; border-radius: 999px;
      margin-bottom: 14px;
    }

    .h1 { font-family: 'DM Sans', sans-serif; font-weight: 900; font-size: clamp(2.4rem, 5vw, 4rem); line-height: 1.08; letter-spacing: -0.03em; }
    .h2 { font-family: 'DM Sans', sans-serif; font-weight: 800; font-size: clamp(1.8rem, 3vw, 2.6rem); line-height: 1.18; letter-spacing: -0.025em; }
    .h3 { font-family: 'DM Sans', sans-serif; font-weight: 700; font-size: 0.98rem; }
    .body-t { font-size: 0.975rem; color: ${B.slate}; line-height: 1.8; }
    .small-t { font-size: 0.85rem; color: ${B.slate}; line-height: 1.75; }

    @keyframes floatY { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
    .float { animation: floatY 5s ease-in-out infinite; }

    /* Responsive */
    @media(max-width:768px){
      .hide-m { display:none!important; }
      .g2,.g3,.g4,.gc { grid-template-columns:1fr!important; gap:20px!important; }
      .g2s { grid-template-columns:repeat(2,1fr)!important; }
      .section { padding: 64px 0!important; }
    }
    @media(min-width:640px) and (max-width:960px){
      .g3 { grid-template-columns:repeat(2,1fr)!important; }
      .g4 { grid-template-columns:repeat(2,1fr)!important; }
    }
  `}</style>
);

// ─── Navbar ───────────────────────────────────────────────────────────────────
function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", fn); return () => window.removeEventListener("scroll", fn);
  }, []);
  const go = (h: string) => { setOpen(false); document.querySelector(h)?.scrollIntoView({ behavior: "smooth" }); };

  return (
    <>
      <nav style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 200, background: "rgba(255,255,255,0.97)", backdropFilter: "blur(16px)", borderBottom: `1px solid ${scrolled ? B.border : "transparent"}`, transition: "border-color 0.3s", boxShadow: scrolled ? "0 1px 16px rgba(0,0,0,0.06)" : "none" }}>
        <div className="wrap" style={{ height: "68px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          {/* Logo */}
          <button onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: "9px" }}>
            <div style={{ width: "34px", height: "34px", borderRadius: "9px", background: B.pink, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round">
                <path d="M12 3C7 3 3 7 3 12s4 9 9 9 9-4 9-9-4-9-9-9z"/>
                <path d="M8 14s1.5 2 4 2 4-2 4-2"/>
                <circle cx="9" cy="10" r="1.2" fill="white" stroke="none"/>
                <circle cx="15" cy="10" r="1.2" fill="white" stroke="none"/>
              </svg>
            </div>
            <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "1.18rem", fontWeight: 900, letterSpacing: "-0.025em", color: B.ink }}>
              <span style={{ color: B.pink }}>Mynd</span>Works
            </span>
          </button>

          {/* Desktop links */}
          <div className="hide-m" style={{ display: "flex", alignItems: "center", gap: "2px" }}>
            {[["Home","#"],["Services","#services"],["About","#about"],["FAQ","#faq"]].map(([l, h]) => (
              <button key={l} onClick={() => h === "#" ? window.scrollTo({ top: 0, behavior: "smooth" }) : go(h)}
                style={{ background: "none", border: "none", cursor: "pointer", padding: "7px 15px", borderRadius: "8px", fontSize: "0.875rem", fontWeight: 500, color: B.slate, fontFamily: "'DM Sans', sans-serif", transition: "all 0.18s" }}
                onMouseEnter={e => { e.currentTarget.style.color = B.ink; e.currentTarget.style.background = B.soft; }}
                onMouseLeave={e => { e.currentTarget.style.color = B.slate; e.currentTarget.style.background = "none"; }}>
                {l}
              </button>
            ))}
            <button onClick={() => go("#contact")} className="btn-main" style={{ marginLeft: "10px", padding: "9px 20px", borderRadius: "8px", fontSize: "0.83rem" }}>
              Book Appointment
            </button>
          </div>

          {/* Mobile toggle */}
          <button onClick={() => setOpen(!open)} className="show-m" style={{ background: "none", border: "none", cursor: "pointer", display: "none", padding: "4px" }}>
            <svg width="22" height="22" fill="none" stroke={B.ink} viewBox="0 0 24 24">
              {open ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/> : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16"/>}
            </svg>
          </button>
        </div>

        {open && (
          <div style={{ background: "#fff", borderTop: `1px solid ${B.border}`, padding: "14px 24px 20px" }}>
            {[["Services","#services"],["About","#about"],["FAQ","#faq"]].map(([l,h]) => (
              <button key={l} onClick={() => go(h)} style={{ display: "block", width: "100%", textAlign: "left", padding: "12px 0", background: "none", border: "none", borderBottom: `1px solid ${B.border}`, fontSize: "0.95rem", fontWeight: 500, color: B.ink, cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>{l}</button>
            ))}
            <button onClick={() => go("#contact")} className="btn-main" style={{ width: "100%", marginTop: "14px", justifyContent: "center", borderRadius: "10px" }}>Book Appointment</button>
          </div>
        )}
      </nav>
      <style>{`.show-m{display:none!important;} @media(max-width:768px){.show-m{display:flex!important;}.hide-m{display:none!important;}}`}</style>
    </>
  );
}

// ─── Hero ─────────────────────────────────────────────────────────────────────
function Hero() {
  return (
    <section style={{ minHeight: "100vh", background: "#fff", display: "flex", alignItems: "center", position: "relative", overflow: "hidden", paddingTop: "68px" }}>
      {/* Soft blob background — like the reference image */}
      <div style={{ position: "absolute", inset: 0, pointerEvents: "none", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: "-40px", right: "-40px", width: "520px", height: "520px", borderRadius: "50%", background: "linear-gradient(135deg, #e8f5e9 0%, #e3f2fd 50%, #fce4ec 100%)", opacity: 0.65 }}/>
        <div style={{ position: "absolute", bottom: "-80px", left: "-80px", width: "320px", height: "320px", borderRadius: "50%", background: "radial-gradient(circle, #fdf2f8 0%, transparent 70%)", opacity: 0.8 }}/>
        {/* Small decorative circle top right — from reference */}
        <div style={{ position: "absolute", top: "14%", right: "8%", width: "44px", height: "44px", borderRadius: "50%", background: B.blue, opacity: 0.85 }} className="hide-m"/>
        <div style={{ position: "absolute", top: "22%", right: "18%", width: "18px", height: "18px", borderRadius: "50%", background: B.pink, opacity: 0.5 }} className="hide-m"/>
      </div>

      <div className="wrap" style={{ width: "100%", padding: "40px 24px 60px" }}>
        <div className="g2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "56px", alignItems: "center" }}>
          {/* Left */}
          <div>
            <Reveal>
              <div className="label-pill">
                <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: B.pink, display: "block" }}/>
                Professional Mental Health Support
              </div>
            </Reveal>

            <Reveal delay={60}>
              <h1 className="h1" style={{ color: B.ink, marginBottom: "16px" }}>
                Your health<br/>
                <span style={{ color: B.pink }}>is our priority</span>
              </h1>
            </Reveal>

            <Reveal delay={110}>
              <p className="body-t" style={{ maxWidth: "440px", marginBottom: "32px" }}>
                Book therapy, talk to a professional, or get the guidance you need — whenever and wherever you need it. Compassionate, evidence-based mental wellness support.
              </p>
            </Reveal>

            <Reveal delay={160}>
              <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", marginBottom: "36px" }}>
                <button className="btn-main" onClick={() => document.querySelector("#contact")?.scrollIntoView({ behavior: "smooth" })}>
                  Book Appointment
                </button>
                <button className="btn-out" onClick={() => document.querySelector("#services")?.scrollIntoView({ behavior: "smooth" })}>
                  Learn more
                </button>
              </div>
            </Reveal>

            <Reveal delay={200}>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "18px" }}>
                {[
                  { svg: `<svg width="13" height="13" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7"/></svg>`, label: "Fully Confidential" },
                  { svg: `<svg width="13" height="13" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7"/></svg>`, label: "In-Person & Online" },
                  { svg: `<svg width="13" height="13" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7"/></svg>`, label: "Free First Consultation" },
                ].map(t => (
                  <div key={t.label} style={{ display: "flex", alignItems: "center", gap: "7px" }}>
                    <div style={{ width: "20px", height: "20px", borderRadius: "50%", background: B.pinkBg, display: "flex", alignItems: "center", justifyContent: "center", color: B.pink, flexShrink: 0 }}
                      dangerouslySetInnerHTML={{ __html: t.svg }}/>
                    <span style={{ fontSize: "0.82rem", color: B.slate, fontWeight: 500 }}>{t.label}</span>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>

          {/* Right — clean image card like reference */}
          <Reveal delay={80} className="hide-m">
            <div style={{ position: "relative" }}>
              {/* Blob behind image */}
              <div style={{ position: "absolute", top: "20px", left: "20px", right: "-10px", bottom: "-10px", borderRadius: "28px", background: "linear-gradient(135deg, #e3f2fd, #fce4ec)", opacity: 0.7 }}/>

              {/* Main photo */}
              <div style={{ position: "relative", borderRadius: "24px", overflow: "hidden", height: "480px", boxShadow: "0 20px 60px rgba(0,0,0,0.1)" }}>
                <img
                  src="https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=800&auto=format&fit=crop&q=80"
                  alt="Therapist"
                  style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "top center" }}
                />
              </div>

              {/* Floating card — bottom left */}
              <div className="float" style={{ position: "absolute", bottom: "-20px", left: "-24px", background: "#fff", borderRadius: "16px", padding: "16px 20px", boxShadow: "0 8px 28px rgba(0,0,0,0.09)", border: `1px solid ${B.border}`, zIndex: 10 }}>
                <p style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 900, fontSize: "1.8rem", color: B.pink, lineHeight: 1 }}>2,000+</p>
                <p style={{ fontSize: "0.72rem", color: B.muted, marginTop: "3px" }}>Lives transformed</p>
              </div>

              {/* Floating badge — top left */}
              <div style={{ position: "absolute", top: "24px", left: "-20px", background: "#fff", borderRadius: "14px", padding: "10px 16px", boxShadow: "0 6px 20px rgba(0,0,0,0.08)", border: `1px solid ${B.border}`, zIndex: 10, display: "flex", alignItems: "center", gap: "8px" }}>
                <div style={{ width: "26px", height: "26px", borderRadius: "50%", background: B.pinkBg, display: "flex", alignItems: "center", justifyContent: "center", color: B.pink }}
                  dangerouslySetInnerHTML={{ __html: `<svg width="13" height="13" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7"/></svg>` }}/>
                <span style={{ fontSize: "0.8rem", fontWeight: 700, color: B.ink }}>Fully confidential</span>
              </div>

              {/* Stars badge — top right */}
              <div style={{ position: "absolute", top: "50%", right: "-18px", transform: "translateY(-50%)", background: "#fff", borderRadius: "14px", padding: "12px 16px", boxShadow: "0 6px 20px rgba(0,0,0,0.08)", border: `1px solid ${B.border}`, zIndex: 10, textAlign: "center" }}>
                <div style={{ display: "flex", gap: "2px", marginBottom: "4px", justifyContent: "center" }}>
                  {[...Array(5)].map((_,i) => <span key={i} style={{ color: "#f59e0b", fontSize: "10px" }}>★</span>)}
                </div>
                <p style={{ fontSize: "0.75rem", fontWeight: 700, color: B.ink }}>4.9 / 5</p>
                <p style={{ fontSize: "0.65rem", color: B.muted }}>Avg rating</p>
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
    { v: "2,000+", l: "Clients Supported",    color: B.pink },
    { v: "15+",    l: "Years Experience",      color: B.blue },
    { v: "98%",    l: "Satisfaction Rate",     color: B.teal },
    { v: "8",      l: "Specialist Therapists", color: B.orange },
  ];
  return (
    <section className="section" style={{ background: B.soft, borderTop: `1px solid ${B.border}`, borderBottom: `1px solid ${B.border}`, padding: "52px 0" }}>
      <div className="wrap">
        <div className="g2s" style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "16px" }}>
          {items.map((s, i) => (
            <Reveal key={s.l} delay={i * 60}>
              <div style={{ background: "#fff", borderRadius: "14px", border: `1px solid ${B.border}`, padding: "24px 20px", textAlign: "center" }}>
                <p style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 900, fontSize: "2.2rem", color: s.color, lineHeight: 1, marginBottom: "6px" }}>{s.v}</p>
                <p style={{ fontSize: "0.74rem", color: B.muted, textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 600 }}>{s.l}</p>
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
    <section id="services" className="section" style={{ background: "#fff", padding: "88px 0" }}>
      <div className="wrap">
        <Reveal>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "48px", flexWrap: "wrap", gap: "16px" }}>
            <div>
              <div className="label-pill">What We Offer</div>
              <h2 className="h2">Our Services</h2>
            </div>
            <button className="btn-blue" onClick={() => document.querySelector("#contact")?.scrollIntoView({ behavior: "smooth" })} style={{ borderRadius: "10px" }}>
              Explore the services →
            </button>
          </div>
        </Reveal>

        <div className="g4" style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "14px" }}>
          {SERVICES.map((s, i) => (
            <Reveal key={s.title} delay={i * 45}>
              <div className="card" style={{ padding: "22px", cursor: "pointer", height: "100%" }}>
                <div style={{ width: "44px", height: "44px", borderRadius: "12px", background: SERVICE_COLORS[i].bg, display: "flex", alignItems: "center", justifyContent: "center", color: SERVICE_COLORS[i].color, marginBottom: "14px" }}
                  dangerouslySetInnerHTML={{ __html: s.icon }}/>
                <h3 className="h3" style={{ marginBottom: "8px", fontSize: "0.92rem" }}>{s.title}</h3>
                <p style={{ fontSize: "0.82rem", color: B.muted, lineHeight: 1.7 }}>{s.desc}</p>
                <div style={{ marginTop: "16px", display: "flex", alignItems: "center", gap: "4px", fontSize: "0.78rem", fontWeight: 700, color: SERVICE_COLORS[i].color }}>
                  View more
                  <svg width="12" height="12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/></svg>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── About — 3 col layout like reference ──────────────────────────────────────
function About() {
  return (
    <section id="about" className="section" style={{ background: B.soft, padding: "88px 0" }}>
      <div className="wrap">
        <Reveal>
          <div className="label-pill" style={{ marginBottom: "12px" }}>About MyndWorks</div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "44px", flexWrap: "wrap", gap: "16px" }}>
            <h2 className="h2" style={{ maxWidth: "480px" }}>
              Rooted in empathy,<br/>driven by science.
            </h2>
            <p className="body-t" style={{ maxWidth: "360px" }}>
              MyndWorks was founded on a simple belief — everyone deserves access to compassionate, high-quality mental health care. We combine CBT, EMDR, and mindfulness with a deeply human style of care.
            </p>
          </div>
        </Reveal>

        {/* 3-col card row — like reference image middle section */}
        <div className="g3" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "16px", marginBottom: "24px" }}>
          {/* Image card */}
          <Reveal delay={0}>
            <div style={{ borderRadius: "18px", overflow: "hidden", height: "320px", position: "relative" }}>
              <img
                src="https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=600&auto=format&fit=crop&q=80"
                alt="Therapist"
                style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "top" }}
              />
              <div style={{ position: "absolute", top: "12px", left: "12px", width: "28px", height: "28px", borderRadius: "50%", background: B.blue, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <svg width="13" height="13" fill="none" stroke="white" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7"/></svg>
              </div>
            </div>
          </Reveal>

          {/* Text card */}
          <Reveal delay={80}>
            <div className="card" style={{ padding: "32px", height: "320px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
              <div>
                <h3 style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 800, fontSize: "1.3rem", color: B.ink, marginBottom: "14px", lineHeight: 1.25 }}>
                  Your health is<br/>
                  <span style={{ color: B.blue }}>our core focus.</span>
                </h3>
                <p className="small-t" style={{ marginBottom: "16px" }}>
                  Evidence-based therapies delivered by accredited professionals — compassionate, confidential and accessible.
                </p>
                <p className="small-t">
                  We offer individual, couples, group, child and corporate mental wellness services — both in-person and online.
                </p>
              </div>
              <button className="btn-blue" onClick={() => document.querySelector("#contact")?.scrollIntoView({ behavior: "smooth" })} style={{ borderRadius: "10px", alignSelf: "flex-start", padding: "10px 20px", fontSize: "0.82rem" }}>
                Get Appointment →
              </button>
            </div>
          </Reveal>

          {/* Icon services mini card */}
          <Reveal delay={160}>
            <div className="card" style={{ padding: "28px", height: "320px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
              <div>
                <p style={{ fontSize: "0.7rem", fontWeight: 700, color: B.muted, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "16px" }}>Our Specialties</p>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "14px" }}>
                  {[
                    { icon: `<svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.7" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>`, label: "Individual", color: B.blue },
                    { icon: `<svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.7" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/></svg>`, label: "Couples", color: B.pink },
                    { icon: `<svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.7" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"/></svg>`, label: "Group", color: B.teal },
                    { icon: `<svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.7" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/></svg>`, label: "Corporate", color: B.orange },
                    { icon: `<svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.7" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"/></svg>`, label: "Children", color: B.blue },
                    { icon: `<svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.7" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>`, label: "Online", color: B.pink },
                  ].map(item => (
                    <div key={item.label} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "6px" }}>
                      <div style={{ width: "40px", height: "40px", borderRadius: "12px", background: B.soft, display: "flex", alignItems: "center", justifyContent: "center", color: item.color }}
                        dangerouslySetInnerHTML={{ __html: item.icon }}/>
                      <span style={{ fontSize: "0.65rem", color: B.muted, fontWeight: 600, textAlign: "center" }}>{item.label}</span>
                    </div>
                  ))}
                </div>
              </div>
              <button className="btn-main" onClick={() => document.querySelector("#services")?.scrollIntoView({ behavior: "smooth" })} style={{ borderRadius: "10px", fontSize: "0.8rem", padding: "9px 16px" }}>
                All Services →
              </button>
            </div>
          </Reveal>
        </div>

        {/* Bottom about row — like reference bottom section */}
        <div className="g2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
          {/* Text */}
          <Reveal>
            <div className="card" style={{ padding: "32px" }}>
              <div className="label-pill" style={{ marginBottom: "14px" }}>Our Approach</div>
              <h3 style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 800, fontSize: "1.2rem", color: B.ink, marginBottom: "14px" }}>
                Professional mental wellness,<br/>built around you.
              </h3>
              <p className="small-t" style={{ marginBottom: "14px" }}>
                Every person who walks through our doors — physically or virtually — receives care that's evidence-based, compassionate, and tailored to their unique journey.
              </p>
              <p className="small-t" style={{ marginBottom: "24px" }}>
                We work with individuals, couples, families, children and corporates — because mental wellness matters at every stage of life.
              </p>
              <button className="btn-out" onClick={() => document.querySelector("#contact")?.scrollIntoView({ behavior: "smooth" })} style={{ borderRadius: "10px", fontSize: "0.82rem" }}>
                ✕ &nbsp; Get Appointment
              </button>
            </div>
          </Reveal>

          {/* Team mini list */}
          <Reveal delay={80}>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {[
                { name: "Dr. M. Patel", title: "Clinical Psychologist · Founder", img: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop&q=80" },
                { name: "J. Okoro",     title: "Psychotherapist",                 img: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=200&auto=format&fit=crop&q=80" },
              ].map((t, i) => (
                <div key={t.name} className="card" style={{ padding: "20px 24px", display: "flex", alignItems: "center", gap: "16px", flex: 1 }}>
                  <div style={{ width: "56px", height: "56px", borderRadius: "50%", overflow: "hidden", flexShrink: 0, border: `2px solid ${B.border}` }}>
                    <img src={t.img} alt={t.name} style={{ width: "100%", height: "100%", objectFit: "cover" }}/>
                  </div>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontWeight: 700, fontSize: "0.92rem", color: B.ink, marginBottom: "3px" }}>{t.name}</p>
                    <p style={{ fontSize: "0.78rem", color: B.muted }}>{t.title}</p>
                  </div>
                  <button className="btn-main" onClick={() => document.querySelector("#contact")?.scrollIntoView({ behavior: "smooth" })} style={{ borderRadius: "8px", padding: "8px 16px", fontSize: "0.76rem", flexShrink: 0 }}>
                    Book
                  </button>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

// ─── Corporate ────────────────────────────────────────────────────────────────
function Corporate() {
  return (
    <section style={{ background: "#fff", padding: "72px 0" }}>
      <div className="wrap">
        <Reveal>
          <div style={{ background: B.ink, borderRadius: "20px", overflow: "hidden", position: "relative" }}>
            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(120deg, rgba(233,30,140,0.12) 0%, rgba(59,130,246,0.12) 100%)" }}/>
            <div className="g2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", position: "relative", zIndex: 1 }}>
              <div style={{ height: "320px", overflow: "hidden" }} className="hide-m">
                <img
                  src="https://images.unsplash.com/photo-1552664730-d307ca884978?w=700&auto=format&fit=crop&q=80"
                  alt="Corporate wellness"
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              </div>
              <div style={{ padding: "44px 40px" }}>
                <div style={{ display: "inline-block", fontSize: "0.68rem", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.12em", color: B.pink, background: "rgba(233,30,140,0.12)", padding: "5px 12px", borderRadius: "999px", marginBottom: "16px" }}>Corporate</div>
                <h2 style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 800, fontSize: "clamp(1.4rem, 2.5vw, 2rem)", color: "#fff", marginBottom: "18px", lineHeight: 1.2 }}>
                  Wellness solutions for<br/>your organisation
                </h2>
                <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "9px", marginBottom: "28px" }}>
                  {["Team Building","Workshops & Training","Debriefing Sessions","Healthy & Wellness Programs","Public Speaking in Wellness"].map(item => (
                    <li key={item} style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "0.875rem", color: "rgba(255,255,255,0.8)" }}>
                      <span style={{ color: B.pink, fontWeight: 700 }}>+</span> {item}
                    </li>
                  ))}
                </ul>
                <button className="btn-main" onClick={() => document.querySelector("#contact")?.scrollIntoView({ behavior: "smooth" })} style={{ borderRadius: "10px" }}>
                  Get in Touch
                </button>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

// ─── Appointment / Contact section like reference ────────────────────────────
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

  const inp: React.CSSProperties = { width: "100%", padding: "12px 15px", borderRadius: "10px", border: `1.5px solid ${B.border}`, background: B.soft, fontSize: "0.875rem", color: B.ink, outline: "none", fontFamily: "'DM Sans', sans-serif", transition: "border-color 0.2s" };

  return (
    <section id="contact" className="section" style={{ background: B.soft, padding: "88px 0" }}>
      <div className="wrap">
        <div className="g2 gc" style={{ display: "grid", gridTemplateColumns: "1fr 1.2fr", gap: "48px", alignItems: "start" }}>
          {/* Left */}
          <Reveal>
            <div style={{ position: "relative", borderRadius: "20px", overflow: "hidden", height: "380px", marginBottom: "28px" }}>
              <img
                src="https://images.unsplash.com/photo-1590650153855-d9e808231d41?w=700&auto=format&fit=crop&q=80"
                alt="Welcoming session"
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            </div>
            <div className="label-pill">Get in Touch</div>
            <h2 className="h2" style={{ marginBottom: "14px" }}>Take the first step.</h2>
            <p className="body-t" style={{ marginBottom: "28px", maxWidth: "320px" }}>
              Book a free 15-minute consultation. No commitment, no pressure — just a conversation.
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: "16px", marginBottom: "24px" }}>
              {[
                { icon: `<svg width="15" height="15" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg>`, label: "Phone",     val: "(076) 122-8682",              href: "tel:+27761228682" },
                { icon: `<svg width="15" height="15" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>`, label: "Email",     val: "myndworkspractice@gmail.com", href: "mailto:myndworkspractice@gmail.com" },
                { icon: `<svg width="15" height="15" fill="none" stroke="currentColor" viewBox="0 0 24 24"><rect x="2" y="2" width="20" height="20" rx="5" ry="5" strokeWidth={2}/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5" strokeWidth={2}/></svg>`, label: "Instagram", val: "@myndworkspsychology",        href: "https://instagram.com/myndworkspsychology" },
              ].map(c => (
                <div key={c.label} style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <div style={{ width: "38px", height: "38px", borderRadius: "10px", background: B.pinkBg, display: "flex", alignItems: "center", justifyContent: "center", color: B.pink, flexShrink: 0 }}
                    dangerouslySetInnerHTML={{ __html: c.icon }}/>
                  <div>
                    <p style={{ fontSize: "0.65rem", fontWeight: 700, color: B.muted, textTransform: "uppercase", letterSpacing: "0.1em" }}>{c.label}</p>
                    <a href={c.href} style={{ fontSize: "0.875rem", color: B.ink, fontWeight: 600, textDecoration: "none" }}
                      onMouseEnter={e => (e.currentTarget.style.color = B.pink)}
                      onMouseLeave={e => (e.currentTarget.style.color = B.ink)}>
                      {c.val}
                    </a>
                  </div>
                </div>
              ))}
            </div>
            <div style={{ padding: "14px 18px", borderRadius: "12px", background: B.tealBg, border: `1px solid rgba(8,145,178,0.15)` }}>
              <p style={{ fontSize: "0.8rem", fontWeight: 700, color: B.teal, marginBottom: "3px" }}>🆘 In crisis right now?</p>
              <p style={{ fontSize: "0.8rem", color: B.slate, lineHeight: 1.6 }}>Contact your local emergency services or a crisis helpline immediately. You are not alone.</p>
            </div>
          </Reveal>

          {/* Form */}
          <Reveal delay={100}>
            <div style={{ background: "#fff", borderRadius: "20px", padding: "36px", border: `1px solid ${B.border}`, boxShadow: "0 8px 32px rgba(0,0,0,0.05)" }}>
              {status === "success" ? (
                <div style={{ textAlign: "center", padding: "48px 0" }}>
                  <div style={{ width: "64px", height: "64px", borderRadius: "50%", background: B.pinkBg, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px", fontSize: "1.8rem" }}>🌿</div>
                  <h3 style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 800, fontSize: "1.3rem", color: B.ink, marginBottom: "8px" }}>Thank you, {form.name.split(" ")[0]}!</h3>
                  <p style={{ color: B.slate, fontSize: "0.875rem", lineHeight: 1.7 }}>We'll be in touch within 24 hours.<br/>You've taken a brave step.</p>
                </div>
              ) : (
                <>
                  <h3 style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 800, fontSize: "1.15rem", color: B.ink, marginBottom: "6px" }}>Appointment Booking</h3>
                  <p style={{ fontSize: "0.82rem", color: B.muted, marginBottom: "24px" }}>Fill in the form and we'll reach out within 24 hours.</p>
                  <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "13px" }}>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                      {[
                        { label: "Appointment Name", type: "text",  key: "name",  ph: "Jane Smith",       req: true },
                        { label: "Add Phone Here",   type: "tel",   key: "phone", ph: "076 122 8682",     req: false },
                      ].map(f => (
                        <div key={f.key}>
                          <label style={{ display: "block", fontSize: "0.72rem", fontWeight: 600, color: B.muted, marginBottom: "6px" }}>{f.label}{f.req ? " *" : ""}</label>
                          <input required={f.req} type={f.type} placeholder={f.ph} value={form[f.key as keyof typeof form]}
                            onChange={e => setForm({ ...form, [f.key]: e.target.value })} style={inp}
                            onFocus={e => (e.target.style.borderColor = B.pink)}
                            onBlur={e => (e.target.style.borderColor = B.border)}/>
                        </div>
                      ))}
                    </div>
                    <div>
                      <label style={{ display: "block", fontSize: "0.72rem", fontWeight: 600, color: B.muted, marginBottom: "6px" }}>Email Address *</label>
                      <input required type="email" placeholder="jane@example.com" value={form.email}
                        onChange={e => setForm({...form, email: e.target.value})} style={inp}
                        onFocus={e => (e.target.style.borderColor = B.pink)}
                        onBlur={e => (e.target.style.borderColor = B.border)}/>
                    </div>
                    <div>
                      <label style={{ display: "block", fontSize: "0.72rem", fontWeight: 600, color: B.muted, marginBottom: "6px" }}>Service</label>
                      <select value={form.service} onChange={e => setForm({...form, service: e.target.value})} style={{ ...inp, appearance: "none" as const }}
                        onFocus={e => (e.target.style.borderColor = B.pink)} onBlur={e => (e.target.style.borderColor = B.border)}>
                        <option value="">Select a service…</option>
                        {SERVICES.map(s => <option key={s.title} value={s.title}>{s.title}</option>)}
                      </select>
                    </div>
                    <div>
                      <label style={{ display: "block", fontSize: "0.72rem", fontWeight: 600, color: B.muted, marginBottom: "6px" }}>Message</label>
                      <textarea rows={3} placeholder="Tell us what brings you here…" value={form.message}
                        onChange={e => setForm({...form, message: e.target.value})}
                        style={{ ...inp, resize: "none" as const }}
                        onFocus={e => (e.target.style.borderColor = B.pink)}
                        onBlur={e => (e.target.style.borderColor = B.border)}/>
                    </div>
                    {status === "error" && <p style={{ color: "#dc2626", fontSize: "0.8rem", textAlign: "center" }}>Something went wrong. Please try again.</p>}
                    <button type="submit" disabled={status === "sending"} className="btn-blue" style={{ justifyContent: "center", padding: "13px", borderRadius: "10px", fontSize: "0.9rem", opacity: status === "sending" ? 0.6 : 1, width: "100%" }}>
                      {status === "sending" ? "Sending…" : "Book Appointment"}
                    </button>
                    <p style={{ fontSize: "0.7rem", color: B.muted, textAlign: "center" }}>Strictly confidential. We never share your information.</p>
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

// ─── Testimonials ─────────────────────────────────────────────────────────────
function Testimonials() {
  const [active, setActive] = useState(0);
  useEffect(() => { const t = setInterval(() => setActive(a => (a + 1) % TESTIMONIALS.length), 5500); return () => clearInterval(t); }, []);
  return (
    <section id="testimonials" className="section" style={{ background: "#fff", padding: "88px 0" }}>
      <div className="wrap">
        <Reveal>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "44px", flexWrap: "wrap", gap: "16px" }}>
            <div>
              <div className="label-pill">Client Stories</div>
              <h2 className="h2">Real people, <span style={{ color: B.pink }}>real change.</span></h2>
            </div>
            <div style={{ display: "flex", gap: "6px" }}>
              {TESTIMONIALS.map((_,i) => (
                <button key={i} onClick={() => setActive(i)} style={{ border: "none", cursor: "pointer", borderRadius: "999px", height: "5px", transition: "all 0.3s", background: active === i ? B.pink : B.border, width: active === i ? "22px" : "7px" }}/>
              ))}
            </div>
          </div>
        </Reveal>
        <div className="g2" style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr", gap: "16px" }}>
          <Reveal>
            <div className="card" style={{ padding: "36px" }}>
              <div style={{ display: "flex", gap: "3px", marginBottom: "18px" }}>
                {[...Array(5)].map((_,i) => <span key={i} style={{ color: B.orange, fontSize: "0.95rem" }}>★</span>)}
              </div>
              <p style={{ fontSize: "1.05rem", color: B.ink, lineHeight: 1.75, fontStyle: "italic", marginBottom: "28px" }}>
                "{TESTIMONIALS[active].text}"
              </p>
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <div style={{ width: "44px", height: "44px", borderRadius: "50%", background: B.pink, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.78rem", fontWeight: 800, color: "#fff", flexShrink: 0 }}>
                  {TESTIMONIALS[active].initials}
                </div>
                <div>
                  <p style={{ fontSize: "0.9rem", fontWeight: 700, color: B.ink }}>{TESTIMONIALS[active].name}</p>
                  <p style={{ fontSize: "0.74rem", color: B.muted }}>{TESTIMONIALS[active].role}</p>
                </div>
              </div>
            </div>
          </Reveal>
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {TESTIMONIALS.map((t, i) => (
              <Reveal key={t.name} delay={i * 50}>
                <button onClick={() => setActive(i)} style={{ width: "100%", textAlign: "left", padding: "16px 18px", borderRadius: "14px", cursor: "pointer", border: `1px solid ${active === i ? B.pink : B.border}`, background: active === i ? B.pinkBg : "#fff", transition: "all 0.22s", display: "flex", alignItems: "center", gap: "12px" }}>
                  <div style={{ width: "36px", height: "36px", borderRadius: "50%", background: active === i ? B.pink : B.soft, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.7rem", fontWeight: 800, color: active === i ? "#fff" : B.slate, flexShrink: 0, transition: "all 0.22s" }}>
                    {t.initials}
                  </div>
                  <div>
                    <p style={{ fontSize: "0.85rem", fontWeight: 700, color: B.ink }}>{t.name}</p>
                    <p style={{ fontSize: "0.7rem", color: B.muted }}>{t.role}</p>
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
    <section id="faq" className="section" style={{ background: B.soft, padding: "88px 0" }}>
      <div style={{ maxWidth: "720px", margin: "0 auto", padding: "0 24px" }}>
        <Reveal>
          <div className="label-pill">Common Questions</div>
          <h2 className="h2" style={{ marginBottom: "44px" }}>Got questions?</h2>
        </Reveal>
        {FAQS.map((f, i) => (
          <Reveal key={i} delay={i * 35}>
            <div style={{ borderBottom: `1px solid ${B.border}` }}>
              <button onClick={() => setOpen(open === i ? null : i)} style={{ width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center", padding: "20px 0", background: "none", border: "none", cursor: "pointer", textAlign: "left", gap: "16px" }}>
                <span style={{ fontSize: "0.92rem", fontWeight: 600, color: open === i ? B.pink : B.ink, transition: "color 0.2s" }}>{f.q}</span>
                <div style={{ width: "30px", height: "30px", borderRadius: "50%", background: open === i ? B.pink : B.soft, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, transition: "all 0.22s", color: open === i ? "#fff" : B.pink, fontSize: "1.1rem", fontWeight: 700, lineHeight: 1 }}>
                  {open === i ? "−" : "+"}
                </div>
              </button>
              {open === i && (
                <p style={{ fontSize: "0.875rem", color: B.slate, lineHeight: 1.85, paddingBottom: "20px", paddingRight: "46px" }}>{f.a}</p>
              )}
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

// ─── Footer ───────────────────────────────────────────────────────────────────
function Footer() {
  return (
    <footer style={{ background: B.ink, color: "#64748b", padding: "64px 0 32px" }}>
      <div className="wrap">
        <div className="g3" style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr 1fr", gap: "48px", marginBottom: "48px" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "9px", marginBottom: "14px" }}>
              <div style={{ width: "32px", height: "32px", borderRadius: "9px", background: B.pink, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round">
                  <path d="M12 3C7 3 3 7 3 12s4 9 9 9 9-4 9-9-4-9-9-9z"/>
                  <path d="M8 14s1.5 2 4 2 4-2 4-2"/>
                  <circle cx="9" cy="10" r="1.2" fill="white" stroke="none"/>
                  <circle cx="15" cy="10" r="1.2" fill="white" stroke="none"/>
                </svg>
              </div>
              <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "1.1rem", fontWeight: 900, color: "#fff", letterSpacing: "-0.02em" }}>
                <span style={{ color: B.pink }}>Mynd</span>Works
              </span>
            </div>
            <p style={{ fontSize: "0.84rem", lineHeight: 1.8, maxWidth: "270px", marginBottom: "22px" }}>
              Professional mental wellbeing support. Compassionate, evidence-based care for every stage of life.
            </p>
            <div style={{ display: "flex", gap: "8px" }}>
              {[
                { icon: `<svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24"><rect x="2" y="2" width="20" height="20" rx="5" ry="5" strokeWidth={2}/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5" strokeWidth={2}/></svg>`, h: "https://instagram.com/myndworkspsychology" },
                { icon: `<svg width="14" height="14" fill="currentColor" viewBox="0 0 24 24"><path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/></svg>`, h: "#" },
              ].map((s, i) => (
                <a key={i} href={s.h} style={{ width: "34px", height: "34px", borderRadius: "8px", background: "rgba(255,255,255,0.06)", display: "flex", alignItems: "center", justifyContent: "center", color: "#64748b", textDecoration: "none", transition: "all 0.2s" }}
                  dangerouslySetInnerHTML={{ __html: s.icon }}
                  onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.background = B.pink; (e.currentTarget as HTMLAnchorElement).style.color = "#fff"; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.background = "rgba(255,255,255,0.06)"; (e.currentTarget as HTMLAnchorElement).style.color = "#64748b"; }}/>
              ))}
            </div>
          </div>
          <div>
            <p style={{ fontSize: "0.68rem", fontWeight: 700, color: "#475569", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "16px" }}>Services</p>
            <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "9px" }}>
              {SERVICES.map(s => (
                <li key={s.title}>
                  <a href="#services" style={{ fontSize: "0.82rem", color: "#64748b", textDecoration: "none", transition: "color 0.2s" }}
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
            <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "11px" }}>
              {[
                { v: "(076) 122-8682",              h: "tel:+27761228682" },
                { v: "myndworkspractice@gmail.com", h: "mailto:myndworkspractice@gmail.com" },
                { v: "sphe@myndworks.co.za",        h: "mailto:sphe@myndworks.co.za" },
                { v: "@myndworkspsychology",         h: "https://instagram.com/myndworkspsychology" },
                { v: "www.myndworks.co.za",          h: "https://www.myndworks.co.za" },
              ].map(c => (
                <li key={c.v}>
                  <a href={c.h} style={{ fontSize: "0.82rem", color: "#64748b", textDecoration: "none", transition: "color 0.2s" }}
                    onMouseEnter={e => (e.currentTarget.style.color = "#fff")}
                    onMouseLeave={e => (e.currentTarget.style.color = "#64748b")}>
                    {c.v}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div style={{ borderTop: "1px solid #1e293b", paddingTop: "24px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "10px" }}>
          <p style={{ fontSize: "0.74rem" }}>© {new Date().getFullYear()} MyndWorks. All rights reserved.</p>
          <p style={{ fontSize: "0.74rem", color: "#334155" }}>Designed with care for mental wellbeing.</p>
        </div>
      </div>
    </footer>
  );
}

// ─── App ──────────────────────────────────────────────────────────────────────
export default function App() {
  return (
    <>
      <GS/>
      <Navbar/>
      <Hero/>
      <Stats/>
      <Services/>
      <About/>
      <Corporate/>
      <Testimonials/>
      <FAQ/>
      <Contact/>
      <Footer/>
    </>
  );
}