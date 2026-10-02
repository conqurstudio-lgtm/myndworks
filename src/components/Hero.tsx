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
              <h1 className="hero-heading">
                Feel better. Think clearer.
              </h1>

              <p className="hero-subheading">
                Mental wellness support that fits your life.
              </p>

              <a
                className="btn-hero-primary"
                href="#contact"
              >
                Book a session →
              </a>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
