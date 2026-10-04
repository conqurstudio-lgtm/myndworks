import healthIcon from "../assets/health-icon.svg";
import { Reveal } from "./ui";


const SERVICES = [
  {
    tag: "therapy",
    title: "Therapeutic Services",
    intro:
      "Support for emotional, psychological and relationship challenges.",
    details: [
      "Depression",
      "Anxiety",
      "Grief / bereavement",
      "Bipolar mood disorder",
      "Borderline personality disorder",
      "Couples counselling",
    ],
  },
  {
    tag: "corporate",
    title: "Corporate Wellness",
    intro:
      "Wellbeing support created for teams, organisations and communities.",
    details: [
      "Workshops and training",
      "Speaking engagements",
      "Wellness programs",
      "Intimacy events",
    ],
  },
  {
    tag: "1 : 1",
    title: "Individual Therapy",
    intro:
      "A private space to work through what you are carrying.",
    details: [
      "In-person sessions",
      "Virtual sessions",
      "Personalised support",
    ],
  },
  {
    tag: "assessment",
    title: "Assessments",
    intro:
      "Professional psychological assessments that provide clarity and direction.",
    details: [
      "Psychological assessments",
      "Clinical insight",
      "Professional reporting",
    ],
  },
  {
    tag: "medico-legal",
    title: "Medico-legal Assessments",
    intro:
      "Comprehensive professional assessments for medico-legal matters.",
    details: [
      "Clinical assessment",
      "Professional reports",
      "Medico-legal support",
    ],
  },
] as const;


export function Services() {
  return (
    <section
      id="services"
      className="services-section"
    >
      <Reveal>
        <div className="section-eyebrow">
          Services
        </div>
      </Reveal>


      <div className="services-heading-row">
        <Reveal>
          <h2 className="services-heading">
            Support that meets you
            <span>
              {" "}
              exactly where you are
            </span>
          </h2>
        </Reveal>


        <Reveal delay={100}>
          <a
            className="services-book-link"
            href="#contact"
          >
            <span>
              Book a session
            </span>

            <span
              className="services-book-icon"
              aria-hidden="true"
            >
              ↗
            </span>
          </a>
        </Reveal>
      </div>


      <div className="services-grid">
        {SERVICES.map(
          (service, index) => (
            <Reveal
              key={service.title}
              delay={index * 70}
            >
              <article
                className={`service-card ${
                  index < 2
                    ? "service-card-priority"
                    : ""
                }`}
              >
                <div className="service-card-top">

                  <div
                    className="service-thumb"
                    aria-hidden="true"
                  >
                    <img
                      className="service-thumb-icon"
                      src={healthIcon}
                      alt=""
                    />
                  </div>


                  <span
                    className={`service-tag ${
                      index === 0
                        ? "service-tag-therapy"
                        : index === 1
                          ? "service-tag-corporate"
                          : ""
                    }`}
                  >
                    {service.tag}
                  </span>

                </div>


                <div className="service-card-content">

                  <h3>
                    {service.title}
                  </h3>


                  <div className="service-reveal">
                    <div className="service-reveal-inner">

                      <p className="service-intro">
                        {service.intro}
                      </p>


                      <div className="service-detail-list">
                        {service.details.map(
                          (detail) => (
                            <span
                              key={detail}
                            >
                              {detail}
                            </span>
                          )
                        )}
                      </div>


                      <a
                        className="service-card-link"
                        href="#contact"
                      >
                        Learn more →
                      </a>

                    </div>
                  </div>

                </div>
              </article>
            </Reveal>
          )
        )}
      </div>
    </section>
  );
}
