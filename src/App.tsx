import { useState, useEffect, useRef } from "react";

// ─── Tokens ───────────────────────────────────────────────────────────────────
const T = {
  primary:   "#e91e8c",
  primaryDk: "#c9186f",
  orange:    "#f97316",
  ink:       "#0f172a",
  body:      "#475569",
  muted:     "#94a3b8",
  border:    "#e2e8f0",
  bg:        "#ffffff",
  soft:      "#f8fafc",
  pill:      "#fdf2f8",
  pillTxt:   "#e91e8c",
  dark:      "#0f172a",
};

interface Service     { icon: string; title: string; desc: string; }
interface Testimonial { name: string; role: string; text: string; initials: string; }
interface FaqItem     { q: string; a: string; }

const SERVICES: Service[] = [
  { icon: `<svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.6" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>`, title: "Individual Therapy", desc: "One-on-one sessions for anxiety, depression, trauma and life transitions in a safe, confidential space." },
  { icon: `<svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.6" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/></svg>`, title: "Couples Counselling", desc: "Rebuild trust, improve communication and reconnect using evidence-based tools." },
  { icon: `<svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.6" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3"/></svg>`, title: "Mindfulness & Stress", desc: "Practical techniques to manage stress and cultivate lasting calm in daily life." },
  { icon: `<svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.6" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"/></svg>`, title: "Group Therapy", desc: "Connect and heal with others in a safe, facilitated group environment." },
  { icon: `<svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.6" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/></svg>`, title: "Corporate Wellness", desc: "Team building, workshops, debriefing and wellness programmes for organisations." },
  { icon: `<svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.6" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>`, title: "Online Sessions", desc: "Secure, confidential video sessions from wherever you are — flexible and professional." },
  { icon: `<svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.6" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"/></svg>`, title: "Child & Adolescent", desc: "Specialised support for young people navigating emotional challenges and growth." },
  { icon: `<svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.6" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z"/></svg>`, title: "Workshops & Training", desc: "Engaging wellness workshops and professional training programmes for lasting resilience." },
];

const WHY = [
  { icon: `<svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.6" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>`, title: "Flexible Scheduling", desc: "Morning, lunch-time or evening — we fit around your life." },
  { icon: `<svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.6" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/></svg>`, title: "Personalised Programs", desc: "Every programme is tailored to your unique needs and goals." },
  { icon: `<svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.6" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>`, title: "Accredited Therapists", desc: "Certified professionals dedicated to your mental wellness goals." },
  { icon: `<svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.6" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/></svg>`, title: "Holistic Wellness", desc: "We go beyond talk therapy — mindfulness, corporate and workshops." },
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
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setV(true); obs.disconnect(); } }, { threshold: 0.05 });
    obs.observe(el); return () => obs.disconnect();
  }, []);
  return { ref, v };
}

function Reveal({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  const { ref, v } = useReveal();
  return (
    <div ref={ref} className={className} style={{ opacity: v ? 1 : 0, transform: v ? "none" : "translateY(20px)", transition: `opacity 0.6s ease ${delay}ms, transform 0.6s ease ${delay}ms` }}>
      {children}
    </div>
  );
}

// ─── Global Styles ────────────────────────────────────────────────────────────
const GS = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;0,9..40,800;0,9..40,900;1,9..40,400&display=swap');

    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    html { scroll-behavior: smooth; }
    body { background: ${T.soft}; font-family: 'DM Sans', system-ui, sans-serif; color: ${T.ink}; -webkit-font-smoothing: antialiased; }
    ::selection { background: ${T.pill}; }
    input, textarea, select { font-family: 'DM Sans', sans-serif; }

    .wrap    { max-width: 1100px; margin: 0 auto; padding: 0 24px; }
    .wrap-sm { max-width: 720px;  margin: 0 auto; padding: 0 24px; }

    /* Buttons */
    .btn-primary {
      display: inline-flex; align-items: center; gap: 8px;
      padding: 10px 20px; border-radius: 8px;
      background: ${T.primary}; color: #fff; border: none; cursor: pointer;
      font-family: 'DM Sans', sans-serif; font-size: 0.875rem; font-weight: 600;
      transition: all 0.2s;
    }
    .btn-primary:hover { background: ${T.primaryDk}; transform: translateY(-1px); }

    .btn-secondary {
      display: inline-flex; align-items: center; gap: 8px;
      padding: 9px 20px; border-radius: 8px;
      background: transparent; color: ${T.ink}; border: 1.5px solid ${T.border}; cursor: pointer;
      font-family: 'DM Sans', sans-serif; font-size: 0.875rem; font-weight: 600;
      transition: all 0.2s;
    }
    .btn-secondary:hover { border-color: ${T.primary}; color: ${T.primary}; }

    /* Cards */
    .card { background: #fff; border-radius: 12px; border: 1px solid ${T.border}; transition: all 0.22s; }
    .card:hover { box-shadow: 0 8px 28px rgba(0,0,0,0.07); transform: translateY(-2px); }

    /* Icon box */
    .icon-box {
      width: 44px; height: 44px; border-radius: 10px;
      background: ${T.pill}; color: ${T.primary};
      display: flex; align-items: center; justify-content: center;
      flex-shrink: 0; transition: all 0.2s;
    }

    /* Tag pill */
    .tag {
      display: inline-flex; align-items: center; gap: 6px;
      font-size: 0.72rem; font-weight: 600; color: ${T.primary};
      background: ${T.pill}; border: 1px solid rgba(233,30,140,0.15);
      padding: 4px 12px; border-radius: 999px;
    }

    /* Section label */
    .section-tag {
      display: inline-block; font-size: 0.7rem; font-weight: 700;
      text-transform: uppercase; letter-spacing: 0.1em; color: ${T.primary};
      background: ${T.pill}; padding: 4px 12px; border-radius: 999px; margin-bottom: 12px;
    }

    /* Typography */
    .h1 { font-size: clamp(2rem, 4.5vw, 3.2rem); font-weight: 800; line-height: 1.12; letter-spacing: -0.025em; color: ${T.ink}; }
    .h2 { font-size: clamp(1.6rem, 3vw, 2.4rem); font-weight: 800; line-height: 1.2; letter-spacing: -0.02em; color: ${T.ink}; }
    .h3 { font-size: 0.95rem; font-weight: 700; color: ${T.ink}; }
    .body-t { font-size: 0.9rem; color: ${T.body}; line-height: 1.75; }
    .small-t { font-size: 0.82rem; color: ${T.body}; line-height: 1.7; }
    .muted { color: ${T.muted}; font-size: 0.8rem; }

    /* Divider */
    .divider { display: flex; align-items: center; gap: 14px; font-size: 0.7rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.08em; color: ${T.muted}; }
    .divider::before, .divider::after { content: ''; flex: 1; height: 1px; background: ${T.border}; }

    /* Scrollbar */
    ::-webkit-scrollbar { width: 4px; }
    ::-webkit-scrollbar-track { background: ${T.soft}; }
    ::-webkit-scrollbar-thumb { background: rgba(233,30,140,0.3); border-radius: 2px; }

    /* Responsive */
    @media(max-width: 768px) {
      .hide-m { display: none !important; }
      .g2, .g3, .g4, .gc { grid-template-columns: 1fr !important; gap: 12px !important; }
      .g2s { grid-template-columns: repeat(2, 1fr) !important; }
      .wrap, .wrap-sm { padding: 0 16px; }
      .h1 { font-size: 1.9rem !important; line-height: 1.15 !important; }
      .h2 { font-size: 1.5rem !important; }
      section { padding-top: 52px !important; padding-bottom: 52px !important; }
    }
    @media(min-width: 640px) and (max-width: 960px) {
      .g3 { grid-template-columns: repeat(2,1fr) !important; }
      .g4 { grid-template-columns: repeat(2,1fr) !important; }
    }
    @media(max-width: 480px) {
      .wrap, .wrap-sm { padding: 0 14px; }
      .h1 { font-size: 1.65rem !important; }
    }
  `}</style>
);

// ─── Announcement Bar ─────────────────────────────────────────────────────────
function AnnouncementBar() {
  const [show, setShow] = useState(true);
  if (!show) return null;
  return (
    <div style={{ background: T.dark, color: "#fff", padding: "9px 20px", display: "flex", alignItems: "center", justifyContent: "center", gap: "12px", fontSize: "0.78rem", position: "relative" }}>
      <span style={{ background: T.primary, borderRadius: "4px", padding: "2px 8px", fontSize: "0.68rem", fontWeight: 700 }}>New</span>
      <span style={{ color: "rgba(255,255,255,0.85)" }}>MyndWorks 2025 · Discover new therapy programmes and wellness strategies to elevate your wellbeing.</span>
      <button onClick={() => setShow(false)} style={{ position: "absolute", right: "16px", background: "none", border: "none", color: "rgba(255,255,255,0.5)", cursor: "pointer", fontSize: "1rem", lineHeight: 1 }}>✕</button>
    </div>
  );
}

// ─── Navbar ───────────────────────────────────────────────────────────────────
function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", fn); return () => window.removeEventListener("scroll", fn);
  }, []);
  const go = (h: string) => { setOpen(false); document.querySelector(h)?.scrollIntoView({ behavior: "smooth" }); };

  return (
    <>
      <nav style={{ background: "#fff", borderBottom: `1px solid ${T.border}`, position: "sticky", top: 0, zIndex: 200, boxShadow: scrolled ? "0 1px 12px rgba(0,0,0,0.06)" : "none", transition: "box-shadow 0.2s" }}>
        <div className="wrap" style={{ height: "60px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          {/* Logo */}
          <button onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: "9px" }}>
            <div style={{ width: "30px", height: "30px", borderRadius: "7px", background: T.primary, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round">
                <path d="M12 3C7 3 3 7 3 12s4 9 9 9 9-4 9-9-4-9-9-9z"/>
                <path d="M8 14s1.5 2 4 2 4-2 4-2"/>
                <circle cx="9" cy="10" r="1.2" fill="white" stroke="none"/>
                <circle cx="15" cy="10" r="1.2" fill="white" stroke="none"/>
              </svg>
            </div>
            <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "1rem", fontWeight: 800, letterSpacing: "-0.02em", color: T.ink }}>
              <span style={{ color: T.primary }}>Mynd</span>Works
            </span>
          </button>

          {/* Desktop nav */}
          <div className="hide-m" style={{ display: "flex", alignItems: "center", gap: "2px" }}>
            {[["About","#about"],["Services","#services"],["FAQ","#faq"],["Contact","#contact"]].map(([l,h]) => (
              <button key={l} onClick={() => go(h)} style={{ background: "none", border: "none", cursor: "pointer", padding: "6px 14px", borderRadius: "7px", fontSize: "0.875rem", fontWeight: 500, color: T.body, fontFamily: "'DM Sans', sans-serif", transition: "all 0.16s" }}
                onMouseEnter={e => { e.currentTarget.style.color = T.ink; e.currentTarget.style.background = T.soft; }}
                onMouseLeave={e => { e.currentTarget.style.color = T.body; e.currentTarget.style.background = "none"; }}>
                {l}
              </button>
            ))}
            <button onClick={() => go("#contact")} style={{ marginLeft: "8px", padding: "7px 16px", borderRadius: "7px", background: "none", border: `1px solid ${T.border}`, color: T.ink, cursor: "pointer", fontSize: "0.875rem", fontWeight: 600, fontFamily: "'DM Sans', sans-serif", transition: "all 0.16s" }}
              onMouseEnter={e => (e.currentTarget.style.borderColor = T.primary)}
              onMouseLeave={e => (e.currentTarget.style.borderColor = T.border)}>
              Log In
            </button>
            <button onClick={() => go("#contact")} className="btn-primary" style={{ marginLeft: "6px" }}>
              Book Session
            </button>
          </div>

          {/* Mobile */}
          <button onClick={() => setOpen(!open)} style={{ background: "none", border: "none", cursor: "pointer", display: "none", padding: "4px" }} className="show-m">
            <svg width="20" height="20" fill="none" stroke={T.ink} viewBox="0 0 24 24">
              {open ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/> : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16"/>}
            </svg>
          </button>
        </div>

        {open && (
          <div style={{ background: "#fff", borderTop: `1px solid ${T.border}`, padding: "12px 16px 18px" }}>
            {[["Services","#services"],["About","#about"],["FAQ","#faq"],["Contact","#contact"]].map(([l,h]) => (
              <button key={l} onClick={() => go(h)} style={{ display: "block", width: "100%", textAlign: "left", padding: "11px 0", background: "none", border: "none", borderBottom: `1px solid ${T.border}`, fontSize: "0.9rem", fontWeight: 500, color: T.ink, cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>{l}</button>
            ))}
            <button onClick={() => go("#contact")} className="btn-primary" style={{ width: "100%", marginTop: "12px", justifyContent: "center" }}>Book Appointment</button>
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
    <section style={{ background: "#fff", padding: "72px 0 64px" }}>
      <div className="wrap">
        <div className="g2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "56px", alignItems: "center" }}>
          {/* Left */}
          <div>
            <Reveal>
              <div className="tag" style={{ marginBottom: "20px" }}>
                <span style={{ width: "7px", height: "7px", borderRadius: "50%", background: T.primary, display: "inline-block" }}/>
                Professional Mental Health Support
              </div>
            </Reveal>
            <Reveal delay={60}>
              <h1 className="h1" style={{ marginBottom: "18px" }}>
                Feel Better,<br/>
                Think Clearer,<br/>
                and Live Fully
              </h1>
            </Reveal>
            <Reveal delay={110}>
              <p className="body-t" style={{ maxWidth: "420px", marginBottom: "28px" }}>
                MyndWorks empowers individuals with compassionate, evidence-based therapy to support mental wellness, strengthen relationships, and build lasting resilience.
              </p>
            </Reveal>
            <Reveal delay={155}>
              <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", marginBottom: "28px" }}>
                <button className="btn-primary" onClick={() => document.querySelector("#contact")?.scrollIntoView({ behavior: "smooth" })}>
                  Book Appointment
                </button>
                <button className="btn-secondary" onClick={() => document.querySelector("#services")?.scrollIntoView({ behavior: "smooth" })}>
                  Learn More
                </button>
              </div>
            </Reveal>
            <Reveal delay={195}>
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <div style={{ display: "flex", gap: "2px" }}>
                  {[...Array(5)].map((_,i) => <span key={i} style={{ color: "#f59e0b", fontSize: "0.9rem" }}>★</span>)}
                </div>
                <span style={{ fontWeight: 700, fontSize: "0.9rem", color: T.ink }}>4.9</span>
                <div style={{ display: "flex", marginLeft: "4px" }}>
                  {["SM","JP","TR"].map((ini,i) => (
                    <div key={ini} style={{ width: "28px", height: "28px", borderRadius: "50%", background: T.primary, border: "2px solid #fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.6rem", fontWeight: 700, color: "#fff", marginLeft: i > 0 ? "-8px" : "0", zIndex: 3 - i }}>
                      {ini}
                    </div>
                  ))}
                </div>
                <span style={{ fontSize: "0.8rem", color: T.muted }}>From 500+</span>
              </div>
            </Reveal>
          </div>

          {/* Right — image with floating cards */}
          <Reveal delay={80} className="hide-m">
            <div style={{ position: "relative" }}>
              <div style={{ borderRadius: "16px", overflow: "hidden", height: "420px", background: T.soft }}>
                <img
                  src="https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=800&auto=format&fit=crop&q=80"
                  alt="Therapist"
                  style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "top center" }}
                />
              </div>

              {/* Top floating card */}
              <div style={{ position: "absolute", top: "20px", left: "-20px", background: "#fff", borderRadius: "12px", padding: "14px 16px", boxShadow: "0 8px 24px rgba(0,0,0,0.1)", border: `1px solid ${T.border}`, minWidth: "170px" }}>
                <p style={{ fontSize: "0.68rem", color: T.muted, marginBottom: "4px" }}>Sessions Completed</p>
                <p style={{ fontWeight: 900, fontSize: "1.5rem", color: T.ink, lineHeight: 1 }}>$35,750</p>
                <p style={{ fontSize: "0.68rem", color: "#22c55e", marginTop: "3px", fontWeight: 600 }}>↑ 15% from last month</p>
              </div>

              {/* Bottom floating card */}
              <div style={{ position: "absolute", bottom: "20px", right: "-20px", background: "#fff", borderRadius: "12px", padding: "14px 16px", boxShadow: "0 8px 24px rgba(0,0,0,0.1)", border: `1px solid ${T.border}` }}>
                <p style={{ fontSize: "0.68rem", color: T.muted, marginBottom: "4px" }}>Total Clients</p>
                <p style={{ fontWeight: 900, fontSize: "1.8rem", color: T.ink, lineHeight: 1 }}>2,000+</p>
                <p style={{ fontSize: "0.68rem", color: "#22c55e", marginTop: "3px", fontWeight: 600 }}>↑ Lives transformed</p>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

// ─── Partner Strip ────────────────────────────────────────────────────────────
function Partners() {
  const partners = ["HPCSA", "SACSSP", "BPS", "APA", "SAJPT"];
  return (
    <div style={{ background: "#fff", borderTop: `1px solid ${T.border}`, borderBottom: `1px solid ${T.border}`, padding: "18px 0" }}>
      <div className="wrap">
        <div style={{ display: "flex", alignItems: "center", gap: "40px", flexWrap: "wrap", justifyContent: "center" }}>
          <span style={{ fontSize: "0.72rem", fontWeight: 600, color: T.muted, whiteSpace: "nowrap" }}>Our Accreditation Partners</span>
          {partners.map(p => (
            <span key={p} style={{ fontSize: "0.9rem", fontWeight: 700, color: "#cbd5e1", letterSpacing: "0.06em" }}>{p}</span>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Services Section ─────────────────────────────────────────────────────────
function Services() {
  return (
    <section id="services" style={{ background: T.soft, padding: "80px 0" }}>
      <div className="wrap">
        <Reveal>
          <div style={{ textAlign: "center", marginBottom: "52px" }}>
            <h2 className="h2" style={{ marginBottom: "14px" }}>
              Compassionate Support,<br/>Limitless Possibilities
            </h2>
            <p className="body-t" style={{ maxWidth: "500px", margin: "0 auto" }}>
              With MyndWorks, you get evidence-based mental health support designed to help you thrive — at work, at home, and in relationships.
            </p>
          </div>
        </Reveal>

        <div className="g4" style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "14px" }}>
          {SERVICES.slice(0, 8).map((s, i) => (
            <Reveal key={s.title} delay={i * 40}>
              <div className="card" style={{ padding: "22px" }}>
                <div className="icon-box" style={{ marginBottom: "14px" }}
                  dangerouslySetInnerHTML={{ __html: s.icon }}/>
                <h3 className="h3" style={{ marginBottom: "8px" }}>{s.title}</h3>
                <p className="small-t">{s.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── About / Solutions section ────────────────────────────────────────────────
function About() {
  return (
    <section id="about" style={{ background: "#fff", padding: "80px 0" }}>
      <div className="wrap">
        <div className="g2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "64px", alignItems: "center" }}>
          {/* Left image */}
          <Reveal>
            <div style={{ position: "relative", borderRadius: "16px", overflow: "hidden", height: "420px", background: T.soft }}>
              <img
                src="https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=800&auto=format&fit=crop&q=80"
                alt="Therapy room"
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
              {/* Floating stats card */}
              <div style={{ position: "absolute", top: "20px", left: "20px", background: "#fff", borderRadius: "10px", padding: "14px 18px", boxShadow: "0 6px 20px rgba(0,0,0,0.09)", border: `1px solid ${T.border}`, minWidth: "200px" }}>
                <p style={{ fontSize: "0.72rem", fontWeight: 600, color: T.muted, marginBottom: "10px" }}>Wellness Performance</p>
                {[["Individual Sessions", "75%"],["Group Therapy", "56%"],["Corporate Programs", "48%"],["Online Sessions", "40%"]].map(([l,v]) => (
                  <div key={l} style={{ marginBottom: "7px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "3px" }}>
                      <span style={{ fontSize: "0.68rem", color: T.body }}>{l}</span>
                      <span style={{ fontSize: "0.68rem", color: T.body, fontWeight: 600 }}>{v}</span>
                    </div>
                    <div style={{ height: "4px", background: T.soft, borderRadius: "2px" }}>
                      <div style={{ height: "4px", borderRadius: "2px", background: T.primary, width: v }}/>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>

          {/* Right text */}
          <Reveal delay={100}>
            <div className="section-tag">About MyndWorks</div>
            <h2 className="h2" style={{ marginBottom: "16px" }}>
              Client-Driven Solutions<br/>with MyndWorks
            </h2>
            <p className="body-t" style={{ marginBottom: "24px" }}>
              At MyndWorks, we focus on delivering tailored mental health solutions that meet your unique needs. With evidence-based therapy and deeply human care, we help individuals, couples, families, and organisations build stronger, healthier foundations.
            </p>

            <div className="g2s" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginBottom: "28px" }}>
              {["Evidence-Based Care","Fully Confidential","In-Person & Online","Free Consultation"].map(v => (
                <div key={v} style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <div style={{ width: "18px", height: "18px", borderRadius: "50%", background: T.primary, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <svg width="10" height="10" fill="none" stroke="white" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7"/></svg>
                  </div>
                  <span style={{ fontSize: "0.84rem", fontWeight: 500, color: T.body }}>{v}</span>
                </div>
              ))}
            </div>

            {/* Stats row */}
            <div style={{ display: "flex", gap: "32px", paddingTop: "20px", borderTop: `1px solid ${T.border}` }}>
              {[["2,000+","Clients Supported"],["15+","Years Experience"],["98%","Satisfaction Rate"]].map(([v,l]) => (
                <div key={l}>
                  <p style={{ fontWeight: 900, fontSize: "1.5rem", color: T.ink, lineHeight: 1 }}>{v}</p>
                  <p style={{ fontSize: "0.75rem", color: T.muted, marginTop: "3px" }}>{l}</p>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

// ─── Why Us ───────────────────────────────────────────────────────────────────
function WhyUs() {
  return (
    <section style={{ background: T.soft, padding: "80px 0" }}>
      <div className="wrap">
        <Reveal>
          <div style={{ textAlign: "center", marginBottom: "52px" }}>
            <div className="section-tag" style={{ marginBottom: "12px" }}>Why MyndWorks</div>
            <h2 className="h2" style={{ marginBottom: "14px" }}>Why Choose Us?</h2>
            <p className="body-t" style={{ maxWidth: "460px", margin: "0 auto" }}>
              Our commitment to your wellness goes beyond just sessions. Discover the unique benefits that set us apart.
            </p>
          </div>
        </Reveal>

        <div className="g4" style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "14px" }}>
          {WHY.map((w, i) => (
            <Reveal key={w.title} delay={i * 55}>
              <div className="card" style={{ padding: "24px", height: "100%", display: "flex", flexDirection: "column", gap: "12px" }}>
                <div className="icon-box" dangerouslySetInnerHTML={{ __html: w.icon }}/>
                <h3 className="h3">{w.title}</h3>
                <p className="small-t" style={{ flex: 1 }}>{w.desc}</p>
                <button onClick={() => document.querySelector("#contact")?.scrollIntoView({ behavior: "smooth" })}
                  style={{ alignSelf: "flex-start", background: "none", border: "none", color: T.primary, fontSize: "0.8rem", fontWeight: 600, cursor: "pointer", padding: 0, fontFamily: "'DM Sans', sans-serif" }}>
                  Book Now →
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
    <section style={{ background: "#fff", padding: "64px 0" }}>
      <div className="wrap">
        <Reveal>
          <div style={{ borderRadius: "16px", overflow: "hidden", display: "grid", background: T.dark }} className="g2" style={{ gridTemplateColumns: "1fr 1fr" }}>
            <div style={{ padding: "48px 44px", display: "flex", flexDirection: "column", justifyContent: "center" }}>
              <div style={{ display: "inline-block", fontSize: "0.68rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "rgba(253,163,175,1)", background: "rgba(233,30,140,0.15)", padding: "4px 12px", borderRadius: "999px", marginBottom: "16px", width: "fit-content" }}>
                Free Offer
              </div>
              <h2 style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 800, fontSize: "clamp(1.4rem, 2.5vw, 2rem)", color: "#fff", lineHeight: 1.2, letterSpacing: "-0.02em", marginBottom: "16px" }}>
                Free consultation<br/>
                for new clients<br/>
                this month
              </h2>
              <p style={{ fontSize: "0.84rem", color: "rgba(255,255,255,0.6)", lineHeight: 1.7, marginBottom: "28px", maxWidth: "300px" }}>
                Once we receive your request, we match you with the right therapist for your unique goals, needs, and personality.
              </p>
              <button onClick={() => document.querySelector("#contact")?.scrollIntoView({ behavior: "smooth" })}
                style={{ alignSelf: "flex-start", padding: "10px 22px", borderRadius: "8px", background: "transparent", color: "#fff", border: "1.5px solid rgba(255,255,255,0.4)", cursor: "pointer", fontSize: "0.875rem", fontWeight: 600, fontFamily: "'DM Sans', sans-serif", transition: "all 0.2s" }}
                onMouseEnter={e => (e.currentTarget.style.background = "rgba(255,255,255,0.1)")}
                onMouseLeave={e => (e.currentTarget.style.background = "transparent")}>
                Book Free Session
              </button>
            </div>
            <div style={{ position: "relative", minHeight: "300px" }} className="hide-m">
              <img
                src="https://images.unsplash.com/photo-1516302752625-fcc3c50ae61f?w=700&auto=format&fit=crop&q=80"
                alt="Wellness"
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
              <div style={{ position: "absolute", inset: 0, background: "linear-gradient(90deg, rgba(15,23,42,0.35) 0%, transparent 50%)" }}/>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

// ─── Testimonials ─────────────────────────────────────────────────────────────
function Testimonials() {
  const [active, setActive] = useState(0);
  useEffect(() => { const t = setInterval(() => setActive(a => (a + 1) % TESTIMONIALS.length), 5500); return () => clearInterval(t); }, []);

  return (
    <section id="testimonials" style={{ background: T.soft, padding: "80px 0" }}>
      <div className="wrap">
        <Reveal>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "44px", flexWrap: "wrap", gap: "16px" }}>
            <div>
              <div className="section-tag" style={{ marginBottom: "10px" }}>Client Stories</div>
              <h2 className="h2">Real people, real change.</h2>
            </div>
            <div style={{ display: "flex", gap: "6px" }}>
              {TESTIMONIALS.map((_,i) => (
                <button key={i} onClick={() => setActive(i)} style={{ border: "none", cursor: "pointer", borderRadius: "999px", height: "4px", transition: "all 0.3s", background: active === i ? T.primary : T.border, width: active === i ? "22px" : "7px" }}/>
              ))}
            </div>
          </div>
        </Reveal>

        <div className="g2" style={{ display: "grid", gridTemplateColumns: "1.6fr 1fr", gap: "14px" }}>
          <Reveal>
            <div style={{ background: T.dark, borderRadius: "14px", padding: "36px", position: "relative", overflow: "hidden" }}>
              <div style={{ position: "absolute", top: "-20px", right: "-20px", width: "100px", height: "100px", borderRadius: "50%", background: "rgba(233,30,140,0.06)" }}/>
              <div style={{ display: "flex", gap: "3px", marginBottom: "20px" }}>
                {[...Array(5)].map((_,i) => <span key={i} style={{ color: T.orange, fontSize: "0.95rem" }}>★</span>)}
              </div>
              <p style={{ fontSize: "1.05rem", color: "rgba(255,255,255,0.9)", lineHeight: 1.72, marginBottom: "28px", fontStyle: "normal" }}>
                "{TESTIMONIALS[active].text}"
              </p>
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <div style={{ width: "42px", height: "42px", borderRadius: "50%", background: T.primary, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.75rem", fontWeight: 700, color: "#fff", flexShrink: 0 }}>
                  {TESTIMONIALS[active].initials}
                </div>
                <div>
                  <p style={{ fontSize: "0.875rem", fontWeight: 700, color: "#fff" }}>{TESTIMONIALS[active].name}</p>
                  <p style={{ fontSize: "0.72rem", color: "rgba(255,255,255,0.5)" }}>{TESTIMONIALS[active].role}</p>
                </div>
              </div>
            </div>
          </Reveal>

          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {TESTIMONIALS.map((t, i) => (
              <Reveal key={t.name} delay={i * 45}>
                <button onClick={() => setActive(i)} style={{ width: "100%", textAlign: "left", padding: "14px 16px", borderRadius: "12px", cursor: "pointer", border: `1px solid ${active === i ? T.primary : T.border}`, background: active === i ? "#fdf2f8" : "#fff", transition: "all 0.2s", display: "flex", alignItems: "center", gap: "10px" }}>
                  <div style={{ width: "36px", height: "36px", borderRadius: "50%", background: active === i ? T.primary : T.soft, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.68rem", fontWeight: 700, color: active === i ? "#fff" : T.muted, flexShrink: 0, transition: "all 0.2s" }}>
                    {t.initials}
                  </div>
                  <div>
                    <p style={{ fontSize: "0.82rem", fontWeight: 700, color: T.ink }}>{t.name}</p>
                    <p style={{ fontSize: "0.7rem", color: T.muted }}>{t.role}</p>
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
    <section id="faq" style={{ background: "#fff", padding: "80px 0" }}>
      <div className="wrap-sm">
        <Reveal>
          <div style={{ textAlign: "center", marginBottom: "48px" }}>
            <div className="section-tag" style={{ marginBottom: "10px" }}>Common Questions</div>
            <h2 className="h2">Got questions?</h2>
          </div>
        </Reveal>
        {FAQS.map((f, i) => (
          <Reveal key={i} delay={i * 30}>
            <div style={{ borderBottom: `1px solid ${T.border}` }}>
              <button onClick={() => setOpen(open === i ? null : i)} style={{ width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center", padding: "18px 0", background: "none", border: "none", cursor: "pointer", textAlign: "left", gap: "16px" }}>
                <span style={{ fontSize: "0.9rem", fontWeight: 600, color: open === i ? T.primary : T.ink, transition: "color 0.2s" }}>{f.q}</span>
                <div style={{ width: "28px", height: "28px", borderRadius: "50%", background: open === i ? T.primary : T.soft, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, transition: "all 0.2s", color: open === i ? "#fff" : T.primary, fontSize: "1rem", fontWeight: 700, lineHeight: 1 }}>
                  {open === i ? "−" : "+"}
                </div>
              </button>
              {open === i && (
                <p style={{ fontSize: "0.875rem", color: T.body, lineHeight: 1.8, paddingBottom: "18px", paddingRight: "44px" }}>{f.a}</p>
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

  const inp: React.CSSProperties = { width: "100%", padding: "11px 14px", borderRadius: "8px", border: `1.5px solid ${T.border}`, background: T.soft, fontSize: "0.875rem", color: T.ink, outline: "none", fontFamily: "'DM Sans', sans-serif", transition: "border-color 0.2s" };

  return (
    <section id="contact" style={{ background: T.soft, padding: "80px 0" }}>
      <div className="wrap">
        <Reveal>
          <div className="divider" style={{ marginBottom: "52px" }}>Get in touch</div>
        </Reveal>

        <div className="g2 gc" style={{ display: "grid", gridTemplateColumns: "1fr 1.2fr", gap: "56px", alignItems: "start" }}>
          {/* Info */}
          <Reveal>
            <div className="section-tag" style={{ marginBottom: "12px" }}>Book a Session</div>
            <h2 className="h2" style={{ marginBottom: "14px" }}>Take the first step.</h2>
            <p className="body-t" style={{ marginBottom: "32px", maxWidth: "300px" }}>
              Book a free 15-minute consultation. No commitment, no pressure — just a conversation.
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: "16px", marginBottom: "28px" }}>
              {[
                { icon: `<svg width="15" height="15" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg>`, label: "Phone",     val: "(076) 122-8682",              href: "tel:+27761228682" },
                { icon: `<svg width="15" height="15" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>`, label: "Email",     val: "myndworkspractice@gmail.com", href: "mailto:myndworkspractice@gmail.com" },
                { icon: `<svg width="15" height="15" fill="none" stroke="currentColor" viewBox="0 0 24 24"><rect x="2" y="2" width="20" height="20" rx="5" ry="5" strokeWidth={2}/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5" strokeWidth={2}/></svg>`, label: "Instagram", val: "@myndworkspsychology",        href: "https://instagram.com/myndworkspsychology" },
                { icon: `<svg width="15" height="15" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"/></svg>`, label: "Website",   val: "www.myndworks.co.za",         href: "https://www.myndworks.co.za" },
              ].map(c => (
                <div key={c.label} style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <div style={{ width: "36px", height: "36px", borderRadius: "9px", background: "#fff", border: `1px solid ${T.border}`, display: "flex", alignItems: "center", justifyContent: "center", color: T.primary, flexShrink: 0 }}
                    dangerouslySetInnerHTML={{ __html: c.icon }}/>
                  <div>
                    <p style={{ fontSize: "0.64rem", fontWeight: 700, color: T.muted, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "1px" }}>{c.label}</p>
                    <a href={c.href} style={{ fontSize: "0.84rem", color: T.ink, fontWeight: 600, textDecoration: "none", transition: "color 0.2s" }}
                      onMouseEnter={e => (e.currentTarget.style.color = T.primary)}
                      onMouseLeave={e => (e.currentTarget.style.color = T.ink)}>
                      {c.val}
                    </a>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ padding: "14px 18px", borderRadius: "10px", background: "#fff0f7", border: `1px solid rgba(233,30,140,0.15)` }}>
              <p style={{ fontSize: "0.78rem", fontWeight: 700, color: T.primary, marginBottom: "3px" }}>🆘 In crisis right now?</p>
              <p style={{ fontSize: "0.78rem", color: T.body, lineHeight: 1.6 }}>Contact your local emergency services or a crisis helpline immediately. You are not alone.</p>
            </div>
          </Reveal>

          {/* Form */}
          <Reveal delay={80}>
            <div style={{ background: "#fff", borderRadius: "14px", padding: "32px", border: `1px solid ${T.border}`, boxShadow: "0 4px 24px rgba(0,0,0,0.05)" }}>
              {status === "success" ? (
                <div style={{ textAlign: "center", padding: "40px 0" }}>
                  <div style={{ width: "56px", height: "56px", borderRadius: "50%", background: "#fff0f7", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 14px", fontSize: "1.6rem" }}>🌿</div>
                  <h3 style={{ fontWeight: 800, fontSize: "1.2rem", color: T.ink, marginBottom: "8px" }}>Thank you, {form.name.split(" ")[0]}!</h3>
                  <p style={{ color: T.body, fontSize: "0.875rem", lineHeight: 1.7 }}>We'll be in touch within 24 hours.<br/>You've taken a brave step.</p>
                </div>
              ) : (
                <>
                  <h3 style={{ fontWeight: 800, fontSize: "1.05rem", color: T.ink, marginBottom: "4px" }}>Appointment Booking</h3>
                  <p style={{ fontSize: "0.8rem", color: T.muted, marginBottom: "22px" }}>Fill in the form and we'll reach out within 24 hours.</p>
                  <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                      <div>
                        <label style={{ display: "block", fontSize: "0.68rem", fontWeight: 600, color: T.muted, marginBottom: "5px", textTransform: "uppercase", letterSpacing: "0.06em" }}>Full Name *</label>
                        <input required type="text" placeholder="Jane Smith" value={form.name} onChange={e => setForm({...form, name: e.target.value})} style={inp}
                          onFocus={e => (e.target.style.borderColor = T.primary)} onBlur={e => (e.target.style.borderColor = T.border)}/>
                      </div>
                      <div>
                        <label style={{ display: "block", fontSize: "0.68rem", fontWeight: 600, color: T.muted, marginBottom: "5px", textTransform: "uppercase", letterSpacing: "0.06em" }}>Phone</label>
                        <input type="tel" placeholder="076 122 8682" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} style={inp}
                          onFocus={e => (e.target.style.borderColor = T.primary)} onBlur={e => (e.target.style.borderColor = T.border)}/>
                      </div>
                    </div>
                    <div>
                      <label style={{ display: "block", fontSize: "0.68rem", fontWeight: 600, color: T.muted, marginBottom: "5px", textTransform: "uppercase", letterSpacing: "0.06em" }}>Email Address *</label>
                      <input required type="email" placeholder="jane@example.com" value={form.email} onChange={e => setForm({...form, email: e.target.value})} style={inp}
                        onFocus={e => (e.target.style.borderColor = T.primary)} onBlur={e => (e.target.style.borderColor = T.border)}/>
                    </div>
                    <div>
                      <label style={{ display: "block", fontSize: "0.68rem", fontWeight: 600, color: T.muted, marginBottom: "5px", textTransform: "uppercase", letterSpacing: "0.06em" }}>Service</label>
                      <select value={form.service} onChange={e => setForm({...form, service: e.target.value})} style={{...inp, appearance: "none" as const}}
                        onFocus={e => (e.target.style.borderColor = T.primary)} onBlur={e => (e.target.style.borderColor = T.border)}>
                        <option value="">Select a service…</option>
                        {SERVICES.map(s => <option key={s.title} value={s.title}>{s.title}</option>)}
                      </select>
                    </div>
                    <div>
                      <label style={{ display: "block", fontSize: "0.68rem", fontWeight: 600, color: T.muted, marginBottom: "5px", textTransform: "uppercase", letterSpacing: "0.06em" }}>Message</label>
                      <textarea rows={3} placeholder="Tell us what brings you here…" value={form.message} onChange={e => setForm({...form, message: e.target.value})} style={{...inp, resize: "none" as const}}
                        onFocus={e => (e.target.style.borderColor = T.primary)} onBlur={e => (e.target.style.borderColor = T.border)}/>
                    </div>
                    {status === "error" && <p style={{ color: "#dc2626", fontSize: "0.78rem", textAlign: "center" }}>Something went wrong. Please try again.</p>}
                    <button type="submit" disabled={status === "sending"} className="btn-primary" style={{ justifyContent: "center", padding: "12px", fontSize: "0.875rem", opacity: status === "sending" ? 0.6 : 1, width: "100%", borderRadius: "8px" }}>
                      {status === "sending" ? "Sending…" : "Book Appointment"}
                    </button>
                    <p style={{ fontSize: "0.68rem", color: T.muted, textAlign: "center" }}>Strictly confidential. We never share your information.</p>
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
    <footer style={{ background: T.dark, color: "rgba(255,255,255,0.45)", padding: "60px 0 28px" }}>
      <div className="wrap">
        <div className="g3" style={{ display: "grid", gridTemplateColumns: "1.6fr 1fr 1fr", gap: "48px", marginBottom: "48px" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "9px", marginBottom: "14px" }}>
              <div style={{ width: "28px", height: "28px", borderRadius: "7px", background: T.primary, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round">
                  <path d="M12 3C7 3 3 7 3 12s4 9 9 9 9-4 9-9-4-9-9-9z"/>
                  <path d="M8 14s1.5 2 4 2 4-2 4-2"/>
                  <circle cx="9" cy="10" r="1.2" fill="white" stroke="none"/>
                  <circle cx="15" cy="10" r="1.2" fill="white" stroke="none"/>
                </svg>
              </div>
              <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "1rem", fontWeight: 800, color: "#fff", letterSpacing: "-0.02em" }}>
                <span style={{ color: T.primary }}>Mynd</span>Works
              </span>
            </div>
            <p style={{ fontSize: "0.82rem", lineHeight: 1.8, maxWidth: "260px", marginBottom: "20px" }}>
              Professional mental wellbeing support. Compassionate, evidence-based care for every stage of life.
            </p>
            <div style={{ display: "flex", gap: "8px" }}>
              {[
                { icon: `<svg width="13" height="13" fill="none" stroke="currentColor" viewBox="0 0 24 24"><rect x="2" y="2" width="20" height="20" rx="5" ry="5" strokeWidth={2}/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5" strokeWidth={2}/></svg>`, h: "https://instagram.com/myndworkspsychology" },
                { icon: `<svg width="13" height="13" fill="currentColor" viewBox="0 0 24 24"><path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/></svg>`, h: "#" },
              ].map((s, i) => (
                <a key={i} href={s.h} style={{ width: "32px", height: "32px", borderRadius: "7px", background: "rgba(255,255,255,0.07)", display: "flex", alignItems: "center", justifyContent: "center", color: "rgba(255,255,255,0.4)", textDecoration: "none", transition: "all 0.2s" }}
                  dangerouslySetInnerHTML={{ __html: s.icon }}
                  onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.background = T.primary; (e.currentTarget as HTMLAnchorElement).style.color = "#fff"; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.background = "rgba(255,255,255,0.07)"; (e.currentTarget as HTMLAnchorElement).style.color = "rgba(255,255,255,0.4)"; }}/>
              ))}
            </div>
          </div>

          <div>
            <p style={{ fontSize: "0.66rem", fontWeight: 700, color: "rgba(255,255,255,0.3)", textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: "16px" }}>Services</p>
            <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "9px" }}>
              {SERVICES.map(s => (
                <li key={s.title}>
                  <a href="#services" style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.45)", textDecoration: "none", transition: "color 0.2s" }}
                    onMouseEnter={e => (e.currentTarget.style.color = "#fff")}
                    onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,0.45)")}>
                    {s.title}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p style={{ fontSize: "0.66rem", fontWeight: 700, color: "rgba(255,255,255,0.3)", textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: "16px" }}>Contact</p>
            <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "11px" }}>
              {[
                { v: "(076) 122-8682",              h: "tel:+27761228682" },
                { v: "myndworkspractice@gmail.com", h: "mailto:myndworkspractice@gmail.com" },
                { v: "sphe@myndworks.co.za",        h: "mailto:sphe@myndworks.co.za" },
                { v: "@myndworkspsychology",         h: "https://instagram.com/myndworkspsychology" },
                { v: "www.myndworks.co.za",          h: "https://www.myndworks.co.za" },
              ].map(c => (
                <li key={c.v}>
                  <a href={c.h} style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.45)", textDecoration: "none", transition: "color 0.2s" }}
                    onMouseEnter={e => (e.currentTarget.style.color = "#fff")}
                    onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,0.45)")}>
                    {c.v}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div style={{ borderTop: "1px solid rgba(255,255,255,0.07)", paddingTop: "24px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "10px" }}>
          <p style={{ fontSize: "0.72rem" }}>© {new Date().getFullYear()} MyndWorks. All rights reserved.</p>
          <p style={{ fontSize: "0.72rem", color: "rgba(255,255,255,0.22)" }}>Designed with care for mental wellbeing.</p>
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
      <AnnouncementBar/>
      <Navbar/>
      <Hero/>
      <Partners/>
      <Services/>
      <About/>
      <WhyUs/>
      <PromoBanner/>
      <Testimonials/>
      <FAQ/>
      <Contact/>
      <Footer/>
    </>
  );
}