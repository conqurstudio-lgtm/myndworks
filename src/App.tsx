import { Header } from "./components/Header";
import { Hero } from "./components/Hero";
import { About } from "./components/About";
import { Services } from "./components/Services";
import { Process } from "./components/Process";

export default function App() {
  return (
    <>
      <Header />

      <main id="top">
        <Hero />
        <About />
        <Services />
        <Process />
      </main>
    </>
  );
}
