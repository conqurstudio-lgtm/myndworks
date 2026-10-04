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
