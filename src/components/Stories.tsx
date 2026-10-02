import { useState } from "react";
import { Reveal } from "./ui";

const STORIES = [
  {
    name: "Thandiwe M",
    text: "MyndWorks has been a beacon of support on my mental health journey. The individual therapy sessions provided a safe space for self-reflection, and the virtual option made it incredibly convenient. The holistic approach, including family and couples therapy, truly sets them apart.",
  },
  {
    name: "Jabulani S",
    text: "As someone who values both traditional and virtual options, MyndWorks exceeded my expectations. The in-person sessions felt warm and comforting, while virtual assessments provided a flexible solution for my busy schedule.",
  },
  {
    name: "Kira Brooks",
    text: "The comprehensive approach, including medico-legal assessments, shows their commitment to addressing mental health from all angles. The therapists are not only highly skilled but also compassionate.",
  },
  {
    name: "John D",
    text: "MyndWorks has been instrumental in fostering positive change in my life. The availability of both in-person and virtual sessions made it easy to prioritise my wellbeing.",
  },
  {
    name: "Lerato M",
    text: "The family and couples therapy sessions have strengthened my relationships, and the convenience of virtual sessions has made therapy accessible.",
  },
] as const;

export function Stories() {
  const [active, setActive] = useState(0);

  const story = STORIES[active];

  const previous = () => {
    setActive((current) =>
      current === 0 ? STORIES.length - 1 : current - 1
    );
  };

  const next = () => {
    setActive((current) =>
      current === STORIES.length - 1 ? 0 : current + 1
    );
  };

  return (
    <section id="stories" className="stories-section">
      <Reveal>
        <div className="section-eyebrow">
          Stories
        </div>
      </Reveal>

      <div className="stories-grid">
        <Reveal className="stories-intro">
          <div>
            <h2 className="stories-heading">
              What our
              <span> clients say</span>
            </h2>
          </div>

          <div className="stories-controls stories-controls-desktop">
            <button
              type="button"
              className="story-arrow"
              onClick={previous}
              aria-label="Previous story"
            >
              ←
            </button>

            <button
              type="button"
              className="story-arrow story-arrow-next"
              onClick={next}
              aria-label="Next story"
            >
              →
            </button>
          </div>
        </Reveal>

        <Reveal delay={120}>
          <article className="story-card">
            <div
              className="story-quote-mark"
              aria-hidden="true"
            >
              “
            </div>

            <p
              key={active}
              className="story-quote story-change"
            >
              {story.text}
            </p>

            <div className="story-footer">
              <div className="story-person">
                <span className="story-avatar">
                  {story.name.charAt(0)}
                </span>

                <div>
                  <strong>
                    {story.name}
                  </strong>

                  <span>
                    MyndWorks client
                  </span>
                </div>
              </div>

              <div
                className="story-progress"
                aria-label="Story navigation"
              >
                {STORIES.map((item, index) => (
                  <button
                    key={item.name}
                    type="button"
                    className={
                      index === active
                        ? "story-dot is-active"
                        : "story-dot"
                    }
                    onClick={() => setActive(index)}
                    aria-label={`View story ${index + 1}`}
                  />
                ))}
              </div>
            </div>
          </article>

          <div className="stories-controls stories-controls-mobile">
            <button
              type="button"
              className="story-arrow"
              onClick={previous}
              aria-label="Previous story"
            >
              ←
            </button>

            <button
              type="button"
              className="story-arrow story-arrow-next"
              onClick={next}
              aria-label="Next story"
            >
              →
            </button>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
