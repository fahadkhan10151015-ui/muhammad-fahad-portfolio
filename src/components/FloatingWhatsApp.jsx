import { motion } from "framer-motion";
import { WhatsAppIcon } from "./BrandIcons.jsx";
import { whatsappLink } from "../data/portfolio.js";

export default function FloatingWhatsApp() {
  return (
    <motion.a
      href={whatsappLink}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp (opens in a new tab)"
      initial={{ opacity: 0, scale: 0.85, y: 12 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ delay: 1.2, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ scale: 1.06 }}
      whileTap={{ scale: 0.94 }}
      className="group fixed bottom-[max(1rem,env(safe-area-inset-bottom))] right-4 z-40 grid h-14 w-14 place-items-center rounded-full border border-whatsapp/30 bg-graphite/90 text-whatsapp shadow-[0_8px_30px_-6px_rgb(37_211_102/0.35)] backdrop-blur-md transition-colors hover:border-whatsapp/60 sm:bottom-6 sm:right-6"
    >
      <WhatsAppIcon className="h-6 w-6" />
      <span className="pointer-events-none absolute right-full mr-3 hidden whitespace-nowrap rounded-full border border-white/10 bg-charcoal px-3 py-1.5 text-sm text-bone opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100 sm:block">
        Chat on WhatsApp
      </span>
    </motion.a>
  );
}
