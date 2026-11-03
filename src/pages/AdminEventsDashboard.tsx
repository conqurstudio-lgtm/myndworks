import { useEffect, useMemo, useState } from "react";
import { supabase } from "../lib/supabase";
import "./admin-events.css";

type EventRow = {
  id: string;
  title: string;
  slug: string;
  event_date: string;
  start_time: string;
    cover_image_url: string | null;
venue_name: string | null;
  venue_type: string;
  status: "draft" | "published" | "closed" | "past";
};

type RsvpRow = {
  event_id: string;
  guest_count: number;
  status: string;
};

type EventSummaryIconKind =
  | "events"
  | "published"
  | "guests";

function EventSummaryIcon({
  kind,
}: {
  kind: EventSummaryIconKind;
}) {
  if (kind === "events") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M5 4.5h14v15H5z" />
        <path d="M8 3v3M16 3v3M5 8h14" />
        <path d="M8.5 11.5h3M8.5 15h6.5" />
      </svg>
    );
  }

  if (kind === "published") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 3.8 14.3 6l3.2-.1.8 3 2.5 2-1.5 2.8.7 3.1-3 1-1.7 2.7-2.8-1.4-3 1.2-1.6-2.8-3.1-.9.8-3.1L4 11l2.4-2 .6-3.1 3.2.2L12 3.8Z" />
        <path d="m9 12 2 2 4-4" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="9" cy="8" r="2.6" />
      <circle cx="16.5" cy="9" r="2" />
      <path d="M4.5 18c.4-3.4 2-5.1 4.5-5.1s4.1 1.7 4.5 5.1" />
      <path d="M13.8 14c2.8-.2 4.7 1.2 5.4 4" />
    </svg>
  );
}

export function AdminEventsDashboard() {
  const [allowed, setAllowed] = useState(false);
  const [events, setEvents] = useState<EventRow[]>([]);
  const [rsvps, setRsvps] = useState<RsvpRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    async function load() {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session?.user) {
        window.location.replace("/admin/login");
        return;
      }

      const { data: admin } = await supabase
        .from("admin_users")
        .select("user_id")
        .eq("user_id", session.user.id)
        .maybeSingle();

      if (!admin) {
        await supabase.auth.signOut();
        window.location.replace("/admin/login");
        return;
      }

      const [{ data: eventRows, error: eventsError }, { data: rsvpRows }] =
        await Promise.all([
          supabase
            .from("events")
            .select(
              "id,title,slug,event_date,start_time,cover_image_url,venue_name,venue_type,status",
            )
            .order("event_date", { ascending: true })
            .order("start_time", { ascending: true }),
          supabase
            .from("event_rsvps")
            .select("event_id,guest_count,status"),
        ]);

      if (!active) return;

      if (eventsError) {
        setError(eventsError.message);
      } else {
        setEvents((eventRows ?? []) as EventRow[]);
        setRsvps((rsvpRows ?? []) as RsvpRow[]);
      }

      setAllowed(true);
      setLoading(false);
    }

    load();

    return () => {
      active = false;
    };
  }, []);

  const totals = useMemo(() => {
    const map = new Map<string, number>();

    for (const row of rsvps) {
      if (row.status !== "confirmed") continue;
      map.set(
        row.event_id,
        (map.get(row.event_id) ?? 0) + Number(row.guest_count || 0),
      );
    }

    return map;
  }, [rsvps]);

  const publishedCount = events.filter(
    (event) => event.status === "published",
  ).length;

  const totalGuests = rsvps
    .filter((row) => row.status === "confirmed")
    .reduce((sum, row) => sum + Number(row.guest_count || 0), 0);

  async function signOut() {
    await supabase.auth.signOut();
    window.location.href = "/admin/login";
  }

  function formatDate(value: string) {
    return new Intl.DateTimeFormat("en-ZA", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }).format(new Date(`${value}T12:00:00`));
  }

  function formatTime(value: string) {
    return value.slice(0, 5);
  }

  if (!allowed || loading) {
    return (
      <main className="mw-admin-auth">
        <div className="mw-admin-loading">Loading events…</div>
      </main>
    );
  }

  return (
    <main className="mw-events-admin-shell">
      <header className="mw-events-admin-header">
        <div>
          <a className="mw-admin-brand mw-admin-brand-link" href="/admin">
            MyndWorks
          </a>

        </div>

        <button
          className="mw-admin-signout"
          type="button"
          onClick={signOut}
        >
          Sign out
        </button>
      </header>

      <section className="mw-events-page">
        <div className="mw-events-page-head">
          <div>
            <a className="mw-admin-back-link" href="/admin">
              <span className="mw-admin-back-link-icon" aria-hidden="true">
                ←
              </span>
              <span>Back to Admin</span>
            </a>

            <h1>Events</h1>
            <p>Create, publish and manage MyndWorks events.</p>
          </div>

          <a
            className="mw-admin-primary mw-admin-primary-link"
            href="/admin/events/new"
          >
            + New event
          </a>
        </div>

        <div className="mw-events-stats mw-events-stats-v2 mw-event-summary-grid">
          <div className="mw-event-summary-card">
            <div className="mw-event-summary-card-head">
              <span>Events</span>
              <EventSummaryIcon kind="events" />
            </div>
            <strong>{events.length}</strong>
            <small>All events</small>
          </div>

          <div className="mw-event-summary-card">
            <div className="mw-event-summary-card-head">
              <span>Published</span>
              <EventSummaryIcon kind="published" />
            </div>
            <strong>{publishedCount}</strong>
            <small>Visible on the website</small>
          </div>

          <div className="mw-event-summary-card">
            <div className="mw-event-summary-card-head">
              <span>Confirmed guests</span>
              <EventSummaryIcon kind="guests" />
            </div>
            <strong>{totalGuests}</strong>
            <small>Across all events</small>
          </div>
        </div>

        {error && <div className="mw-admin-error">{error}</div>}

        {events.length === 0 ? (
          <div className="mw-events-empty">

            <h2>Create your first MyndWorks event.</h2>
            <p>
              Save it as a draft while preparing it, or publish it when
              you’re ready for the public event page.
            </p>
            <a
              className="mw-admin-primary mw-admin-primary-link"
              href="/admin/events/new"
            >
              + New event
            </a>
          </div>
        ) : (
          <div className="mw-events-list">
            {events.map((event) => {
              const guestCount = totals.get(event.id) ?? 0;
              const venueLabel =
                event.venue_type === "online"
                  ? "Online"
                  : event.venue_name || "Venue TBC";

              return (
                <a
                  className="mw-event-row"
                  key={event.id}
                  href={`/admin/events/${event.id}`}
                >
                  <span className="mw-event-row-thumb" aria-hidden="true">
                    {event.cover_image_url ? (
                      <img src={event.cover_image_url} alt="" />
                    ) : (
                      <span className="mw-event-row-thumb-placeholder">
                        MyndWorks
                      </span>
                    )}
                  </span>

                  <div className="mw-event-row-main">
                    <span className={`mw-event-status is-${event.status}`}>
                      {event.status}
                    </span>

                    <h2>{event.title}</h2>

                    <div className="mw-event-row-meta">
                      <span className="mw-event-meta-pill">
                        {formatDate(event.event_date)}
                      </span>
                      <span className="mw-event-meta-pill">
                        {formatTime(event.start_time)}
                      </span>
                      <span className="mw-event-meta-pill">
                        {venueLabel}
                      </span>
                    </div>
                  </div>

                  <div className="mw-event-row-side">
                    <span className="mw-event-rsvp-count">
                      <strong>{guestCount}</strong>
                      <span>
                        {guestCount === 1 ? "guest" : "guests"}
                      </span>
                    </span>

                    <span className="mw-event-row-arrow-ring" aria-hidden="true">
                      <span className="mw-event-row-arrow">→</span>
                    </span>
                  </div>
                </a>
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
}
