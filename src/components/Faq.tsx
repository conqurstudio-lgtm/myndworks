import { useState } from "react";
import { Reveal } from "./ui";

const FAQS = [
  {
    question: "What can I expect on my first appointment?",
    answer:
      "The first session aims to know more about you and the problem that brings you to therapy. Unpacking your life history takes time and forms an important part of the therapeutic process. These stories can offer insight into your relationships and how they affect you. It is also important to remember that meaningful change does not happen in a single session — working through long-standing trauma, depression or other challenges takes time.",
  },
  {
    question: "Which other professions work with mental health?",
    answer:
      "Mental wellbeing may involve support from Occupational Therapists, Social Workers, Speech Therapists, Audiologists, Dietitians, Physiotherapists and Medical Doctors. Each profession can play an important role in holistic health and wellbeing because psychological, social, physical and other factors may all influence mental health.",
  },
  {
    question: "Do psychologists use the same treatment method?",
    answer:
      "Therapy is structured case by case because every person is different, even when people are experiencing similar conditions. A therapist may draw on different therapeutic approaches such as CBT, psychodynamic therapy and solution-focused therapy, depending on the person's needs as well as the therapist's training and areas of practice.",
  },
] as const;

export function Faq() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="faq" className="faq-section">
      <Reveal>
        <div className="section-eyebrow">
          Frequently asked questions
        </div>
      </Reveal>

      <div className="faq-grid">
        <Reveal className="faq-intro">
          <h2 className="faq-heading">
            Good questions,
            <span> honest answers</span>
          </h2>

          <p className="faq-lede">
            Starting therapy can feel like a big step.
            Here are some of the questions people commonly
            have before beginning.
          </p>

          <a
            className="faq-contact-link"
            href="#contact"
          >
            <span>Still have a question?</span>
            <span
              className="faq-contact-icon"
              aria-hidden="true"
            >
              ↗
            </span>
          </a>
        </Reveal>

        <Reveal
          className="faq-list"
          delay={120}
        >
          {FAQS.map((item, index) => {
            const isOpen = open === index;

            return (
              <article
                className={
                  isOpen
                    ? "faq-item is-open"
                    : "faq-item"
                }
                key={item.question}
              >
                <button
                  type="button"
                  className="faq-question"
                  aria-expanded={isOpen}
                  onClick={() =>
                    setOpen(isOpen ? null : index)
                  }
                >
                  <span>
                    {item.question}
                  </span>

                  <span
                    className="faq-toggle"
                    aria-hidden="true"
                  >
                    +
                  </span>
                </button>

                <div className="faq-answer-wrap">
                  <div className="faq-answer-inner">
                    <p>
                      {item.answer}
                    </p>
                  </div>
                </div>
              </article>
            );
          })}
        </Reveal>
      </div>
    </section>
  );
}
