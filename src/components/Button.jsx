import { motion } from "framer-motion";

const styles = {
  primary:
    "bg-linear-to-b from-white to-bone text-ink shadow-[0_8px_24px_-10px_rgb(255_255_255/0.45)] hover:from-white hover:to-white",
  secondary: "border border-white/15 bg-white/[0.05] text-bone hover:border-white/30 hover:bg-white/[0.1]",
  ghost: "text-ash hover:text-bone",
};

/**
 * Link styled as a button.
 * - external: opens in a new tab safely
 * - download: filename for downloaded files
 */
export default function Button({
  href,
  variant = "primary",
  icon: Icon,
  external = false,
  download,
  children,
  className = "",
  ...rest
}) {
  const externalProps = external ? { target: "_blank", rel: "noopener noreferrer" } : {};
  const downloadProps = download ? { download } : {};

  return (
    <motion.a
      href={href}
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.97 }}
      transition={{ duration: 0.18 }}
      className={`inline-flex min-h-11 items-center justify-center gap-2 rounded-full px-5 py-2.5 text-[0.95rem] font-medium transition-colors duration-200 ${styles[variant]} ${className}`}
      {...externalProps}
      {...downloadProps}
      {...rest}
    >
      {Icon && <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />}
      {children}
    </motion.a>
  );
}
