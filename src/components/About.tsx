import aboutHands from "../assets/about-hands.png";
import aboutOffice from "../assets/about-office.png";
import { Reveal } from "./ui";

export function About() {
  return (
    <section id="about" className="about-section">
      <Reveal>
        <div className="section-eyebrow">
          Who we are
        </div>
      </Reveal>

      <div className="about-grid">
        <Reveal className="about-column-left">
          <h2 className="about-heading">
            A calmer way to
            <span> care for your mind</span>
          </h2>

          <div className="about-image-wrap about-image-small">
            <img
              className="about-image-media about-image-hands"
              src={aboutHands}
              alt="A group of hands joined together in support"
            />

            <div className="about-stat about-stat-year">
              <strong>2022</strong>
              <span>Year established</span>
            </div>
          </div>
        </Reveal>

        <Reveal
          className="about-copy"
          delay={120}
        >
          <p>
            MyndWorks is a mental wellbeing company that seeks to offer a
            multifaceted approach to dealing with mental health.
            <span>
              {" "}
              Established in 2022 to increase awareness of mental illnesses and
              promote mental health, we offer individual, family and couples
              therapy, in-person and virtual, as well as assessments and
              medico-legal assessments.
            </span>
          </p>

          <a
            className="about-button"
            href="#services"
          >
            Explore our services →
          </a>
        </Reveal>

        <Reveal
          className="about-column-right"
          delay={240}
        >
          <div className="about-image-wrap about-image-large">
            <img
              className="about-image-media about-image-office"
              src={aboutOffice}
              alt="The MyndWorks office and consultation environment"
            />

            <div className="about-stat about-stat-session">
              <strong>In-person + virtual</strong>
              <span>Sessions that fit your life</span>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
