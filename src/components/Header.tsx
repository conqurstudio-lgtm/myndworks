import {
  useEffect,
  useRef,
  useState,
} from "react";

import myndworksMark from "../assets/myndworks-mark.svg";

const NAV_ITEMS = [
  {
    label: "About",
    href: "#about",
  },
  {
    label: "Services",
    href: "#services",
  },
  {
    label: "Your first visit",
    href: "#first-visit",
  },
  {
    label: "Stories",
    href: "#stories",
  },
  {
    label: "FAQ",
    href: "#faq",
  },
];

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);

  const lastScrollY = useRef(0);
  const ticking = useRef(false);

  useEffect(() => {
    lastScrollY.current = window.scrollY;

    const handleScroll = () => {
      if (ticking.current) {
        return;
      }

      ticking.current = true;

      window.requestAnimationFrame(() => {
        const currentY = Math.max(
          window.scrollY,
          0
        );

        const difference =
          currentY - lastScrollY.current;

        setScrolled(currentY > 40);

        /*
         * Always show the navigation near
         * the top of the page.
         */
        if (currentY < 100) {
          setHidden(false);
        }

        /*
         * Never hide it while the mobile
         * navigation is open.
         */
        else if (menuOpen) {
          setHidden(false);
        }

        /*
         * Meaningful downward movement.
         */
        else if (difference > 7) {
          setHidden(true);
        }

        /*
         * Meaningful upward movement.
         */
        else if (difference < -7) {
          setHidden(false);
        }

        lastScrollY.current = currentY;
        ticking.current = false;
      });
    };

    window.addEventListener(
      "scroll",
      handleScroll,
      {
        passive: true,
      }
    );

    return () => {
      window.removeEventListener(
        "scroll",
        handleScroll
      );
    };
  }, [menuOpen]);

  const closeMenu = () => {
    setMenuOpen(false);
  };

  return (
    <header
      className={
        hidden
          ? "site-header is-hidden"
          : "site-header"
      }
    >
      <div
        className={
          scrolled
            ? "nav-shell is-scrolled"
            : "nav-shell"
        }
      >
        <a
          className="header-brand"
          href="#top"
          onClick={closeMenu}
          aria-label="MyndWorks home"
        >
          <img
            className="header-brand-mark"
            src={myndworksMark}
            alt=""
          />

          <span className="wordmark">
            MyndWorks
          </span>
        </a>

        <nav
          className="desktop-nav"
          aria-label="Main navigation"
        >
          {NAV_ITEMS.map((item) => (
            <a
              href={item.href}
              key={item.href}
            >
              {item.label}
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
          className={
            menuOpen
              ? "menu-toggle is-open"
              : "menu-toggle"
          }
          aria-expanded={menuOpen}
          aria-label={
            menuOpen
              ? "Close navigation"
              : "Open navigation"
          }
          onClick={() =>
            setMenuOpen(
              (current) => !current
            )
          }
        >
          <span className="menu-toggle-line" />
          <span className="menu-toggle-line" />
          <span className="menu-toggle-line" />
        </button>
      </div>

      <div
        className={
          menuOpen
            ? "mobile-menu is-open"
            : "mobile-menu"
        }
      >
        {NAV_ITEMS.map((item) => (
          <a
            className="mobile-link"
            href={item.href}
            key={item.href}
            onClick={closeMenu}
          >
            {item.label}
          </a>
        ))}

        <a
          className="btn-lime"
          href="#contact"
          onClick={closeMenu}
        >
          Book a session
        </a>
      </div>
    </header>
  );
}
