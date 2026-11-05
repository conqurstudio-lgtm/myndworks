import { useEffect, useState, type ReactNode } from "react";
import { supabase } from "../lib/supabase";
import "./admin-events.css";

type ModuleIconProps = {
  kind: "events" | "blogs";
};

function ModuleIcon({ kind }: ModuleIconProps) {
  if (kind === "events") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <rect x="3.5" y="5.5" width="17" height="15" rx="2.5" />
        <path d="M7.5 3.5v4M16.5 3.5v4M3.5 9.5h17" />
        <path d="M8 13h3M8 16.5h6" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M6 3.5h8l4 4v13H6z" />
      <path d="M14 3.5v4h4M9 12h6M9 15.5h6" />
    </svg>
  );
}

function AdminModuleCard({
  href,
  icon,
  title,
  description,
  detail,
}: {
  href: string;
  icon: ModuleIconProps["kind"];
  title: string;
  description: string;
  detail: ReactNode;
}) {
  return (
    <a className="mw-admin-module-card mw-admin-module-card-v2" href={href}>
      <div className="mw-admin-module-card-top">
        <span className="mw-admin-module-icon">
          <ModuleIcon kind={icon} />
        </span>

        <span className="mw-admin-module-arrow" aria-hidden="true">
          ↗
        </span>
      </div>

      <div className="mw-admin-module-card-body">
        <h2>{title}</h2>
        <p>{description}</p>
      </div>

      <div className="mw-admin-module-card-detail">
        {detail}
      </div>
    </a>
  );
}

export function AdminDashboard() {
  const [allowed, setAllowed] = useState(false);

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
        setAllowed(true);
      }
    }

    checkAccess();

    return () => {
      active = false;
    };
  }, []);

  async function signOut() {
    await supabase.auth.signOut();
    window.location.href = "/admin/login";
  }

  if (!allowed) {
    return (
      <main className="mw-admin-auth">
        <div className="mw-admin-loading">
          Checking access…
        </div>
      </main>
    );
  }

  return (
    <main className="mw-events-admin-shell">
      <header className="mw-events-admin-header mw-admin-header-v2">
        <div className="mw-admin-brand">
          MyndWorks
        </div>

        <div className="mw-admin-header-actions">
          <a
            className="mw-admin-account-link"
            href="/admin/profile"
          >
            My account
          </a>

          <button
          className="mw-admin-signout"
          type="button"
          onClick={signOut}
        >
          Sign out
        </button>
        </div>
      </header>

      <section className="mw-admin-home mw-admin-home-v2">
        <div className="mw-admin-home-intro mw-admin-home-intro-v2">
          <h1>MyndWorks Admin</h1>
          <p>Choose what you want to manage.</p>
        </div>

        <div className="mw-admin-module-grid mw-admin-module-grid-v2">
          <AdminModuleCard
            href="/admin/events"
            icon="events"
            title="Events"
            description="Create and publish events, manage RSVPs and keep track of guest lists."
            detail={
              <>
                <span>Events</span>
                <span>RSVPs</span>
                <span>Guest lists</span>
              </>
            }
          />

          <AdminModuleCard
            href="/admin/blogs"
            icon="blogs"
            title="Blogs"
            description="Write, edit and publish MyndWorks articles from one place."
            detail={
              <>
                <span>Articles</span>
                <span>Drafts</span>
                <span>Publishing</span>
              </>
            }
          />
        </div>
      </section>
    </main>
  );
}
