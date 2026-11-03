import { BlogEditor } from "../components/BlogEditor";
import { useEffect, useState, type ChangeEvent } from "react";
import { supabase } from "../lib/supabase";
import "./admin-events.css";

type BlogStatus = "draft" | "published";

type BlogRecord = {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  cover_image_url: string | null;
  author_name: string | null;
  status: BlogStatus;
  published_at: string | null;
};

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/['"]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function AdminBlogEdit({ blogId }: { blogId: string }) {
  const [allowed, setAllowed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);

  const [title, setTitle] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [coverImageUrl, setCoverImageUrl] = useState("");
  const [authorName, setAuthorName] = useState("MyndWorks");
  const [status, setStatus] = useState<BlogStatus>("draft");
  const [publishedAt, setPublishedAt] = useState<string | null>(null);

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
          "id,title,slug,excerpt,content,cover_image_url,author_name,status,published_at",
        )
        .eq("id", blogId)
        .maybeSingle();

      if (!active) return;

      if (fetchError || !data) {
        setError(fetchError?.message || "Article not found.");
        setAllowed(true);
        setLoading(false);
        return;
      }

      const blog = data as BlogRecord;

      setTitle(blog.title);
      setExcerpt(blog.excerpt || "");
      setContent(blog.content || "");
      setCoverImageUrl(blog.cover_image_url || "");
      setAuthorName(blog.author_name || "MyndWorks");
      setStatus(blog.status);
      setPublishedAt(blog.published_at);
      setAllowed(true);
      setLoading(false);
    }

    load();

    return () => {
      active = false;
    };
  }, [blogId]);

  async function saveBlog(nextStatus?: BlogStatus) {
    setError("");
    setSaved(false);

    const cleanTitle = title.trim();
    const slug = slugify(cleanTitle);
    const finalStatus = nextStatus ?? status;

    if (cleanTitle.length < 2 || !slug) {
      setError("Please enter an article title.");
      return;
    }

    setSaving(true);

    const nextPublishedAt =
      finalStatus === "published"
        ? publishedAt || new Date().toISOString()
        : null;

    const { error: updateError } = await supabase
      .from("blog_posts")
      .update({
        title: cleanTitle,
        slug,
        excerpt: excerpt.trim() || null,
        content: content.trim(),
        author_name: authorName.trim() || "MyndWorks",
        status: finalStatus,
        published_at: nextPublishedAt,
      })
      .eq("id", blogId);

    if (updateError) {
      if (updateError.code === "23505") {
        setError("Another article already uses this public link.");
      } else {
        setError(updateError.message);
      }

      setSaving(false);
      return;
    }

    setStatus(finalStatus);
    setPublishedAt(nextPublishedAt);
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

    const objectPath = `${blogId}/${Date.now()}-${safeName}`;

    const { error: uploadError } = await supabase.storage
      .from("blog-covers")
      .upload(objectPath, file, {
        cacheControl: "3600",
        upsert: false,
      });

    if (uploadError) {
      setError(uploadError.message);
      setUploading(false);
      return;
    }

    const { data } = supabase.storage
      .from("blog-covers")
      .getPublicUrl(objectPath);

    const publicUrl = data.publicUrl;

    const { error: updateError } = await supabase
      .from("blog_posts")
      .update({ cover_image_url: publicUrl })
      .eq("id", blogId);

    if (updateError) {
      setError(updateError.message);
      setUploading(false);
      return;
    }

    setCoverImageUrl(publicUrl);
    setUploading(false);
    setSaved(true);
  }

  if (!allowed || loading) {
    return (
      <main className="mw-admin-auth">
        <div className="mw-admin-loading">Loading article…</div>
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
        </div>
      </header>

      <section className="mw-blog-editor">
        <div className="mw-event-editor-head">
          <div>
            <a className="mw-admin-back-link" href="/admin/blogs">
              <span className="mw-admin-back-link-icon" aria-hidden="true">
                ←
              </span>
              <span>Back to blogs</span>
            </a>
            <h1>{title || "Article"}</h1>
            <p>Update the article, cover image and publishing status.</p>
          </div>

          {status === "published" && title && (
            <a
              className="mw-admin-primary mw-admin-primary-link"
              href={`/blog/${slugify(title)}`}
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
              <div>
                <h2>Cover image</h2>
                <p>Recommended: wide landscape image under 5 MB.</p>
              </div>
            </div>

            <div className="mw-event-cover-editor">
              <div className="mw-event-cover-preview">
                {coverImageUrl ? (
                  <img src={coverImageUrl} alt="" />
                ) : (
                  <span>No cover image yet</span>
                )}
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
              <div>
                <h2>Article details</h2>
                <p>Title, author and public summary.</p>
              </div>
            </div>

            <div className="mw-event-form-fields is-grid">
              <label className="mw-field is-full">
                <span>Article title</span>
                <input
                  type="text"
                  maxLength={180}
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
                {title && <small>Public link: /blog/{slugify(title)}</small>}
              </label>

              <label className="mw-field">
                <span>Author</span>
                <input
                  type="text"
                  value={authorName}
                  onChange={(e) => setAuthorName(e.target.value)}
                />
              </label>

              <label className="mw-field">
                <span>Status</span>
                <select
                  value={status}
                  onChange={(e) =>
                    setStatus(e.target.value as BlogStatus)
                  }
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                </select>
              </label>

              <label className="mw-field is-full">
                <span>Excerpt</span>
                <textarea
                  rows={3}
                  maxLength={320}
                  value={excerpt}
                  onChange={(e) => setExcerpt(e.target.value)}
                />
              </label>
            </div>
          </div>

          <div className="mw-event-form-section">
            <div className="mw-event-form-section-title">
              <div>
                <h2>Article content</h2>
                <p>Write the main article body.</p>
              </div>
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
          {saved && (
            <div className="mw-admin-success">
              Article changes saved.
            </div>
          )}

          <div className="mw-event-form-actions">
            <a href="/admin/blogs">← Back to blogs</a>

            <div className="mw-blog-save-actions">
              <button
                type="button"
                className="mw-blog-secondary"
                disabled={saving || uploading}
                onClick={() => saveBlog("draft")}
              >
                Save draft
              </button>

              <button
                type="button"
                className="mw-admin-primary"
                disabled={saving || uploading}
                onClick={() => saveBlog("published")}
              >
                {saving ? "Saving..." : "Publish"}
              </button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
