import { Header } from "./components/Header";
import { Hero } from "./components/Hero";
import { About } from "./components/About";
import { Services } from "./components/Services";
import { Process } from "./components/Process";
import { HolisticCare } from "./components/HolisticCare";

export default function App() {
  return (
    <>
      <Header />

      <main id="top">
        <Hero />
        <About />
        <Services />
        <Process />
        <HolisticCare />
      </main>
    </>
  );
}
