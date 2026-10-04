import { useState } from "react";
import { Reveal } from "./ui";

const FAQS = [
  {
    q: "What can I expect on my first appointment?",
    a:
      "The first session aims to know more about the patient and their presenting problem. Unpacking one's life history takes time and it is an important part of the therapeutic process. These stories give insight into the relationships that the patient has and how they affect them. People must not expect that their problem will be fixed in one session, resolving years of trauma and depression takes time.",
  },
  {
    q: "Which other professions work with mental health?",
    a:
      "Occupational Therapists, Social workers, Speech Therapists, Audiologists, Dietitians, Physiotherapists and Medical Drs. Each of these practitioners plays an important role in providing holistic health and wellbeing, as some psychiatric conditions occur due to psychological, social, physical as well as spiritual factors.",
  },
  {
    q: "Do psychologists use the same treatment method?",
    a:
      "Therapy is set up on a case by case situation as people are uniquely different even if they are suffering from the same condition. People will also respond differently to similar situations. As a result, therapy is structured to fit the individual's challenges. Therapists also use different therapeutic modalities such as CBT, psychodynamic and solution focused, based on the therapist's interests and training.",
  },
];

export function Faq() {
  const [open, setOpen] =
    useState<number | null>(null);

  return (
    <section
      id="faq"
      className="source-faq-section"
    >
      <Reveal>
        <div className="source-faq-eyebrow">
          <span
            className="source-faq-star"
            aria-hidden="true"
          >
            ✳
          </span>

          <span>
            Frequently asked questions
          </span>

          <span
            className="source-faq-line"
            aria-hidden="true"
          />
        </div>
      </Reveal>

      <div className="source-faq-grid">
        <Reveal className="source-faq-intro">
          <h2 className="source-faq-heading">
            Good questions,{" "}
            <span>
              honest answers
            </span>
          </h2>

          <p className="source-faq-copy">
            Starting therapy can feel like a
            big step. Here's what people ask
            us most often.
          </p>
        </Reveal>

        <Reveal
          className="source-faq-list"
          delay={100}
        >
          {FAQS.map((faq, index) => {
            const isOpen =
              open === index;

            return (
              <div
                className={[
                  "source-faq-item",
                  isOpen
                    ? "is-open"
                    : "",
                ]
                  .filter(Boolean)
                  .join(" ")}
                key={faq.q}
              >
                <button
                  type="button"
                  className="source-faq-trigger"
                  onClick={() =>
                    setOpen(
                      isOpen
                        ? null
                        : index
                    )
                  }
                  aria-expanded={isOpen}
                  aria-controls={`faq-answer-${index}`}
                >
                  <span className="source-faq-question">
                    {faq.q}
                  </span>

                  <span
                    className="source-faq-plus"
                    aria-hidden="true"
                  >
                    {isOpen ? "×" : "+"}
                  </span>
                </button>

                <div
                  id={`faq-answer-${index}`}
                  className="source-faq-answer"
                  aria-hidden={!isOpen}
                >
                  <div className="source-faq-answer-inner">
                    <p>
                      {faq.a}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </Reveal>
      </div>
    </section>
  );
}
