import { useEffect, useState } from "react";
import { BlogContentRenderer } from "../components/BlogContentRenderer";
import { supabase } from "../lib/supabase";
import "./public-blog.css";

type PublicBlog = {
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  cover_image_url: string | null;
  author_name: string | null;
  published_at: string | null;
};

export function PublicBlogPage({ slug }: { slug: string }) {
  const [blog, setBlog] = useState<PublicBlog | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    let active = true;

    async function load() {
      const { data } = await supabase
        .from("blog_posts")
        .select(
          "title,slug,excerpt,content,cover_image_url,author_name,published_at",
        )
        .eq("slug", slug)
        .eq("status", "published")
        .maybeSingle();

      if (!active) return;

      setBlog((data as PublicBlog | null) ?? null);
      setLoading(false);
    }

    load();

    return () => {
      active = false;
    };
  }, [slug]);

  async function copyLink() {
    await navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  }

  if (loading) {
    return (
      <main className="mw-public-blog-shell">
        <div className="mw-public-blog-loading">Loading article…</div>
      </main>
    );
  }

  if (!blog) {
    return (
      <main className="mw-public-blog-shell">
        <section className="mw-public-blog-not-found">
          <a href="/" className="mw-public-blog-brand">
            MyndWorks
          </a>
          <span>Article unavailable</span>
          <h1>This article could not be found.</h1>
          <a href="/">Return to MyndWorks →</a>
        </section>
      </main>
    );
  }

  const publishedLabel = blog.published_at
    ? new Intl.DateTimeFormat("en-ZA", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      }).format(new Date(blog.published_at))
    : "";

  const author = blog.author_name || "MyndWorks";

  const authorInitials = author
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("");

  const shareText = encodeURIComponent(
    `${blog.title} — ${window.location.href}`,
  );

  const whatsappUrl = `https://wa.me/?text=${shareText}`;

  return (
    <main className="mw-public-blog-shell">
      <header className="mw-public-blog-header">
        <a href="/" className="mw-public-blog-brand">
          MyndWorks
        </a>

        <a href="/" className="mw-public-blog-home">
          Visit website ↗
        </a>
      </header>

      <section className="mw-public-blog-intro">
        <div className="mw-public-blog-intro-rail">
          <a href="/" className="mw-public-blog-back">
            ← Back to MyndWorks
          </a>
        </div>

        <div className="mw-public-blog-intro-main">
          <span className="mw-public-blog-kicker">
            MyndWorks Journal
          </span>

          <h1>{blog.title}</h1>

          {blog.excerpt && (
            <p className="mw-public-blog-excerpt">
              {blog.excerpt}
            </p>
          )}

          <div className="mw-public-blog-meta">
            <div className="mw-public-blog-author">
              <span className="mw-public-blog-author-avatar">
                {authorInitials || "MW"}
              </span>
              <div>
                <small>Author</small>
                <strong>{author}</strong>
              </div>
            </div>

            <div className="mw-public-blog-meta-item">
              <small>Section</small>
              <strong>Journal</strong>
            </div>

            <div className="mw-public-blog-meta-item">
              <small>Date</small>
              <strong>{publishedLabel || "Published"}</strong>
            </div>
          </div>
        </div>
      </section>

      <section className="mw-public-blog-cover-wrap">
        <div className="mw-public-blog-cover">
          {blog.cover_image_url ? (
            <img src={blog.cover_image_url} alt="" />
          ) : (
            <div className="mw-public-blog-cover-placeholder">
              <span>MyndWorks</span>
            </div>
          )}
        </div>
      </section>

      <article className="mw-public-blog-article">
        <div className="mw-public-blog-content">
          <BlogContentRenderer content={blog.content} />
        </div>
      </article>

      <section className="mw-public-blog-share">
        <div>
          <span>Share this article</span>
          <p>
            Share this MyndWorks perspective with someone.
          </p>
        </div>

        <div className="mw-public-blog-share-actions">
          <button type="button" onClick={copyLink}>
            {copied ? "Copied" : "Copy link"}
          </button>

          <a
            href={whatsappUrl}
            target="_blank"
            rel="noreferrer"
          >
            WhatsApp ↗
          </a>
        </div>
      </section>

      <footer className="mw-public-blog-footer">
        <span>MyndWorks</span>
        <span>Mental wellbeing, approached with care.</span>
      </footer>
    </main>
  );
}
