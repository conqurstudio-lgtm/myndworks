import healthIcon from "../assets/health-icon.svg";
import { Reveal } from "./ui";

const CARE_ROLES = [
  {
    title: "Occupational Therapists & Social Workers",
    text:
      "Supporting daily functioning, relationships and the social environments that can influence wellbeing.",
  },
  {
    title: "Speech Therapists & Audiologists",
    text:
      "Supporting communication, hearing and expression where these form part of a person's wider wellbeing.",
  },
  {
    title: "Dietitians & Physiotherapists",
    text:
      "Supporting the physical side of wellbeing through nutrition, movement and healthy daily functioning.",
  },
  {
    title: "Medical Doctors",
    text:
      "Helping assess and manage medical factors that may influence how someone thinks, feels and functions.",
  },
] as const;

export function HolisticCare() {
  return (
    <section id="holistic-care" className="holistic-section">
      <Reveal>
        <div className="section-eyebrow">
          Holistic care
        </div>
      </Reveal>

      <div className="holistic-grid">
        <Reveal className="holistic-intro">
          <div>
            <h2 className="holistic-heading">
              Care that sees
              <span> the whole person</span>
            </h2>

            <p className="holistic-lede">
              Mental wellbeing can be influenced by psychological,
              social and physical factors. In some situations,
              support from more than one health discipline may form
              part of a person's broader care journey.
            </p>
          </div>

          <a className="holistic-link" href="#faq">
            <span>Read the FAQ</span>
            <span className="holistic-link-icon" aria-hidden="true">
              ↗
            </span>
          </a>
        </Reveal>

        <div className="holistic-list">
          {CARE_ROLES.map((role, index) => (
            <Reveal key={role.title} delay={index * 80}>
              <article className="holistic-card">
                <div className="holistic-card-copy">
                  <h3>{role.title}</h3>
                  <p>{role.text}</p>
                </div>

                <div className="holistic-service-icon" aria-hidden="true">
                  <span
                    className="holistic-service-glyph"
                    style={{
                      WebkitMaskImage: `url(${healthIcon})`,
                      maskImage: `url(${healthIcon})`,
                    }}
                  />
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
