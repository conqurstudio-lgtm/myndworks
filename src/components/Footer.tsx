import myndworksMark from "../assets/myndworks-mark.svg";

const YEAR = new Date().getFullYear();

function FooterIcon({
  type,
}: {
  type: "phone" | "email" | "instagram";
}) {
  if (type === "phone") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M6.6 3.5 9 3a1.5 1.5 0 0 1 1.7.9l1.1 2.8a1.5 1.5 0 0 1-.4 1.7L9.8 9.9a13.2 13.2 0 0 0 4.3 4.3l1.5-1.6a1.5 1.5 0 0 1 1.7-.4l2.8 1.1A1.5 1.5 0 0 1 21 15l-.5 2.4a2.5 2.5 0 0 1-2.5 2C10.6 19.4 4.6 13.4 4.6 6A2.5 2.5 0 0 1 6.6 3.5Z" />
      </svg>
    );
  }

  if (type === "email") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <rect x="3" y="5" width="18" height="14" rx="2" />
        <path d="m4 7 8 6 8-6" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r=".8" className="icon-fill" />
    </svg>
  );
}

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-top">
        <div className="footer-brand-column">
          <a
            className="footer-brand"
            href="#top"
            aria-label="MyndWorks home"
          >
            <span className="footer-brand-mark">
              <img
                src={myndworksMark}
                alt=""
              />
            </span>

            <span>MyndWorks</span>
          </a>

          <p className="footer-intro">
            Mental wellness support for individuals,
            couples, families and organisations —
            in-person and virtual.
          </p>
        </div>

        <div className="footer-links-column">
          <span className="footer-label">
            Explore
          </span>

          <nav
            className="footer-links"
            aria-label="Footer navigation"
          >
            <a href="#about">About</a>
            <a href="#services">Services</a>
            <a href="#first-visit">Your first visit</a>
            <a href="#stories">Stories</a>
            <a href="#faq">FAQ</a>
          </nav>
        </div>

        <div className="footer-links-column">
          <span className="footer-label">
            Contact
          </span>

          <div className="footer-links footer-contact-links">
            <a href="tel:+27761228682">
              <span className="footer-mini-icon">
                <FooterIcon type="phone" />
              </span>
              <span>(076) 122-8682</span>
            </a>

            <a href={"mailto:" + "sphe@myndworks.co.za"}>
              <span className="footer-mini-icon">
                <FooterIcon type="email" />
              </span>
              <span>sphe@myndworks.co.za</span>
            </a>
          </div>
        </div>

        <div className="footer-links-column">
          <span className="footer-label">
            Follow
          </span>

          <div className="footer-links footer-contact-links">
            <a
              href="https://instagram.com/myndworkspsychology"
              target="_blank"
              rel="noreferrer"
            >
              <span className="footer-mini-icon">
                <FooterIcon type="instagram" />
              </span>
              <span>Instagram ↗</span>
            </a>

            <a href="#contact">
              <span>Book a session →</span>
            </a>
          </div>
        </div>
      </div>

      <div className="footer-meta">
        <p>
          © {YEAR} MyndWorks. All rights reserved.
        </p>

        <p>
          Mental wellbeing, approached with care.
        </p>
      </div>
    </footer>
  );
}
