import { useEffect, useState, type ChangeEvent } from "react";
import { supabase } from "../lib/supabase";
import "./admin-events.css";

type VenueType = "in_person" | "online" | "hybrid";
type EventStatus = "draft" | "published" | "closed" | "past";

type EventRecord = {
  id: string;
  title: string;
  slug: string;
  short_description: string | null;
  description: string;
  cover_image_url: string | null;
  event_date: string;
  start_time: string;
  end_time: string | null;
  venue_type: VenueType;
  venue_name: string | null;
  venue_address: string | null;
  online_url: string | null;
  capacity: number | null;
  rsvp_closes_at: string | null;
  status: EventStatus;
};

type RsvpRow = {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string | null;
  guest_count: number;
  note: string | null;
  status: "confirmed" | "cancelled" | "waitlisted";
  created_at: string;
};


function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/['"]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function toLocalDateTime(value: string | null) {
  if (!value) return "";
  const date = new Date(value);
  const offset = date.getTimezoneOffset() * 60000;
  return new Date(date.getTime() - offset).toISOString().slice(0, 16);
}

export function AdminEventEdit({ eventId }: { eventId: string }) {
  const [allowed, setAllowed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);
  const [rsvps, setRsvps] = useState<RsvpRow[]>([]);
  const [rsvpLoading, setRsvpLoading] = useState(true);
  const [updatingRsvpId, setUpdatingRsvpId] = useState("");

  const [title, setTitle] = useState("");
  const [shortDescription, setShortDescription] = useState("");
  const [description, setDescription] = useState("");
  const [coverImageUrl, setCoverImageUrl] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [venueType, setVenueType] = useState<VenueType>("in_person");
  const [venueName, setVenueName] = useState("");
  const [venueAddress, setVenueAddress] = useState("");
  const [onlineUrl, setOnlineUrl] = useState("");
  const [capacity, setCapacity] = useState("");
  const [rsvpClosesAt, setRsvpClosesAt] = useState("");
  const [status, setStatus] = useState<EventStatus>("draft");

  useEffect(() => {
    let active = true;

    async function load() {
      const { data: { session } } = await supabase.auth.getSession();

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

      const { data, error: fetchError } = await supabase
        .from("events")
        .select("id,title,slug,short_description,description,cover_image_url,event_date,start_time,end_time,venue_type,venue_name,venue_address,online_url,capacity,rsvp_closes_at,status")
        .eq("id", eventId)
        .maybeSingle();

      if (!active) return;

      if (fetchError || !data) {
        setError(fetchError?.message || "Event not found.");
        setAllowed(true);
        setLoading(false);
        return;
      }

      const event = data as EventRecord;

      setTitle(event.title);
      setShortDescription(event.short_description || "");
      setDescription(event.description || "");
      setCoverImageUrl(event.cover_image_url || "");
      setEventDate(event.event_date);
      setStartTime(event.start_time?.slice(0, 5) || "");
      setEndTime(event.end_time?.slice(0, 5) || "");
      setVenueType(event.venue_type);
      setVenueName(event.venue_name || "");
      setVenueAddress(event.venue_address || "");
      setOnlineUrl(event.online_url || "");
      setCapacity(event.capacity ? String(event.capacity) : "");
      setRsvpClosesAt(toLocalDateTime(event.rsvp_closes_at));
      setStatus(event.status);

      const { data: rsvpRows, error: rsvpFetchError } = await supabase
        .from("event_rsvps")
        .select("id,first_name,last_name,email,phone,guest_count,note,status,created_at")
        .eq("event_id", eventId)
        .order("created_at", { ascending: false });

      if (rsvpFetchError) {
        setError(rsvpFetchError.message);
      } else {
        setRsvps((rsvpRows ?? []) as RsvpRow[]);
      }

      setRsvpLoading(false);
      setAllowed(true);
      setLoading(false);
    }

    load();
    return () => { active = false; };
  }, [eventId]);

  async function saveEvent(nextStatus?: EventStatus) {
    setError("");
    setSaved(false);

    const slug = slugify(title);

    const finalStatus = nextStatus ?? status;

    if (!title.trim() || !slug) {
      setError("Please enter an event title.");
      return;
    }

    if (!eventDate || !startTime) {
      setError("Event date and start time are required.");
      return;
    }

    setSaving(true);

    const { error: updateError } = await supabase
      .from("events")
      .update({
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
        rsvp_closes_at: rsvpClosesAt ? new Date(rsvpClosesAt).toISOString() : null,
        status: finalStatus,
      })
      .eq("id", eventId);

    if (updateError) {
      setError(updateError.code === "23505"
        ? "Another event already uses this public link."
        : updateError.message);
      setSaving(false);
      return;
    }

    setStatus(finalStatus);
    setSaved(true);
    setSaving(false);
  }

  async function uploadCover(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    setError("");
    setSaved(false);

    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      setError("Use a JPG, PNG or WebP image.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("Cover image must be 5 MB or smaller.");
      return;
    }

    setUploading(true);

    const safeName = file.name
      .toLowerCase()
      .replace(/[^a-z0-9.]+/g, "-")
      .replace(/^-+|-+$/g, "");

    const objectPath = `${eventId}/${Date.now()}-${safeName}`;

    const { error: uploadError } = await supabase.storage
      .from("event-covers")
      .upload(objectPath, file, { cacheControl: "3600", upsert: false });

    if (uploadError) {
      setError(uploadError.message);
      setUploading(false);
      return;
    }

    const { data } = supabase.storage.from("event-covers").getPublicUrl(objectPath);
    const publicUrl = data.publicUrl;

    const { error: updateError } = await supabase
      .from("events")
      .update({ cover_image_url: publicUrl })
      .eq("id", eventId);

    if (updateError) {
      setError(updateError.message);
      setUploading(false);
      return;
    }

    setCoverImageUrl(publicUrl);
    setUploading(false);
    setSaved(true);
  }

  const confirmedRsvps = rsvps.filter((rsvp) => rsvp.status === "confirmed");

  const confirmedGuests = confirmedRsvps.reduce(
    (sum, rsvp) => sum + Number(rsvp.guest_count || 0),
    0,
  );
  async function updateRsvpStatus(
    rsvpId: string,
    nextStatus: RsvpRow["status"],
  ) {
    setError("");
    setUpdatingRsvpId(rsvpId);

    const { error: updateError } = await supabase
      .from("event_rsvps")
      .update({ status: nextStatus })
      .eq("id", rsvpId);

    if (updateError) {
      setError(updateError.message);
      setUpdatingRsvpId("");
      return;
    }

    setRsvps((current) =>
      current.map((rsvp) =>
        rsvp.id === rsvpId
          ? { ...rsvp, status: nextStatus }
          : rsvp,
      ),
    );

    setUpdatingRsvpId("");
  }


  function exportRsvpsCsv() {
    const escapeCsv = (value: string | number | null) =>
      `"${String(value ?? "").replace(/"/g, '""')}"`;

    const rows = [
      ["First name", "Last name", "Email", "Phone", "Guests", "Status", "RSVP date", "Note"],
      ...rsvps.map((rsvp) => [
        rsvp.first_name, rsvp.last_name, rsvp.email, rsvp.phone ?? "",
        rsvp.guest_count, rsvp.status,
        new Date(rsvp.created_at).toLocaleString("en-ZA"), rsvp.note ?? "",
      ]),
    ];

    const csv = rows.map((row) => row.map(escapeCsv).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${slugify(title) || "event"}-rsvps.csv`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  }

  if (!allowed || loading) {
    return <main className="mw-admin-auth"><div className="mw-admin-loading">Loading event…</div></main>;
  }

  return (
    <main className="mw-events-admin-shell">
      <header className="mw-events-admin-header">
        <div>
          <a className="mw-admin-brand mw-admin-brand-link" href="/admin">MyndWorks</a>
        </div>
      </header>

      <section className="mw-event-editor">
        <div className="mw-event-editor-head">
          <div>
            <a className="mw-admin-back-link" href="/admin/events">
              <span className="mw-admin-back-link-icon" aria-hidden="true">
                ←
              </span>
              <span>Back to events</span>
            </a>
            <h1>{title || "Event"}</h1>
            <p>Update event details, publishing status and cover image.</p>
          </div>

          {status === "published" && title && (
            <a
              className="mw-admin-primary mw-admin-primary-link"
              href={`/events/${slugify(title)}`}
              target="_blank"
              rel="noreferrer"
            >
              View public page ↗
            </a>
          )}
        </div>

        <div className="mw-event-form">
          <div className="mw-event-form-section">
            <div className="mw-event-form-section-title">
              <span>01</span>
              <div>
                <h2>Cover image</h2>
                <p>Recommended: wide landscape image under 5 MB.</p>
              </div>
            </div>

            <div className="mw-event-cover-editor">
              <div className="mw-event-cover-preview">
                {coverImageUrl ? <img src={coverImageUrl} alt="" /> : <span>No cover image yet</span>}
              </div>

              <label className="mw-event-upload-button">
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={uploadCover}
                  disabled={uploading}
                />
                {uploading ? "Uploading..." : "Choose cover image"}
              </label>
            </div>
          </div>

          <div className="mw-event-form-section">
            <div className="mw-event-form-section-title">
              <span>02</span>
              <div>
                <h2>Event details</h2>
                <p>Public title, description and publishing status.</p>
              </div>
            </div>

            <div className="mw-event-form-fields is-grid">
              <label className="mw-field is-full">
                <span>Event title</span>
                <input type="text" maxLength={160} value={title} onChange={(e) => setTitle(e.target.value)} />
                {title && <small>Public link: /events/{slugify(title)}</small>}
              </label>

              <label className="mw-field">
                <span>Status</span>
                <select value={status} onChange={(e) => setStatus(e.target.value as EventStatus)}>
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                  <option value="closed">Closed</option>
                  <option value="past">Past</option>
                </select>
              </label>

              <div />

              <label className="mw-field is-full">
                <span>Short description</span>
                <textarea rows={2} maxLength={280} value={shortDescription} onChange={(e) => setShortDescription(e.target.value)} />
              </label>

              <label className="mw-field is-full">
                <span>Full description</span>
                <textarea rows={6} value={description} onChange={(e) => setDescription(e.target.value)} />
              </label>
            </div>
          </div>

          <div className="mw-event-form-section">
            <div className="mw-event-form-section-title">
              <span>03</span>
              <div>
                <h2>Date & time</h2>
                <p>All event times use Africa/Johannesburg.</p>
              </div>
            </div>

            <div className="mw-event-form-fields is-grid">
              <label className="mw-field">
                <span>Date</span>
                <input type="date" value={eventDate} onChange={(e) => setEventDate(e.target.value)} />
              </label>

              <label className="mw-field">
                <span>Start time</span>
                <input type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} />
              </label>

              <label className="mw-field">
                <span>End time</span>
                <input type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} />
              </label>

              <label className="mw-field">
                <span>RSVP closes</span>
                <input type="datetime-local" value={rsvpClosesAt} onChange={(e) => setRsvpClosesAt(e.target.value)} />
              </label>
            </div>
          </div>

          <div className="mw-event-form-section">
            <div className="mw-event-form-section-title">
              <span>04</span>
              <div>
                <h2>Venue</h2>
                <p>Attendance location and capacity.</p>
              </div>
            </div>

            <div className="mw-event-form-fields is-grid">
              <label className="mw-field">
                <span>Event type</span>
                <select value={venueType} onChange={(e) => setVenueType(e.target.value as VenueType)}>
                  <option value="in_person">In person</option>
                  <option value="online">Online</option>
                  <option value="hybrid">Hybrid</option>
                </select>
              </label>

              <label className="mw-field">
                <span>Maximum attendees</span>
                <input type="number" min="1" value={capacity} onChange={(e) => setCapacity(e.target.value)} placeholder="Optional" />
              </label>

              {venueType !== "online" && (
                <>
                  <label className="mw-field">
                    <span>Venue name</span>
                    <input type="text" value={venueName} onChange={(e) => setVenueName(e.target.value)} />
                  </label>

                  <label className="mw-field">
                    <span>Venue address</span>
                    <input type="text" value={venueAddress} onChange={(e) => setVenueAddress(e.target.value)} />
                  </label>
                </>
              )}

              {venueType !== "in_person" && (
                <label className="mw-field is-full">
                  <span>Online meeting URL</span>
                  <input type="url" value={onlineUrl} onChange={(e) => setOnlineUrl(e.target.value)} />
                </label>
              )}
            </div>
          </div>

          {error && <div className="mw-admin-error">{error}</div>}
          {saved && <div className="mw-admin-success">Event changes saved.</div>}

          <div className="mw-event-form-actions">
            <a href="/admin/events">← Back to events</a>

            <div>
              <button
                type="button"
                className={
                  status === "draft"
                    ? "mw-event-secondary-button"
                    : "mw-admin-primary"
                }
                disabled={saving || uploading}
                onClick={() => saveEvent()}
              >
                {saving ? "Saving..." : "Save changes"}
              </button>

              {status === "draft" && (
                <button
                  type="button"
                  className="mw-admin-primary"
                  disabled={saving || uploading}
                  onClick={() => saveEvent("published")}
                >
                  {saving ? "Publishing..." : "Publish event"}
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="mw-event-rsvp-admin">
          <div className="mw-event-rsvp-admin-head">
            <div>
              <span className="mw-admin-label">Guest management</span>
              <h2>RSVP list</h2>
              <p>{confirmedGuests} confirmed guest{confirmedGuests === 1 ? "" : "s"} across {confirmedRsvps.length} RSVP{confirmedRsvps.length === 1 ? "" : "s"}.</p>
            </div>

            <div className="mw-event-rsvp-admin-actions">
              <button type="button" onClick={() => window.print()}>Print list</button>
              <button type="button" onClick={exportRsvpsCsv}>Export CSV</button>
            </div>
          </div>

          {rsvpLoading ? (
            <div className="mw-event-rsvp-empty">Loading RSVPs…</div>
          ) : rsvps.length === 0 ? (
            <div className="mw-event-rsvp-empty">No RSVPs have been received yet.</div>
          ) : (
            <div className="mw-event-rsvp-table-wrap">
              <table className="mw-event-rsvp-table">
                <thead><tr><th className="mw-print-check">✓</th><th>Guest</th><th>Contact</th><th>Guests</th><th>Status</th><th>RSVP date</th></tr></thead>
                <tbody>
                  {rsvps.map((rsvp) => (
                    <tr key={rsvp.id}>
                      <td className="mw-print-check"><span /></td>
                      <td><strong>{rsvp.first_name} {rsvp.last_name}</strong>{rsvp.note && <small>{rsvp.note}</small>}</td>
                      <td><span>{rsvp.email}</span>{rsvp.phone && <small>{rsvp.phone}</small>}</td>
                      <td>{rsvp.guest_count}</td>
                      <td>
                        <select
                          className={`mw-rsvp-status-select is-${rsvp.status}`}
                          value={rsvp.status}
                          disabled={updatingRsvpId === rsvp.id}
                          onChange={(e) =>
                            updateRsvpStatus(
                              rsvp.id,
                              e.target.value as RsvpRow["status"],
                            )
                          }
                          aria-label={`RSVP status for ${rsvp.first_name} ${rsvp.last_name}`}
                        >
                          <option value="confirmed">Confirmed</option>
                          <option value="waitlisted">Waitlisted</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </td>
                      <td>{new Date(rsvp.created_at).toLocaleDateString("en-ZA", { day: "2-digit", month: "short", year: "numeric" })}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
