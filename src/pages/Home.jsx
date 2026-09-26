import { useEffect } from "react";
import Hero from "../sections/Hero.jsx";
import About from "../sections/About.jsx";
import Experience from "../sections/Experience.jsx";
import Skills from "../sections/Skills.jsx";
import Projects from "../sections/Projects.jsx";
import Education from "../sections/Education.jsx";
import Contact from "../sections/Contact.jsx";
import { personalInfo } from "../data/portfolio.js";

export default function Home() {
  useEffect(() => {
    document.title = `${personalInfo.name} | Full-Stack & Mobile Developer`;
  }, []);

  return (
    <>
      <Hero />
      <About />
      <Experience />
      <Skills />
      <Projects />
      <Education />
      <Contact />
    </>
  );
}
