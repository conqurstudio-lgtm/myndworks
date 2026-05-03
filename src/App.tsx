import { useState, useEffect, useRef } from "react";

interface Service { icon: string; title: string; desc: string; }
interface Testimonial { name: string; role: string; text: string; avatar: string; }
interface FaqItem { q: string; a: string; }

const SERVICES: Service[] = [
  { icon: "🧠", title: "Individual Therapy", desc: "One-on-one sessions tailored to your unique needs. Work through anxiety, depression, trauma, and life transitions in a safe, confidential space." },
  { icon: "💑", title: "Couples Counselling", desc: "Strengthen your relationship with evidence-based tools. Improve communication, rebuild trust, and reconnect with your partner." },
  { icon: "🌿", title: "Mindfulness & Stress", desc: "Learn proven mindfulness techniques to manage stress, reduce overwhelm, and cultivate lasting calm in daily life." },
  { icon: "👥", title: "Group Therapy", desc: "Connect with others in a supportive, facilitated group environment. Heal through shared understanding and community." },
  { icon: "🧒", title: "Child & Adolescent", desc: "Specialised support for young people navigating emotional challenges, school pressures, and identity development." },
  { icon: "💻", title: "Online Sessions", desc: "Access professional mental health support from the comfort of your home. Fully secure, confidential video sessions." },
];

const TESTIMONIALS: Testimonial[] = [
  { name: "Sarah M.", role: "Individual Therapy", text: "MyndWorks changed my life. After years of struggling with anxiety, I finally have the tools to manage my thoughts and live fully.", avatar: "SM" },
  { name: "James & Priya K.", role: "Couples Counselling", text: "We came to MyndWorks on the brink of separation. Through counselling, we rediscovered what brought us together.", avatar: "JP" },
  { name: "Tom R.", role: "Mindfulness Programme", text: "The mindfulness programme was transformative. My stress levels have dropped dramatically and my sleep has improved enormously.", avatar: "TR" },
  { name: "Leila H.", role: "Online Sessions", text: "As a busy working mum, the online sessions were a lifeline. The flexibility meant I could prioritise my mental health.", avatar: "LH" },
];

const FAQS: FaqItem[] = [
  { q: "How do I know if therapy is right for me?", a: "Therapy can benefit anyone who wants to improve their mental wellbeing or work through challenges. You don't need to be in crisis to benefit." },
  { q: "What happens in the first session?", a: "Your first session is a chance for us to get to know you, explore what brings you to therapy, and see if we're a good fit. There's no pressure." },
  { q: "How long will I need therapy?", a: "This varies depending on your goals. Some benefit from 6–12 sessions, others prefer longer-term support. We review progress regularly." },
  { q: "Is everything kept confidential?", a: "Yes. Confidentiality is fundamental. What you share stays between you and your therapist, with very limited exceptions explained in your first session." },
  { q: "Do you offer online and in-person sessions?", a: "We offer both. Choose secure video sessions from anywhere, or visit us in person. Many clients mix both depending on their schedule." },
  { q: "How much do sessions cost?", a: "Please contact us to discuss pricing and availability. We're committed to making support as accessible as possible." },
];

const STATS = [
  { value: "2,000+", label: "Clients Supported" },
  { value: "15+", label: "Years Experience" },
  { value: "98%", label: "Satisfaction Rate" },
  { value: "6", label: "Specialist Therapists" },
];

// ─── Animation Hook ───────────────────────────────────────────────────────────
function useReveal() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.1 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return { ref, visible };
}

function Reveal({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  const { ref, visible } = useReveal();
  return (
    <div ref={ref} className={className} style={{
      opacity: visible ? 1 : 0,
      transform: visible ? "translateY(0)" : "translateY(24px)",
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
    <nav style={{ fontFamily: "'DM Sans', sans-serif" }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? "bg-white shadow-sm" : "bg-white/80 backdrop-blur-md"}`}>
      <div className="max-w-6xl mx-auto px-6 flex items-center justify-between h-18" style={{ height: "72px" }}>
        {/* Logo */}
        <button onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "linear-gradient(135deg, #7c3aed, #0ea5e9)" }}>
            <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none">
              <path d="M12 3C7 3 3 7 3 12s4 9 9 9 9-4 9-9-4-9-9-9z" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              <path d="M8 14s1.5 2 4 2 4-2 4-2" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              <circle cx="9" cy="10" r="1.2" fill="currentColor"/>
              <circle cx="15" cy="10" r="1.2" fill="currentColor"/>
            </svg>
          </div>
          <span className="text-lg font-bold text-slate-900">Mynd<span style={{ color: "#7c3aed" }}>Works</span></span>
        </button>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-1">
          {[["Services","#services"],["About","#about"],["Testimonials","#testimonials"],["FAQ","#faq"]].map(([label, href]) => (
            <button key={label} onClick={() => go(href)}
              className="px-4 py-2 rounded-full text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-all">
              {label}
            </button>
          ))}
          <button onClick={() => go("#contact")}
            className="ml-3 px-5 py-2.5 rounded-full text-white text-sm font-semibold transition-all hover:opacity-90 hover:scale-105"
            style={{ background: "linear-gradient(135deg, #7c3aed, #0ea5e9)" }}>
            Book Session
          </button>
        </div>

        {/* Mobile toggle */}
        <button className="md:hidden p-2 text-slate-700" onClick={() => setOpen(!open)}>
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {open
              ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/>
              : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16"/>}
          </svg>
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-white border-t border-slate-100 px-6 py-4 space-y-1">
          {[["Services","#services"],["About","#about"],["Testimonials","#testimonials"],["FAQ","#faq"]].map(([label, href]) => (
            <button key={label} onClick={() => go(href)}
              className="block w-full text-left px-4 py-3 rounded-xl text-slate-700 font-medium hover:bg-slate-50">
              {label}
            </button>
          ))}
          <button onClick={() => go("#contact")}
            className="w-full mt-2 py-3 rounded-xl text-white font-semibold"
            style={{ background: "linear-gradient(135deg, #7c3aed, #0ea5e9)" }}>
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
    <section className="relative overflow-hidden bg-white" style={{ minHeight: "100vh", fontFamily: "'DM Sans', sans-serif" }}>
      {/* Soft background blobs */}
      <div className="absolute top-0 right-0 w-2/3 h-full pointer-events-none">
        <div className="absolute top-16 right-0 w-96 h-96 rounded-full opacity-30 blur-3xl" style={{ background: "#c4b5fd" }}/>
        <div className="absolute top-32 right-32 w-64 h-64 rounded-full opacity-20 blur-2xl" style={{ background: "#7dd3fc" }}/>
        <div className="absolute bottom-32 right-16 w-48 h-48 rounded-full opacity-20 blur-2xl" style={{ background: "#a5f3fc" }}/>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-6 flex items-center" style={{ minHeight: "100vh" }}>
        <div className="grid md:grid-cols-2 gap-12 items-center w-full py-32">
          {/* Left text */}
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium mb-8 border"
              style={{ background: "#f5f3ff", borderColor: "#ddd6fe", color: "#7c3aed" }}>
              <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: "#7c3aed" }}/>
              Professional Mental Health Support
            </div>
            <h1 className="font-bold text-slate-900 leading-tight mb-6" style={{ fontSize: "clamp(2.5rem, 5vw, 3.75rem)" }}>
              Your mind<br/>
              <span style={{ fontFamily: "'DM Serif Display', serif", color: "#7c3aed", fontStyle: "italic", fontWeight: 400 }}>
                deserves care.
              </span>
            </h1>
            <p className="text-lg text-slate-500 leading-relaxed mb-10 max-w-md">
              Compassionate, evidence-based therapy and mental wellbeing support — helping you live with greater clarity, connection, and calm.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <button onClick={() => document.querySelector("#contact")?.scrollIntoView({ behavior: "smooth" })}
                className="px-8 py-4 rounded-2xl text-white font-semibold text-base shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all"
                style={{ background: "linear-gradient(135deg, #7c3aed, #0ea5e9)" }}>
                Book Your First Session
              </button>
              <button onClick={() => document.querySelector("#services")?.scrollIntoView({ behavior: "smooth" })}
                className="px-8 py-4 rounded-2xl font-semibold text-base border border-slate-200 text-slate-700 hover:bg-slate-50 transition-all">
                Explore Services
              </button>
            </div>
            {/* Trust badges */}
            <div className="flex flex-wrap gap-4 mt-10">
              {["Fully Confidential", "In-person & Online", "Free First Consultation"].map(t => (
                <div key={t} className="flex items-center gap-2 text-sm text-slate-500">
                  <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: "#f0fdf4" }}>
                    <svg className="w-3 h-3" style={{ color: "#22c55e" }} fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                    </svg>
                  </div>
                  {t}
                </div>
              ))}
            </div>
          </div>

          {/* Right image card */}
          <div className="relative hidden md:block">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl" style={{ background: "#f5f3ff" }}>
              <img
                src="https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=600&auto=format&fit=crop&q=80"
                alt="Therapist"
                className="w-full object-cover"
                style={{ height: "520px", objectPosition: "top" }}
              />
              <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(124,58,237,0.15), transparent)" }}/>
            </div>

            {/* Floating stat card */}
            <div className="absolute -bottom-6 -left-6 bg-white rounded-2xl shadow-xl p-5 border border-slate-100">
              <p className="text-3xl font-bold" style={{ color: "#7c3aed" }}>2,000+</p>
              <p className="text-sm text-slate-500 mt-0.5">Lives transformed</p>
            </div>

            {/* Floating badge */}
            <div className="absolute top-6 -right-4 bg-white rounded-2xl shadow-lg px-4 py-3 border border-slate-100 flex items-center gap-2">
              <span className="text-xl">⭐</span>
              <div>
                <p className="text-sm font-bold text-slate-900">98% satisfaction</p>
                <p className="text-xs text-slate-400">from our clients</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Stats Bar ────────────────────────────────────────────────────────────────
function Stats() {
  return (
    <section className="py-14 border-y border-slate-100" style={{ background: "#fafafa", fontFamily: "'DM Sans', sans-serif" }}>
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {STATS.map((s, i) => (
            <Reveal key={s.label} delay={i * 80} className="text-center">
              <p className="text-4xl font-bold mb-1" style={{ color: "#7c3aed" }}>{s.value}</p>
              <p className="text-sm text-slate-500 uppercase tracking-wider font-medium">{s.label}</p>
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
    <section id="services" className="py-24 bg-white" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <div className="max-w-6xl mx-auto px-6">
        <Reveal className="text-center mb-16">
          <span className="inline-block px-4 py-1.5 rounded-full text-sm font-semibold uppercase tracking-wide mb-4"
            style={{ background: "#f5f3ff", color: "#7c3aed" }}>
            What We Offer
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
            Support for{" "}
            <span style={{ fontFamily: "'DM Serif Display', serif", color: "#7c3aed", fontStyle: "italic", fontWeight: 400 }}>
              every journey
            </span>
          </h2>
          <p className="text-lg text-slate-500 max-w-xl mx-auto">
            Evidence-based therapies delivered by accredited professionals in a safe, welcoming space.
          </p>
        </Reveal>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {SERVICES.map((s, i) => (
            <Reveal key={s.title} delay={i * 70}>
              <div className="group p-7 rounded-2xl border border-slate-100 hover:border-violet-200 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer bg-white">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl mb-5"
                  style={{ background: "#f5f3ff" }}>
                  {s.icon}
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-violet-600 transition-colors">{s.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{s.desc}</p>
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
    <section id="about" className="py-24 overflow-hidden" style={{ background: "#fafafa", fontFamily: "'DM Sans', sans-serif" }}>
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Image */}
          <Reveal className="relative">
            <div className="relative rounded-3xl overflow-hidden shadow-xl">
              <img
                src="https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=700&auto=format&fit=crop&q=80"
                alt="Welcoming therapy space"
                className="w-full object-cover"
                style={{ height: "460px" }}
              />
              <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(124,58,237,0.1), transparent)" }}/>
            </div>
            {/* Floating card */}
            <div className="absolute -bottom-5 -right-5 bg-white rounded-2xl shadow-lg p-5 border border-slate-100 max-w-48">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm" style={{ background: "#f5f3ff" }}>💜</div>
                <p className="font-semibold text-slate-900 text-sm">Compassion First</p>
              </div>
              <p className="text-xs text-slate-500">Every person met with warmth and genuine care.</p>
            </div>
          </Reveal>

          {/* Text */}
          <Reveal delay={200}>
            <span className="inline-block px-4 py-1.5 rounded-full text-sm font-semibold uppercase tracking-wide mb-5"
              style={{ background: "#f0fdfa", color: "#0d9488" }}>
              About MyndWorks
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6 leading-tight">
              Rooted in empathy,{" "}
              <span style={{ fontFamily: "'DM Serif Display', serif", color: "#0d9488", fontStyle: "italic", fontWeight: 400 }}>
                driven by science
              </span>
            </h2>
            <p className="text-slate-600 leading-relaxed mb-5">
              MyndWorks was founded on a simple but powerful belief — that everyone deserves access to high-quality, compassionate mental health care. We've built a team of dedicated specialists serving thousands of clients across every stage of life.
            </p>
            <p className="text-slate-600 leading-relaxed mb-8">
              We combine evidence-based therapy — including CBT, EMDR, and mindfulness approaches — with a deeply human style of care. Our goal is not just symptom relief, but lasting transformation.
            </p>
            <div className="grid grid-cols-2 gap-4 mb-8">
              {[
                { icon: "🔬", label: "Evidence-Based" },
                { icon: "🔒", label: "Fully Confidential" },
                { icon: "🌍", label: "In-Person & Online" },
                { icon: "💬", label: "Free Consultation" },
              ].map(v => (
                <div key={v.label} className="flex items-center gap-3 p-3 rounded-xl border border-slate-100 bg-white">
                  <span className="text-lg">{v.icon}</span>
                  <span className="text-sm font-medium text-slate-700">{v.label}</span>
                </div>
              ))}
            </div>
            <button onClick={() => document.querySelector("#contact")?.scrollIntoView({ behavior: "smooth" })}
              className="px-7 py-3.5 rounded-xl text-white font-semibold hover:opacity-90 hover:scale-[1.02] transition-all"
              style={{ background: "linear-gradient(135deg, #0d9488, #7c3aed)" }}>
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
    <section id="testimonials" className="py-24 bg-white" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <div className="max-w-6xl mx-auto px-6">
        <Reveal className="text-center mb-16">
          <span className="inline-block px-4 py-1.5 rounded-full text-sm font-semibold uppercase tracking-wide mb-4"
            style={{ background: "#fffbeb", color: "#d97706" }}>
            Client Stories
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
            Real people,{" "}
            <span style={{ fontFamily: "'DM Serif Display', serif", color: "#d97706", fontStyle: "italic", fontWeight: 400 }}>
              real change
            </span>
          </h2>
        </Reveal>

        {/* Featured */}
        <div className="max-w-2xl mx-auto mb-8">
          <div className="rounded-3xl p-8 md:p-10 border border-slate-100 shadow-sm" style={{ background: "#fafafa" }}>
            <div className="flex gap-1 mb-6">
              {[...Array(5)].map((_, i) => (
                <svg key={i} className="w-5 h-5" style={{ color: "#f59e0b" }} fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                </svg>
              ))}
            </div>
            <p className="text-slate-700 text-lg leading-relaxed mb-8 italic">
              "{TESTIMONIALS[active].text}"
            </p>
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-full flex items-center justify-center text-white text-sm font-bold"
                style={{ background: "linear-gradient(135deg, #7c3aed, #0ea5e9)" }}>
                {TESTIMONIALS[active].avatar}
              </div>
              <div>
                <p className="font-bold text-slate-900 text-sm">{TESTIMONIALS[active].name}</p>
                <p className="text-slate-400 text-xs">{TESTIMONIALS[active].role}</p>
              </div>
            </div>
          </div>
          {/* Dots */}
          <div className="flex justify-center gap-2 mt-5">
            {TESTIMONIALS.map((_, i) => (
              <button key={i} onClick={() => setActive(i)}
                className="rounded-full transition-all"
                style={{
                  width: active === i ? "24px" : "10px",
                  height: "10px",
                  background: active === i ? "#7c3aed" : "#e2e8f0"
                }}/>
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
    <section id="faq" className="py-24" style={{ background: "#fafafa", fontFamily: "'DM Sans', sans-serif" }}>
      <div className="max-w-3xl mx-auto px-6">
        <Reveal className="text-center mb-16">
          <span className="inline-block px-4 py-1.5 rounded-full text-sm font-semibold uppercase tracking-wide mb-4"
            style={{ background: "#eff6ff", color: "#2563eb" }}>
            Common Questions
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
            Got{" "}
            <span style={{ fontFamily: "'DM Serif Display', serif", color: "#2563eb", fontStyle: "italic", fontWeight: 400 }}>
              questions?
            </span>
          </h2>
          <p className="text-lg text-slate-500">Everything you need to know before your first step.</p>
        </Reveal>
        <div className="space-y-3">
          {FAQS.map((f, i) => (
            <Reveal key={i} delay={i * 50}>
              <div className={`rounded-2xl border bg-white overflow-hidden transition-all ${open === i ? "border-violet-200 shadow-sm" : "border-slate-100"}`}>
                <button onClick={() => setOpen(open === i ? null : i)}
                  className="w-full flex items-center justify-between px-6 py-5 text-left">
                  <span className={`font-semibold pr-4 text-sm transition-colors ${open === i ? "text-violet-600" : "text-slate-800"}`}>
                    {f.q}
                  </span>
                  <div className="flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center transition-all"
                    style={{ background: open === i ? "#7c3aed" : "#f1f5f9", transform: open === i ? "rotate(180deg)" : "rotate(0deg)" }}>
                    <svg className="w-3.5 h-3.5" style={{ color: open === i ? "white" : "#64748b" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7"/>
                    </svg>
                  </div>
                </button>
                {open === i && (
                  <div className="px-6 pb-5">
                    <p className="text-slate-500 text-sm leading-relaxed">{f.a}</p>
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
    } catch {
      setStatus("error");
    }
  };

  return (
    <section id="contact" className="py-24 bg-white" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <div className="max-w-6xl mx-auto px-6">
        <Reveal className="text-center mb-16">
          <span className="inline-block px-4 py-1.5 rounded-full text-sm font-semibold uppercase tracking-wide mb-4"
            style={{ background: "#f5f3ff", color: "#7c3aed" }}>
            Get in Touch
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
            Take the{" "}
            <span style={{ fontFamily: "'DM Serif Display', serif", color: "#7c3aed", fontStyle: "italic", fontWeight: 400 }}>
              first step
            </span>
          </h2>
          <p className="text-lg text-slate-500 max-w-md mx-auto">Book a free 15-minute consultation. No commitment required.</p>
        </Reveal>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Info */}
          <Reveal>
            <div className="space-y-4 mb-8">
              {[
                { icon: "📍", title: "Visit Us", info: "Your address here" },
                { icon: "📞", title: "Call Us", info: "Your phone number" },
                { icon: "✉️", title: "Email Us", info: "your@gmail.com" },
                { icon: "🕐", title: "Hours", info: "Mon–Fri 8am–6pm · Sat 9am–1pm" },
              ].map(c => (
                <div key={c.title} className="flex items-center gap-4 p-4 rounded-2xl border border-slate-100 bg-white hover:border-violet-100 transition-all">
                  <div className="w-11 h-11 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
                    style={{ background: "#f5f3ff" }}>
                    {c.icon}
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 uppercase tracking-wider font-medium">{c.title}</p>
                    <p className="text-slate-800 font-medium text-sm">{c.info}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="p-5 rounded-2xl border" style={{ background: "#f0fdfa", borderColor: "#99f6e4" }}>
              <p className="font-semibold mb-1" style={{ color: "#0d9488" }}>🆘 In Crisis Right Now?</p>
              <p className="text-slate-600 text-sm">Please contact your local emergency services or a crisis helpline immediately. You are not alone.</p>
            </div>
          </Reveal>

          {/* Form */}
          <Reveal delay={200}>
            <div className="rounded-3xl p-8 border border-slate-100 shadow-sm" style={{ background: "#fafafa" }}>
              {status === "success" ? (
                <div className="text-center py-12">
                  <div className="text-5xl mb-4">🌿</div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-2">Thank you, {form.name.split(" ")[0]}!</h3>
                  <p className="text-slate-500">We'll be in touch within 24 hours. You've taken a brave step.</p>
                </div>
              ) : (
                <>
                  <h3 className="text-lg font-bold text-slate-900 mb-6">Book a Free Consultation</h3>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs text-slate-500 font-medium mb-1.5 uppercase tracking-wide">Full Name *</label>
                        <input required type="text" placeholder="Jane Smith" value={form.name}
                          onChange={e => setForm({ ...form, name: e.target.value })}
                          className="w-full px-4 py-3 rounded-xl bg-white border border-slate-200 text-slate-800 text-sm placeholder-slate-400 focus:outline-none focus:border-violet-400 focus:ring-2 transition-all"
                          style={{ "--tw-ring-color": "#ede9fe" } as React.CSSProperties}/>
                      </div>
                      <div>
                        <label className="block text-xs text-slate-500 font-medium mb-1.5 uppercase tracking-wide">Email *</label>
                        <input required type="email" placeholder="jane@example.com" value={form.email}
                          onChange={e => setForm({ ...form, email: e.target.value })}
                          className="w-full px-4 py-3 rounded-xl bg-white border border-slate-200 text-slate-800 text-sm placeholder-slate-400 focus:outline-none focus:border-violet-400 focus:ring-2 transition-all"/>
                      </div>
                    </div>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs text-slate-500 font-medium mb-1.5 uppercase tracking-wide">Phone</label>
                        <input type="tel" placeholder="+27 82 000 0000" value={form.phone}
                          onChange={e => setForm({ ...form, phone: e.target.value })}
                          className="w-full px-4 py-3 rounded-xl bg-white border border-slate-200 text-slate-800 text-sm placeholder-slate-400 focus:outline-none focus:border-violet-400 focus:ring-2 transition-all"/>
                      </div>
                      <div>
                        <label className="block text-xs text-slate-500 font-medium mb-1.5 uppercase tracking-wide">Service</label>
                        <select value={form.service} onChange={e => setForm({ ...form, service: e.target.value })}
                          className="w-full px-4 py-3 rounded-xl bg-white border border-slate-200 text-slate-800 text-sm focus:outline-none focus:border-violet-400 focus:ring-2 transition-all">
                          <option value="">Select…</option>
                          {SERVICES.map(s => <option key={s.title} value={s.title}>{s.title}</option>)}
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs text-slate-500 font-medium mb-1.5 uppercase tracking-wide">What brings you here?</label>
                      <textarea rows={4} placeholder="Share as much or as little as you like…" value={form.message}
                        onChange={e => setForm({ ...form, message: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-white border border-slate-200 text-slate-800 text-sm placeholder-slate-400 focus:outline-none focus:border-violet-400 focus:ring-2 transition-all resize-none"/>
                    </div>
                    {status === "error" && (
                      <p className="text-red-500 text-sm text-center">Something went wrong. Please try again.</p>
                    )}
                    <button type="submit" disabled={status === "sending"}
                      className="w-full py-4 rounded-xl text-white font-semibold text-base shadow-md hover:shadow-lg hover:scale-[1.01] transition-all disabled:opacity-60"
                      style={{ background: "linear-gradient(135deg, #7c3aed, #0ea5e9)" }}>
                      {status === "sending" ? "Sending…" : "Book Free Consultation"}
                    </button>
                    <p className="text-center text-slate-400 text-xs">Your information is always kept strictly confidential.</p>
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
    <footer style={{ background: "#0f172a", fontFamily: "'DM Sans', sans-serif" }} className="text-slate-400 py-16">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "linear-gradient(135deg, #7c3aed, #0ea5e9)" }}>
                <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none">
                  <path d="M12 3C7 3 3 7 3 12s4 9 9 9 9-4 9-9-4-9-9-9z" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  <path d="M8 14s1.5 2 4 2 4-2 4-2" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  <circle cx="9" cy="10" r="1.2" fill="currentColor"/>
                  <circle cx="15" cy="10" r="1.2" fill="currentColor"/>
                </svg>
              </div>
              <span className="text-white font-bold">Mynd<span style={{ color: "#a78bfa" }}>Works</span></span>
            </div>
            <p className="text-sm leading-relaxed mb-5">Professional mental wellbeing support. Compassionate, evidence-based care for every stage of life.</p>
            <div className="flex gap-3">
              {["I","F","L","X"].map((s, i) => (
                <a key={i} href="#" className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold transition-all hover:text-white"
                  style={{ background: "rgba(255,255,255,0.05)" }}
                  onMouseEnter={e => (e.currentTarget.style.background = "#7c3aed")}
                  onMouseLeave={e => (e.currentTarget.style.background = "rgba(255,255,255,0.05)")}>
                  {s}
                </a>
              ))}
            </div>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm">Services</h4>
            <ul className="space-y-2 text-sm">
              {SERVICES.map(s => (
                <li key={s.title}>
                  <a href="#services" className="hover:text-white transition-colors">{s.title}</a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm">Company</h4>
            <ul className="space-y-2 text-sm">
              {["About Us","Testimonials","FAQ","Contact"].map(l => (
                <li key={l}><a href="#" className="hover:text-white transition-colors">{l}</a></li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm">Contact</h4>
            <ul className="space-y-3 text-sm">
              <li>Your address here</li>
              <li><a href="#" className="hover:text-white transition-colors">Your phone here</a></li>
              <li><a href="#" className="hover:text-white transition-colors">your@gmail.com</a></li>
            </ul>
            <div className="mt-5 p-3.5 rounded-xl text-xs" style={{ background: "rgba(13,148,136,0.15)", border: "1px solid rgba(13,148,136,0.3)" }}>
              <p className="font-medium mb-0.5" style={{ color: "#2dd4bf" }}>Crisis Support</p>
              <p>Contact local emergency services or a crisis helpline if you need immediate help.</p>
            </div>
          </div>
        </div>
        <div className="border-t pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs" style={{ borderColor: "rgba(255,255,255,0.05)" }}>
          <p>© {new Date().getFullYear()} MyndWorks. All rights reserved.</p>
          <div className="flex gap-6">
            {["Privacy Policy","Terms of Service","Accessibility"].map(l => (
              <a key={l} href="#" className="hover:text-white transition-colors">{l}</a>
            ))}
          </div>
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