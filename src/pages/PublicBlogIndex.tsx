import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import "./public-blog-index.css";

type BlogCard = {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  cover_image_url: string | null;
  author_name: string | null;
  published_at: string | null;
};

export function PublicBlogIndex() {
  const [blogs, setBlogs] = useState<BlogCard[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.title = "Journal | MyndWorks";

    let active = true;

    async function load() {
      const { data } = await supabase
        .from("blog_posts")
        .select(
          "id,title,slug,excerpt,cover_image_url,author_name,published_at",
        )
        .eq("status", "published")
        .order("published_at", { ascending: false });

      if (!active) return;

      setBlogs((data ?? []) as BlogCard[]);
      setLoading(false);
    }

    load();

    return () => {
      active = false;
    };
  }, []);

  return (
    <main className="mw-journal-shell">
      <header className="mw-journal-header">
        <a href="/" className="mw-journal-brand">
          MyndWorks
        </a>

        <a href="/" className="mw-journal-home">
          Visit website ↗
        </a>
      </header>

      <section className="mw-journal-intro">
        <div>
          <span className="mw-journal-kicker">
            MyndWorks Journal
          </span>
          <h1>
            Thoughts for a healthier{" "}
            <span>inner life.</span>
          </h1>
        </div>

        <p>
          Practical perspectives on mental wellbeing,
          relationships, emotional health and the everyday
          experiences that shape how we feel.
        </p>
      </section>

      <section className="mw-journal-feed">
        {loading ? (
          <div className="mw-journal-empty">
            Loading journal…
          </div>
        ) : blogs.length === 0 ? (
          <div className="mw-journal-empty">
            <span>Journal</span>
            <h2>New perspectives are coming soon.</h2>
          </div>
        ) : (
          <div className="mw-journal-grid">
            {blogs.map((blog, index) => {
              const date = blog.published_at
                ? new Intl.DateTimeFormat("en-ZA", {
                    day: "2-digit",
                    month: "long",
                    year: "numeric",
                  }).format(new Date(blog.published_at))
                : "";

              return (
                <a
                  key={blog.id}
                  href={`/blog/${blog.slug}`}
                  className={[
                    "mw-journal-card",
                    index === 0 ? "is-featured" : "",
                  ]
                    .filter(Boolean)
                    .join(" ")}
                >
                  <div className="mw-journal-card-image">
                    {blog.cover_image_url ? (
                      <img
                        src={blog.cover_image_url}
                        alt=""
                        loading={index === 0 ? "eager" : "lazy"}
                      />
                    ) : (
                      <div className="mw-journal-card-placeholder">
                        MyndWorks
                      </div>
                    )}
                  </div>

                  <div className="mw-journal-card-copy">
                    <div className="mw-journal-card-meta">
                      <span>
                        {blog.author_name || "MyndWorks"}
                      </span>
                      {date && <span>{date}</span>}
                    </div>

                    <h2>{blog.title}</h2>

                    {blog.excerpt && <p>{blog.excerpt}</p>}

                    <span className="mw-journal-read">
                      Read article →
                    </span>
                  </div>
                </a>
              );
            })}
          </div>
        )}
      </section>

      <footer className="mw-journal-footer">
        <span>MyndWorks</span>
        <a href="/">Back to website →</a>
      </footer>
    </main>
  );
}
