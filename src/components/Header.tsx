import { useEffect, useState } from "react";
import myndworksMark from "../assets/myndworks-mark.svg";
import { cn } from "./ui";

const NAV_LINKS = [
  { label: "About", href: "#about" },
  { label: "Services", href: "#services" },
  { label: "Your first visit", href: "#first-visit" },
  { label: "Stories", href: "#stories" },
  { label: "FAQ", href: "#faq" },
] as const;

export function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);

    onScroll();

    window.addEventListener("scroll", onScroll, {
      passive: true,
    });

    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };

    const onResize = () => {
      if (window.innerWidth >= 768) {
        setOpen(false);
      }
    };

    window.addEventListener("keydown", onKey);
    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <header className="site-header">
      <div className={cn("nav-shell", scrolled && "is-scrolled")}>
        <a
          className="brand"
          href="#top"
          aria-label="MyndWorks home"
        >
          <img
            className="brand-mark"
            src={myndworksMark}
            alt=""
            aria-hidden="true"
          />

          <span className="wordmark">
            MyndWorks
          </span>
        </a>

        <nav
          className="desktop-nav"
          aria-label="Primary navigation"
        >
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
            >
              {link.label}
            </a>
          ))}
        </nav>

        <a
          className="btn-lime header-cta"
          href="#contact"
        >
          Book a session
        </a>

        <button
          type="button"
          className={cn(
            "menu-toggle",
            open && "is-open"
          )}
          aria-label={
            open ? "Close menu" : "Open menu"
          }
          aria-expanded={open}
          aria-controls="mobile-navigation"
          onClick={() =>
            setOpen((value) => !value)
          }
        >
          <span className="menu-toggle-line" />
          <span className="menu-toggle-line" />
          <span className="menu-toggle-line" />
        </button>
      </div>

      <nav
        id="mobile-navigation"
        className={cn(
          "mobile-menu",
          open && "is-open"
        )}
        aria-label="Mobile navigation"
        aria-hidden={!open}
      >
        {NAV_LINKS.map((link) => (
          <a
            key={link.href}
            className="mobile-link"
            href={link.href}
            onClick={() => setOpen(false)}
          >
            {link.label}
          </a>
        ))}

        <a
          className="btn-lime"
          href="#contact"
          onClick={() => setOpen(false)}
        >
          Book a session
        </a>
      </nav>
    </header>
  );
}
