import { useState, useEffect, useRef } from "react";

// ─── Brand tokens ─────────────────────────────────────────────────────────────
const B = {
  pink:    "#e91e8c",
  orange:  "#f97316",
  teal:    "#0891b2",
  ink:     "#0f172a",
  slate:   "#475569",
  muted:   "#94a3b8",
  border:  "#e8edf5",
  bg:      "#ffffff",
  warm:    "#fafafa",
  pinkSoft:"#fff0f7",
  tealSoft:"#f0f9ff",
  grad:    "linear-gradient(135deg, #e91e8c, #f97316)",
  gradT:   "linear-gradient(135deg, #0891b2, #e91e8c)",
};

interface Service    { icon: string; title: string; desc: string; }
interface Testimonial{ name: string; role: string; text: string; initials: string; }
interface FaqItem    { q: string; a: string; }

const SERVICES: Service[] = [
  { icon: `<svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.6" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>`,
    title: "Individual Therapy",    desc: "One-on-one sessions for anxiety, depression, trauma and life transitions in a safe, confidential space." },
  { icon: `<svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.6" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/></svg>`,
    title: "Couples Counselling",   desc: "Rebuild trust, improve communication and reconnect using evidence-based tools." },
  { icon: `<svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.6" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5"/></svg>`,
    title: "Mindfulness & Stress",  desc: "Practical techniques to manage stress and cultivate lasting calm in daily life." },
  { icon: `<svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.6" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"/></svg>`,
    title: "Group Therapy",         desc: "Connect and heal with others in a safe, facilitated group environment." },
  { icon: `<svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.6" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/></svg>`,
    title: "Corporate Wellness",    desc: "Team building, workshops, debriefing and wellness programmes for organisations." },
  { icon: `<svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.6" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>`,
    title: "Online Sessions",       desc: "Secure, confidential video sessions from wherever you are — flexible and professional." },
  { icon: `<svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.6" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"/></svg>`,
    title: "Child & Adolescent",    desc: "Specialised support for young people navigating emotional challenges and growth." },
  { icon: `<svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.6" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z"/></svg>`,
    title: "Workshops & Training",  desc: "Engaging wellness workshops and professional training programmes for lasting resilience." },
];

const TESTIMONIALS: Testimonial[] = [
  { name: "Sarah M.",      role: "Individual Therapy",  initials: "SM", text: "After years of struggling with anxiety, I finally have the tools to manage my thoughts and live fully. MyndWorks truly changed my life." },
  { name: "James & Priya", role: "Couples Counselling", initials: "JP", text: "We came on the brink of separation. Through counselling, we rediscovered what brought us together and built something even stronger." },
  { name: "Tom R.",        role: "Mindfulness",         initials: "TR", text: "My stress levels have dropped dramatically. I learned to pause, breathe, and respond rather than react. Completely transformative." },
  { name: "Leila H.",      role: "Online Sessions",     initials: "LH", text: "The flexibility of online sessions meant I could finally prioritise my mental health without disrupting my family. Excellent care." },
];

const FAQS: FaqItem[] = [
  { q: "Do I need to be in crisis to start therapy?",    a: "Not at all. Therapy benefits anyone wanting to improve their wellbeing, work through challenges, or simply understand themselves better." },
  { q: "What happens in the first session?",            a: "We get to know you — what brings you here, your background, and your goals. There's no pressure. It's simply a conversation." },
  { q: "Is everything confidential?",                   a: "Yes. What you share stays between you and your therapist, with very limited exceptions explained clearly upfront." },
  { q: "Do you offer online and in-person sessions?",   a: "We offer both. Many clients mix and match depending on their schedule and preference." },
  { q: "Do you offer corporate packages?",              a: "Yes — tailored corporate wellness programmes including team building, workshops, debriefing and public speaking in wellness." },
];

// ─── Reveal hook ──────────────────────────────────────────────────────────────
function useReveal() {
  const ref = useRef<HTMLDivElement>(null);
  const [v, setV] = useState(false);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setV(true); obs.disconnect(); } }, { threshold: 0.08 });
    obs.observe(el); return () => obs.disconnect();
  }, []);
  return { ref, v };
}

function Reveal({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  const { ref, v } = useReveal();
  return (
    <div ref={ref} className={className} style={{ opacity: v ? 1 : 0, transform: v ? "none" : "translateY(22px)", transition: `opacity 0.7s cubic-bezier(.16,1,.3,1) ${delay}ms, transform 0.7s cubic-bezier(.16,1,.3,1) ${delay}ms` }}>
      {children}
    </div>
  );
}

// SVG icon helper
const Icon = ({ svg, color = B.pink, bg = B.pinkSoft }: { svg: string; color?: string; bg?: string }) => (
  <div style={{ width: "52px", height: "52px", borderRadius: "14px", background: bg, display: "flex", alignItems: "center", justifyContent: "center", color, flexShrink: 0 }}
    dangerouslySetInnerHTML={{ __html: svg }}/>
);

// ─── Global styles ────────────────────────────────────────────────────────────
const GS = () => (
  <style>{`
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    html { scroll-behavior: smooth; }
    body { background: #fff; font-family: 'DM Sans', system-ui, sans-serif; color: ${B.ink}; -webkit-font-smoothing: antialiased; }
    ::selection { background: ${B.pinkSoft}; }

    .btn-p { display: inline-flex; align-items: center; gap: 8px; padding: 14px 30px; border-radius: 999px; background: ${B.grad}; color: #fff; border: none; cursor: pointer; font-family: 'DM Sans', sans-serif; font-size: 0.9rem; font-weight: 700; letter-spacing: 0.01em; transition: all 0.25s; box-shadow: 0 4px 20px rgba(233,30,140,0.25); }
    .btn-p:hover { transform: translateY(-2px); box-shadow: 0 8px 32px rgba(233,30,140,0.35); }

    .btn-g { display: inline-flex; align-items: center; gap: 8px; padding: 14px 30px; border-radius: 999px; background: transparent; color: ${B.ink}; border: 1.5px solid ${B.border}; cursor: pointer; font-family: 'DM Sans', sans-serif; font-size: 0.9rem; font-weight: 600; transition: all 0.25s; }
    .btn-g:hover { border-color: ${B.pink}; color: ${B.pink}; background: ${B.pinkSoft}; }

    .card { background: #fff; border-radius: 20px; border: 1px solid ${B.border}; transition: all 0.3s cubic-bezier(.16,1,.3,1); }
    .card:hover { transform: translateY(-5px); box-shadow: 0 24px 64px rgba(233,30,140,0.09); border-color: rgba(233,30,140,0.2); }

    .section-label { display: inline-block; font-size: 0.68rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.14em; color: ${B.pink}; background: ${B.pinkSoft}; padding: 6px 14px; border-radius: 999px; margin-bottom: 16px; }

    .h1 { font-family: 'DM Sans', sans-serif; font-weight: 900; font-size: clamp(2.8rem, 5.5vw, 4.8rem); line-height: 1.05; letter-spacing: -0.03em; color: ${B.ink}; }
    .h2 { font-family: 'DM Sans', sans-serif; font-weight: 800; font-size: clamp(2rem, 3.5vw, 2.8rem); line-height: 1.15; letter-spacing: -0.025em; color: ${B.ink}; }
    .h3 { font-family: 'DM Sans', sans-serif; font-weight: 700; font-size: 1.05rem; color: ${B.ink}; }
    .body { font-size: 1rem; color: ${B.slate}; line-height: 1.8; }
    .small { font-size: 0.875rem; color: ${B.slate}; line-height: 1.75; }

    .wrap { max-width: 1180px; margin: 0 auto; padding: 0 28px; }

    @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-10px)} }
    @keyframes pulse-ring { 0%{transform:scale(1);opacity:0.5} 100%{transform:scale(1.5);opacity:0} }
    .float { animation: float 5s ease-in-out infinite; }

    input, textarea, select { font-family: 'DM Sans', sans-serif; }

    @media(max-width:768px){
      .hide-m{display:none!important;}
      .grid-2,.grid-3,.grid-4,.grid-c{grid-template-columns:1fr!important;}
      .grid-s{grid-template-columns:repeat(2,1fr)!important;}
    }
    @media(min-width:640px) and (max-width:900px){
      .grid-3{grid-template-columns:repeat(2,1fr)!important;}
      .grid-4{grid-template-columns:repeat(2,1fr)!important;}
    }
  `}</style>
);

// ─── Navbar ───────────────────────────────────────────────────────────────────
function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => { const fn = () => setScrolled(window.scrollY > 24); window.addEventListener("scroll", fn); return () => window.removeEventListener("scroll", fn); }, []);
  const go = (h: string) => { setOpen(false); document.querySelector(h)?.scrollIntoView({ behavior: "smooth" }); };

  return (
    <>
      <nav style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 200, background: scrolled ? "rgba(255,255,255,0.97)" : "rgba(255,255,255,0.88)", backdropFilter: "blur(20px)", borderBottom: scrolled ? `1px solid ${B.border}` : "1px solid transparent", transition: "all 0.35s", boxShadow: scrolled ? "0 2px 24px rgba(0,0,0,0.06)" : "none" }}>
        <div className="wrap" style={{ height: "72px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          {/* Logo */}
          <button onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: "10px" }}>
            <div style={{ width: "38px", height: "38px", borderRadius: "12px", background: B.grad, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 14px rgba(233,30,140,0.3)" }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round">
                <path d="M12 3C7 3 3 7 3 12s4 9 9 9 9-4 9-9-4-9-9-9z"/>
                <path d="M8 14s1.5 2 4 2 4-2 4-2"/>
                <circle cx="9" cy="10" r="1.2" fill="white" stroke="none"/>
                <circle cx="15" cy="10" r="1.2" fill="white" stroke="none"/>
              </svg>
            </div>
            <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "1.25rem", fontWeight: 900, letterSpacing: "-0.03em", color: B.ink }}>
              <span style={{ color: B.pink }}>Mynd</span>Works
            </span>
          </button>

          {/* Desktop */}
          <div className="hide-m" style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            {[["Services","#services"],["About","#about"],["Testimonials","#testimonials"],["FAQ","#faq"]].map(([l,h]) => (
              <button key={l} onClick={() => go(h)} style={{ background: "none", border: "none", cursor: "pointer", padding: "8px 16px", borderRadius: "999px", fontSize: "0.875rem", fontWeight: 500, color: B.slate, transition: "all 0.2s", fontFamily: "'DM Sans', sans-serif" }}
                onMouseEnter={e => { e.currentTarget.style.color = B.ink; e.currentTarget.style.background = B.warm; }}
                onMouseLeave={e => { e.currentTarget.style.color = B.slate; e.currentTarget.style.background = "none"; }}>
                {l}
              </button>
            ))}
            <button onClick={() => go("#contact")} className="btn-p" style={{ marginLeft: "8px", padding: "10px 22px", fontSize: "0.85rem" }}>
              Book Session
            </button>
          </div>

          {/* Mobile */}
          <button onClick={() => setOpen(!open)} style={{ background: "none", border: "none", cursor: "pointer", display: "none", padding: "4px" }} className="show-m">
            <svg width="22" height="22" fill="none" stroke={B.ink} viewBox="0 0 24 24">
              {open ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/> : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16"/>}
            </svg>
          </button>
        </div>

        {open && (
          <div style={{ background: "#fff", borderTop: `1px solid ${B.border}`, padding: "16px 28px 24px" }}>
            {[["Services","#services"],["About","#about"],["Testimonials","#testimonials"],["FAQ","#faq"]].map(([l,h]) => (
              <button key={l} onClick={() => go(h)} style={{ display: "block", width: "100%", textAlign: "left", padding: "13px 0", background: "none", border: "none", borderBottom: `1px solid ${B.border}`, fontSize: "0.95rem", fontWeight: 500, color: B.ink, cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>{l}</button>
            ))}
            <button onClick={() => go("#contact")} className="btn-p" style={{ width: "100%", marginTop: "14px", justifyContent: "center" }}>Book a Session</button>
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
    <section style={{ minHeight: "100vh", background: "#fff", display: "flex", alignItems: "center", position: "relative", overflow: "hidden", paddingTop: "72px" }}>
      {/* Soft background */}
      <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
        <div style={{ position: "absolute", top: 0, right: 0, width: "55%", height: "100%", background: "linear-gradient(135deg, #fff8fc 0%, #f0f9ff 100%)", borderRadius: "0 0 0 120px" }}/>
        <div style={{ position: "absolute", bottom: "-60px", left: "-60px", width: "300px", height: "300px", borderRadius: "50%", background: "radial-gradient(circle, rgba(233,30,140,0.06) 0%, transparent 70%)" }}/>
      </div>

      <div className="wrap" style={{ width: "100%", padding: "60px 28px" }}>
        <div className="grid-2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "64px", alignItems: "center" }}>
          {/* Left */}
          <div>
            <Reveal>
              <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", padding: "7px 16px", borderRadius: "999px", background: B.pinkSoft, border: `1px solid rgba(233,30,140,0.15)`, marginBottom: "28px" }}>
                <span style={{ width: "7px", height: "7px", borderRadius: "50%", background: B.pink, display: "block" }}/>
                <span style={{ fontSize: "0.78rem", fontWeight: 700, color: B.pink, letterSpacing: "0.04em" }}>Professional Mental Health Support · South Africa</span>
              </div>
            </Reveal>

            <Reveal delay={70}>
              <h1 className="h1" style={{ marginBottom: "6px" }}>
                <span style={{ background: B.grad, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Feel better.</span>
              </h1>
              <h1 className="h1" style={{ marginBottom: "6px", color: B.ink }}>Think clearer.</h1>
              <h1 style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 600, fontSize: "clamp(1.4rem, 2.5vw, 2rem)", color: B.slate, letterSpacing: "-0.01em", marginBottom: "28px", lineHeight: 1.3 }}>
                Mental wellness support that fits your life.
              </h1>
            </Reveal>

            <Reveal delay={130}>
              <p className="body" style={{ maxWidth: "460px", marginBottom: "36px" }}>
                Book therapy, talk to a professional, or get the guidance you need — whenever and wherever you need it. Compassionate, evidence-based care.
              </p>
            </Reveal>

            <Reveal delay={190}>
              <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", marginBottom: "40px" }}>
                <button className="btn-p" onClick={() => document.querySelector("#contact")?.scrollIntoView({ behavior: "smooth" })}>
                  Book Appointment
                  <svg width="15" height="15" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3"/></svg>
                </button>
                <button className="btn-g" onClick={() => document.querySelector("#services")?.scrollIntoView({ behavior: "smooth" })}>
                  Our Services
                </button>
              </div>
            </Reveal>

            <Reveal delay={240}>
              <div style={{ display: "flex", gap: "24px", flexWrap: "wrap" }}>
                {[
                  { icon: `<svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg>`, label: "Fully Confidential" },
                  { icon: `<svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>`, label: "In-Person & Online" },
                  { icon: `<svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7"/></svg>`, label: "Free First Consultation" },
                ].map(t => (
                  <div key={t.label} style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <div style={{ width: "24px", height: "24px", borderRadius: "50%", background: B.pinkSoft, display: "flex", alignItems: "center", justifyContent: "center", color: B.pink, flexShrink: 0 }}
                      dangerouslySetInnerHTML={{ __html: t.icon }}/>
                    <span style={{ fontSize: "0.82rem", color: B.slate, fontWeight: 500 }}>{t.label}</span>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>

          {/* Right — image stack */}
          <Reveal delay={100} className="hide-m">
            <div style={{ position: "relative", height: "580px" }}>
              {/* Main image */}
              <div style={{ position: "absolute", top: 0, right: 0, width: "88%", height: "520px", borderRadius: "32px", overflow: "hidden", boxShadow: "0 32px 80px rgba(0,0,0,0.12)" }}>
                <img
                  src="https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=800&auto=format&fit=crop&q=80"
                  alt="Therapist session"
                  style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "top center" }}
                />
                <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(15,23,42,0.18), transparent 60%)" }}/>
              </div>

              {/* Floating stat card */}
              <div className="float" style={{ position: "absolute", bottom: "20px", left: 0, background: "#fff", borderRadius: "20px", padding: "18px 22px", boxShadow: "0 16px 48px rgba(0,0,0,0.1)", border: `1px solid ${B.border}`, zIndex: 10 }}>
                <p style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 900, fontSize: "2rem", lineHeight: 1, background: B.grad, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>2,000+</p>
                <p style={{ fontSize: "0.75rem", color: B.muted, marginTop: "3px" }}>Lives transformed</p>
              </div>

              {/* Floating badge */}
              <div style={{ position: "absolute", top: "24px", left: "0px", background: "#fff", borderRadius: "16px", padding: "12px 18px", boxShadow: "0 8px 24px rgba(0,0,0,0.08)", border: `1px solid ${B.border}`, zIndex: 10, display: "flex", alignItems: "center", gap: "10px" }}>
                <div style={{ width: "32px", height: "32px", borderRadius: "50%", background: B.pinkSoft, display: "flex", alignItems: "center", justifyContent: "center", color: B.pink }}>
                  <svg width="15" height="15" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7"/></svg>
                </div>
                <div>
                  <p style={{ fontSize: "0.8rem", fontWeight: 700, color: B.ink }}>Fully confidential</p>
                  <p style={{ fontSize: "0.68rem", color: B.muted }}>Your privacy is sacred</p>
                </div>
              </div>

              {/* Rating */}
              <div style={{ position: "absolute", top: "50%", right: "-16px", transform: "translateY(-50%)", background: B.grad, borderRadius: "16px", padding: "14px 18px", boxShadow: "0 8px 24px rgba(233,30,140,0.35)", zIndex: 10 }}>
                <p style={{ fontSize: "1.6rem", fontWeight: 900, color: "#fff", lineHeight: 1 }}>98%</p>
                <p style={{ fontSize: "0.65rem", color: "rgba(255,255,255,0.8)", marginTop: "2px" }}>Satisfaction</p>
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
    { v: "2,000+", l: "Clients Supported" },
    { v: "15+",    l: "Years Experience" },
    { v: "98%",    l: "Satisfaction Rate" },
    { v: "8",      l: "Specialist Therapists" },
  ];
  return (
    <section style={{ background: B.warm, borderTop: `1px solid ${B.border}`, borderBottom: `1px solid ${B.border}`, padding: "56px 0" }}>
      <div className="wrap">
        <div className="grid-4 grid-s" style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "20px" }}>
          {items.map((s, i) => (
            <Reveal key={s.l} delay={i * 70}>
              <div style={{ textAlign: "center", padding: "28px 16px", background: "#fff", borderRadius: "18px", border: `1px solid ${B.border}` }}>
                <p style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 900, fontSize: "2.4rem", lineHeight: 1, marginBottom: "6px", background: i % 2 === 0 ? B.grad : B.gradT, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>{s.v}</p>
                <p style={{ fontSize: "0.75rem", color: B.muted, textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 600 }}>{s.l}</p>
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
  const colors = [
    { bg: B.pinkSoft, color: B.pink },
    { bg: "#fff7ed",  color: B.orange },
    { bg: B.tealSoft, color: B.teal },
    { bg: B.pinkSoft, color: B.pink },
    { bg: "#fff7ed",  color: B.orange },
    { bg: B.tealSoft, color: B.teal },
    { bg: B.pinkSoft, color: B.pink },
    { bg: "#fff7ed",  color: B.orange },
  ];
  return (
    <section id="services" style={{ background: "#fff", padding: "100px 0" }}>
      <div className="wrap">
        <Reveal>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "56px", gap: "24px", flexWrap: "wrap" }}>
            <div>
              <div className="section-label">What We Offer</div>
              <h2 className="h2">Support for every <span style={{ background: B.grad, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>journey</span></h2>
            </div>
            <button className="btn-g" onClick={() => document.querySelector("#contact")?.scrollIntoView({ behavior: "smooth" })}>
              Book a session →
            </button>
          </div>
        </Reveal>

        <div className="grid-4" style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "16px" }}>
          {SERVICES.map((s, i) => (
            <Reveal key={s.title} delay={i * 50}>
              <div className="card" style={{ padding: "26px", cursor: "pointer", height: "100%" }}>
                <Icon svg={s.icon} bg={colors[i].bg} color={colors[i].color}/>
                <h3 className="h3" style={{ margin: "16px 0 8px" }}>{s.title}</h3>
                <p className="small">{s.desc}</p>
                <div style={{ marginTop: "18px", display: "flex", alignItems: "center", gap: "5px", fontSize: "0.8rem", fontWeight: 700, color: colors[i].color }}>
                  Learn more
                  <svg width="13" height="13" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3"/></svg>
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
    <section id="about" style={{ background: B.warm, padding: "100px 0", overflow: "hidden" }}>
      <div className="wrap">
        <div className="grid-2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "72px", alignItems: "center" }}>
          {/* Images */}
          <Reveal>
            <div style={{ position: "relative", height: "520px" }}>
              {/* Main */}
              <div style={{ position: "absolute", top: 0, left: 0, width: "80%", height: "420px", borderRadius: "28px", overflow: "hidden", boxShadow: "0 24px 64px rgba(0,0,0,0.1)" }}>
                <img
                  src="https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=800&auto=format&fit=crop&q=80"
                  alt="Therapy room"
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              </div>
              {/* Secondary */}
              <div style={{ position: "absolute", bottom: 0, right: 0, width: "55%", height: "280px", borderRadius: "24px", overflow: "hidden", boxShadow: "0 16px 48px rgba(0,0,0,0.12)", border: "4px solid #fff" }}>
                <img
                  src="https://images.unsplash.com/photo-1609234656388-0ff363383899?w=600&auto=format&fit=crop&q=80"
                  alt="Counselling session"
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              </div>
              {/* Pink floating card */}
              <div className="float" style={{ position: "absolute", top: "32px", right: "-16px", background: B.grad, borderRadius: "18px", padding: "18px 22px", boxShadow: "0 12px 32px rgba(233,30,140,0.35)", zIndex: 10 }}>
                <p style={{ fontWeight: 900, fontSize: "1.8rem", color: "#fff", lineHeight: 1 }}>15+</p>
                <p style={{ fontSize: "0.7rem", color: "rgba(255,255,255,0.8)", marginTop: "2px" }}>Years of care</p>
              </div>
            </div>
          </Reveal>

          {/* Text */}
          <Reveal delay={120}>
            <div className="section-label">About MyndWorks</div>
            <h2 className="h2" style={{ marginBottom: "20px" }}>
              Rooted in empathy,<br/>
              <span style={{ background: B.grad, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>driven by science.</span>
            </h2>
            <p className="body" style={{ marginBottom: "14px" }}>
              MyndWorks was founded on a simple belief — everyone deserves access to compassionate, high-quality mental health care.
            </p>
            <p className="body" style={{ marginBottom: "36px" }}>
              We combine CBT, EMDR, and mindfulness with a deeply human style of care. Our goal is not just symptom relief, but lasting transformation — for individuals, couples, families, and organisations.
            </p>

            <div className="grid-2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginBottom: "36px" }}>
              {[
                { icon: `<svg width="15" height="15" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>`, label: "Evidence-Based" },
                { icon: `<svg width="15" height="15" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg>`, label: "Fully Confidential" },
                { icon: `<svg width="15" height="15" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064"/></svg>`, label: "In-Person & Online" },
                { icon: `<svg width="15" height="15" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"/></svg>`, label: "Free Consultation" },
              ].map(v => (
                <div key={v.label} style={{ display: "flex", alignItems: "center", gap: "10px", padding: "13px 16px", borderRadius: "14px", background: "#fff", border: `1px solid ${B.border}` }}>
                  <div style={{ color: B.pink, flexShrink: 0 }} dangerouslySetInnerHTML={{ __html: v.icon }}/>
                  <span style={{ fontSize: "0.83rem", fontWeight: 600, color: B.ink }}>{v.label}</span>
                </div>
              ))}
            </div>

            <button className="btn-p" onClick={() => document.querySelector("#contact")?.scrollIntoView({ behavior: "smooth" })}>
              Start Your Journey
              <svg width="15" height="15" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3"/></svg>
            </button>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

// ─── Corporate callout ────────────────────────────────────────────────────────
function Corporate() {
  return (
    <section style={{ background: "#fff", padding: "80px 0" }}>
      <div className="wrap">
        <Reveal>
          <div style={{ borderRadius: "28px", overflow: "hidden", position: "relative", background: B.ink }}>
            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg, rgba(233,30,140,0.15) 0%, rgba(8,145,178,0.15) 100%)" }}/>
            <div style={{ position: "absolute", top: "-60px", right: "-60px", width: "300px", height: "300px", borderRadius: "50%", background: "rgba(255,255,255,0.03)" }}/>
            <div className="grid-2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", position: "relative", zIndex: 1 }}>
              {/* Image */}
              <div style={{ height: "360px", overflow: "hidden" }} className="hide-m">
                <img
                  src="https://images.unsplash.com/photo-1552664730-d307ca884978?w=700&auto=format&fit=crop&q=80"
                  alt="Corporate wellness"
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              </div>
              {/* Text */}
              <div style={{ padding: "52px 48px" }}>
                <div style={{ display: "inline-block", fontSize: "0.68rem", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.14em", color: B.pink, background: "rgba(233,30,140,0.15)", padding: "6px 14px", borderRadius: "999px", marginBottom: "18px" }}>Corporate</div>
                <h2 style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 800, fontSize: "clamp(1.6rem, 2.5vw, 2.2rem)", color: "#fff", marginBottom: "20px", lineHeight: 1.2 }}>
                  Wellness solutions<br/>for your organisation
                </h2>
                <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "10px", marginBottom: "32px" }}>
                  {["Team Building","Workshops & Training","Debriefing Sessions","Healthy & Wellness Programs","Public Speaking in Wellness"].map(item => (
                    <li key={item} style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "0.9rem", color: "rgba(255,255,255,0.8)" }}>
                      <span style={{ color: B.pink, fontWeight: 700, fontSize: "1rem" }}>+</span>
                      {item}
                    </li>
                  ))}
                </ul>
                <button className="btn-p" onClick={() => document.querySelector("#contact")?.scrollIntoView({ behavior: "smooth" })}>
                  Get in Touch
                  <svg width="15" height="15" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3"/></svg>
                </button>
              </div>
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
    <section id="testimonials" style={{ background: B.warm, padding: "100px 0" }}>
      <div className="wrap">
        <Reveal>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "52px", flexWrap: "wrap", gap: "16px" }}>
            <div>
              <div className="section-label">Client Stories</div>
              <h2 className="h2">Real people, <span style={{ background: B.grad, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>real change.</span></h2>
            </div>
            {/* Dots */}
            <div style={{ display: "flex", gap: "8px" }}>
              {TESTIMONIALS.map((_,i) => (
                <button key={i} onClick={() => setActive(i)} style={{ border: "none", cursor: "pointer", borderRadius: "999px", height: "6px", transition: "all 0.3s", background: active === i ? B.pink : B.border, width: active === i ? "24px" : "8px" }}/>
              ))}
            </div>
          </div>
        </Reveal>

        <div className="grid-2" style={{ display: "grid", gridTemplateColumns: "1.6fr 1fr", gap: "20px", alignItems: "start" }}>
          {/* Featured */}
          <Reveal>
            <div style={{ background: "#fff", borderRadius: "24px", padding: "44px", border: `1px solid ${B.border}`, boxShadow: "0 8px 32px rgba(0,0,0,0.04)" }}>
              {/* Image strip */}
              <div style={{ width: "100%", height: "200px", borderRadius: "16px", overflow: "hidden", marginBottom: "28px" }}>
                <img
                  src="https://images.unsplash.com/photo-1516302752625-fcc3c50ae61f?w=800&auto=format&fit=crop&q=80"
                  alt="Counselling"
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              </div>
              <div style={{ display: "flex", gap: "3px", marginBottom: "18px" }}>
                {[...Array(5)].map((_,i) => <span key={i} style={{ color: B.orange, fontSize: "1rem" }}>★</span>)}
              </div>
              <p style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 500, fontSize: "1.1rem", color: B.ink, lineHeight: 1.72, fontStyle: "italic", marginBottom: "28px" }}>
                "{TESTIMONIALS[active].text}"
              </p>
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <div style={{ width: "46px", height: "46px", borderRadius: "50%", background: B.grad, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.8rem", fontWeight: 800, color: "#fff", flexShrink: 0 }}>
                  {TESTIMONIALS[active].initials}
                </div>
                <div>
                  <p style={{ fontSize: "0.9rem", fontWeight: 700, color: B.ink }}>{TESTIMONIALS[active].name}</p>
                  <p style={{ fontSize: "0.75rem", color: B.muted }}>{TESTIMONIALS[active].role}</p>
                </div>
              </div>
            </div>
          </Reveal>

          {/* Selector */}
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {TESTIMONIALS.map((t, i) => (
              <Reveal key={t.name} delay={i * 50}>
                <button onClick={() => setActive(i)} style={{ width: "100%", textAlign: "left", padding: "18px 20px", borderRadius: "16px", cursor: "pointer", border: `1px solid ${active === i ? B.pink : B.border}`, transition: "all 0.25s", background: active === i ? B.pinkSoft : "#fff", display: "flex", alignItems: "center", gap: "12px" }}>
                  <div style={{ width: "40px", height: "40px", borderRadius: "50%", background: active === i ? B.grad : B.warm, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.72rem", fontWeight: 800, color: active === i ? "#fff" : B.slate, flexShrink: 0, transition: "all 0.25s" }}>
                    {t.initials}
                  </div>
                  <div>
                    <p style={{ fontSize: "0.875rem", fontWeight: 700, color: B.ink }}>{t.name}</p>
                    <p style={{ fontSize: "0.72rem", color: B.muted }}>{t.role}</p>
                  </div>
                </button>
              </Reveal>
            ))}

            {/* Second image */}
            <Reveal delay={200}>
              <div style={{ borderRadius: "18px", overflow: "hidden", height: "160px", marginTop: "4px" }}>
                <img
                  src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=600&auto=format&fit=crop&q=80"
                  alt="Group wellness"
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              </div>
            </Reveal>
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
    <section id="faq" style={{ background: "#fff", padding: "100px 0" }}>
      <div style={{ maxWidth: "760px", margin: "0 auto", padding: "0 28px" }}>
        <Reveal>
          <div className="section-label">Common Questions</div>
          <h2 className="h2" style={{ marginBottom: "52px" }}>
            Got <span style={{ background: B.grad, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>questions?</span>
          </h2>
        </Reveal>
        <div>
          {FAQS.map((f, i) => (
            <Reveal key={i} delay={i * 40}>
              <div style={{ borderBottom: `1px solid ${B.border}` }}>
                <button onClick={() => setOpen(open === i ? null : i)}
                  style={{ width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center", padding: "22px 0", background: "none", border: "none", cursor: "pointer", textAlign: "left", gap: "16px" }}>
                  <span style={{ fontSize: "0.95rem", fontWeight: 600, color: open === i ? B.pink : B.ink, transition: "color 0.2s" }}>{f.q}</span>
                  <div style={{ width: "32px", height: "32px", borderRadius: "50%", background: open === i ? B.grad : B.warm, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, transition: "all 0.25s", color: open === i ? "#fff" : B.pink, fontSize: "1.2rem", lineHeight: 1, fontWeight: 700 }}>
                    {open === i ? "−" : "+"}
                  </div>
                </button>
                {open === i && (
                  <p style={{ fontSize: "0.9rem", color: B.slate, lineHeight: 1.85, paddingBottom: "22px", paddingRight: "48px" }}>{f.a}</p>
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

  const inp: React.CSSProperties = { width: "100%", padding: "13px 16px", borderRadius: "12px", border: `1.5px solid ${B.border}`, background: B.warm, fontSize: "0.875rem", color: B.ink, outline: "none", fontFamily: "'DM Sans', sans-serif", transition: "border-color 0.2s" };

  return (
    <section id="contact" style={{ background: B.warm, padding: "100px 0" }}>
      <div className="wrap">
        <div className="grid-c" style={{ display: "grid", gridTemplateColumns: "1fr 1.3fr", gap: "72px", alignItems: "start" }}>
          {/* Info */}
          <Reveal>
            <div className="section-label">Get in Touch</div>
            <h2 className="h2" style={{ marginBottom: "18px" }}>
              Take the<br/>
              <span style={{ background: B.grad, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>first step.</span>
            </h2>
            <p className="body" style={{ marginBottom: "40px", maxWidth: "320px" }}>
              Book a free 15-minute consultation. No commitment, no pressure — just a conversation.
            </p>

            {/* Contact image */}
            <div style={{ borderRadius: "20px", overflow: "hidden", height: "200px", marginBottom: "32px" }}>
              <img
                src="https://images.unsplash.com/photo-1590650153855-d9e808231d41?w=700&auto=format&fit=crop&q=80"
                alt="Welcoming session"
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "20px", marginBottom: "32px" }}>
              {[
                { icon: `<svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg>`, label: "Phone",     value: "(076) 122-8682",              href: "tel:+27761228682" },
                { icon: `<svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>`, label: "Email",     value: "myndworkspractice@gmail.com", href: "mailto:myndworkspractice@gmail.com" },
                { icon: `<svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><rect x="2" y="2" width="20" height="20" rx="5" ry="5" strokeWidth={2}/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5" strokeWidth={2}/></svg>`, label: "Instagram", value: "@myndworkspsychology",        href: "https://instagram.com/myndworkspsychology" },
              ].map(c => (
                <div key={c.label} style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                  <div style={{ width: "40px", height: "40px", borderRadius: "12px", background: B.pinkSoft, display: "flex", alignItems: "center", justifyContent: "center", color: B.pink, flexShrink: 0 }}
                    dangerouslySetInnerHTML={{ __html: c.icon }}/>
                  <div>
                    <p style={{ fontSize: "0.67rem", fontWeight: 700, color: B.muted, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "2px" }}>{c.label}</p>
                    <a href={c.href} style={{ fontSize: "0.9rem", color: B.ink, fontWeight: 600, textDecoration: "none", transition: "color 0.2s" }}
                      onMouseEnter={e => (e.currentTarget.style.color = B.pink)}
                      onMouseLeave={e => (e.currentTarget.style.color = B.ink)}>
                      {c.value}
                    </a>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ padding: "16px 20px", borderRadius: "14px", background: B.tealSoft, border: `1px solid rgba(8,145,178,0.15)` }}>
              <p style={{ fontSize: "0.82rem", fontWeight: 700, color: B.teal, marginBottom: "4px" }}>🆘 In crisis right now?</p>
              <p style={{ fontSize: "0.82rem", color: B.slate, lineHeight: 1.65 }}>Please contact your local emergency services or a crisis helpline immediately. You are not alone.</p>
            </div>
          </Reveal>

          {/* Form */}
          <Reveal delay={120}>
            <div style={{ background: "#fff", borderRadius: "28px", padding: "40px", boxShadow: "0 16px 56px rgba(0,0,0,0.07)", border: `1px solid ${B.border}` }}>
              {status === "success" ? (
                <div style={{ textAlign: "center", padding: "52px 0" }}>
                  <div style={{ width: "72px", height: "72px", borderRadius: "50%", background: B.pinkSoft, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px", fontSize: "2rem" }}>🌿</div>
                  <h3 style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 800, fontSize: "1.5rem", color: B.ink, marginBottom: "10px" }}>Thank you, {form.name.split(" ")[0]}!</h3>
                  <p style={{ color: B.slate, fontSize: "0.9rem", lineHeight: 1.7 }}>We'll be in touch within 24 hours.<br/>You've taken a brave step.</p>
                </div>
              ) : (
                <>
                  <h3 style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 800, fontSize: "1.2rem", color: B.ink, marginBottom: "6px" }}>Book a Free Consultation</h3>
                  <p style={{ fontSize: "0.85rem", color: B.muted, marginBottom: "28px" }}>Fill in the form and we'll reach out within 24 hours.</p>
                  <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                      {[
                        { label: "Full Name", type: "text",  key: "name",  ph: "Jane Smith",       req: true },
                        { label: "Email",     type: "email", key: "email", ph: "jane@example.com", req: true },
                      ].map(f => (
                        <div key={f.key}>
                          <label style={{ display: "block", fontSize: "0.68rem", fontWeight: 700, color: B.slate, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "7px" }}>{f.label}{f.req && " *"}</label>
                          <input required={f.req} type={f.type} placeholder={f.ph} value={form[f.key as keyof typeof form]}
                            onChange={e => setForm({ ...form, [f.key]: e.target.value })} style={inp}
                            onFocus={e => (e.target.style.borderColor = B.pink)}
                            onBlur={e => (e.target.style.borderColor = B.border)}/>
                        </div>
                      ))}
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                      <div>
                        <label style={{ display: "block", fontSize: "0.68rem", fontWeight: 700, color: B.slate, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "7px" }}>Phone</label>
                        <input type="tel" placeholder="076 122 8682" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} style={inp}
                          onFocus={e => (e.target.style.borderColor = B.pink)} onBlur={e => (e.target.style.borderColor = B.border)}/>
                      </div>
                      <div>
                        <label style={{ display: "block", fontSize: "0.68rem", fontWeight: 700, color: B.slate, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "7px" }}>Service</label>
                        <select value={form.service} onChange={e => setForm({...form, service: e.target.value})} style={{ ...inp, appearance: "none" as const }}
                          onFocus={e => (e.target.style.borderColor = B.pink)} onBlur={e => (e.target.style.borderColor = B.border)}>
                          <option value="">Select…</option>
                          {SERVICES.map(s => <option key={s.title} value={s.title}>{s.title}</option>)}
                        </select>
                      </div>
                    </div>
                    <div>
                      <label style={{ display: "block", fontSize: "0.68rem", fontWeight: 700, color: B.slate, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "7px" }}>Message</label>
                      <textarea rows={4} placeholder="Tell us what brings you here…" value={form.message} onChange={e => setForm({...form, message: e.target.value})}
                        style={{ ...inp, resize: "none" as const }}
                        onFocus={e => (e.target.style.borderColor = B.pink)} onBlur={e => (e.target.style.borderColor = B.border)}/>
                    </div>
                    {status === "error" && <p style={{ color: "#dc2626", fontSize: "0.82rem", textAlign: "center" }}>Something went wrong. Please try again.</p>}
                    <button type="submit" disabled={status === "sending"} className="btn-p" style={{ justifyContent: "center", padding: "15px", fontSize: "0.95rem", opacity: status === "sending" ? 0.65 : 1 }}>
                      {status === "sending" ? "Sending…" : "Book Free Consultation"}
                    </button>
                    <p style={{ fontSize: "0.72rem", color: B.muted, textAlign: "center" }}>Strictly confidential. We never share your information.</p>
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
    <footer style={{ background: B.ink, color: "#64748b", padding: "72px 0 36px" }}>
      <div className="wrap">
        <div className="grid-3" style={{ display: "grid", gridTemplateColumns: "1.6fr 1fr 1fr", gap: "56px", marginBottom: "56px" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px" }}>
              <div style={{ width: "34px", height: "34px", borderRadius: "10px", background: B.grad, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round">
                  <path d="M12 3C7 3 3 7 3 12s4 9 9 9 9-4 9-9-4-9-9-9z"/>
                  <path d="M8 14s1.5 2 4 2 4-2 4-2"/>
                  <circle cx="9" cy="10" r="1.2" fill="white" stroke="none"/>
                  <circle cx="15" cy="10" r="1.2" fill="white" stroke="none"/>
                </svg>
              </div>
              <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "1.15rem", fontWeight: 900, color: "#fff", letterSpacing: "-0.02em" }}>
                <span style={{ color: B.pink }}>Mynd</span>Works
              </span>
            </div>
            <p style={{ fontSize: "0.85rem", lineHeight: 1.8, maxWidth: "280px", marginBottom: "24px" }}>
              Professional mental wellbeing support. Compassionate, evidence-based care for every stage of life.
            </p>
            <div style={{ display: "flex", gap: "10px" }}>
              {[
                { l: "IG", h: "https://instagram.com/myndworkspsychology", icon: `<svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24"><rect x="2" y="2" width="20" height="20" rx="5" ry="5" strokeWidth={2}/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5" strokeWidth={2}/></svg>` },
                { l: "FB", h: "#", icon: `<svg width="14" height="14" fill="currentColor" viewBox="0 0 24 24"><path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/></svg>` },
                { l: "LI", h: "#", icon: `<svg width="14" height="14" fill="currentColor" viewBox="0 0 24 24"><path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z"/><circle cx="4" cy="4" r="2"/></svg>` },
              ].map(s => (
                <a key={s.l} href={s.h} style={{ width: "36px", height: "36px", borderRadius: "50%", background: "rgba(255,255,255,0.06)", display: "flex", alignItems: "center", justifyContent: "center", color: "#64748b", textDecoration: "none", transition: "all 0.2s" }}
                  dangerouslySetInnerHTML={{ __html: s.icon }}
                  onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.background = B.pink; (e.currentTarget as HTMLAnchorElement).style.color = "#fff"; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.background = "rgba(255,255,255,0.06)"; (e.currentTarget as HTMLAnchorElement).style.color = "#64748b"; }}/>
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
              <li><a href="mailto:myndworkspractice@gmail.com" style={{ fontSize: "0.83rem", color: "#64748b", textDecoration: "none" }} onMouseEnter={e => (e.currentTarget.style.color = "#fff")} onMouseLeave={e => (e.currentTarget.style.color = "#64748b")}>myndworkspractice@gmail.com</a></li>
              <li><a href="mailto:sphe@myndworks.co.za" style={{ fontSize: "0.83rem", color: "#64748b", textDecoration: "none" }} onMouseEnter={e => (e.currentTarget.style.color = "#fff")} onMouseLeave={e => (e.currentTarget.style.color = "#64748b")}>sphe@myndworks.co.za</a></li>
              <li><a href="https://instagram.com/myndworkspsychology" style={{ fontSize: "0.83rem", color: "#64748b", textDecoration: "none" }} onMouseEnter={e => (e.currentTarget.style.color = B.pink)} onMouseLeave={e => (e.currentTarget.style.color = "#64748b")}>@myndworkspsychology</a></li>
              <li><a href="https://www.myndworks.co.za" style={{ fontSize: "0.83rem", color: "#64748b", textDecoration: "none" }} onMouseEnter={e => (e.currentTarget.style.color = "#fff")} onMouseLeave={e => (e.currentTarget.style.color = "#64748b")}>www.myndworks.co.za</a></li>
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