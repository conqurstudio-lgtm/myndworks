import { Reveal } from "./ui";

export function Contact() {
  return (
    <section id="contact" className="contact-section">
      <Reveal>
        <div className="section-eyebrow">
          Book a session
        </div>
      </Reveal>

      <Reveal className="contact-panel" delay={80}>
        <div className="contact-main">
          <span className="contact-small">
            Ready when you are
          </span>

          <h2 className="contact-heading">
            The first step can be
            <span> a simple conversation</span>
          </h2>

          <p className="contact-copy">
            Whether you already know what kind of support
            you need or you're still figuring it out,
            you can start by getting in touch with MyndWorks.
          </p>

          <div className="contact-actions">
            <a
              className="contact-primary"
              href="tel:+27761228682"
            >
              Book a session →
            </a>

            <a
              className="contact-secondary"
              href={"mailto:" + "myndworkspractice@gmail.com"}
            >
              Email MyndWorks ↗
            </a>
          </div>
        </div>

        <div className="contact-details">
          <div className="contact-detail">
            <span className="contact-detail-label">
              Phone
            </span>

            <a href="tel:+27761228682">
              (076) 122-8682
            </a>
          </div>

          <div className="contact-detail">
            <span className="contact-detail-label">
              Email
            </span>

            <a href={"mailto:" + "myndworkspractice@gmail.com"}>
              myndworkspractice@gmail.com
            </a>

            <a href={"mailto:" + "sphe@myndworks.co.za"}>
              sphe@myndworks.co.za
            </a>
          </div>

          <div className="contact-detail">
            <span className="contact-detail-label">
              Instagram
            </span>

            <a
              href="https://instagram.com/myndworkspsychology"
              target="_blank"
              rel="noreferrer"
            >
              @myndworkspsychology
            </a>
          </div>

          <div className="contact-detail contact-detail-last">
            <span className="contact-detail-label">
              Sessions
            </span>

            <span className="contact-detail-value">
              In-person &amp; virtual
            </span>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
