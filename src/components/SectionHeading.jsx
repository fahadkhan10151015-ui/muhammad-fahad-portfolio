import Reveal from "./Reveal.jsx";

export default function SectionHeading({ id, title, description, className = "" }) {
  return (
    <Reveal className={`max-w-xl ${className}`}>
      <h2
        id={`${id}-title`}
        className="text-[2rem] font-semibold leading-[1.05] tracking-[-0.03em] text-bone text-balance sm:text-5xl"
      >
        {title}
      </h2>
      {description && <p className="mt-4 text-base leading-relaxed text-ash text-pretty sm:text-lg">{description}</p>}
    </Reveal>
  );
}
