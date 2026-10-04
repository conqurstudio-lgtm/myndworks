import { useEffect } from "react";

export function ScrollToTop() {
  useEffect(() => {
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }

    const resetToTop = () => {
      const html = document.documentElement;
      const previousBehavior = html.style.scrollBehavior;

      html.style.scrollBehavior = "auto";

      window.scrollTo({
        top: 0,
        left: 0,
        behavior: "auto",
      });

      document.body.scrollTop = 0;
      document.documentElement.scrollTop = 0;

      requestAnimationFrame(() => {
        html.style.scrollBehavior = previousBehavior;
      });
    };

    /*
     * Remove a stale section hash on a fresh page load.
     * Example:
     * /myndworks/#faq
     * becomes:
     * /myndworks/
     *
     * Navigation links can still add hashes normally
     * while the visitor is using the page.
     */
    if (window.location.hash) {
      window.history.replaceState(
        null,
        "",
        window.location.pathname + window.location.search
      );
    }

    resetToTop();

    const frame1 = requestAnimationFrame(() => {
      resetToTop();

      requestAnimationFrame(() => {
        resetToTop();
      });
    });

    const timeout1 = window.setTimeout(resetToTop, 50);
    const timeout2 = window.setTimeout(resetToTop, 200);

    const handlePageShow = () => {
      if (window.location.hash) {
        window.history.replaceState(
          null,
          "",
          window.location.pathname + window.location.search
        );
      }

      resetToTop();
    };

    window.addEventListener("pageshow", handlePageShow);

    return () => {
      cancelAnimationFrame(frame1);
      clearTimeout(timeout1);
      clearTimeout(timeout2);
      window.removeEventListener("pageshow", handlePageShow);
    };
  }, []);

  return null;
}
