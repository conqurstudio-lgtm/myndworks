import aboutOffice from "../assets/optimized/about-office.webp";
import { Reveal } from "./ui";

export function About() {
  return (
    <section
      id="about"
      className="source-about-section about-clean"
    >
      <div className="about-clean-inner">

        <Reveal>
          <div className="section-eyebrow">
            Who we are
          </div>
        </Reveal>


        <div className="about-clean-grid">

          {/* =================================================
              LEFT — ABOUT INFORMATION
              ================================================= */}

          <Reveal className="about-clean-copy">

            <h2 className="about-clean-heading">
              A calmer way to
              <span> care for your mind</span>
            </h2>


            <p className="about-clean-description">
              MyndWorks is a mental wellbeing
              company that seeks to offer a
              multifaceted approach to dealing
              with mental health.{" "}

              <span>
                Established in 2022 to increase
                awareness of mental illnesses
                and promote mental health, we
                offer individual, family and
                couples therapy, in-person and
                virtual, as well as assessments
                and medico-legal assessments.
              </span>
            </p>


            <a
              href="#services"
              className="about-clean-cta"
            >
              <span>
                Explore our services
              </span>

              <span aria-hidden="true">
                →
              </span>
            </a>

          </Reveal>


          {/* =================================================
              RIGHT — MYNDWORKS OFFICE
              ================================================= */}

          <Reveal
            className="about-clean-visual"
            delay={120}
          >
            <img
              src={aboutOffice}
              alt="A calm MyndWorks therapy environment"
              className="about-clean-image"
            loading="lazy"
            decoding="async"
            />
          </Reveal>

        </div>

      </div>
    </section>
  );
}
