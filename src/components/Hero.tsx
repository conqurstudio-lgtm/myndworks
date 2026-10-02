import myndworksHero from "../assets/myndworks-hero.png";
import { Reveal } from "./ui";

export function Hero() {
  return (
    <section
      className="hero-outer"
      aria-label="Introduction"
    >
      <div className="hero-canvas">
        <img
          className="hero-image"
          src={myndworksHero}
          alt="A therapist speaking with a client in a calm wellness setting"
        />

        <div
          className="hero-overlay"
          aria-hidden="true"
        />

        <div className="hero-copy">
          <Reveal>
            <div className="hero-copy-left">
              <div className="hero-kicker">
                <span className="hero-kicker-star" aria-hidden="true">✳</span>
                <span>Mental wellbeing company</span>
              </div>

              <h1 className="hero-heading">
                Feel better. Think clearer.
              </h1>

              <p className="hero-subheading">
                Mental wellness support that fits your life.
              </p>
            </div>
          </Reveal>

          <Reveal
            className="hero-copy-right"
            delay={120}
          >
            <p className="hero-lede">
              Individual, family and couples therapy,
              assessments and medico-legal assessments,
              in-person and virtual.
            </p>

            <a
              className="btn-white"
              href="#contact"
            >
              Start your journey →
            </a>
          </Reveal>
        </div>

        <div className="hero-meta">
          <span>In-person &amp; virtual</span>
          <span>Established 2022</span>
        </div>
      </div>
    </section>
  );
}
