import About from "../sections/About.jsx";
import Experience from "../sections/Experience.jsx";
import Skills from "../sections/Skills.jsx";
import Projects from "../sections/Projects.jsx";
import Education from "../sections/Education.jsx";
import Contact from "../sections/Contact.jsx";

// Everything below the hero. Loaded as a separate file right after the hero has painted.
export default function HomeSections() {
  return (
    <>
      <About />
      <Experience />
      <Skills />
      <Projects />
      <Education />
      <Contact />
    </>
  );
}