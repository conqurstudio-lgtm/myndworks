import { useState, useEffect, useRef } from "react";

// ─── Design Tokens — MyndWorks Brand ─────────────────────────────────────────
const G = {
  // Primary brand
  darkGreen:   "#e91e8c",   // pink — CTAs, nav accent, dark cards
  forest:      "#c9186f",   // deeper pink
  olive:       "#f97316",   // orange — secondary accent
  sage:        "#fb923c",   // lighter orange
  lightSage:   "#fda4af",   // soft pink for dark bg text
  // Backgrounds
  cream:       "#ffffff",   // main page bg — pure white
  softCream:   "#f8fafc",   // section alt bg
  paleGreen:   "#fdf2f8",   // pill bg / card accent (soft pink)
  white:       "#ffffff",
  // Dark section
  darkBg:      "#0f172a",   // very dark navy for banner/footer
  // Text
  ink:         "#0f172a",   // primary text
  body:        "#475569",   // body text
  muted:       "#94a3b8",   // muted text
  // Borders
  border:      "#e8edf5",
  borderDark:  "#cbd5e1",
  // Blue tones for variety
  blue:        "#3b82f6",
  blueSoft:    "#eff6ff",
  teal:        "#0891b2",
  tealSoft:    "#f0f9ff",
};

interface Service     { icon: string; title: string; desc: string; }
interface Testimonial { name: string; role: string; text: string; initials: string; }
interface FaqItem     { q: string; a: string; }

const SERVICES: Service[] = [
  { icon: `<svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>`, title: "Individual Therapy", desc: "One-on-one sessions for anxiety, depression, trauma and life transitions in a safe, confidential space." },
  { icon: `<svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/></svg>`, title: "Couples Counselling", desc: "Rebuild trust, improve communication and reconnect using evidence-based tools." },
  { icon: `<svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3"/></svg>`, title: "Mindfulness & Stress", desc: "Practical techniques to manage stress and cultivate lasting calm in daily life." },
  { icon: `<svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"/></svg>`, title: "Group Therapy", desc: "Connect and heal with others in a safe, facilitated group environment." },
  { icon: `<svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/></svg>`, title: "Corporate Wellness", desc: "Team building, workshops, debriefing and wellness programmes for organisations." },
  { icon: `<svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>`, title: "Online Sessions", desc: "Secure, confidential video sessions from wherever you are — flexible and professional." },
  { icon: `<svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"/></svg>`, title: "Child & Adolescent", desc: "Specialised support for young people navigating emotional challenges and growth." },
  { icon: `<svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z"/></svg>`, title: "Workshops & Training", desc: "Engaging wellness workshops and professional training programmes for lasting resilience." },
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
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setV(true); obs.disconnect(); } }, { threshold: 0.06 });
    obs.observe(el); return () => obs.disconnect();
  }, []);
  return { ref, v };
}

function Reveal({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  const { ref, v } = useReveal();
  return (
    <div ref={ref} className={className} style={{ opacity: v ? 1 : 0, transform: v ? "none" : "translateY(24px)", transition: `opacity 0.7s ease ${delay}ms, transform 0.7s ease ${delay}ms` }}>
      {children}
    </div>
  );
}

// ─── Global Styles ────────────────────────────────────────────────────────────
const GS = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:wght@300;400;500;600;700;800&display=swap');

    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    html { scroll-behavior: smooth; }
    body {
      background: ${G.cream};
      font-family: 'DM Sans', system-ui, sans-serif;
      color: ${G.ink};
      -webkit-font-smoothing: antialiased;
    }
    ::selection { background: ${G.paleGreen}; color: ${G.forest}; }
    input, textarea, select { font-family: 'DM Sans', sans-serif; }

    .wrap { max-width: 1160px; margin: 0 auto; padding: 0 32px; }
    .wrap-sm { max-width: 780px; margin: 0 auto; padding: 0 32px; }

    .serif { font-family: 'DM Serif Display', Georgia, serif; }
    .serif-it { font-family: 'DM Serif Display', Georgia, serif; font-style: italic; }

    /* Buttons — flat solid */
    .btn-dark {
      display: inline-flex; align-items: center; gap: 8px;
      padding: 11px 22px; border-radius: 999px;
      background: ${G.ink}; color: #fff; border: none; cursor: pointer;
      font-family: 'DM Sans', sans-serif; font-size: 0.82rem; font-weight: 600;
      letter-spacing: 0.01em; transition: all 0.22s;
    }
    .btn-dark:hover { background: ${G.darkGreen}; transform: translateY(-1px); box-shadow: 0 6px 20px rgba(233,30,140,0.2); }

    .btn-outline {
      display: inline-flex; align-items: center; gap: 8px;
      padding: 10px 22px; border-radius: 999px;
      background: transparent; color: ${G.ink};
      border: 1.5px solid ${G.ink}; cursor: pointer;
      font-family: 'DM Sans', sans-serif; font-size: 0.82rem; font-weight: 600;
      transition: all 0.22s;
    }
    .btn-outline:hover { background: ${G.ink}; color: #fff; }

    .btn-outline-white {
      display: inline-flex; align-items: center; gap: 8px;
      padding: 10px 22px; border-radius: 999px;
      background: transparent; color: #fff;
      border: 1.5px solid rgba(255,255,255,0.45); cursor: pointer;
      font-family: 'DM Sans', sans-serif; font-size: 0.82rem; font-weight: 600;
      transition: all 0.22s;
    }
    .btn-outline-white:hover { background: rgba(255,255,255,0.1); border-color: #fff; }

    .btn-pink {
      display: inline-flex; align-items: center; gap: 8px;
      padding: 11px 22px; border-radius: 999px;
      background: ${G.darkGreen}; color: #fff; border: none; cursor: pointer;
      font-family: 'DM Sans', sans-serif; font-size: 0.82rem; font-weight: 600;
      transition: all 0.22s;
    }
    .btn-pink:hover { background: ${G.forest}; transform: translateY(-1px); box-shadow: 0 6px 20px rgba(233,30,140,0.25); }

    /* Cards */
    .card-soft { background: ${G.softCream}; border-radius: 16px; border: 1px solid ${G.border}; transition: all 0.25s; }
    .card-white { background: ${G.white}; border-radius: 16px; border: 1px solid ${G.border}; transition: all 0.25s; }
    .card-dark { background: ${G.darkBg}; border-radius: 16px; color: #fff; }
    .card-pink { background: ${G.darkGreen}; border-radius: 16px; color: #fff; }

    /* Label pill */
    .label-pill {
      display: inline-flex; align-items: center; gap: 6px;
      font-size: 0.68rem; font-weight: 700; text-transform: uppercase;
      letter-spacing: 0.12em; color: ${G.darkGreen};
      background: ${G.paleGreen}; padding: 5px 14px; border-radius: 999px;
      margin-bottom: 16px;
    }
    .label-pill-dark {
      display: inline-flex; align-items: center; gap: 6px;
      font-size: 0.68rem; font-weight: 700; text-transform: uppercase;
      letter-spacing: 0.12em; color: ${G.lightSage};
      background: rgba(255,255,255,0.1); padding: 5px 14px; border-radius: 999px;
      margin-bottom: 16px;
    }

    /* Divider */
    .divider-line {
      display: flex; align-items: center; gap: 16px;
      font-size: 0.68rem; font-weight: 600; letter-spacing: 0.1em;
      text-transform: uppercase; color: ${G.muted};
    }
    .divider-line::before, .divider-line::after {
      content: ''; flex: 1; height: 1px; background: ${G.border};
    }

    /* Typography */
    .h1 { font-family: 'DM Serif Display', serif; font-weight: 400; font-size: clamp(2.6rem, 5.5vw, 4.4rem); line-height: 1.06; letter-spacing: -0.02em; }
    .h2 { font-family: 'DM Serif Display', serif; font-weight: 400; font-size: clamp(1.8rem, 3.2vw, 2.8rem); line-height: 1.15; letter-spacing: -0.02em; }
    .h3 { font-family: 'DM Sans', sans-serif; font-weight: 700; font-size: 1rem; }
    .body-t { font-size: 0.95rem; color: ${G.body}; line-height: 1.8; }
    .small-t { font-size: 0.84rem; color: ${G.body}; line-height: 1.75; }
    .muted-t { font-size: 0.82rem; color: ${G.muted}; }

    /* Service card hover */
    .service-card { cursor: pointer; transition: all 0.25s; }
    .service-card:hover { background: ${G.paleGreen} !important; border-color: ${G.darkGreen}33 !important; }
    .service-card:hover .svc-icon { background: ${G.darkGreen} !important; color: #fff !important; }

    @keyframes floatY { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-7px)} }
    .float { animation: floatY 5s ease-in-out infinite; }

    ::-webkit-scrollbar { width: 5px; }
    ::-webkit-scrollbar-track { background: ${G.cream}; }
    ::-webkit-scrollbar-thumb { background: ${G.lightSage}; border-radius: 3px; }

    @media(max-width:768px){
      .hide-m { display:none!important; }
      .g2,.g3,.g4,.gc { grid-template-columns:1fr!important; gap:14px!important; }
      .wrap { padding: 0 18px; }
      .section { padding: 60px 0!important; }
      .h1 { font-size: 2.2rem!important; }
      .h2 { font-size: 1.7rem!important; }
    }
    @media(min-width:640px) and (max-width:960px){
      .g3 { grid-template-columns:repeat(2,1fr)!important; }
      .g4 { grid-template-columns:repeat(2,1fr)!important; }
    }
    @media(max-width:480px){
      .wrap { padding: 0 14px; }
    }
  `}</style>
);

// ─── Navbar ───────────────────────────────────────────────────────────────────
function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", fn); return () => window.removeEventListener("scroll", fn);
  }, []);
  const go = (h: string) => { setOpen(false); document.querySelector(h)?.scrollIntoView({ behavior: "smooth" }); };

  return (
    <>
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 200,
        background: scrolled ? "rgba(255,255,255,0.97)" : "rgba(255,255,255,0.88)",
        backdropFilter: "blur(20px)",
        borderBottom: `1px solid ${scrolled ? G.border : "transparent"}`,
        transition: "all 0.3s",
        boxShadow: scrolled ? "0 1px 16px rgba(0,0,0,0.05)" : "none",
      }}>
        <div className="wrap" style={{ height: "66px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          {/* Logo */}
          <button onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: "10px" }}>
            <div style={{ width: "32px", height: "32px", borderRadius: "8px", background: G.darkGreen, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round">
                <path d="M12 3C7 3 3 7 3 12s4 9 9 9 9-4 9-9-4-9-9-9z"/>
                <path d="M8 14s1.5 2 4 2 4-2 4-2"/>
                <circle cx="9" cy="10" r="1.2" fill="white" stroke="none"/>
                <circle cx="15" cy="10" r="1.2" fill="white" stroke="none"/>
              </svg>
            </div>
            <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "1.1rem", fontWeight: 800, letterSpacing: "-0.02em", color: G.ink }}>
              <span style={{ color: G.darkGreen }}>Mynd</span>Works
            </span>
          </button>

          {/* Desktop links */}
          <div className="hide-m" style={{ display: "flex", alignItems: "center", gap: "4px" }}>
            {[["About","#about"],["Services","#services"],["FAQ","#faq"],["Contact","#contact"]].map(([l,h]) => (
              <button key={l} onClick={() => go(h)}
                style={{ background: "none", border: "none", cursor: "pointer", padding: "7px 14px", borderRadius: "999px", fontSize: "0.84rem", fontWeight: 500, color: G.body, fontFamily: "'DM Sans', sans-serif", transition: "all 0.18s" }}
                onMouseEnter={e => { e.currentTarget.style.color = G.ink; e.currentTarget.style.background = G.paleGreen; }}
                onMouseLeave={e => { e.currentTarget.style.color = G.body; e.currentTarget.style.background = "none"; }}>
                {l}
              </button>
            ))}
            <button onClick={() => go("#contact")} className="btn-dark" style={{ marginLeft: "8px" }}>
              Book Session
            </button>
            <button onClick={() => go("#contact")} style={{ marginLeft: "6px", display: "flex", alignItems: "center", gap: "7px", background: "none", border: `1px solid ${G.border}`, borderRadius: "999px", padding: "7px 14px", cursor: "pointer", fontSize: "0.84rem", color: G.body, fontFamily: "'DM Sans', sans-serif", transition: "all 0.18s" }}
              onMouseEnter={e => (e.currentTarget.style.borderColor = G.darkGreen)}
              onMouseLeave={e => (e.currentTarget.style.borderColor = G.border)}>
              <div style={{ width: "22px", height: "22px", borderRadius: "50%", background: G.darkGreen, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <svg width="11" height="11" fill="none" stroke="white" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
              </div>
              Log in
            </button>
          </div>

          {/* Mobile toggle */}
          <button onClick={() => setOpen(!open)} style={{ background: "none", border: "none", cursor: "pointer", display: "none", padding: "4px" }} className="show-m">
            <svg width="22" height="22" fill="none" stroke={G.ink} viewBox="0 0 24 24">
              {open ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/> : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16"/>}
            </svg>
          </button>
        </div>

        {open && (
          <div style={{ background: G.cream, borderTop: `1px solid ${G.border}`, padding: "14px 18px 20px" }}>
            {[["Services","#services"],["About","#about"],["FAQ","#faq"],["Contact","#contact"]].map(([l,h]) => (
              <button key={l} onClick={() => go(h)} style={{ display: "block", width: "100%", textAlign: "left", padding: "13px 0", background: "none", border: "none", borderBottom: `1px solid ${G.border}`, fontSize: "0.95rem", fontWeight: 500, color: G.ink, cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>{l}</button>
            ))}
            <button onClick={() => go("#contact")} className="btn-dark" style={{ width: "100%", marginTop: "14px", justifyContent: "center" }}>Book Appointment</button>
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
    <section style={{ minHeight: "100vh", background: G.cream, display: "flex", flexDirection: "column", justifyContent: "flex-end", position: "relative", overflow: "hidden", paddingTop: "66px" }}>
      {/* Full-bleed bg */}
      <div style={{ position: "absolute", inset: 0, zIndex: 0 }}>
        <img
          src="https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=1600&auto=format&fit=crop&q=80"
          alt="Therapy"
          style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center top" }}
        />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.0) 30%, rgba(255,255,255,0.82) 72%, rgba(255,255,255,1) 100%)" }}/>
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(120deg, rgba(15,23,42,0.3) 0%, transparent 55%)" }}/>
      </div>

      {/* Floating badge */}
      <div className="hide-m" style={{ position: "absolute", top: "110px", right: "40px", zIndex: 10 }}>
        <div style={{ background: "rgba(255,255,255,0.94)", backdropFilter: "blur(12px)", borderRadius: "14px", padding: "14px 18px", border: `1px solid ${G.border}`, textAlign: "center" }} className="float">
          <p style={{ fontFamily: "'DM Serif Display', serif", fontWeight: 400, fontSize: "1.6rem", color: G.darkGreen, lineHeight: 1 }}>2,000+</p>
          <p style={{ fontSize: "0.68rem", color: G.muted, marginTop: "3px", fontWeight: 500 }}>Lives Transformed</p>
        </div>
      </div>

      {/* Stars */}
      <div className="hide-m" style={{ position: "absolute", top: "200px", right: "56px", zIndex: 10 }}>
        <div style={{ background: G.darkGreen, borderRadius: "999px", padding: "7px 14px", display: "flex", alignItems: "center", gap: "6px" }}>
          <div style={{ display: "flex", gap: "1px" }}>
            {[...Array(5)].map((_,i) => <span key={i} style={{ color: "#fde68a", fontSize: "9px" }}>★</span>)}
          </div>
          <span style={{ fontSize: "0.72rem", color: "#fff", fontWeight: 600 }}>4.9 Rating</span>
        </div>
      </div>

      {/* Content */}
      <div className="wrap" style={{ position: "relative", zIndex: 2, paddingBottom: "80px" }}>
        <div style={{ maxWidth: "620px" }}>
          <Reveal>
            <div className="label-pill" style={{ background: "rgba(255,255,255,0.88)", backdropFilter: "blur(8px)" }}>
              Professional Mental Health Support
            </div>
          </Reveal>
          <Reveal delay={60}>
            <h1 style={{ fontFamily: "'DM Serif Display', serif", fontWeight: 400, fontSize: "clamp(2.8rem, 6vw, 5rem)", lineHeight: 1.05, letterSpacing: "-0.02em", color: G.ink, marginBottom: "8px" }}>
              Feel better. <em style={{ fontStyle: "italic", color: G.darkGreen }}>Think</em>
            </h1>
            <h1 style={{ fontFamily: "'DM Serif Display', serif", fontWeight: 400, fontSize: "clamp(2.8rem, 6vw, 5rem)", lineHeight: 1.05, letterSpacing: "-0.02em", color: G.ink, marginBottom: "22px" }}>
              clearer.
            </h1>
          </Reveal>
          <Reveal delay={110}>
            <p className="body-t" style={{ maxWidth: "440px", marginBottom: "32px" }}>
              Book therapy, talk to a professional, or get the guidance you need — whenever and wherever you need it.
            </p>
          </Reveal>
          <Reveal delay={160}>
            <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
              <button className="btn-dark" onClick={() => document.querySelector("#contact")?.scrollIntoView({ behavior: "smooth" })}>
                Book Appointment
              </button>
              <button className="btn-outline" onClick={() => document.querySelector("#services")?.scrollIntoView({ behavior: "smooth" })} style={{ background: "rgba(255,255,255,0.88)", backdropFilter: "blur(8px)" }}>
                Learn more →
              </button>
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
    { v: "2,000+", l: "Clients Supported",    color: G.darkGreen },
    { v: "15+",    l: "Years Experience",      color: G.olive },
    { v: "98%",    l: "Satisfaction Rate",     color: G.blue },
  ];
  return (
    <section style={{ background: G.softCream, borderTop: `1px solid ${G.border}`, borderBottom: `1px solid ${G.border}`, padding: "48px 0" }}>
      <div className="wrap">
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "1px", background: G.border }} className="g3">
          {items.map((s, i) => (
            <Reveal key={s.l} delay={i * 70}>
              <div style={{ background: G.softCream, padding: "32px 40px", display: "flex", alignItems: "center", gap: "20px" }}>
                <p style={{ fontFamily: "'DM Serif Display', serif", fontWeight: 400, fontSize: "2.4rem", color: s.color, lineHeight: 1 }}>{s.v}</p>
                <p style={{ fontSize: "0.78rem", color: G.body, maxWidth: "80px", lineHeight: 1.4, fontWeight: 500 }}>{s.l}</p>
              </div>
            </Reveal>
          ))}
        </div>
        <Reveal delay={200}>
          <p className="small-t" style={{ maxWidth: "420px", marginTop: "28px", color: G.muted, paddingLeft: "4px" }}>
            Whether you're navigating a life transition or seeking lasting change, our team is here to walk the journey with you.
          </p>
        </Reveal>
      </div>
    </section>
  );
}

// ─── Services ─────────────────────────────────────────────────────────────────
function Services() {
  return (
    <section id="services" className="section" style={{ background: G.cream, padding: "96px 0" }}>
      <div className="wrap">
        <Reveal>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "56px", flexWrap: "wrap", gap: "20px" }}>
            <div>
              <div className="label-pill">What We Offer</div>
              <h2 className="h2" style={{ color: G.ink }}>Our Services</h2>
            </div>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "10px" }}>
              <p className="small-t" style={{ maxWidth: "300px", textAlign: "right" }}>
                Evidence-based support for every stage of your mental wellness journey.
              </p>
              <button className="btn-dark" onClick={() => document.querySelector("#contact")?.scrollIntoView({ behavior: "smooth" })}>
                Explore the services →
              </button>
            </div>
          </div>
        </Reveal>

        <div className="g3" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "0", borderTop: `1px solid ${G.border}` }}>
          {SERVICES.slice(0, 6).map((s, i) => (
            <Reveal key={s.title} delay={i * 40}>
              <div className="service-card" style={{ padding: "32px 28px", borderBottom: `1px solid ${G.border}`, borderRight: i % 3 !== 2 ? `1px solid ${G.border}` : "none", height: "100%", background: G.cream }}>
                <div className="svc-icon" style={{ width: "46px", height: "46px", borderRadius: "12px", background: G.paleGreen, display: "flex", alignItems: "center", justifyContent: "center", color: G.darkGreen, marginBottom: "18px", transition: "all 0.22s" }}
                  dangerouslySetInnerHTML={{ __html: s.icon }}/>
                <h3 style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: "1rem", color: G.ink, marginBottom: "10px" }}>{s.title}</h3>
                <p style={{ fontSize: "0.83rem", color: G.body, lineHeight: 1.7, marginBottom: "18px" }}>{s.desc}</p>
                <div style={{ display: "flex", alignItems: "center", gap: "5px", fontSize: "0.78rem", fontWeight: 600, color: G.darkGreen }}>
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

// ─── Why Choose Us ────────────────────────────────────────────────────────────
function WhyUs() {
  const reasons = [
    { icon: `<svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>`, title: "Flexible Scheduling", desc: "We offer flexible scheduling options to fit your busy lifestyle — mornings, evenings or weekends." },
    { icon: `<svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/></svg>`, title: "Personalised Programs", desc: "Every wellness journey is unique. Our programmes are tailored specifically to your individual needs and goals." },
    { icon: `<svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>`, title: "Accredited Therapists", desc: "Our team of certified and experienced therapists is dedicated to helping you reach your wellness goals." },
    { icon: `<svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/></svg>`, title: "Holistic Wellness", desc: "We go beyond talk therapy — offering mindfulness, corporate wellness, workshops and holistic care." },
  ];

  return (
    <section style={{ background: G.softCream, padding: "88px 0", borderTop: `1px solid ${G.border}` }}>
      <div className="wrap">
        <Reveal>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "48px", flexWrap: "wrap", gap: "20px" }}>
            <div>
              <div className="label-pill">Why MyndWorks</div>
              <h2 className="h2" style={{ color: G.ink }}>Why Choose Us?</h2>
            </div>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "8px" }}>
              <p className="small-t" style={{ maxWidth: "300px", textAlign: "right" }}>
                Our commitment to your wellness goes beyond just sessions.
              </p>
              <button className="btn-pink" onClick={() => document.querySelector("#contact")?.scrollIntoView({ behavior: "smooth" })}>
                Book Now
              </button>
            </div>
          </div>
        </Reveal>

        <div className="g4" style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "12px" }}>
          {reasons.map((r, i) => (
            <Reveal key={r.title} delay={i * 60}>
              <div style={{
                background: i === 0 ? G.darkGreen : G.white,
                borderRadius: "16px",
                border: `1px solid ${i === 0 ? "transparent" : G.border}`,
                padding: "28px 24px",
                height: "100%",
                display: "flex", flexDirection: "column", gap: "14px",
                transition: "all 0.25s",
              }}
                onMouseEnter={e => { if (i !== 0) { (e.currentTarget as HTMLDivElement).style.background = G.paleGreen; (e.currentTarget as HTMLDivElement).style.borderColor = G.darkGreen + "33"; } }}
                onMouseLeave={e => { if (i !== 0) { (e.currentTarget as HTMLDivElement).style.background = G.white; (e.currentTarget as HTMLDivElement).style.borderColor = G.border; } }}>
                <div style={{ width: "44px", height: "44px", borderRadius: "12px", background: i === 0 ? "rgba(255,255,255,0.15)" : G.paleGreen, display: "flex", alignItems: "center", justifyContent: "center", color: i === 0 ? "#fff" : G.darkGreen }}
                  dangerouslySetInnerHTML={{ __html: r.icon }}/>
                <h3 style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: "0.95rem", color: i === 0 ? "#fff" : G.ink, lineHeight: 1.3 }}>{r.title}</h3>
                <p style={{ fontSize: "0.8rem", color: i === 0 ? "rgba(255,255,255,0.72)" : G.body, lineHeight: 1.7, flex: 1 }}>{r.desc}</p>
                <button onClick={() => document.querySelector("#contact")?.scrollIntoView({ behavior: "smooth" })}
                  style={{ alignSelf: "flex-start", background: i === 0 ? "rgba(255,255,255,0.15)" : G.paleGreen, border: "none", borderRadius: "999px", padding: "8px 16px", fontSize: "0.76rem", fontWeight: 600, color: i === 0 ? "#fff" : G.darkGreen, cursor: "pointer", transition: "all 0.2s", fontFamily: "'DM Sans', sans-serif" }}
                  onMouseEnter={e => { (e.currentTarget).style.background = i === 0 ? "rgba(255,255,255,0.25)" : G.darkGreen; if (i !== 0) (e.currentTarget).style.color = "#fff"; }}
                  onMouseLeave={e => { (e.currentTarget).style.background = i === 0 ? "rgba(255,255,255,0.15)" : G.paleGreen; if (i !== 0) (e.currentTarget).style.color = G.darkGreen; }}>
                  Book Now
                </button>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Promo Banner ─────────────────────────────────────────────────────────────
function PromoBanner() {
  return (
    <section style={{ background: G.cream, padding: "72px 0" }}>
      <div className="wrap">
        <Reveal>
          <div style={{ borderRadius: "22px", overflow: "hidden", display: "grid", gridTemplateColumns: "1fr 1fr", background: G.darkBg, position: "relative" }} className="g2">
            <div style={{ padding: "56px 52px", display: "flex", flexDirection: "column", justifyContent: "center" }}>
              <div className="label-pill-dark">Our Offer</div>
              <h2 style={{ fontFamily: "'DM Serif Display', serif", fontWeight: 400, fontSize: "clamp(1.6rem, 3vw, 2.4rem)", color: "#fff", lineHeight: 1.2, marginBottom: "18px" }}>
                Free consultation<br/>
                <em style={{ fontStyle: "italic", color: G.lightSage }}>for new clients</em><br/>
                this month
              </h2>
              <p style={{ fontSize: "0.85rem", color: "rgba(255,255,255,0.6)", lineHeight: 1.75, marginBottom: "32px", maxWidth: "320px" }}>
                Once we receive your consult request, we match you with the right therapist for your unique goals, needs, and personality.
              </p>
              <button className="btn-outline-white" onClick={() => document.querySelector("#contact")?.scrollIntoView({ behavior: "smooth" })} style={{ alignSelf: "flex-start" }}>
                Book Free Session
              </button>
            </div>
            <div style={{ position: "relative", minHeight: "340px", overflow: "hidden" }} className="hide-m">
              <img
                src="https://images.unsplash.com/photo-1516302752625-fcc3c50ae61f?w=800&auto=format&fit=crop&q=80"
                alt="Wellness session"
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
              <div style={{ position: "absolute", inset: 0, background: "linear-gradient(90deg, rgba(15,23,42,0.35) 0%, transparent 45%)" }}/>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

// ─── About / Team ─────────────────────────────────────────────────────────────
function About() {
  return (
    <section id="about" className="section" style={{ background: G.softCream, padding: "96px 0", borderTop: `1px solid ${G.border}` }}>
      <div className="wrap">
        <Reveal>
          <div className="label-pill">Our Team</div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "48px", flexWrap: "wrap", gap: "20px" }}>
            <h2 className="h2" style={{ color: G.ink, maxWidth: "420px" }}>
              Rooted in empathy,<br/>
              <em style={{ fontStyle: "italic", color: G.darkGreen }}>driven by science.</em>
            </h2>
            <p className="small-t" style={{ maxWidth: "340px" }}>
              Our accredited practitioners combine CBT, EMDR, and mindfulness with a deeply human style of care.
            </p>
          </div>
        </Reveal>

        <div style={{ display: "grid", gridTemplateColumns: "1.3fr 1fr 1fr", gap: "14px" }} className="g3">
          {/* Featured dark card */}
          <Reveal delay={0}>
            <div style={{ background: G.darkBg, borderRadius: "18px", padding: "36px 32px", height: "380px", display: "flex", flexDirection: "column", justifyContent: "space-between", position: "relative", overflow: "hidden" }}>
              <div style={{ position: "absolute", top: "-40px", right: "-40px", width: "160px", height: "160px", borderRadius: "50%", background: "rgba(233,30,140,0.08)" }}/>
              <div>
                <div className="label-pill-dark">Personalised Coaching</div>
                <h3 style={{ fontFamily: "'DM Serif Display', serif", fontWeight: 400, fontSize: "1.4rem", color: "#fff", lineHeight: 1.3, marginTop: "8px" }}>
                  Your mental health,<br/>
                  <em style={{ fontStyle: "italic", color: G.lightSage }}>our core focus.</em>
                </h3>
              </div>
              <div>
                <p style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.6)", lineHeight: 1.7, marginBottom: "20px" }}>
                  Evidence-based therapies delivered by accredited professionals — compassionate, confidential and accessible.
                </p>
                <button className="btn-outline-white" onClick={() => document.querySelector("#contact")?.scrollIntoView({ behavior: "smooth" })} style={{ fontSize: "0.8rem", padding: "9px 18px" }}>
                  Get Appointment
                </button>
              </div>
            </div>
          </Reveal>

          {/* Team 1 */}
          <Reveal delay={80}>
            <div style={{ borderRadius: "18px", overflow: "hidden", height: "380px", position: "relative", cursor: "pointer" }}>
              <img
                src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=500&auto=format&fit=crop&q=80"
                alt="Dr. M. Patel"
                style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "top" }}
              />
              <div style={{ position: "absolute", inset: 0, background: "linear-gradient(0deg, rgba(15,23,42,0.72) 0%, transparent 55%)" }}/>
              <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "20px 18px" }}>
                <p style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: "0.92rem", color: "#fff" }}>Dr. M. Patel</p>
                <p style={{ fontSize: "0.72rem", color: "rgba(255,255,255,0.65)" }}>Clinical Psychologist · Founder</p>
                <button onClick={() => document.querySelector("#contact")?.scrollIntoView({ behavior: "smooth" })} style={{ marginTop: "10px", background: G.darkGreen, border: "none", borderRadius: "999px", padding: "7px 14px", fontSize: "0.72rem", fontWeight: 600, color: "#fff", cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>
                  Learn more →
                </button>
              </div>
            </div>
          </Reveal>

          {/* Team 2 */}
          <Reveal delay={160}>
            <div style={{ borderRadius: "18px", overflow: "hidden", height: "380px", position: "relative", cursor: "pointer" }}>
              <img
                src="https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=500&auto=format&fit=crop&q=80"
                alt="J. Okoro"
                style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "top" }}
              />
              <div style={{ position: "absolute", inset: 0, background: "linear-gradient(0deg, rgba(15,23,42,0.72) 0%, transparent 55%)" }}/>
              <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "20px 18px" }}>
                <p style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: "0.92rem", color: "#fff" }}>J. Okoro</p>
                <p style={{ fontSize: "0.72rem", color: "rgba(255,255,255,0.65)" }}>Psychotherapist</p>
                <button onClick={() => document.querySelector("#contact")?.scrollIntoView({ behavior: "smooth" })} style={{ marginTop: "10px", background: G.darkGreen, border: "none", borderRadius: "999px", padding: "7px 14px", fontSize: "0.72rem", fontWeight: 600, color: "#fff", cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>
                  Learn more →
                </button>
              </div>
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
    <section id="testimonials" style={{ background: G.cream, padding: "96px 0", borderTop: `1px solid ${G.border}` }}>
      <div className="wrap">
        <Reveal>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "52px", flexWrap: "wrap", gap: "20px" }}>
            <div>
              <div className="label-pill">Client Stories</div>
              <h2 className="h2" style={{ color: G.ink }}>Real people, <em style={{ fontStyle: "italic", color: G.darkGreen }}>real change.</em></h2>
            </div>
            <div style={{ display: "flex", gap: "6px" }}>
              {TESTIMONIALS.map((_,i) => (
                <button key={i} onClick={() => setActive(i)} style={{ border: "none", cursor: "pointer", borderRadius: "999px", height: "4px", transition: "all 0.3s", background: active === i ? G.darkGreen : G.border, width: active === i ? "24px" : "8px" }}/>
              ))}
            </div>
          </div>
        </Reveal>

        <div style={{ display: "grid", gridTemplateColumns: "1.6fr 1fr", gap: "14px" }} className="g2">
          <Reveal>
            <div style={{ background: G.darkBg, borderRadius: "18px", padding: "40px", position: "relative", overflow: "hidden" }}>
              <div style={{ position: "absolute", top: "-30px", right: "-30px", width: "140px", height: "140px", borderRadius: "50%", background: "rgba(233,30,140,0.06)" }}/>
              <div style={{ display: "flex", gap: "3px", marginBottom: "24px" }}>
                {[...Array(5)].map((_,i) => <span key={i} style={{ color: G.olive, fontSize: "1rem" }}>★</span>)}
              </div>
              <p style={{ fontFamily: "'DM Serif Display', serif", fontStyle: "italic", fontSize: "1.15rem", color: "rgba(255,255,255,0.9)", lineHeight: 1.75, marginBottom: "32px" }}>
                "{TESTIMONIALS[active].text}"
              </p>
              <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                <div style={{ width: "46px", height: "46px", borderRadius: "50%", background: G.darkGreen, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.8rem", fontWeight: 700, color: "#fff", flexShrink: 0 }}>
                  {TESTIMONIALS[active].initials}
                </div>
                <div>
                  <p style={{ fontSize: "0.9rem", fontWeight: 700, color: "#fff" }}>{TESTIMONIALS[active].name}</p>
                  <p style={{ fontSize: "0.74rem", color: "rgba(255,255,255,0.5)" }}>{TESTIMONIALS[active].role}</p>
                </div>
              </div>
            </div>
          </Reveal>

          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {TESTIMONIALS.map((t, i) => (
              <Reveal key={t.name} delay={i * 50}>
                <button onClick={() => setActive(i)} style={{ width: "100%", textAlign: "left", padding: "16px 18px", borderRadius: "14px", cursor: "pointer", border: `1px solid ${active === i ? G.darkGreen : G.border}`, background: active === i ? G.paleGreen : G.white, transition: "all 0.22s", display: "flex", alignItems: "center", gap: "12px" }}>
                  <div style={{ width: "38px", height: "38px", borderRadius: "50%", background: active === i ? G.darkGreen : G.softCream, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.72rem", fontWeight: 700, color: active === i ? "#fff" : G.muted, flexShrink: 0, transition: "all 0.22s" }}>
                    {t.initials}
                  </div>
                  <div>
                    <p style={{ fontSize: "0.84rem", fontWeight: 700, color: G.ink }}>{t.name}</p>
                    <p style={{ fontSize: "0.72rem", color: G.muted }}>{t.role}</p>
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
    <section id="faq" style={{ background: G.softCream, padding: "96px 0", borderTop: `1px solid ${G.border}` }}>
      <div className="wrap-sm">
        <Reveal>
          <div className="label-pill">Common Questions</div>
          <h2 className="h2" style={{ marginBottom: "52px", color: G.ink }}>Got questions?</h2>
        </Reveal>
        {FAQS.map((f, i) => (
          <Reveal key={i} delay={i * 35}>
            <div style={{ borderBottom: `1px solid ${G.border}` }}>
              <button onClick={() => setOpen(open === i ? null : i)} style={{ width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center", padding: "22px 0", background: "none", border: "none", cursor: "pointer", textAlign: "left", gap: "16px" }}>
                <span style={{ fontSize: "0.95rem", fontWeight: 600, color: open === i ? G.darkGreen : G.ink, transition: "color 0.2s" }}>{f.q}</span>
                <div style={{ width: "32px", height: "32px", borderRadius: "50%", background: open === i ? G.darkGreen : G.paleGreen, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, transition: "all 0.22s", color: open === i ? "#fff" : G.darkGreen, fontSize: "1.1rem", lineHeight: 1 }}>
                  {open === i ? "−" : "+"}
                </div>
              </button>
              {open === i && (
                <p style={{ fontSize: "0.875rem", color: G.body, lineHeight: 1.85, paddingBottom: "22px", paddingRight: "48px" }}>{f.a}</p>
              )}
            </div>
          </Reveal>
        ))}
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

  const inp: React.CSSProperties = { width: "100%", padding: "12px 16px", borderRadius: "10px", border: `1.5px solid ${G.border}`, background: G.softCream, fontSize: "0.875rem", color: G.ink, outline: "none", fontFamily: "'DM Sans', sans-serif", transition: "border-color 0.2s" };

  return (
    <section id="contact" style={{ background: G.cream, padding: "96px 0", borderTop: `1px solid ${G.border}` }}>
      <div className="wrap">
        <Reveal>
          <div className="divider-line" style={{ marginBottom: "60px" }}>Get in touch</div>
        </Reveal>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1.3fr", gap: "56px", alignItems: "start" }} className="g2 gc">
          <Reveal>
            <div className="label-pill">Book a Session</div>
            <h2 className="h2" style={{ color: G.ink, marginBottom: "14px" }}>
              Take the<br/><em style={{ fontStyle: "italic", color: G.darkGreen }}>first step.</em>
            </h2>
            <p className="body-t" style={{ marginBottom: "36px", maxWidth: "320px" }}>
              Book a free 15-minute consultation. No commitment, no pressure — just a conversation.
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: "18px", marginBottom: "32px" }}>
              {[
                { icon: `<svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg>`, label: "Phone",     val: "(076) 122-8682",              href: "tel:+27761228682" },
                { icon: `<svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>`, label: "Email",     val: "myndworkspractice@gmail.com", href: "mailto:myndworkspractice@gmail.com" },
                { icon: `<svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><rect x="2" y="2" width="20" height="20" rx="5" ry="5" strokeWidth={2}/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5" strokeWidth={2}/></svg>`, label: "Instagram", val: "@myndworkspsychology",        href: "https://instagram.com/myndworkspsychology" },
                { icon: `<svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"/></svg>`, label: "Website",   val: "www.myndworks.co.za",         href: "https://www.myndworks.co.za" },
              ].map(c => (
                <div key={c.label} style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                  <div style={{ width: "40px", height: "40px", borderRadius: "10px", background: G.paleGreen, display: "flex", alignItems: "center", justifyContent: "center", color: G.darkGreen, flexShrink: 0 }}
                    dangerouslySetInnerHTML={{ __html: c.icon }}/>
                  <div>
                    <p style={{ fontSize: "0.65rem", fontWeight: 700, color: G.muted, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "2px" }}>{c.label}</p>
                    <a href={c.href} style={{ fontSize: "0.875rem", color: G.ink, fontWeight: 600, textDecoration: "none", transition: "color 0.2s" }}
                      onMouseEnter={e => (e.currentTarget.style.color = G.darkGreen)}
                      onMouseLeave={e => (e.currentTarget.style.color = G.ink)}>
                      {c.val}
                    </a>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ padding: "16px 20px", borderRadius: "12px", background: G.paleGreen, border: `1px solid ${G.border}` }}>
              <p style={{ fontSize: "0.8rem", fontWeight: 700, color: G.darkGreen, marginBottom: "4px" }}>🆘 In crisis right now?</p>
              <p style={{ fontSize: "0.8rem", color: G.body, lineHeight: 1.6 }}>Contact your local emergency services or a crisis helpline immediately. You are not alone.</p>
            </div>
          </Reveal>

          <Reveal delay={100}>
            <div style={{ background: G.white, borderRadius: "20px", padding: "40px", border: `1px solid ${G.border}`, boxShadow: "0 8px 40px rgba(233,30,140,0.06)" }}>
              {status === "success" ? (
                <div style={{ textAlign: "center", padding: "48px 0" }}>
                  <div style={{ width: "64px", height: "64px", borderRadius: "50%", background: G.paleGreen, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px", fontSize: "1.8rem" }}>🌿</div>
                  <h3 style={{ fontFamily: "'DM Serif Display', serif", fontWeight: 400, fontSize: "1.4rem", color: G.ink, marginBottom: "10px" }}>Thank you, {form.name.split(" ")[0]}!</h3>
                  <p style={{ color: G.body, fontSize: "0.875rem", lineHeight: 1.75 }}>We'll be in touch within 24 hours.<br/>You've taken a brave step.</p>
                </div>
              ) : (
                <>
                  <h3 style={{ fontFamily: "'DM Serif Display', serif", fontWeight: 400, fontSize: "1.2rem", color: G.ink, marginBottom: "6px" }}>Appointment Booking</h3>
                  <p style={{ fontSize: "0.82rem", color: G.muted, marginBottom: "28px" }}>Fill in the form and we'll reach out within 24 hours.</p>
                  <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                      {[
                        { label: "Full Name", type: "text", key: "name",  ph: "Jane Smith",   req: true },
                        { label: "Phone",     type: "tel",  key: "phone", ph: "076 122 8682", req: false },
                      ].map(f => (
                        <div key={f.key}>
                          <label style={{ display: "block", fontSize: "0.72rem", fontWeight: 600, color: G.muted, marginBottom: "7px", textTransform: "uppercase", letterSpacing: "0.06em" }}>{f.label}{f.req ? " *" : ""}</label>
                          <input required={f.req} type={f.type} placeholder={f.ph} value={form[f.key as keyof typeof form]}
                            onChange={e => setForm({ ...form, [f.key]: e.target.value })} style={inp}
                            onFocus={e => (e.target.style.borderColor = G.darkGreen)}
                            onBlur={e => (e.target.style.borderColor = G.border)}/>
                        </div>
                      ))}
                    </div>
                    <div>
                      <label style={{ display: "block", fontSize: "0.72rem", fontWeight: 600, color: G.muted, marginBottom: "7px", textTransform: "uppercase", letterSpacing: "0.06em" }}>Email Address *</label>
                      <input required type="email" placeholder="jane@example.com" value={form.email}
                        onChange={e => setForm({...form, email: e.target.value})} style={inp}
                        onFocus={e => (e.target.style.borderColor = G.darkGreen)}
                        onBlur={e => (e.target.style.borderColor = G.border)}/>
                    </div>
                    <div>
                      <label style={{ display: "block", fontSize: "0.72rem", fontWeight: 600, color: G.muted, marginBottom: "7px", textTransform: "uppercase", letterSpacing: "0.06em" }}>Service</label>
                      <select value={form.service} onChange={e => setForm({...form, service: e.target.value})} style={{ ...inp, appearance: "none" as const }}
                        onFocus={e => (e.target.style.borderColor = G.darkGreen)} onBlur={e => (e.target.style.borderColor = G.border)}>
                        <option value="">Select a service…</option>
                        {SERVICES.map(s => <option key={s.title} value={s.title}>{s.title}</option>)}
                      </select>
                    </div>
                    <div>
                      <label style={{ display: "block", fontSize: "0.72rem", fontWeight: 600, color: G.muted, marginBottom: "7px", textTransform: "uppercase", letterSpacing: "0.06em" }}>Message</label>
                      <textarea rows={3} placeholder="Tell us what brings you here…" value={form.message}
                        onChange={e => setForm({...form, message: e.target.value})}
                        style={{ ...inp, resize: "none" as const }}
                        onFocus={e => (e.target.style.borderColor = G.darkGreen)}
                        onBlur={e => (e.target.style.borderColor = G.border)}/>
                    </div>
                    {status === "error" && <p style={{ color: "#dc2626", fontSize: "0.8rem", textAlign: "center" }}>Something went wrong. Please try again.</p>}
                    <button type="submit" disabled={status === "sending"} className="btn-dark" style={{ justifyContent: "center", padding: "14px", borderRadius: "10px", fontSize: "0.9rem", opacity: status === "sending" ? 0.6 : 1, width: "100%" }}>
                      {status === "sending" ? "Sending…" : "Book Appointment"}
                    </button>
                    <p style={{ fontSize: "0.7rem", color: G.muted, textAlign: "center" }}>Strictly confidential. We never share your information.</p>
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
    <footer style={{ background: G.darkBg, color: "rgba(255,255,255,0.45)", padding: "72px 0 36px" }}>
      <div className="wrap">
        <div style={{ display: "grid", gridTemplateColumns: "1.6fr 1fr 1fr", gap: "56px", marginBottom: "56px" }} className="g3">
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px" }}>
              <div style={{ width: "32px", height: "32px", borderRadius: "8px", background: G.darkGreen, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round">
                  <path d="M12 3C7 3 3 7 3 12s4 9 9 9 9-4 9-9-4-9-9-9z"/>
                  <path d="M8 14s1.5 2 4 2 4-2 4-2"/>
                  <circle cx="9" cy="10" r="1.2" fill="white" stroke="none"/>
                  <circle cx="15" cy="10" r="1.2" fill="white" stroke="none"/>
                </svg>
              </div>
              <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "1.1rem", fontWeight: 700, color: "#fff", letterSpacing: "-0.02em" }}>
                <span style={{ color: G.darkGreen }}>Mynd</span>Works
              </span>
            </div>
            <p style={{ fontSize: "0.84rem", lineHeight: 1.8, maxWidth: "280px", marginBottom: "24px" }}>
              Professional mental wellbeing support. Compassionate, evidence-based care for every stage of life.
            </p>
            <div style={{ display: "flex", gap: "8px" }}>
              {[
                { icon: `<svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24"><rect x="2" y="2" width="20" height="20" rx="5" ry="5" strokeWidth={2}/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5" strokeWidth={2}/></svg>`, h: "https://instagram.com/myndworkspsychology" },
                { icon: `<svg width="14" height="14" fill="currentColor" viewBox="0 0 24 24"><path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/></svg>`, h: "#" },
              ].map((s, i) => (
                <a key={i} href={s.h} style={{ width: "36px", height: "36px", borderRadius: "8px", background: "rgba(255,255,255,0.07)", display: "flex", alignItems: "center", justifyContent: "center", color: "rgba(255,255,255,0.4)", textDecoration: "none", transition: "all 0.2s" }}
                  dangerouslySetInnerHTML={{ __html: s.icon }}
                  onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.background = G.darkGreen; (e.currentTarget as HTMLAnchorElement).style.color = "#fff"; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.background = "rgba(255,255,255,0.07)"; (e.currentTarget as HTMLAnchorElement).style.color = "rgba(255,255,255,0.4)"; }}/>
              ))}
            </div>
          </div>

          <div>
            <p style={{ fontSize: "0.68rem", fontWeight: 700, color: "rgba(255,255,255,0.3)", textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: "18px" }}>Services</p>
            <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "10px" }}>
              {SERVICES.map(s => (
                <li key={s.title}>
                  <a href="#services" style={{ fontSize: "0.83rem", color: "rgba(255,255,255,0.45)", textDecoration: "none", transition: "color 0.2s" }}
                    onMouseEnter={e => (e.currentTarget.style.color = G.lightSage)}
                    onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,0.45)")}>
                    {s.title}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p style={{ fontSize: "0.68rem", fontWeight: 700, color: "rgba(255,255,255,0.3)", textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: "18px" }}>Contact</p>
            <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "12px" }}>
              {[
                { v: "(076) 122-8682",              h: "tel:+27761228682" },
                { v: "myndworkspractice@gmail.com", h: "mailto:myndworkspractice@gmail.com" },
                { v: "sphe@myndworks.co.za",        h: "mailto:sphe@myndworks.co.za" },
                { v: "@myndworkspsychology",         h: "https://instagram.com/myndworkspsychology" },
                { v: "www.myndworks.co.za",          h: "https://www.myndworks.co.za" },
              ].map(c => (
                <li key={c.v}>
                  <a href={c.h} style={{ fontSize: "0.83rem", color: "rgba(255,255,255,0.45)", textDecoration: "none", transition: "color 0.2s" }}
                    onMouseEnter={e => (e.currentTarget.style.color = G.lightSage)}
                    onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,0.45)")}>
                    {c.v}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div style={{ borderTop: "1px solid rgba(255,255,255,0.07)", paddingTop: "28px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "10px" }}>
          <p style={{ fontSize: "0.75rem" }}>© {new Date().getFullYear()} MyndWorks. All rights reserved.</p>
          <p style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.22)" }}>Designed with care for mental wellbeing.</p>
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
      <WhyUs/>
      <PromoBanner/>
      <About/>
      <Testimonials/>
      <FAQ/>
      <Contact/>
      <Footer/>
    </>
  );
}