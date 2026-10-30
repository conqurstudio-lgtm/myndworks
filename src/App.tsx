import { PublicEventsIndex } from "./pages/PublicEventsIndex";
import { PublicBlogIndex } from "./pages/PublicBlogIndex";
import { PublicBlogPage } from "./pages/PublicBlogPage";
import { AdminBlogEdit } from "./pages/AdminBlogEdit";
import { AdminBlogNew } from "./pages/AdminBlogNew";
import { AdminBlogsDashboard } from "./pages/AdminBlogsDashboard";
import { PublicEventPage } from "./pages/PublicEventPage";
import { AdminEventEdit } from "./pages/AdminEventEdit";
import { AdminEventNew } from "./pages/AdminEventNew";
import { AdminDashboard } from "./pages/AdminDashboard";
import { AdminEventsLogin } from "./pages/AdminEventsLogin";
import { AdminEventsDashboard } from "./pages/AdminEventsDashboard";
import { ScrollToTop } from "./components/ScrollToTop";
import { Header } from "./components/Header";
import { Hero } from "./components/Hero";
import { About } from "./components/About";
import { Services } from "./components/Services";
import { Process } from "./components/Process";
import { HolisticCare } from "./components/HolisticCare";
import { Stories } from "./components/Stories";
import { Faq } from "./components/Faq";
import { Contact } from "./components/Contact";
import { Footer } from "./components/Footer";

export default function App() {
  const pathname = window.location.pathname.replace(/\/+$/, "") || "/";

  if (pathname === "/admin/login" || pathname === "/admin/events/login") {
    return <AdminEventsLogin />;
  }

  if (pathname === "/admin") {
    return <AdminDashboard />;
  }

  if (pathname === "/admin/blogs/new") {
    return <AdminBlogNew />;
  }

  if (
    pathname.startsWith("/admin/blogs/") &&
    pathname !== "/admin/blogs/new"
  ) {
    return (
      <AdminBlogEdit
        blogId={pathname.replace("/admin/blogs/", "")}
      />
    );
  }

  if (pathname === "/admin/blogs") {
    return <AdminBlogsDashboard />;
  }

  if (pathname === "/admin/events/new") {
    return <AdminEventNew />;
  }

  if (
    pathname.startsWith("/admin/events/") &&
    pathname !== "/admin/events/login"
  ) {
    return (
      <AdminEventEdit
        eventId={pathname.replace("/admin/events/", "")}
      />
    );
  }

  if (pathname === "/admin/events") {
    return <AdminEventsDashboard />;
  }

  if (pathname === "/blog") {
    return <PublicBlogIndex />;
  }

  if (pathname.startsWith("/blog/")) {
    return (
      <PublicBlogPage
        slug={decodeURIComponent(pathname.replace("/blog/", ""))}
      />
    );
  }

  if (pathname === "/events") {
    return <PublicEventsIndex />;
  }

  if (pathname.startsWith("/events/")) {
    return (
      <PublicEventPage
        slug={decodeURIComponent(pathname.replace("/events/", ""))}
      />
    );
  }

return (
    <div className="mw-page-shell">
      <ScrollToTop />
      <Header />

      <div className="mw-page-frame">
        <main id="top">
          <Hero />
          <About />
          <Services />
          <Process />
          <HolisticCare />
          <Stories />
          <Faq />
          <Contact />
        </main>

        <Footer />
      </div>
    </div>
  );
}
