import { useEffect, useState, type FormEvent } from "react";
import { supabase } from "../lib/supabase";
import "./admin-events.css";

type VenueType = "in_person" | "online" | "hybrid";
type EventStatus = "draft" | "published";

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/['"]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function AdminEventNew() {
  const [allowed, setAllowed] = useState(false);
  const [userId, setUserId] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [title, setTitle] = useState("");
  const [shortDescription, setShortDescription] = useState("");
  const [description, setDescription] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [venueType, setVenueType] = useState<VenueType>("in_person");
  const [venueName, setVenueName] = useState("");
  const [venueAddress, setVenueAddress] = useState("");
  const [onlineUrl, setOnlineUrl] = useState("");
  const [capacity, setCapacity] = useState("");
  const [rsvpClosesAt, setRsvpClosesAt] = useState("");

  useEffect(() => {
    let active = true;

    async function checkAccess() {
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

      if (active) {
        setUserId(session.user.id);
        setAllowed(true);
      }
    }

    checkAccess();

    return () => {
      active = false;
    };
  }, []);

  async function saveEvent(status: EventStatus) {
    setError("");

    const slug = slugify(title);

    if (!title.trim() || !slug) {
      setError("Please enter an event title.");
      return;
    }

    if (!eventDate || !startTime) {
      setError("Event date and start time are required.");
      return;
    }

    setSaving(true);

    const payload = {
      title: title.trim(),
      slug,
      short_description: shortDescription.trim() || null,
      description: description.trim(),
      event_date: eventDate,
      start_time: startTime,
      end_time: endTime || null,
      timezone: "Africa/Johannesburg",
      venue_type: venueType,
      venue_name: venueName.trim() || null,
      venue_address: venueAddress.trim() || null,
      online_url: onlineUrl.trim() || null,
      capacity: capacity ? Number(capacity) : null,
      rsvp_closes_at: rsvpClosesAt
        ? new Date(rsvpClosesAt).toISOString()
        : null,
      status,
      created_by: userId,
    };

    const { error: insertError } = await supabase
      .from("events")
      .insert(payload);

    if (insertError) {
      if (insertError.code === "23505") {
        setError(
          "An event with this title/link already exists. Change the title slightly.",
        );
      } else {
        setError(insertError.message);
      }

      setSaving(false);
      return;
    }

    window.location.href = "/admin/events";
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
  }

  if (!allowed) {
    return (
      <main className="mw-admin-auth">
        <div className="mw-admin-loading">Checking access…</div>
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
      </header>

      <section className="mw-event-editor">
        <div className="mw-event-editor-head">
          <div>
            <a className="mw-admin-back-link" href="/admin/events">
              ← Events
            </a>
            <span className="mw-admin-label">New event</span>
            <h1>Create event</h1>
            <p>
              Add the event information now. Cover image and public
              sharing will be added in the next step.
            </p>
          </div>
        </div>

        <form className="mw-event-form" onSubmit={handleSubmit}>
          <div className="mw-event-form-section">
            <div className="mw-event-form-section-title">
              <span>01</span>
              <div>
                <h2>Event details</h2>
                <p>The information people will see on the event page.</p>
              </div>
            </div>

            <div className="mw-event-form-fields">
              <label className="mw-field is-full">
                <span>Event title</span>
                <input
                  type="text"
                  required
                  maxLength={160}
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="MyndWorks Wellness Morning"
                />
                {title && (
                  <small>Link preview: /events/{slugify(title)}</small>
                )}
              </label>

              <label className="mw-field is-full">
                <span>Short description</span>
                <textarea
                  rows={2}
                  maxLength={280}
                  value={shortDescription}
                  onChange={(e) => setShortDescription(e.target.value)}
                  placeholder="A short introduction for event cards and sharing."
                />
              </label>

              <label className="mw-field is-full">
                <span>Full description</span>
                <textarea
                  rows={6}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Tell guests what the event is about and what to expect."
                />
              </label>
            </div>
          </div>

          <div className="mw-event-form-section">
            <div className="mw-event-form-section-title">
              <span>02</span>
              <div>
                <h2>Date & time</h2>
                <p>All event times use Africa/Johannesburg.</p>
              </div>
            </div>

            <div className="mw-event-form-fields is-grid">
              <label className="mw-field">
                <span>Date</span>
                <input
                  type="date"
                  required
                  value={eventDate}
                  onChange={(e) => setEventDate(e.target.value)}
                />
              </label>

              <label className="mw-field">
                <span>Start time</span>
                <input
                  type="time"
                  required
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                />
              </label>

              <label className="mw-field">
                <span>End time</span>
                <input
                  type="time"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                />
              </label>

              <label className="mw-field">
                <span>RSVP closes</span>
                <input
                  type="datetime-local"
                  value={rsvpClosesAt}
                  onChange={(e) => setRsvpClosesAt(e.target.value)}
                />
              </label>
            </div>
          </div>

          <div className="mw-event-form-section">
            <div className="mw-event-form-section-title">
              <span>03</span>
              <div>
                <h2>Venue</h2>
                <p>Choose how guests will attend the event.</p>
              </div>
            </div>

            <div className="mw-event-form-fields is-grid">
              <label className="mw-field">
                <span>Event type</span>
                <select
                  value={venueType}
                  onChange={(e) =>
                    setVenueType(e.target.value as VenueType)
                  }
                >
                  <option value="in_person">In person</option>
                  <option value="online">Online</option>
                  <option value="hybrid">Hybrid</option>
                </select>
              </label>

              <label className="mw-field">
                <span>Maximum attendees</span>
                <input
                  type="number"
                  min="1"
                  value={capacity}
                  onChange={(e) => setCapacity(e.target.value)}
                  placeholder="Optional"
                />
              </label>

              {venueType !== "online" && (
                <>
                  <label className="mw-field">
                    <span>Venue name</span>
                    <input
                      type="text"
                      value={venueName}
                      onChange={(e) => setVenueName(e.target.value)}
                      placeholder="MyndWorks"
                    />
                  </label>

                  <label className="mw-field">
                    <span>Venue address</span>
                    <input
                      type="text"
                      value={venueAddress}
                      onChange={(e) => setVenueAddress(e.target.value)}
                      placeholder="Street address"
                    />
                  </label>
                </>
              )}

              {venueType !== "in_person" && (
                <label className="mw-field is-full">
                  <span>Online meeting URL</span>
                  <input
                    type="url"
                    value={onlineUrl}
                    onChange={(e) => setOnlineUrl(e.target.value)}
                    placeholder="https://..."
                  />
                </label>
              )}
            </div>
          </div>

          {error && (
            <div className="mw-admin-error mw-event-form-error">
              {error}
            </div>
          )}

          <div className="mw-event-form-actions">
            <a href="/admin/events">Cancel</a>

            <div>
              <button
                type="button"
                className="mw-event-secondary-button"
                disabled={saving}
                onClick={() => saveEvent("draft")}
              >
                Save draft
              </button>

              <button
                type="button"
                className="mw-admin-primary"
                disabled={saving}
                onClick={() => saveEvent("published")}
              >
                {saving ? "Saving..." : "Publish event"}
              </button>
            </div>
          </div>
        </form>
      </section>
    </main>
  );
}
