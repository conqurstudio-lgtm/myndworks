import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import "./admin-events.css";

type BlogRow = {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  cover_image_url: string | null;
  author_name: string | null;
  status: "draft" | "published";
  published_at: string | null;
  updated_at: string;
};

type BlogSummaryIconKind =
  | "articles"
  | "published"
  | "drafts";

function BlogSummaryIcon({
  kind,
}: {
  kind: BlogSummaryIconKind;
}) {
  if (kind === "articles") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M6 3.5h8l4 4v13H6z" />
        <path d="M14 3.5v4h4" />
        <path d="M9 12h6M9 15.5h5" />
      </svg>
    );
  }

  if (kind === "published") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <circle cx="12" cy="12" r="8.5" />
        <path d="m8.6 12 2.1 2.2 4.8-5" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="m5 16.8-.6 2.8 2.8-.6L17.5 8.7 15.3 6.5 5 16.8Z" />
      <path d="m13.9 7.9 2.2 2.2" />
      <path d="M9 20h10" />
    </svg>
  );
}

export function AdminBlogsDashboard() {
  const [allowed, setAllowed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [blogs, setBlogs] = useState<BlogRow[]>([]);
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

      const { data, error: fetchError } = await supabase
        .from("blog_posts")
        .select(
          "id,title,slug,excerpt,cover_image_url,author_name,status,published_at,updated_at",
        )
        .order("updated_at", { ascending: false });

      if (!active) return;

      if (fetchError) {
        setError(fetchError.message);
      } else {
        setBlogs((data ?? []) as BlogRow[]);
      }

      setAllowed(true);
      setLoading(false);
    }

    load();

    return () => {
      active = false;
    };
  }, []);

  if (!allowed || loading) {
    return (
      <main className="mw-admin-auth">
        <div className="mw-admin-loading">Loading blogs…</div>
      </main>
    );
  }

  const publishedCount = blogs.filter(
    (blog) => blog.status === "published",
  ).length;

  return (
    <main className="mw-events-admin-shell">
      <header className="mw-events-admin-header">
        <div>
          <a className="mw-admin-brand mw-admin-brand-link" href="/admin">
            MyndWorks
          </a>
        </div>
      </header>

      <section className="mw-blogs-admin">
        <div className="mw-events-page-head mw-blogs-page-head">
          <div>
            <a className="mw-admin-back-link" href="/admin">
              <span className="mw-admin-back-link-icon" aria-hidden="true">
                ←
              </span>
              <span>Back to Admin</span>
            </a>

            <h1>Blogs</h1>
            <p>Create and publish MyndWorks articles from one place.</p>
          </div>

          <a
            className="mw-admin-primary mw-admin-primary-link"
            href="/admin/blogs/new"
          >
            + New blog
          </a>
        </div>

        <div className="mw-blog-stats mw-blog-summary-grid">
          <div className="mw-blog-summary-card">
            <div className="mw-blog-summary-card-head">
              <span>Total articles</span>
              <BlogSummaryIcon kind="articles" />
            </div>
            <strong>{blogs.length}</strong>
            <small>All articles</small>
          </div>

          <div className="mw-blog-summary-card">
            <div className="mw-blog-summary-card-head">
              <span>Published</span>
              <BlogSummaryIcon kind="published" />
            </div>
            <strong>{publishedCount}</strong>
            <small>Visible on the website</small>
          </div>

          <div className="mw-blog-summary-card">
            <div className="mw-blog-summary-card-head">
              <span>Drafts</span>
              <BlogSummaryIcon kind="drafts" />
            </div>
            <strong>{blogs.length - publishedCount}</strong>
            <small>Still in progress</small>
          </div>
        </div>

        {error && <div className="mw-admin-error">{error}</div>}

        {blogs.length === 0 ? (
          <div className="mw-blog-empty">
            <span>No articles yet</span>
            <h2>Create your first MyndWorks article.</h2>
            <a
              className="mw-admin-primary mw-admin-primary-link"
              href="/admin/blogs/new"
            >
              + New blog
            </a>
          </div>
        ) : (
          <div className="mw-blog-list">
            {blogs.map((blog) => (
              <a
                className="mw-blog-row mw-blog-row-v2"
                key={blog.id}
                href={`/admin/blogs/${blog.id}`}
              >
                <span className="mw-blog-row-thumb" aria-hidden="true">
                  {blog.cover_image_url ? (
                    <img src={blog.cover_image_url} alt="" />
                  ) : (
                    <span className="mw-blog-row-thumb-placeholder">
                      Journal
                    </span>
                  )}
                </span>

                <div className="mw-blog-row-main">
                  <span className={`mw-blog-status is-${blog.status}`}>
                    {blog.status}
                  </span>

                  <h2>{blog.title}</h2>

                  {blog.excerpt && <p>{blog.excerpt}</p>}

                  <div className="mw-blog-row-details">
                    <span>{blog.author_name || "MyndWorks"}</span>
                    <span>
                      Updated{" "}
                      {new Date(blog.updated_at).toLocaleDateString(
                        "en-ZA",
                        {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        },
                      )}
                    </span>
                  </div>
                </div>

                <span className="mw-blog-row-arrow" aria-hidden="true">
                  ↗
                </span>
              </a>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
