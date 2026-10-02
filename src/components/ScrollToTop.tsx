import { useEffect } from "react";

export function ScrollToTop() {
  useEffect(() => {
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }

    const resetScroll = () => {
      // Preserve intentional deep links such as #services or #faq.
      if (window.location.hash) return;

      window.scrollTo({
        top: 0,
        left: 0,
        behavior: "auto",
      });
    };

    resetScroll();

    const frame = window.requestAnimationFrame(() => {
      window.requestAnimationFrame(resetScroll);
    });

    const onPageShow = () => {
      resetScroll();
    };

    window.addEventListener("pageshow", onPageShow);

    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("pageshow", onPageShow);
    };
  }, []);

  return null;
}
