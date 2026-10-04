import firstVisitBanner from "../assets/first-visit-sky.png";
import { Reveal } from "./ui";


const STEPS = [
  {
    number: "01",
    label: "Reach out",
    title: "Take the first step when you're ready",
    text:
      "Choose a convenient way to connect with MyndWorks and book your first session. If you're not sure which service is right for you, we'll help guide you in the right direction.",
  },
  {
    number: "02",
    label: "First session",
    title: "Tell us what brings you here",
    text:
      "Your first session is a chance to talk through what you're experiencing, how you've been feeling and what you'd like support with. You don't need to prepare or have all the answers.",
  },
  {
    number: "03",
    label: "Tailored therapy",
    title: "Therapy shaped around your needs",
    text:
      "There is no one-size-fits-all approach. Your therapist will shape the therapeutic process around your circumstances, goals and what feels most helpful for you.",
  },
  {
    number: "04",
    label: "Ongoing progress",
    title: "Move forward one session at a time",
    text:
      "Meaningful change takes time. Each session creates space to build understanding, develop practical tools and work towards healthier ways of thinking, feeling and relating.",
  },
] as const;


export function Process() {
  return (
    <section
      id="first-visit"
      className="process-section visit-cards-section"
    >

      {/* ===================================================
          IMAGE BANNER
          =================================================== */}

      <Reveal>
        <div className="visit-banner">

          <img
            className="visit-banner-image"
            src={firstVisitBanner}
            alt=""
          />

          <div
            className="visit-banner-overlay"
            aria-hidden="true"
          />

          <div className="visit-banner-content">

            <div className="visit-banner-eyebrow">
              <span
                className="visit-banner-eyebrow-star"
                aria-hidden="true"
              >
                ✳
              </span>

              <span>
                Your first visit
              </span>
            </div>


            <h2 className="visit-banner-heading">
              Your journey,
              <span>
                one step at a time.
              </span>
            </h2>


            <p className="visit-banner-copy">
              Taking the first step towards better
              mental wellbeing can feel big. We're
              here to make it simple, supportive
              and comfortable.
            </p>

          </div>

        </div>
      </Reveal>


      {/* ===================================================
          JOURNEY CARDS
          =================================================== */}

      <div className="visit-cards">

        {STEPS.map((step, index) => (
          <Reveal
            key={step.label}
            delay={index * 60}
          >
            <article className="visit-card">

              <div className="visit-card-top">

                <div className="visit-step-number">
                  {step.number}
                </div>


                <span className="visit-card-tag">
                  {step.label}
                </span>

              </div>


              <div className="visit-card-content">

                <h3>
                  {step.title}
                </h3>


                <div className="visit-card-reveal">

                  <div className="visit-card-reveal-inner">

                    <p>
                      {step.text}
                    </p>


                    <a
                      href="#contact"
                      className="visit-card-link"
                    >
                      Book a session →
                    </a>

                  </div>

                </div>

              </div>

            </article>
          </Reveal>
        ))}

      </div>

    </section>
  );
}
