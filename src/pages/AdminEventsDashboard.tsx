import { useEffect, useMemo, useState } from "react";
import { supabase } from "../lib/supabase";
import "./admin-events.css";

type EventRow = {
  id: string;
  title: string;
  slug: string;
  event_date: string;
  start_time: string;
  venue_name: string | null;
  venue_type: string;
  status: "draft" | "published" | "closed" | "past";
};

type RsvpRow = {
  event_id: string;
  guest_count: number;
  status: string;
};

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
              "id,title,slug,event_date,start_time,venue_name,venue_type,status",
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
          <span className="mw-admin-label">Admin / Events</span>
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
              ← Admin
            </a>
            <span className="mw-admin-label">Events management</span>
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

        <div className="mw-events-stats">
          <div>
            <span>Events</span>
            <strong>{events.length}</strong>
          </div>
          <div>
            <span>Published</span>
            <strong>{publishedCount}</strong>
          </div>
          <div>
            <span>Confirmed guests</span>
            <strong>{totalGuests}</strong>
          </div>
        </div>

        {error && <div className="mw-admin-error">{error}</div>}

        {events.length === 0 ? (
          <div className="mw-events-empty">
            <span className="mw-admin-label">No events yet</span>
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
            {events.map((event) => (
              <article className="mw-event-row" key={event.id}>
                <div className="mw-event-row-main">
                  <span className={`mw-event-status is-${event.status}`}>
                    {event.status}
                  </span>
                  <h2>{event.title}</h2>
                  <div className="mw-event-row-meta">
                    <span>{formatDate(event.event_date)}</span>
                    <span>{formatTime(event.start_time)}</span>
                    <span>
                      {event.venue_type === "online"
                        ? "Online"
                        : event.venue_name || "Venue TBC"}
                    </span>
                  </div>
                </div>

                <div className="mw-event-row-side">
                  <span className="mw-event-rsvp-count">
                    <strong>{totals.get(event.id) ?? 0}</strong>
                    guests
                  </span>
                  <span className="mw-event-row-arrow">→</span>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
