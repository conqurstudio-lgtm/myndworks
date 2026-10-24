import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import "./admin-events.css";

type BlogRow = {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  author_name: string | null;
  status: "draft" | "published";
  published_at: string | null;
  updated_at: string;
};

export function AdminBlogsDashboard() {
  const [allowed, setAllowed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [blogs, setBlogs] = useState<BlogRow[]>([]);
  const [error, setError] = useState("");

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
        .from("blog_posts")
        .select("id,title,slug,excerpt,author_name,status,published_at,updated_at")
        .order("updated_at", { ascending: false });

      if (!active) return;

      if (fetchError) setError(fetchError.message);
      else setBlogs((data ?? []) as BlogRow[]);

      setAllowed(true);
      setLoading(false);
    }

    load();
    return () => { active = false; };
  }, []);

  if (!allowed || loading) {
    return <main className="mw-admin-auth"><div className="mw-admin-loading">Loading blogs…</div></main>;
  }

  const publishedCount = blogs.filter((blog) => blog.status === "published").length;

  return (
    <main className="mw-events-admin-shell">
      <header className="mw-events-admin-header">
        <div>
          <a className="mw-admin-brand mw-admin-brand-link" href="/admin">MyndWorks</a>
          <span className="mw-admin-label">Admin / Blogs</span>
        </div>
        <a className="mw-admin-primary mw-admin-primary-link" href="/admin/blogs/new">+ New blog</a>
      </header>

      <section className="mw-blogs-admin">
        <div className="mw-events-page-head">
          <div>
            <a className="mw-admin-back-link" href="/admin">← Admin</a>
            <span className="mw-admin-label">Content management</span>
            <h1>Blogs</h1>
            <p>Create and publish MyndWorks articles from one place.</p>
          </div>
        </div>

        <div className="mw-blog-stats">
          <div><span>Total articles</span><strong>{blogs.length}</strong></div>
          <div><span>Published</span><strong>{publishedCount}</strong></div>
          <div><span>Drafts</span><strong>{blogs.length - publishedCount}</strong></div>
        </div>

        {error && <div className="mw-admin-error">{error}</div>}

        {blogs.length === 0 ? (
          <div className="mw-blog-empty">
            <span>No articles yet</span>
            <h2>Create your first MyndWorks article.</h2>
            <a className="mw-admin-primary mw-admin-primary-link" href="/admin/blogs/new">+ New blog</a>
          </div>
        ) : (
          <div className="mw-blog-list">
            {blogs.map((blog) => (
              <div className="mw-blog-row" key={blog.id}>
                <div className="mw-blog-row-main">
                  <span className={`mw-blog-status is-${blog.status}`}>{blog.status}</span>
                  <h2>{blog.title}</h2>
                  {blog.excerpt && <p>{blog.excerpt}</p>}
                </div>
                <div className="mw-blog-row-meta">
                  <span>{blog.author_name || "MyndWorks"}</span>
                  <span>Updated {new Date(blog.updated_at).toLocaleDateString("en-ZA", { day: "2-digit", month: "short", year: "numeric" })}</span>
                  <span>/blog/{blog.slug}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
