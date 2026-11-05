import { useEffect, useState, type FormEvent } from "react";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import healthIcon from "../assets/health-icon.svg";
import { supabase } from "../lib/supabase";
import "./public-event.css";

type PublicEvent = {
  id: string;
  title: string;
  slug: string;
  short_description: string | null;
  description: string;
  cover_image_url: string | null;
  event_date: string;
  start_time: string;
  end_time: string | null;
  venue_type: string;
  venue_name: string | null;
  venue_address: string | null;
  capacity: number | null;
  rsvp_closes_at: string | null;
};

export function PublicEventPage({ slug }: { slug: string }) {
  const [event, setEvent] = useState<PublicEvent | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [guestCount, setGuestCount] = useState("1");
  const [note, setNote] = useState("");
  const [privacyConsent, setPrivacyConsent] = useState(false);
  const [rsvpSaving, setRsvpSaving] = useState(false);
  const [rsvpError, setRsvpError] = useState("");
  const [rsvpSuccess, setRsvpSuccess] = useState(false);

  useEffect(() => {
    let active = true;

    async function load() {
      const { data } = await supabase
        .from("events")
        .select(
          "id,title,slug,short_description,description,cover_image_url,event_date,start_time,end_time,venue_type,venue_name,venue_address,capacity,rsvp_closes_at",
        )
        .eq("slug", slug)
        .eq("status", "published")
        .maybeSingle();

      if (!active) return;
      setEvent((data as PublicEvent | null) ?? null);
      setLoading(false);
    }

    load();
    return () => { active = false; };
  }, [slug]);

  async function shareEvent() {
    if (!event) return;

    const shareData = {
      title: event.title,
      text: event.short_description || "MyndWorks event",
      url: window.location.href,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
        return;
      }

      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") {
        return;
      }

      try {
        await navigator.clipboard.writeText(window.location.href);
        setCopied(true);
        window.setTimeout(() => setCopied(false), 1800);
      } catch {
        // Sharing unavailable; keep the page usable.
      }
    }
  }

  async function submitRsvp(formEvent: FormEvent<HTMLFormElement>) {
    formEvent.preventDefault();
    if (!event) return;

    setRsvpError("");
    setRsvpSuccess(false);
    setRsvpSaving(true);

    const { error } = await supabase.rpc("submit_event_rsvp", {
      p_event_id: event.id,
      p_first_name: firstName.trim(),
      p_last_name: lastName.trim(),
      p_email: email.trim(),
      p_phone: phone.trim() || null,
      p_guest_count: Number(guestCount || 1),
      p_note: note.trim() || null,
      p_privacy_consent: privacyConsent,
    });

    if (error) {
      setRsvpError(error.message.replace(/^.*?: /, ""));
      setRsvpSaving(false);
      return;
    }

    setRsvpSuccess(true);
    setRsvpSaving(false);
  }

  if (loading) {
    return (
      <main className="mw-public-event-shell">
        <div className="mw-public-event-loading">Loading event…</div>
      </main>
    );
  }

  if (!event) {
    return (
      <main className="mw-public-event-shell">
        <section className="mw-public-event-not-found">
          <a href="/" className="mw-public-event-brand">MyndWorks</a>
          <span>Event unavailable</span>
          <h1>This event could not be found.</h1>
          <a href="/">Return to MyndWorks →</a>
        </section>
      </main>
    );
  }

  const dateLabel = new Intl.DateTimeFormat("en-ZA", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(new Date(`${event.event_date}T12:00:00`));

  const start = event.start_time.slice(0, 5);
  const end = event.end_time ? event.end_time.slice(0, 5) : "";
  const timeLabel = end ? `${start} – ${end}` : start;

  const rsvpClosed = !!event.rsvp_closes_at && new Date() > new Date(event.rsvp_closes_at);

  const locationQuery =
    event.venue_type === "online"
      ? ""
      : [event.venue_name, event.venue_address]
          .filter(Boolean)
          .join(", ");

  const mapsEmbedUrl = locationQuery
    ? `https://www.google.com/maps?q=${encodeURIComponent(locationQuery)}&output=embed`
    : "";

  const mapsOpenUrl = locationQuery
    ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(locationQuery)}`
    : "";

  return (
    <>
      <Header />

      <main className="mw-public-event-shell mw-public-event-shell-integrated">
        <a href="/events" className="mw-public-event-back">
          <span aria-hidden="true">←</span>
          Back to events
        </a>

        <section className="mw-public-event-hero">
        <div className="mw-public-event-copy">
          <span className="mw-public-event-kicker">MyndWorks Event</span>
          <h1>{event.title}</h1>
          {event.short_description && <p>{event.short_description}</p>}

          <div className="mw-public-event-hero-facts">
            <div>
              <span>Date</span>
              <strong>{dateLabel}</strong>
            </div>

            <div>
              <span>Time</span>
              <strong>{timeLabel}</strong>
            </div>

            <div>
              <span>Venue</span>
              <strong>
                {event.venue_type === "online"
                  ? "Online"
                  : event.venue_name || "Venue to be confirmed"}
              </strong>
            </div>

            {event.capacity && (
              <div>
                <span>Capacity</span>
                <strong>{event.capacity} attendees</strong>
              </div>
            )}
          </div>
        </div>

        <div className="mw-public-event-cover">
          {event.cover_image_url ? (
            <img src={event.cover_image_url} alt="" />
          ) : (
            <div className="mw-public-event-cover-placeholder"><span>MyndWorks</span></div>
          )}
        </div>
      </section>

      <section className="mw-public-event-about">
        <div className="mw-public-event-chapter">
          <img src={healthIcon} alt="" aria-hidden="true" />
          <span>About the event</span>
          <i aria-hidden="true" />
        </div>

        <div className="mw-public-event-about-copy">
          <p>{event.description || event.short_description}</p>
        </div>
      </section>

      {event.venue_type !== "online" && locationQuery && (
        <section className="mw-public-event-location">
          <div className="mw-public-event-chapter">
            <img src={healthIcon} alt="" aria-hidden="true" />
            <span>Location</span>
            <i aria-hidden="true" />
          </div>

          <div className="mw-public-event-location-card">
            <div className="mw-public-event-location-copy">
              <span>Where to go</span>
              <h2>{event.venue_name || "Event venue"}</h2>

              {event.venue_address && (
                <p>{event.venue_address}</p>
              )}

              {mapsOpenUrl && (
                <a
                  href={mapsOpenUrl}
                  target="_blank"
                  rel="noreferrer"
                >
                  Open in Maps ↗
                </a>
              )}
            </div>

            {mapsEmbedUrl && (
              <div className="mw-public-event-map">
                <iframe
                  title={`Map for ${event.venue_name || event.title}`}
                  src={mapsEmbedUrl}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            )}
          </div>
        </section>
      )}

      <section className="mw-public-event-rsvp">
        <div className="mw-public-event-rsvp-intro">
          <span className="mw-public-event-kicker">RSVP</span>
          <h2>Reserve your place.</h2>
          <p>Complete your details below and we’ll add you to the guest list for this event.</p>
        </div>

        {rsvpClosed ? (
          <div className="mw-public-event-rsvp-closed">
            <span>RSVP closed</span>
            <p>Registrations for this event are no longer open.</p>
          </div>
        ) : rsvpSuccess ? (
          <div className="mw-public-event-rsvp-success">
            <span>RSVP confirmed</span>
            <h3>Thank you, {firstName}.</h3>
            <p>Your place has been added to the guest list for <strong>{event.title}</strong>.</p>
          </div>
        ) : (
          <form className="mw-public-event-rsvp-form" onSubmit={submitRsvp}>
            <div className="mw-public-event-rsvp-grid">
              <label><span>First name</span><input type="text" required maxLength={80} value={firstName} onChange={(e) => setFirstName(e.target.value)} /></label>
              <label><span>Last name</span><input type="text" required maxLength={80} value={lastName} onChange={(e) => setLastName(e.target.value)} /></label>
              <label><span>Email address</span><input type="email" required maxLength={254} value={email} onChange={(e) => setEmail(e.target.value)} /></label>
              <label><span>Mobile number</span><input type="tel" maxLength={40} value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Optional" /></label>
              <label>
                <span>Number attending</span>
                <select value={guestCount} onChange={(e) => setGuestCount(e.target.value)}>
                  {Array.from({ length: 10 }, (_, index) => index + 1).map((count) => <option key={count} value={count}>{count}</option>)}
                </select>
              </label>
              <label className="is-full"><span>Note</span><textarea rows={3} maxLength={1000} value={note} onChange={(e) => setNote(e.target.value)} placeholder="Anything you’d like the MyndWorks team to know? Optional." /></label>
            </div>

            <label className="mw-public-event-consent">
              <input type="checkbox" checked={privacyConsent} onChange={(e) => setPrivacyConsent(e.target.checked)} required />
              <span>I agree that MyndWorks may use these details to manage this event and communicate with me about my RSVP.</span>
            </label>

            {rsvpError && <div className="mw-public-event-rsvp-error" role="alert">{rsvpError}</div>}
            <button type="submit" disabled={rsvpSaving}>{rsvpSaving ? "Submitting..." : "Confirm RSVP"}</button>
          </form>
        )}
      </section>

      <section className="mw-public-event-share">
        <div><span>Share this event</span><p>Invite someone who may find this event meaningful.</p></div>
        <div className="mw-public-event-share-actions">
          <button
            type="button"
            className="mw-public-event-native-share mw-public-event-share-icon"
            onClick={shareEvent}
            aria-label={copied ? "Event link copied" : "Share event"}
            title={copied ? "Link copied" : "Share event"}
          >
            {copied ? (
              <span aria-hidden="true">✓</span>
            ) : (
              <svg
                viewBox="0 0 24 24"
                aria-hidden="true"
                focusable="false"
              >
                <path d="M12 3v12" />
                <path d="M7.5 7.5 12 3l4.5 4.5" />
                <path d="M5 11v7a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-7" />
              </svg>
            )}
          </button>
        </div>
      </section>

      </main>

      <Footer />
    </>
  );
}
