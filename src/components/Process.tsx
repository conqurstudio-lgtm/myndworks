import { useEffect, useRef, useState } from "react";
import firstVisitImage from "../assets/first-visit.png";
import { Reveal } from "./ui";

const STEPS = [
  {
    n: "01",
    label: "Reach out",
    title: "Take the first step when you're ready",
    text: "Choose a convenient way to connect with MyndWorks and book your first session. If you're not sure which service is right for you, we'll help guide you in the right direction.",
  },
  {
    n: "02",
    label: "First session",
    title: "Tell us what brings you here",
    text: "Your first session is a chance to talk through what you're experiencing, how you've been feeling and what you'd like support with. You don't need to prepare or have all the answers.",
  },
  {
    n: "03",
    label: "Tailored therapy",
    title: "Therapy shaped around your needs",
    text: "There is no one-size-fits-all approach. Your therapist will shape the therapeutic process around your circumstances, goals and what feels most helpful for you.",
  },
  {
    n: "04",
    label: "Ongoing progress",
    title: "Move forward one session at a time",
    text: "Meaningful change takes time. Each session creates space to build understanding, develop practical tools and work towards healthier ways of thinking, feeling and relating.",
  },
] as const;

export function Process() {
  const [active, setActive] = useState(0);
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);

  const step = STEPS[active];

  useEffect(() => {
    const activeTab = tabRefs.current[active];

    if (!activeTab) return;

    activeTab.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
      inline: "center",
    });
  }, [active]);

  return (
    <section
      id="first-visit"
      className="process-section"
    >
      <Reveal>
        <div className="section-eyebrow">
          Your first visit
        </div>
      </Reveal>

      <Reveal className="process-heading-wrap">
        <h2 className="process-heading">
          Your journey,
          <span> one step at a time</span>
        </h2>
      </Reveal>

      <Reveal className="journey-tabs-wrap">
        <div
          className="journey-tabs"
          role="tablist"
          aria-label="Your first visit journey"
        >
          {STEPS.map((item, index) => (
            <button
              key={item.n}
              ref={(element) => {
                tabRefs.current[index] = element;
              }}
              type="button"
              role="tab"
              aria-selected={active === index}
              className={
                active === index
                  ? "journey-tab is-active"
                  : "journey-tab"
              }
              onClick={() => setActive(index)}
            >
              <span className="journey-tab-label">
                {item.label}
              </span>

              <span className="journey-tab-number">
                {item.n}
              </span>
            </button>
          ))}
        </div>
      </Reveal>

      <div className="process-grid">
        <div
          key={active}
          className="process-copy process-change"
        >
          <span className="process-number">
            {step.n}
          </span>

          <h3>
            {step.title}
          </h3>

          <p>
            {step.text}
          </p>

          <a
            className="process-cta"
            href="#contact"
          >
            Book a session →
          </a>
        </div>

        <Reveal className="process-image-column">
          <div className="process-image-wrap">
            <img
              className="process-image"
              src={firstVisitImage}
              alt="A therapist speaking with a client during a calm counselling session"
            />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
