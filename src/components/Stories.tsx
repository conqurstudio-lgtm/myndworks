import { useState } from "react";
import { Reveal } from "./ui";

const STORIES = [
  {
    name: "Thandiwe M",
    text:
      "MyndWorks has been a steady source of support on my mental health journey. The sessions created a safe space for reflection, while the virtual option made support easy to access. Their holistic approach truly sets them apart.",
  },
  {
    name: "Jabulani S",
    text:
      "MyndWorks exceeded my expectations. The in-person sessions felt warm and comfortable, while the virtual option gave me the flexibility I needed. Having both choices made support much easier around my schedule.",
  },
  {
    name: "Kira Brooks",
    text:
      "The comprehensive approach, including medico-legal assessments, showed me that MyndWorks considers mental health from different angles. The therapists were highly skilled and compassionate throughout.",
  },
  {
    name: "John D",
    text:
      "MyndWorks has helped me make positive changes in my life. Having both in-person and virtual sessions made it much easier to prioritise my wellbeing and keep support accessible.",
  },
  {
    name: "Lerato M",
    text:
      "Family and couples therapy helped strengthen my relationships, while the convenience of virtual sessions made therapy much more accessible.",
  },
] as const;

export function Stories() {
  const [active, setActive] = useState(0);

  const story = STORIES[active];

  const previous = () => {
    setActive((current) =>
      current === 0
        ? STORIES.length - 1
        : current - 1
    );
  };

  const next = () => {
    setActive((current) =>
      current === STORIES.length - 1
        ? 0
        : current + 1
    );
  };

  return (
    <section
      id="stories"
      className="stories-section"
    >
      <Reveal>
        <div className="section-eyebrow">
          Stories
        </div>
      </Reveal>

      <div className="stories-grid">
        <Reveal className="stories-intro">
          <h2 className="stories-heading">
            What our
            <span> clients say</span>
          </h2>

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
                {STORIES.map(
                  (item, index) => (
                    <button
                      key={item.name}
                      type="button"
                      className={
                        index === active
                          ? "story-dot is-active"
                          : "story-dot"
                      }
                      onClick={() =>
                        setActive(index)
                      }
                      aria-label={`View story ${index + 1}`}
                    />
                  )
                )}
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
