import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import "./admin-events.css";

export function AdminEventsDashboard() {
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    let active = true;

    async function checkAccess() {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session?.user) {
        window.location.replace("/admin/events/login");
        return;
      }

      const { data: admin } = await supabase
        .from("admin_users")
        .select("user_id")
        .eq("user_id", session.user.id)
        .maybeSingle();

      if (!admin) {
        await supabase.auth.signOut();
        window.location.replace("/admin/events/login");
        return;
      }

      if (active) setAllowed(true);
    }

    checkAccess();

    return () => {
      active = false;
    };
  }, []);

  async function signOut() {
    await supabase.auth.signOut();
    window.location.href = "/admin/events/login";
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
          <div className="mw-admin-brand">MyndWorks</div>
          <span className="mw-admin-label">Events administration</span>
        </div>

        <button
          className="mw-admin-signout"
          type="button"
          onClick={signOut}
        >
          Sign out
        </button>
      </header>

      <section className="mw-events-admin-content">
        <div>
          <span className="mw-admin-label">Dashboard</span>
          <h1>Events</h1>
          <p>
            Your secure Events admin is connected. Next we’ll add event
            creation, publishing and RSVP management.
          </p>
        </div>

        <button className="mw-admin-primary" type="button" disabled>
          + New event
        </button>
      </section>
    </main>
  );
}
