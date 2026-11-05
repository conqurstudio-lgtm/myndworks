import { useEffect, useState } from "react";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import healthIcon from "../assets/health-icon.svg";
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

function formatDate(value: string | null) {
  if (!value) return "";

  return new Intl.DateTimeFormat("en-ZA", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(new Date(value));
}

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

  const featured = blogs[0];
  const remaining = blogs.slice(1);

  return (
    <>
      <Header />

      <main className="mw-journal-shell mw-journal-shell-integrated">
        <section
          className="mw-journal-chapter mw-journal-chapter-primary"
          aria-label="Journal"
        >
          <img src={healthIcon} alt="" aria-hidden="true" />
          <span>Journal</span>
          <i aria-hidden="true" />
        </section>

        {loading ? (
          <section className="mw-journal-state">
            <p>Loading journal…</p>
          </section>
        ) : blogs.length === 0 ? (
          <section className="mw-journal-state">
            <h1>New perspectives are coming soon.</h1>
            <p>
              MyndWorks articles on mental wellbeing, relationships and
              everyday emotional health will appear here.
            </p>
          </section>
        ) : (
          <>
            <section className="mw-journal-featured">
              <a
                href={`/blog/${featured.slug}`}
                className="mw-journal-featured-image"
                aria-label={`Read ${featured.title}`}
              >
                {featured.cover_image_url ? (
                  <img
                    src={featured.cover_image_url}
                    alt=""
                    loading="eager"
                  />
                ) : (
                  <div className="mw-journal-image-placeholder">
                    MyndWorks
                  </div>
                )}
              </a>

              <div className="mw-journal-featured-copy">
                <span className="mw-journal-eyebrow">
                  Latest perspective
                </span>

                <div className="mw-journal-meta">
                  <span>{featured.author_name || "MyndWorks"}</span>
                  {featured.published_at && (
                    <>
                      <b aria-hidden="true">•</b>
                      <span>{formatDate(featured.published_at)}</span>
                    </>
                  )}
                </div>

                <h1>{featured.title}</h1>

                {featured.excerpt && (
                  <p>{featured.excerpt}</p>
                )}

                <a
                  href={`/blog/${featured.slug}`}
                  className="mw-journal-read"
                >
                  Read article <span aria-hidden="true">↗</span>
                </a>
              </div>
            </section>

            {remaining.length > 0 && (
              <section className="mw-journal-more">
                <div className="mw-journal-chapter mw-journal-chapter-secondary">
                  <img src={healthIcon} alt="" aria-hidden="true" />
                  <span>More from the Journal</span>
                  <i aria-hidden="true" />
                </div>

                <div
                  className={[
                    "mw-journal-grid",
                    remaining.length === 1 ? "is-single" : "",
                  ]
                    .filter(Boolean)
                    .join(" ")}
                >
                  {remaining.map((blog) => (
                    <a
                      key={blog.id}
                      href={`/blog/${blog.slug}`}
                      className="mw-journal-card"
                    >
                      <div className="mw-journal-card-image">
                        {blog.cover_image_url ? (
                          <img
                            src={blog.cover_image_url}
                            alt=""
                            loading="lazy"
                          />
                        ) : (
                          <div className="mw-journal-image-placeholder">
                            MyndWorks
                          </div>
                        )}
                      </div>

                      <div className="mw-journal-card-copy">
                        <div className="mw-journal-meta">
                          <span>{blog.author_name || "MyndWorks"}</span>
                          {blog.published_at && (
                            <>
                              <b aria-hidden="true">•</b>
                              <span>{formatDate(blog.published_at)}</span>
                            </>
                          )}
                        </div>

                        <h2>{blog.title}</h2>

                        {blog.excerpt && (
                          <p>{blog.excerpt}</p>
                        )}

                        <span className="mw-journal-card-link">
                          Read article <span aria-hidden="true">↗</span>
                        </span>
                      </div>
                    </a>
                  ))}
                </div>
              </section>
            )}
          </>
        )}
      </main>

      <Footer />
    </>
  );
}
