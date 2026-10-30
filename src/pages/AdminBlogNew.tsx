import {
  useEffect,
  useState,
  type ChangeEvent,
  type FormEvent,
} from "react";
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

  const [coverImageFile, setCoverImageFile] =
    useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState("");

  const [title, setTitle] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");

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

  function handleCoverChange(
    event: ChangeEvent<HTMLInputElement>,
  ) {
    const file = event.target.files?.[0];

    if (!file) {
      setCoverImageFile(null);
      setCoverPreview("");
      return;
    }

    setError("");

    if (
      !["image/jpeg", "image/png", "image/webp"].includes(
        file.type,
      )
    ) {
      setError("Use a JPG, PNG or WebP image.");
      event.target.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("Cover image must be 5 MB or smaller.");
      event.target.value = "";
      return;
    }

    setCoverImageFile(file);

    const reader = new FileReader();
    reader.onload = () => {
      setCoverPreview(
        typeof reader.result === "string"
          ? reader.result
          : "",
      );
    };
    reader.readAsDataURL(file);
  }

  async function savePost(status: BlogStatus) {
    setError("");

    const slug = slugify(title);

    if (!title.trim() || !slug) {
      setError("Please enter an article title.");
      return;
    }

    if (!content.trim()) {
      setError("Please add the article content.");
      return;
    }

    setSaving(true);

    let coverImageUrl: string | null = null;
    let uploadedObjectPath: string | null = null;

    if (coverImageFile) {
      const safeName = coverImageFile.name
        .toLowerCase()
        .replace(/[^a-z0-9.]+/g, "-")
        .replace(/^-+|-+$/g, "");

      const objectPath =
        `new/${userId}/${Date.now()}-${safeName}`;

      const { error: uploadError } =
        await supabase.storage
          .from("blog-covers")
          .upload(objectPath, coverImageFile, {
            cacheControl: "3600",
            upsert: false,
          });

      if (uploadError) {
        setError(uploadError.message);
        setSaving(false);
        return;
      }

      const { data } = supabase.storage
        .from("blog-covers")
        .getPublicUrl(objectPath);

      coverImageUrl = data.publicUrl;
      uploadedObjectPath = objectPath;
    }

    const payload = {
      title: title.trim(),
      slug,
      excerpt: excerpt.trim() || null,
      content: content.trim(),
      cover_image_url: coverImageUrl,
      status,
      created_by: userId,
    };

    const { error: insertError } = await supabase
      .from("blog_posts")
      .insert(payload);

    if (insertError) {
      if (uploadedObjectPath) {
        await supabase.storage
          .from("blog-covers")
          .remove([uploadedObjectPath]);
      }

      if (insertError.code === "23505") {
        setError(
          "An article with this title/link already exists. Change the title slightly.",
        );
      } else {
        setError(insertError.message);
      }

      setSaving(false);
      return;
    }

    window.location.href = "/admin/blogs";
  }

  function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();
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
      <header className="mw-events-admin-header">
        <div>
          <a
            className="mw-admin-brand mw-admin-brand-link"
            href="/admin"
          >
            MyndWorks
          </a>
          <span className="mw-admin-label">
            Admin / Journal
          </span>
        </div>
      </header>

      <section className="mw-event-editor">
        <div className="mw-event-editor-head">
          <div>
            <a
              className="mw-admin-back-link"
              href="/admin/blogs"
            >
              ← Journal
            </a>

            <span className="mw-admin-label">
              New article
            </span>

            <h1>Create article</h1>

            <p>
              Add the article information, cover image and
              content below.
            </p>
          </div>
        </div>

        <form
          className="mw-event-form"
          onSubmit={handleSubmit}
        >
          <div className="mw-event-form-section">
            <div className="mw-event-form-section-title">
              <span>01</span>
              <div>
                <h2>Cover image</h2>
                <p>
                  Optional. Recommended: wide landscape image
                  under 5 MB.
                </p>
              </div>
            </div>

            <div className="mw-event-cover-editor">
              <div className="mw-event-cover-preview">
                {coverPreview ? (
                  <img src={coverPreview} alt="" />
                ) : (
                  <span>No cover image selected</span>
                )}
              </div>

              <label className="mw-event-upload-button">
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handleCoverChange}
                  disabled={saving}
                />

                {coverImageFile
                  ? "Change cover image"
                  : "Choose cover image"}
              </label>

              {coverImageFile && (
                <small>
                  {coverImageFile.name} — image will upload
                  when the article is saved.
                </small>
              )}
            </div>
          </div>

          <div className="mw-event-form-section">
            <div className="mw-event-form-section-title">
              <span>02</span>
              <div>
                <h2>Article details</h2>
                <p>
                  The information people will see on the
                  Journal page.
                </p>
              </div>
            </div>

            <div className="mw-event-form-fields">
              <label className="mw-field is-full">
                <span>Article title</span>
                <input
                  type="text"
                  required
                  maxLength={180}
                  value={title}
                  onChange={(e) =>
                    setTitle(e.target.value)
                  }
                  placeholder="Signs of emotional burnout and how to reset"
                />

                {title && (
                  <small>
                    Link preview: /blog/{slugify(title)}
                  </small>
                )}
              </label>

              <label className="mw-field is-full">
                <span>Excerpt</span>
                <textarea
                  rows={3}
                  maxLength={320}
                  value={excerpt}
                  onChange={(e) =>
                    setExcerpt(e.target.value)
                  }
                  placeholder="A short summary for cards and sharing."
                />
              </label>
            </div>
          </div>

          <div className="mw-event-form-section">
            <div className="mw-event-form-section-title">
              <span>03</span>
              <div>
                <h2>Article content</h2>
                <p>
                  Write the full article content below.
                </p>
              </div>
            </div>

            <div className="mw-event-form-fields">
              <label className="mw-field is-full">
                <span>Content</span>
                <textarea
                  rows={18}
                  value={content}
                  onChange={(e) =>
                    setContent(e.target.value)
                  }
                  placeholder="Write your article content here..."
                />
              </label>
            </div>
          </div>

          {error && (
            <div className="mw-admin-error mw-event-form-error">
              {error}
            </div>
          )}

          <div className="mw-event-form-actions">
            <a href="/admin/blogs">Cancel</a>

            <div>
              <button
                type="button"
                className="mw-event-secondary-button"
                disabled={saving}
                onClick={() => savePost("draft")}
              >
                {saving ? "Saving..." : "Save draft"}
              </button>

              <button
                type="button"
                className="mw-admin-primary"
                disabled={saving}
                onClick={() => savePost("published")}
              >
                {saving
                  ? "Saving..."
                  : "Publish article"}
              </button>
            </div>
          </div>
        </form>
      </section>
    </main>
  );
}
