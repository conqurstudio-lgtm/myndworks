import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import "./public-events-index.css";

type PublicEventCard = {
  id: string;
  title: string;
  slug: string;
  short_description: string | null;
  cover_image_url: string | null;
  event_date: string;
  start_time: string;
  end_time: string | null;
  venue_type: "in_person" | "online" | "hybrid";
  venue_name: string | null;
  venue_address: string | null;
};

function johannesburgDate() {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Africa/Johannesburg",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date());

  const values = Object.fromEntries(
    parts
      .filter((part) => part.type !== "literal")
      .map((part) => [part.type, part.value]),
  );

  return `${values.year}-${values.month}-${values.day}`;
}

function eventDateLabel(date: string) {
  return new Intl.DateTimeFormat("en-ZA", {
    weekday: "short",
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(new Date(`${date}T12:00:00`));
}

function eventTimeLabel(
  start: string,
  end: string | null,
) {
  const startTime = start.slice(0, 5);
  const endTime = end ? end.slice(0, 5) : "";

  return endTime
    ? `${startTime} – ${endTime}`
    : startTime;
}

function venueLabel(event: PublicEventCard) {
  if (event.venue_type === "online") return "Online";

  if (event.venue_type === "hybrid") {
    return event.venue_name
      ? `${event.venue_name} + Online`
      : "In person + Online";
  }

  return event.venue_name || "Venue to be confirmed";
}

export function PublicEventsIndex() {
  const [events, setEvents] = useState<PublicEventCard[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.title = "Events | MyndWorks";

    let active = true;

    async function load() {
      const { data } = await supabase
        .from("events")
        .select(
          "id,title,slug,short_description,cover_image_url,event_date,start_time,end_time,venue_type,venue_name,venue_address",
        )
        .eq("status", "published")
        .gte("event_date", johannesburgDate())
        .order("event_date", { ascending: true })
        .order("start_time", { ascending: true });

      if (!active) return;

      setEvents((data ?? []) as PublicEventCard[]);
      setLoading(false);
    }

    load();

    return () => {
      active = false;
    };
  }, []);

  return (
    <main className="mw-events-public-shell">
      <header className="mw-events-public-header">
        <a href="/" className="mw-events-public-brand">
          MyndWorks
        </a>

        <a href="/" className="mw-events-public-home">
          Visit website ↗
        </a>
      </header>

      <section className="mw-events-public-intro">
        <div>
          <span className="mw-events-public-kicker">
            MyndWorks Events
          </span>

          <h1>
            Space to connect,{" "}
            <span>learn and reflect.</span>
          </h1>
        </div>

        <p>
          Upcoming MyndWorks events, conversations and
          experiences created around mental wellbeing,
          connection and practical support.
        </p>
      </section>

      <section className="mw-events-public-feed">
        {loading ? (
          <div className="mw-events-public-empty">
            Loading events…
          </div>
        ) : events.length === 0 ? (
          <div className="mw-events-public-empty">
            <span>Upcoming events</span>
            <h2>Nothing scheduled just yet.</h2>
            <p>
              New MyndWorks events will appear here as soon as
              they are published.
            </p>
          </div>
        ) : (
          <div className="mw-events-public-grid">
            {events.map((event, index) => (
              <a
                className={[
                  "mw-events-public-card",
                  index === 0 ? "is-featured" : "",
                ]
                  .filter(Boolean)
                  .join(" ")}
                href={`/events/${event.slug}`}
                key={event.id}
              >
                <div className="mw-events-public-image">
                  {event.cover_image_url ? (
                    <img
                      src={event.cover_image_url}
                      alt=""
                      loading={index === 0 ? "eager" : "lazy"}
                    />
                  ) : (
                    <div className="mw-events-public-placeholder">
                      MyndWorks
                    </div>
                  )}
                </div>

                <div className="mw-events-public-copy">
                  <div className="mw-events-public-meta">
                    <span>{eventDateLabel(event.event_date)}</span>
                    <span>
                      {eventTimeLabel(
                        event.start_time,
                        event.end_time,
                      )}
                    </span>
                  </div>

                  <h2>{event.title}</h2>

                  {event.short_description && (
                    <p>{event.short_description}</p>
                  )}

                  <div className="mw-events-public-place">
                    <span>{venueLabel(event)}</span>
                    {event.venue_address && (
                      <small>{event.venue_address}</small>
                    )}
                  </div>

                  <span className="mw-events-public-view">
                    View event →
                  </span>
                </div>
              </a>
            ))}
          </div>
        )}
      </section>

      <footer className="mw-events-public-footer">
        <span>MyndWorks</span>
        <a href="/">Back to website →</a>
      </footer>
    </main>
  );
}
