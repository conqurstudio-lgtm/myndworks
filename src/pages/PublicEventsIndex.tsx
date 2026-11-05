import { useEffect, useMemo, useState } from "react";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { supabase } from "../lib/supabase";
import healthIcon from "../assets/health-icon.svg";
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

function eventDateParts(date: string) {
  const value = new Date(`${date}T12:00:00`);

  return {
    day: new Intl.DateTimeFormat("en-ZA", {
      day: "2-digit",
    }).format(value),
    month: new Intl.DateTimeFormat("en-ZA", {
      month: "short",
    })
      .format(value)
      .toUpperCase(),
    year: new Intl.DateTimeFormat("en-ZA", {
      year: "numeric",
    }).format(value),
  };
}

function eventTimeLabel(start: string, end: string | null) {
  const startTime = start.slice(0, 5);
  const endTime = end ? end.slice(0, 5) : "";
  return endTime ? `${startTime} – ${endTime}` : startTime;
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

function EventCard({
  event,
  featured = false,
  past = false,
}: {
  event: PublicEventCard;
  featured?: boolean;
  past?: boolean;
}) {
  const date = eventDateParts(event.event_date);

  return (
    <a
      className={[
        "mw-events-public-card",
        featured ? "is-featured" : "",
        past ? "is-past-event" : "is-upcoming-event",
      ].filter(Boolean).join(" ")}
      href={`/events/${event.slug}`}
    >
      <div className="mw-events-public-image">
        {event.cover_image_url ? (
          <img
            src={event.cover_image_url}
            alt=""
            loading={featured ? "eager" : "lazy"}
          />
        ) : (
          <div className="mw-events-public-placeholder">MyndWorks</div>
        )}
      </div>

      <div className="mw-events-public-event-strip">
        <span className="mw-events-public-status-tag">
          {past ? "Ended" : "Upcoming"}
        </span>

        <span className="mw-events-public-strip-date">
          {date.day} {date.month} {date.year}
        </span>

        <span className="mw-events-public-strip-time">
          {eventTimeLabel(event.start_time, event.end_time)}
        </span>
      </div>

      <div className="mw-events-public-copy">
        <h2>{event.title}</h2>

        {event.short_description && <p>{event.short_description}</p>}

        <div className="mw-events-public-place">
          <span>{venueLabel(event)}</span>
          {event.venue_address && <small>{event.venue_address}</small>}
        </div>

        <span className="mw-events-public-view">View event →</span>
      </div>
    </a>
  );
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

  const today = johannesburgDate();

  const { upcomingEvents, pastEvents } = useMemo(() => {
    const upcoming = events.filter(
      (event) => event.event_date >= today,
    );

    const past = events
      .filter((event) => event.event_date < today)
      .sort((a, b) => {
        const dateCompare = b.event_date.localeCompare(a.event_date);
        if (dateCompare !== 0) return dateCompare;
        return b.start_time.localeCompare(a.start_time);
      });

    return { upcomingEvents: upcoming, pastEvents: past };
  }, [events, today]);

  return (
    <>
      <Header />

      <main className="mw-events-public-shell mw-events-public-shell-integrated">
        <section className="mw-events-public-feed">
          {loading ? (
            <div className="mw-events-public-empty">Loading events…</div>
          ) : (
            <>
              <div className="mw-events-public-chapter">
                <img
                  src={healthIcon}
                  alt=""
                  aria-hidden="true"
                  className="mw-events-public-chapter-icon"
                />
                <span className="mw-events-public-chapter-label">
                  Upcoming events
                </span>
                <span
                  className="mw-events-public-chapter-line"
                  aria-hidden="true"
                />
              </div>

              {upcomingEvents.length === 0 ? (
                <div className="mw-events-public-empty is-compact">
                  <h2>Nothing scheduled just yet.</h2>
                  <p>
                    New MyndWorks events will appear here as soon as they
                    are published.
                  </p>
                </div>
              ) : (
                <div className="mw-events-public-grid">
                  {upcomingEvents.map((event, index) => (
                    <EventCard
                      event={event}
                      featured={index === 0}
                      key={event.id}
                    />
                  ))}
                </div>
              )}

              {pastEvents.length > 0 && (
                <div className="mw-events-public-past">
                  <div className="mw-events-public-chapter">
                    <img
                      src={healthIcon}
                      alt=""
                      aria-hidden="true"
                      className="mw-events-public-chapter-icon"
                    />
                    <span className="mw-events-public-chapter-label">
                      Past events
                    </span>
                    <span
                      className="mw-events-public-chapter-line"
                      aria-hidden="true"
                    />
                  </div>

                  <div className="mw-events-public-grid is-past">
                    {pastEvents.map((event) => (
                      <EventCard
                        event={event}
                        past
                        key={event.id}
                      />
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </section>
      </main>

      <Footer />
    </>
  );
}
