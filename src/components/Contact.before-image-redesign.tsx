import { useEffect, useState } from "react";
import { Reveal } from "./ui";

const PHONE_DISPLAY = "(076) 122-8682";
const PHONE_URL = "tel:+27761228682";

const PRIMARY_EMAIL = "sphe@myndworks.co.za";

const PRIMARY_EMAIL_URL =
  "mailto:sphe@myndworks.co.za?subject=MyndWorks%20Session%20Enquiry&body=Hi%20MyndWorks%2C%0A%0AI%20would%20like%20to%20enquire%20about%20booking%20a%20session.%0A%0AThank%20you.";


const INSTAGRAM_URL =
  "https://instagram.com/myndworkspsychology";

const WHATSAPP_URL =
  "https://wa.me/27761228682?text=Hi%20MyndWorks%2C%20I%20would%20like%20to%20enquire%20about%20booking%20a%20session.";

type IconKind =
  | "phone"
  | "mail"
  | "instagram"
  | "session"
  | "whatsapp"
  | "arrow";

function ContactIcon({
  kind,
}: {
  kind: IconKind;
}) {
  if (kind === "phone") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path
          d="M6.6 10.8c1.6 3.1 3.5 5 6.6 6.6l2.2-2.2c.3-.3.7-.4 1.1-.3 1.2.4 2.4.6 3.7.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1C10.6 21 3 13.4 3 4c0-.6.4-1 1-1h3.4c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.7.1.4 0 .8-.3 1.1l-2.1 2Z"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }

  if (kind === "mail") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path
          d="M4 6h16a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1Z"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
        />

        <path
          d="m4 8 8 6 8-6"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }

  if (kind === "instagram") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <rect
          x="4"
          y="4"
          width="16"
          height="16"
          rx="4"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
        />

        <circle
          cx="12"
          cy="12"
          r="3.5"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
        />

        <circle
          cx="17.2"
          cy="6.8"
          r="1"
          fill="currentColor"
        />
      </svg>
    );
  }

  if (kind === "session") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <circle
          cx="12"
          cy="12"
          r="8.5"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
        />

        <path
          d="M12 7.5V12l3 1.8"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }

  if (kind === "whatsapp") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path
          d="M20 11.7A8 8 0 0 1 8.5 18.9L4 20l1.2-4.3A8 8 0 1 1 20 11.7Z"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        <path
          d="M9.2 8.7c-.2-.4-.5-.4-.7-.4h-.6c-.2 0-.5.1-.7.3-.2.2-.8.8-.8 1.9s.8 2.2.9 2.3c.1.2 1.6 2.6 4 3.5 2 .8 2.4.7 2.8.6.4-.1 1.3-.6 1.4-1.2.2-.6.2-1 .1-1.1-.1-.1-.3-.2-.7-.4s-1.3-.7-1.5-.8c-.2-.1-.4-.1-.6.1-.2.2-.7.8-.8.9-.2.2-.3.2-.6.1-.3-.2-1.1-.4-2.1-1.3-.8-.7-1.3-1.5-1.5-1.7-.2-.3 0-.4.1-.6l.3-.3c.1-.1.2-.3.3-.4.1-.2.1-.4 0-.6-.1-.2-.6-1.5-.8-1.9Z"
          fill="currentColor"
        />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M7 17 17 7M9 7h8v8"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function Contact() {
  const [isConnectOpen, setIsConnectOpen] =
    useState(false);

  useEffect(() => {
    if (!isConnectOpen) return;

    const handleKeyDown = (
      event: KeyboardEvent
    ) => {
      if (event.key === "Escape") {
        setIsConnectOpen(false);
      }
    };

    document.body.classList.add(
      "contact-modal-open"
    );

    document.addEventListener(
      "keydown",
      handleKeyDown
    );

    return () => {
      document.body.classList.remove(
        "contact-modal-open"
      );

      document.removeEventListener(
        "keydown",
        handleKeyDown
      );
    };
  }, [isConnectOpen]);

  return (
    <>
      <section
        id="contact"
        className="contact-section contact-grey-section"
      >
        <Reveal>
          <div className="section-eyebrow">
            Book a session
          </div>
        </Reveal>

        <Reveal
          className="contact-grey-card"
          delay={80}
        >
          <div className="contact-grey-main">
            <span className="contact-grey-small">
              Ready when you are
            </span>

            <h2 className="contact-grey-heading">
              Ready to take the
              <span> first step?</span>
            </h2>

            <p className="contact-grey-copy">
              Reach out to book a session,
              in-person or virtual, or to ask
              about assessments. If you're
              still deciding what kind of
              support you need, we'll help
              guide you in the right
              direction.
            </p>

            <div className="contact-grey-actions">
              <button
                type="button"
                className="contact-grey-primary"
                onClick={() =>
                  setIsConnectOpen(true)
                }
              >
                Book a session →
              </button>

              <a
                className="contact-grey-secondary"
                href={PRIMARY_EMAIL_URL}
              >
                Email MyndWorks ↗
              </a>
            </div>
          </div>

          <div className="contact-grey-details">
            <div className="contact-grey-row">
              <div className="contact-grey-icon">
                <ContactIcon kind="phone" />
              </div>

              <div className="contact-grey-value">
                <a href={PHONE_URL}>
                  {PHONE_DISPLAY}
                </a>
              </div>
            </div>

            <div className="contact-grey-row">
              <div className="contact-grey-icon">
                <ContactIcon kind="mail" />
              </div>

              <div className="contact-grey-value contact-grey-emails">

                <a href={PRIMARY_EMAIL_URL}>
                  {PRIMARY_EMAIL}
                </a>
              </div>
            </div>

            <div className="contact-grey-row">
              <div className="contact-grey-icon">
                <ContactIcon kind="session" />
              </div>

              <div className="contact-grey-value">
                <span>
                  In-person &amp; virtual
                </span>
              </div>
            </div>

            <div className="contact-grey-row contact-grey-row-last">
              <div className="contact-grey-icon">
                <ContactIcon kind="instagram" />
              </div>

              <div className="contact-grey-value">
                <a
                  href={INSTAGRAM_URL}
                  target="_blank"
                  rel="noreferrer"
                >
                  @myndworkspsychology
                </a>
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      {isConnectOpen && (
        <div
          className="contact-modal-backdrop"
          role="presentation"
          onMouseDown={(event) => {
            if (
              event.currentTarget ===
              event.target
            ) {
              setIsConnectOpen(false);
            }
          }}
        >
          <div
            className="contact-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="contact-modal-title"
          >
            <div className="contact-modal-top">
              <div>
                <span className="contact-modal-eyebrow">
                  Get in touch
                </span>

                <h3
                  id="contact-modal-title"
                  className="contact-modal-title"
                >
                  How would you like to
                  connect?
                </h3>

                <p className="contact-modal-copy">
                  Choose the option that
                  feels most convenient.
                </p>
              </div>

              <button
                type="button"
                className="contact-modal-close"
                onClick={() =>
                  setIsConnectOpen(false)
                }
                aria-label="Close contact options"
              >
                ×
              </button>
            </div>

            <div className="contact-modal-options">
              <a
                className="contact-modal-option"
                href={WHATSAPP_URL}
                target="_blank"
                rel="noreferrer"
              >
                <div className="contact-modal-option-icon">
                  <ContactIcon kind="whatsapp" />
                </div>

                <div className="contact-modal-option-copy">
                  <strong>
                    WhatsApp
                  </strong>

                  <span>
                    Send MyndWorks a message
                  </span>
                </div>

                <div className="contact-modal-option-arrow">
                  <ContactIcon kind="arrow" />
                </div>
              </a>

              <a
                className="contact-modal-option"
                href={PHONE_URL}
              >
                <div className="contact-modal-option-icon">
                  <ContactIcon kind="phone" />
                </div>

                <div className="contact-modal-option-copy">
                  <strong>
                    Phone
                  </strong>

                  <span>
                    Call {PHONE_DISPLAY}
                  </span>
                </div>

                <div className="contact-modal-option-arrow">
                  <ContactIcon kind="arrow" />
                </div>
              </a>

              <a
                className="contact-modal-option"
                href={PRIMARY_EMAIL_URL}
              >
                <div className="contact-modal-option-icon">
                  <ContactIcon kind="mail" />
                </div>

                <div className="contact-modal-option-copy">
                  <strong>
                    Email
                  </strong>

                  <span>
                    Send a booking enquiry
                  </span>
                </div>

                <div className="contact-modal-option-arrow">
                  <ContactIcon kind="arrow" />
                </div>
              </a>
            </div>

            <div className="contact-modal-footer">
              You can also email{" "}
              <a href={PRIMARY_EMAIL_URL}>
                {PRIMARY_EMAIL}
              </a>{" "}
              directly.
            </div>
          </div>
        </div>
      )}
    </>
  );
}
