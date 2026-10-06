import {
  useEffect,
  useRef,
  useState,
} from "react";

import { Reveal } from "./ui";
import contactSessionImage from "../assets/optimized/contact-session.webp";


/* =========================================================
   CONTACT DETAILS
   ========================================================= */

const PHONE_DISPLAY = "(076) 122-8682";
const PHONE_URL = "tel:+27761228682";

const PRIMARY_EMAIL = "sphe@myndworks.co.za";

const PRIMARY_EMAIL_URL =
  "mailto:sphe@myndworks.co.za?subject=MyndWorks%20Session%20Enquiry&body=Hi%20MyndWorks%2C%0A%0AI%20would%20like%20to%20enquire%20about%20booking%20a%20session.%0A%0AThank%20you.";

const INSTAGRAM_URL =
  "https://instagram.com/myndworkspsychology";

const WHATSAPP_URL =
  "https://wa.me/27761228682?text=Hi%20MyndWorks%2C%20I%20would%20like%20to%20enquire%20about%20booking%20a%20session.";


/* =========================================================
   ICONS
   ========================================================= */

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
      <svg
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
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
      <svg
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <rect
          x="3"
          y="5"
          width="18"
          height="14"
          rx="2"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
        />

        <path
          d="m4 7 8 6 8-6"
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
      <svg
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <rect
          x="3"
          y="3"
          width="18"
          height="18"
          rx="5"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
        />

        <circle
          cx="12"
          cy="12"
          r="4"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
        />

        <circle
          cx="17.3"
          cy="6.7"
          r="1"
          fill="currentColor"
        />
      </svg>
    );
  }


  if (kind === "session") {
    return (
      <svg
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <rect
          x="4"
          y="5"
          width="16"
          height="15"
          rx="2.5"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.7"
        />

        <path
          d="M8 3.5v4M16 3.5v4M4 9h16"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinecap="round"
        />

        <path
          d="m9 14 2 2 4-4"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }


  if (kind === "whatsapp") {
    return (
      <svg
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
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
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
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


/* =========================================================
   SELF-CONTAINED CONTACT STYLES

   Unique class names are deliberate.
   They avoid the old .contact-grey-* rules.
   ========================================================= */

const contactStyles = String.raw`

/* =========================================================
   SECTION
   ========================================================= */

#contact.mw-contact-image-section {
  width: 100% !important;
  padding: 92px 0 68px !important;
  background: #fbfcfd !important;
  color: #111211 !important;
}


#contact .mw-contact-image-inner {
  width: calc(100% - 104px) !important;
  margin: 0 auto !important;
}


/* =========================================================
   SECTION LABEL
   ========================================================= */

#contact .mw-contact-image-eyebrow {
  width: 100% !important;
  display: flex !important;
  align-items: center !important;
  gap: 14px !important;
  margin: 0 0 36px !important;

  color: #737672 !important;

  font-size: 9px !important;
  font-weight: 500 !important;
  line-height: 1 !important;

  letter-spacing: .17em !important;
  text-transform: uppercase !important;
}


#contact .mw-contact-image-eyebrow-star {
  color: #00b9f3 !important;
}


#contact .mw-contact-image-eyebrow-line {
  height: 1px !important;
  flex: 1 !important;

  background:
    rgba(17,18,17,.09) !important;
}


/* =========================================================
   SPLIT CARD
   ========================================================= */

#contact .mw-contact-image-card {
  width: 100% !important;
  min-height: 410px !important;

  display: grid !important;

  grid-template-columns:
    minmax(0, .96fr)
    minmax(0, 1.04fr) !important;

  margin: 0 !important;
  padding: 0 !important;

  overflow: hidden !important;

  border-radius: 24px !important;
  border: 0 !important;

  background: #171a17 !important;

  box-shadow:
    0 18px 48px
    rgba(17,18,17,.06) !important;
}


/* =========================================================
   LEFT SIDE
   ========================================================= */

#contact .mw-contact-image-copy-side {
  min-width: 0 !important;
  min-height: 410px !important;

  display: flex !important;
  flex-direction: column !important;
  justify-content: center !important;

  padding:
    44px
    42px !important;

  background:
    #171a17 !important;
}


#contact .mw-contact-image-small {
  display: block !important;

  margin:
    0
    0
    28px !important;

  color:
    rgba(255,255,255,.43) !important;

  font-size:
    8px !important;

  font-weight:
    600 !important;

  line-height:
    1 !important;

  letter-spacing:
    .18em !important;

  text-transform:
    uppercase !important;
}


#contact .mw-contact-image-heading {
  max-width: 520px !important;

  margin: 0 !important;

  color:
    #ffffff !important;

  font-family:
    var(--font-display, inherit) !important;

  font-size:
    clamp(
      38px,
      3.2vw,
      54px
    ) !important;

  font-weight:
    400 !important;

  line-height:
    .98 !important;

  letter-spacing:
    -.045em !important;
}


#contact .mw-contact-image-heading span {
  display: block !important;

  color:
    rgba(255,255,255,.34) !important;
}


#contact .mw-contact-image-copy {
  max-width: 520px !important;

  margin:
    26px
    0
    0 !important;

  color:
    rgba(255,255,255,.61) !important;

  font-size:
    13px !important;

  line-height:
    1.63 !important;
}


/* =========================================================
   BUTTONS
   ========================================================= */

#contact .mw-contact-image-actions {
  display: flex !important;
  flex-wrap: wrap !important;
  gap: 10px !important;

  margin-top:
    28px !important;
}


#contact .mw-contact-image-primary,
#contact .mw-contact-image-secondary {
  min-height: 44px !important;

  display: inline-flex !important;

  align-items: center !important;
  justify-content: center !important;

  gap: 8px !important;

  padding:
    0
    18px !important;

  border-radius:
    999px !important;

  font-size:
    11px !important;

  font-weight:
    500 !important;

  line-height:
    1 !important;

  white-space:
    nowrap !important;

  cursor:
    pointer !important;

  text-decoration:
    none !important;

  transition:
    transform .22s ease,
    background-color .22s ease,
    border-color .22s ease !important;
}


#contact .mw-contact-image-primary {
  border:
    1px solid
    #00b9f3 !important;

  background:
    #00b9f3 !important;

  color:
    #ffffff !important;
}


#contact .mw-contact-image-secondary {
  border:
    1px solid
    rgba(255,255,255,.16) !important;

  background:
    transparent !important;

  color:
    rgba(255,255,255,.87) !important;
}


/* =========================================================
   RIGHT IMAGE
   ========================================================= */

#contact .mw-contact-image-photo-side {
  position: relative !important;

  min-width: 0 !important;
  min-height: 410px !important;

  overflow: hidden !important;

  background:
    #e9e6df !important;
}


#contact .mw-contact-image-photo {
  position: absolute !important;

  inset: 0 !important;

  width: 100% !important;
  height: 100% !important;

  display: block !important;

  object-fit: cover !important;

  object-position:
    center 38% !important;
}


/* =========================================================
   CONTACT INFORMATION BELOW CARD
   ========================================================= */

#contact .mw-contact-image-details {
  width: 100% !important;

  display: grid !important;

  grid-template-columns:
    repeat(
      4,
      minmax(0, 1fr)
    ) !important;

  margin-top:
    28px !important;

  padding:
    0
    18px !important;
}


#contact .mw-contact-image-detail {
  position: relative !important;

  min-width: 0 !important;
  min-height: 76px !important;

  display: flex !important;

  align-items: center !important;

  gap: 14px !important;

  padding:
    8px
    24px !important;

  color:
    #111211 !important;

  text-decoration:
    none !important;
}


#contact
.mw-contact-image-detail
+ .mw-contact-image-detail::before {
  content: "" !important;

  position: absolute !important;

  left: 0 !important;
  top: 13px !important;
  bottom: 13px !important;

  width: 1px !important;

  background:
    rgba(17,18,17,.075) !important;
}


/* =========================================================
   CONTACT ICON
   ========================================================= */

#contact .mw-contact-image-detail-icon {
  width: 44px !important;
  height: 44px !important;

  flex:
    0 0 44px !important;

  display: grid !important;

  place-items: center !important;

  border-radius:
    50% !important;

  background:
    #f1f3f4 !important;

  color:
    #252725 !important;
}


#contact
.mw-contact-image-detail-icon
svg {
  width: 18px !important;
  height: 18px !important;

  display: block !important;
}


/* =========================================================
   CONTACT TEXT
   ========================================================= */

#contact .mw-contact-image-detail-copy {
  min-width: 0 !important;

  display: flex !important;

  flex-direction: column !important;

  gap: 6px !important;
}


#contact .mw-contact-image-detail-label {
  color:
    #8d908c !important;

  font-size:
    8px !important;

  font-weight:
    600 !important;

  line-height:
    1 !important;

  letter-spacing:
    .17em !important;

  text-transform:
    uppercase !important;
}


#contact .mw-contact-image-detail-value {
  color:
    #222422 !important;

  font-size:
    13px !important;

  font-weight:
    500 !important;

  line-height:
    1.35 !important;

  overflow-wrap:
    anywhere !important;
}


/* =========================================================
   DESKTOP HOVER
   ========================================================= */

@media (
  hover: hover
) and (
  pointer: fine
) {

  #contact
  .mw-contact-image-primary:hover {
    background:
      #00a6dc !important;

    border-color:
      #00a6dc !important;

    transform:
      translateY(-1px) !important;
  }


  #contact
  .mw-contact-image-secondary:hover {
    background:
      rgba(255,255,255,.06) !important;

    border-color:
      rgba(255,255,255,.24) !important;

    transform:
      translateY(-1px) !important;
  }

}


/* =========================================================
   TABLET
   ========================================================= */

@media (
  min-width: 700px
) and (
  max-width: 1023px
) {

  #contact.mw-contact-image-section {
    padding:
      80px
      0
      60px !important;
  }


  #contact .mw-contact-image-inner {
    width:
      calc(100% - 64px) !important;
  }


  #contact .mw-contact-image-card {
    grid-template-columns:
      minmax(0, 1.04fr)
      minmax(0, .96fr) !important;
  }


  #contact .mw-contact-image-copy-side,
  #contact .mw-contact-image-photo-side {
    min-height:
      370px !important;
  }


  #contact .mw-contact-image-copy-side {
    padding:
      36px
      30px !important;
  }


  #contact .mw-contact-image-details {
    grid-template-columns:
      repeat(
        2,
        minmax(0, 1fr)
      ) !important;

    padding:
      0 !important;
  }


  #contact
  .mw-contact-image-detail:nth-child(3),
  #contact
  .mw-contact-image-detail:nth-child(4) {
    border-top:
      1px solid
      rgba(17,18,17,.07) !important;
  }


  #contact
  .mw-contact-image-detail:nth-child(3)::before {
    display:
      none !important;
  }

}


/* =========================================================
   MOBILE
   ========================================================= */

@media (
  max-width: 699px
) {

  #contact.mw-contact-image-section {
    padding:
      68px
      20px
      50px !important;
  }


  #contact .mw-contact-image-inner {
    width:
      100% !important;

    margin:
      0 !important;
  }


  #contact .mw-contact-image-card {
    grid-template-columns:
      1fr !important;

    border-radius:
      22px !important;
  }


  #contact .mw-contact-image-copy-side {
    min-height:
      auto !important;

    padding:
      34px
      24px
      38px !important;
  }


  #contact .mw-contact-image-heading {
    max-width:
      340px !important;

    font-size:
      clamp(
        35px,
        10vw,
        40px
      ) !important;
  }


  #contact .mw-contact-image-photo-side {
    min-height:
      340px !important;
  }


  #contact .mw-contact-image-details {
    grid-template-columns:
      1fr !important;

    margin-top:
      22px !important;

    padding:
      0 !important;
  }


  #contact .mw-contact-image-detail {
    min-height:
      70px !important;

    padding:
      12px
      2px !important;

    border-top:
      1px solid
      rgba(17,18,17,.07) !important;
  }


  #contact
  .mw-contact-image-detail:first-child {
    border-top:
      0 !important;
  }


  #contact
  .mw-contact-image-detail::before {
    display:
      none !important;
  }

}


/* =========================================================
   SMALL MOBILE
   ========================================================= */

@media (
  max-width: 390px
) {

  #contact .mw-contact-image-actions {
    flex-direction:
      column !important;

    align-items:
      stretch !important;
  }


  #contact .mw-contact-image-primary,
  #contact .mw-contact-image-secondary {
    width:
      100% !important;
  }


  #contact .mw-contact-image-photo-side {
    min-height:
      290px !important;
  }

}


/* =========================================================
   MODAL
   ========================================================= */

body.mw-contact-image-modal-open {
  overflow:
    hidden !important;
}


.mw-contact-image-modal-backdrop {
  position:
    fixed !important;

  inset:
    0 !important;

  z-index:
    9999 !important;

  display:
    grid !important;

  place-items:
    center !important;

  padding:
    24px !important;

  background:
    rgba(17,18,17,.44) !important;

  backdrop-filter:
    blur(10px) !important;

  -webkit-backdrop-filter:
    blur(10px) !important;
}


.mw-contact-image-modal {
  width:
    min(
      100%,
      560px
    ) !important;

  max-height:
    calc(100vh - 48px) !important;

  overflow-y:
    auto !important;

  padding:
    30px !important;

  border:
    1px solid
    rgba(255,255,255,.72) !important;

  border-radius:
    26px !important;

  background:
    rgba(248,250,251,.96) !important;

  box-shadow:
    0 24px 70px
    rgba(17,18,17,.18) !important;

  backdrop-filter:
    blur(30px)
    saturate(135%) !important;
}


.mw-contact-image-modal-top {
  display:
    flex !important;

  align-items:
    flex-start !important;

  justify-content:
    space-between !important;

  gap:
    24px !important;
}


.mw-contact-image-modal-eyebrow {
  display:
    block !important;

  margin-bottom:
    15px !important;

  color:
    #858884 !important;

  font-size:
    9px !important;

  font-weight:
    600 !important;

  letter-spacing:
    .16em !important;

  text-transform:
    uppercase !important;
}


.mw-contact-image-modal-title {
  max-width:
    390px !important;

  margin:
    0 !important;

  color:
    #111211 !important;

  font-family:
    var(--font-display, inherit) !important;

  font-size:
    35px !important;

  font-weight:
    400 !important;

  line-height:
    1.02 !important;

  letter-spacing:
    -.04em !important;
}


.mw-contact-image-modal-copy {
  margin:
    15px
    0
    0 !important;

  color:
    #767a76 !important;

  font-size:
    13px !important;

  line-height:
    1.6 !important;
}


.mw-contact-image-modal-close {
  width:
    40px !important;

  height:
    40px !important;

  flex:
    0
    0
    40px !important;

  display:
    grid !important;

  place-items:
    center !important;

  padding:
    0 !important;

  border:
    0 !important;

  border-radius:
    50% !important;

  background:
    #ffffff !important;

  color:
    #111211 !important;

  font-size:
    20px !important;

  cursor:
    pointer !important;
}


.mw-contact-image-modal-options {
  display:
    grid !important;

  gap:
    10px !important;

  margin-top:
    28px !important;
}


.mw-contact-image-modal-option {
  min-height:
    74px !important;

  display:
    grid !important;

  grid-template-columns:
    46px
    minmax(0,1fr)
    26px !important;

  align-items:
    center !important;

  gap:
    14px !important;

  padding:
    12px
    14px !important;

  border:
    1px solid
    rgba(17,18,17,.07) !important;

  border-radius:
    18px !important;

  background:
    #ffffff !important;

  color:
    #111211 !important;

  text-decoration:
    none !important;
}


.mw-contact-image-modal-option-icon {
  width:
    46px !important;

  height:
    46px !important;

  display:
    grid !important;

  place-items:
    center !important;

  border-radius:
    14px !important;

  background:
    #e7f7fd !important;

  color:
    #00aee8 !important;
}


.mw-contact-image-modal-option-icon svg {
  width:
    19px !important;

  height:
    19px !important;
}


.mw-contact-image-modal-option-copy {
  display:
    flex !important;

  flex-direction:
    column !important;

  gap:
    5px !important;
}


.mw-contact-image-modal-option-copy strong {
  color:
    #111211 !important;

  font-size:
    14px !important;

  font-weight:
    500 !important;
}


.mw-contact-image-modal-option-copy span {
  color:
    #848783 !important;

  font-size:
    12px !important;
}


.mw-contact-image-modal-option-arrow svg {
  width:
    17px !important;

  height:
    17px !important;
}


.mw-contact-image-modal-footer {
  margin-top:
    22px !important;

  padding-top:
    20px !important;

  border-top:
    1px solid
    rgba(17,18,17,.08) !important;

  color:
    #858884 !important;

  font-size:
    11px !important;
}


.mw-contact-image-modal-footer a {
  color:
    #111211 !important;

  text-decoration:
    none !important;
}

`;


/* =========================================================
   COMPONENT
   ========================================================= */

export function Contact() {

  const [
    isConnectOpen,
    setIsConnectOpen,
  ] = useState(false);


  const closeRef =
    useRef<HTMLButtonElement>(null);


  useEffect(() => {

    if (!isConnectOpen) {
      return;
    }


    document.body.classList.add(
      "mw-contact-image-modal-open"
    );


    const previouslyFocused =
      document.activeElement;


    window.setTimeout(() => {
      closeRef.current?.focus();
    }, 0);


    const handleKeyDown = (
      event: KeyboardEvent
    ) => {

      if (event.key === "Escape") {
        setIsConnectOpen(false);
      }

    };


    document.addEventListener(
      "keydown",
      handleKeyDown
    );


    return () => {

      document.body.classList.remove(
        "mw-contact-image-modal-open"
      );


      document.removeEventListener(
        "keydown",
        handleKeyDown
      );


      if (
        previouslyFocused instanceof
        HTMLElement
      ) {

        window.setTimeout(() => {
          previouslyFocused.focus();
        }, 0);

      }

    };

  }, [isConnectOpen]);


  return (
    <>

      <section
        id="contact"
        className="mw-contact-image-section"
      >

        <div className="mw-contact-image-inner">

          {/* ===============================================
              LABEL
              =============================================== */}

          <Reveal>

            <div className="mw-contact-image-eyebrow">

              <span
                className="mw-contact-image-eyebrow-star"
                aria-hidden="true"
              >
                ✳
              </span>

              <span>
                Book a session
              </span>

              <span
                className="mw-contact-image-eyebrow-line"
                aria-hidden="true"
              />

            </div>

          </Reveal>


          {/* ===============================================
              MAIN CARD
              =============================================== */}

          <Reveal
            className="mw-contact-image-card"
            delay={80}
          >

            {/* LEFT */}

            <div className="mw-contact-image-copy-side">

              <span className="mw-contact-image-small">
                Ready when you are
              </span>


              <h2 className="mw-contact-image-heading">
                Ready to take the
                <span>
                  first step?
                </span>
              </h2>


              <p className="mw-contact-image-copy">
                Reach out to book a session,
                in-person or virtual, or to ask
                about assessments. If you're still
                deciding what kind of support you
                need, we'll help guide you in the
                right direction.
              </p>


              <div className="mw-contact-image-actions">

                <button
                  type="button"
                  className="mw-contact-image-primary"
                  onClick={() =>
                    setIsConnectOpen(true)
                  }
                >
                  Book a session
                  <span aria-hidden="true">
                    →
                  </span>
                </button>



              </div>

            </div>


            {/* RIGHT IMAGE */}

            <div className="mw-contact-image-photo-side">

              <img
                className="mw-contact-image-photo"
                src={contactSessionImage}
                alt="A therapist speaking with a client during a supportive session"
              loading="lazy"
              decoding="async"
              />

            </div>

          </Reveal>


          {/* ===============================================
              CONTACT STRIP
              =============================================== */}

          <Reveal
            className="mw-contact-image-details"
            delay={140}
          >

            {/* PHONE */}

            <a
              className="mw-contact-image-detail"
              href={PHONE_URL}
            >

              <span className="mw-contact-image-detail-icon">
                <ContactIcon kind="phone" />
              </span>


              <span className="mw-contact-image-detail-copy">

                <span className="mw-contact-image-detail-label">
                  Phone
                </span>

                <span className="mw-contact-image-detail-value">
                  {PHONE_DISPLAY}
                </span>

              </span>

            </a>


            {/* EMAIL */}

            <a
              className="mw-contact-image-detail"
              href={PRIMARY_EMAIL_URL}
            >

              <span className="mw-contact-image-detail-icon">
                <ContactIcon kind="mail" />
              </span>


              <span className="mw-contact-image-detail-copy">

                <span className="mw-contact-image-detail-label">
                  Email
                </span>

                <span className="mw-contact-image-detail-value">
                  {PRIMARY_EMAIL}
                </span>

              </span>

            </a>


            {/* AVAILABILITY */}

            <div className="mw-contact-image-detail">

              <span className="mw-contact-image-detail-icon">
                <ContactIcon kind="session" />
              </span>


              <span className="mw-contact-image-detail-copy">

                <span className="mw-contact-image-detail-label">
                  Available
                </span>

                <span className="mw-contact-image-detail-value">
                  In-person &amp; virtual
                </span>

              </span>

            </div>


            {/* INSTAGRAM */}

            <a
              className="mw-contact-image-detail"
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noreferrer"
            >

              <span className="mw-contact-image-detail-icon">
                <ContactIcon kind="instagram" />
              </span>


              <span className="mw-contact-image-detail-copy">

                <span className="mw-contact-image-detail-label">
                  Instagram
                </span>

                <span className="mw-contact-image-detail-value">
                  @myndworkspsychology
                </span>

              </span>

            </a>

          </Reveal>

        </div>

      </section>


      {/* ===================================================
          BOOKING OPTIONS MODAL
          =================================================== */}

      {isConnectOpen && (

        <div
          className="mw-contact-image-modal-backdrop"
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
            className="mw-contact-image-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="mw-contact-modal-title"
          >

            <div className="mw-contact-image-modal-top">

              <div>

                <span className="mw-contact-image-modal-eyebrow">
                  Get in touch
                </span>


                <h3
                  id="mw-contact-modal-title"
                  className="mw-contact-image-modal-title"
                >
                  How would you like to connect?
                </h3>


                <p className="mw-contact-image-modal-copy">
                  Choose the option that feels
                  most convenient.
                </p>

              </div>


              <button
                ref={closeRef}
                type="button"
                className="mw-contact-image-modal-close"
                onClick={() =>
                  setIsConnectOpen(false)
                }
                aria-label="Close contact options"
              >
                ×
              </button>

            </div>


            <div className="mw-contact-image-modal-options">

              {/* WHATSAPP */}

              <a
                className="mw-contact-image-modal-option"
                href={WHATSAPP_URL}
                target="_blank"
                rel="noreferrer"
              >

                <span className="mw-contact-image-modal-option-icon">
                  <ContactIcon kind="whatsapp" />
                </span>


                <span className="mw-contact-image-modal-option-copy">

                  <strong>
                    WhatsApp
                  </strong>

                  <span>
                    Send MyndWorks a message
                  </span>

                </span>


                <span className="mw-contact-image-modal-option-arrow">
                  <ContactIcon kind="arrow" />
                </span>

              </a>


              {/* PHONE */}

              <a
                className="mw-contact-image-modal-option"
                href={PHONE_URL}
              >

                <span className="mw-contact-image-modal-option-icon">
                  <ContactIcon kind="phone" />
                </span>


                <span className="mw-contact-image-modal-option-copy">

                  <strong>
                    Phone
                  </strong>

                  <span>
                    Call {PHONE_DISPLAY}
                  </span>

                </span>


                <span className="mw-contact-image-modal-option-arrow">
                  <ContactIcon kind="arrow" />
                </span>

              </a>


              {/* EMAIL */}

              <a
                className="mw-contact-image-modal-option"
                href={PRIMARY_EMAIL_URL}
              >

                <span className="mw-contact-image-modal-option-icon">
                  <ContactIcon kind="mail" />
                </span>


                <span className="mw-contact-image-modal-option-copy">

                  <strong>
                    Email
                  </strong>

                  <span>
                    Send a booking enquiry
                  </span>

                </span>


                <span className="mw-contact-image-modal-option-arrow">
                  <ContactIcon kind="arrow" />
                </span>

              </a>

            </div>


            <div className="mw-contact-image-modal-footer">

              You can also email{" "}

              <a href={PRIMARY_EMAIL_URL}>
                {PRIMARY_EMAIL}
              </a>{" "}

              directly.

            </div>

          </div>

        </div>

      )}


      {/* ===================================================
          STYLES
          =================================================== */}

      <style>
        {contactStyles}
      </style>

    </>
  );
}
