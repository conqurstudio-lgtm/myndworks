import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import "./admin-events.css";

export function AdminDashboard() {
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    let active = true;

    async function checkAccess() {
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

      if (active) setAllowed(true);
    }

    checkAccess();
    return () => { active = false; };
  }, []);

  async function signOut() {
    await supabase.auth.signOut();
    window.location.href = "/admin/login";
  }

  if (!allowed) {
    return <main className="mw-admin-auth"><div className="mw-admin-loading">Checking access…</div></main>;
  }

  return (
    <main className="mw-events-admin-shell">
      <header className="mw-events-admin-header">
        <div>
          <div className="mw-admin-brand">MyndWorks</div>
          <span className="mw-admin-label">Admin</span>
        </div>
        <button className="mw-admin-signout" type="button" onClick={signOut}>Sign out</button>
      </header>

      <section className="mw-admin-home">
        <div className="mw-admin-home-intro">
          <span className="mw-admin-label">Content management</span>
          <h1>MyndWorks Admin</h1>
          <p>Manage the content and experiences connected to the MyndWorks website.</p>
        </div>

        <div className="mw-admin-module-grid">
          <a className="mw-admin-module-card" href="/admin/events">
            <span className="mw-admin-module-index">01</span>
            <div>
              <h2>Events</h2>
              <p>Create events, manage RSVPs and guest lists.</p>
            </div>
            <span className="mw-admin-module-arrow">→</span>
          </a>

          <a className="mw-admin-module-card" href="/admin/blogs">
            <span className="mw-admin-module-index">02</span>
            <div>
              <h2>Blogs</h2>
              <p>Create and publish MyndWorks articles.</p>
            </div>
            <span className="mw-admin-module-arrow">→</span>
          </a>
        </div>
      </section>
    </main>
  );
}
