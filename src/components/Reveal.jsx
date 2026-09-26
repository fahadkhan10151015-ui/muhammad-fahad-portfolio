import { motion } from "framer-motion";

const ease = [0.22, 1, 0.36, 1];

/** Quiet scroll reveal: short fade + 12px rise, runs once. */
export default function Reveal({ children, delay = 0, className = "", as = "div" }) {
  const Tag = motion[as] ?? motion.div;
  return (
    <Tag
      className={className}
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5, delay, ease }}
    >
      {children}
    </Tag>
  );
}
