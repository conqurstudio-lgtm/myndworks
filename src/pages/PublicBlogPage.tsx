import { useEffect, useState } from "react";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { BlogContentRenderer } from "../components/BlogContentRenderer";
import healthIcon from "../assets/health-icon.svg";
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

  useEffect(() => {
    if (blog?.title) {
      document.title = `${blog.title} | MyndWorks Journal`;
    }
  }, [blog?.title]);

  async function shareArticle() {
    const url = window.location.href;
    const title = blog?.title || "MyndWorks Journal";

    try {
      if (navigator.share) {
        await navigator.share({
          title,
          text: blog?.excerpt || "A MyndWorks Journal perspective.",
          url,
        });
        return;
      }

      await navigator.clipboard.writeText(url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch (error) {
      if ((error as Error)?.name !== "AbortError") {
        try {
          await navigator.clipboard.writeText(url);
          setCopied(true);
          window.setTimeout(() => setCopied(false), 1800);
        } catch {
          // Leave the page unchanged if sharing is unavailable.
        }
      }
    }
  }

  if (loading) {
    return (
      <>
        <Header />
        <main className="mw-public-blog-shell mw-public-blog-state-shell">
          <div className="mw-public-blog-loading">Loading article…</div>
        </main>
        <Footer />
      </>
    );
  }

  if (!blog) {
    return (
      <>
        <Header />
        <main className="mw-public-blog-shell mw-public-blog-state-shell">
          <section className="mw-public-blog-not-found">
            <span>Article unavailable</span>
            <h1>This article could not be found.</h1>
            <a href="/blog">Return to Journal →</a>
          </section>
        </main>
        <Footer />
      </>
    );
  }

  const publishedLabel = blog.published_at
    ? new Intl.DateTimeFormat("en-ZA", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      }).format(new Date(blog.published_at))
    : "Published";

  const author = blog.author_name || "MyndWorks";

  return (
    <>
      <Header />

      <main className="mw-public-blog-shell mw-public-blog-shell-integrated">
        <section className="mw-public-blog-topbar">
          <a href="/blog" className="mw-public-blog-back">
            <span aria-hidden="true">←</span>
            Back to Journal
          </a>
        </section>

        <section className="mw-public-blog-intro">
          <div className="mw-public-blog-intro-main">
            <span className="mw-public-blog-kicker">MyndWorks Journal</span>

            <h1>{blog.title}</h1>

            {blog.excerpt && (
              <p className="mw-public-blog-excerpt">{blog.excerpt}</p>
            )}

            <div className="mw-public-blog-meta">
              <div className="mw-public-blog-meta-item">
                <small>Author</small>
                <strong>{author}</strong>
              </div>

              <div className="mw-public-blog-meta-item">
                <small>Section</small>
                <strong>Journal</strong>
              </div>

              <div className="mw-public-blog-meta-item">
                <small>Date</small>
                <strong>{publishedLabel}</strong>
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

        <section
          className="mw-public-blog-chapter"
          aria-label="Article"
        >
          <img src={healthIcon} alt="" aria-hidden="true" />
          <span>Article</span>
          <i aria-hidden="true" />
        </section>

        <article className="mw-public-blog-article">
          <div className="mw-public-blog-content">
            <BlogContentRenderer content={blog.content} />
          </div>
        </article>

        <section className="mw-public-blog-share">
          <div>
            <span>Share this article</span>
            <p>Share this MyndWorks perspective with someone.</p>
          </div>

          <button
            type="button"
            className="mw-public-blog-share-icon"
            onClick={shareArticle}
            aria-label={copied ? "Article link copied" : "Share article"}
            title={copied ? "Link copied" : "Share article"}
          >
            {copied ? (
              <span aria-hidden="true">✓</span>
            ) : (
              <svg
                viewBox="0 0 24 24"
                aria-hidden="true"
                focusable="false"
              >
                <path d="M12 3v12" />
                <path d="M7.5 7.5 12 3l4.5 4.5" />
                <path d="M5 11v7a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-7" />
              </svg>
            )}
          </button>
        </section>
      </main>

      <Footer />
    </>
  );
}
