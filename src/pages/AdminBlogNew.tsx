import { BlogEditor } from "../components/BlogEditor";
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import "./admin-events.css";

type BlogStatus = "draft" | "published";

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/['"]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function AdminBlogNew() {
  const [allowed, setAllowed] = useState(false);
  const [userId, setUserId] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [title, setTitle] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [authorName, setAuthorName] = useState("MyndWorks");

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

      if (active) {
        setUserId(session.user.id);
        setAllowed(true);
      }
    }

    checkAccess();
    return () => { active = false; };
  }, []);

  async function saveBlog(status: BlogStatus) {
    setError("");

    const cleanTitle = title.trim();
    const slug = slugify(cleanTitle);

    if (cleanTitle.length < 2 || !slug) {
      setError("Please enter a blog title.");
      return;
    }

    setSaving(true);

    const { error: insertError } = await supabase.from("blog_posts").insert({
      title: cleanTitle,
      slug,
      excerpt: excerpt.trim() || null,
      content: content.trim(),
      author_name: authorName.trim() || "MyndWorks",
      status,
      published_at: status === "published" ? new Date().toISOString() : null,
      created_by: userId,
    });

    if (insertError) {
      setError(insertError.code === "23505" ? "Another article already uses this public link." : insertError.message);
      setSaving(false);
      return;
    }

    window.location.href = "/admin/blogs";
  }

  if (!allowed) {
    return <main className="mw-admin-auth"><div className="mw-admin-loading">Checking access…</div></main>;
  }

  return (
    <main className="mw-events-admin-shell">
      <header className="mw-events-admin-header">
        <div>
          <a className="mw-admin-brand mw-admin-brand-link" href="/admin">MyndWorks</a>
          <span className="mw-admin-label">Admin / Blogs</span>
        </div>
      </header>

      <section className="mw-blog-editor">
        <div className="mw-event-editor-head">
          <div>
            <a className="mw-admin-back-link" href="/admin/blogs">← Blogs</a>
            <span className="mw-admin-label">New article</span>
            <h1>Create blog</h1>
            <p>Write the article first. Editing, cover images and the public article page come next.</p>
          </div>
        </div>

        <div className="mw-event-form">
          <div className="mw-event-form-section">
            <div className="mw-event-form-section-title">
              <span>01</span>
              <div><h2>Article details</h2><p>Title, author and public summary.</p></div>
            </div>

            <div className="mw-event-form-fields is-grid">
              <label className="mw-field is-full">
                <span>Article title</span>
                <input type="text" maxLength={180} value={title} onChange={(e) => setTitle(e.target.value)} />
                {title && <small>Public link: /blog/{slugify(title)}</small>}
              </label>

              <label className="mw-field">
                <span>Author</span>
                <input type="text" value={authorName} onChange={(e) => setAuthorName(e.target.value)} />
              </label>

              <label className="mw-field is-full">
                <span>Excerpt</span>
                <textarea rows={3} maxLength={320} value={excerpt} onChange={(e) => setExcerpt(e.target.value)} placeholder="A short introduction shown on article cards." />
              </label>
            </div>
          </div>

          <div className="mw-event-form-section">
            <div className="mw-event-form-section-title">
              <span>02</span>
              <div><h2>Article content</h2><p>Write the main article body.</p></div>
            </div>

            <div className="mw-event-form-fields">
              <div className="mw-field is-full">
                <span>Content</span>
                <BlogEditor
                  value={content}
                  onChange={setContent}
                />
              </div>
            </div>
          </div>

          {error && <div className="mw-admin-error">{error}</div>}

          <div className="mw-event-form-actions">
            <a href="/admin/blogs">← Back to blogs</a>
            <div className="mw-blog-save-actions">
              <button type="button" className="mw-blog-secondary" disabled={saving} onClick={() => saveBlog("draft")}>Save draft</button>
              <button type="button" className="mw-admin-primary" disabled={saving} onClick={() => saveBlog("published")}>{saving ? "Saving..." : "Publish"}</button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
