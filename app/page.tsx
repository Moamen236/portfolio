import { Nav } from "@/components/navigation/Nav";
import { Hero } from "@/components/hero/Hero";
import { About } from "@/components/skills/About";
import { Projects } from "@/components/projects/Projects";
import { Engineering } from "@/components/engineering/Engineering";
import { Journey } from "@/components/experience/Journey";
import { Contact } from "@/components/contact/Contact";
import { Footer } from "@/components/layout/Footer";

export default function Home() {
  return (
    <>
      <Nav />
      <main id="main">
        <Hero />
        <About />
        <Projects />
        <Engineering />
        <Journey />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
