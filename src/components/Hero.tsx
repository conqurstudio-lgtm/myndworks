import { Reveal } from "./ui";

export function Hero() {
  return (
    <section className="hero-outer" aria-label="Introduction">
      <div className="hero-canvas">
        <div className="hero-placeholder" aria-hidden="true" />
        <div className="hero-overlay" aria-hidden="true" />

        <div className="hero-word" aria-hidden="true">
          MyndWorks
        </div>

        <div className="hero-copy">
          <Reveal>
            <div className="hero-copy-left">
              <div className="hero-kicker">✳ Mental wellbeing company</div>
              <h1 className="hero-heading">
                A multifaceted approach
                <br />
                to your mental health
              </h1>
            </div>
          </Reveal>

          <Reveal className="hero-copy-right" delay={120}>
            <p className="hero-lede">
              Individual, family and couples therapy, assessments and
              medico-legal assessments, in-person and virtual.
            </p>
            <a className="btn-white" href="#contact">
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
