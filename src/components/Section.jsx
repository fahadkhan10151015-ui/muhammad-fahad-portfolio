import Container from "./Container.jsx";

export default function Section({ id, children, className = "" }) {
  return (
    <section id={id} aria-labelledby={`${id}-title`} className={`relative py-20 sm:py-28 ${className}`}>
      <Container>{children}</Container>
    </section>
  );
}
