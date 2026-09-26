import { motion } from "framer-motion";

const ease = [0.22, 1, 0.36, 1];

export function Timeline({ children, label }) {
  return (
    <div className="relative">
      <motion.span
        aria-hidden="true"
        className="absolute bottom-3 left-[7px] top-3 w-px origin-top bg-linear-to-b from-signal/70 via-white/20 to-white/0"
        initial={{ scaleY: 0 }}
        whileInView={{ scaleY: 1 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 1, ease }}
      />
      <ol aria-label={label} className="space-y-5">
        {children}
      </ol>
    </div>
  );
}

export function TimelineItem({ index = 0, current = false, children }) {
  return (
    <motion.li
      className="relative pl-9 sm:pl-10"
      initial={{ opacity: 0, x: -10 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5, delay: 0.1 + index * 0.08, ease }}
    >
      <span
        aria-hidden="true"
        className="absolute left-0 top-7 grid h-[15px] w-[15px] place-items-center rounded-full border border-white/25 bg-charcoal"
      >
        <span className={`h-[5px] w-[5px] rounded-full ${current ? "bg-white shadow-[0_0_10px_rgb(255_255_255/0.7)]" : "bg-white/40"}`} />
      </span>
      {children}
    </motion.li>
  );
}
