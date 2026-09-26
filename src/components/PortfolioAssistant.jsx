import { Suspense, lazy, useCallback, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Sparkles } from "lucide-react";

// The chat panel and its answer engine are only downloaded when someone shows interest in them
// (hover / focus / touch on the button, or a click), so they cost nothing on the first page load.
const loadPanel = () => import("./AssistantPanel.jsx");
const AssistantPanel = lazy(loadPanel);

const ease = [0.22, 1, 0.36, 1];

export default function PortfolioAssistant() {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false); // stays true after the first open, so the chat is kept
  const close = useCallback(() => setOpen(false), []);

  return (
    <>
      <AnimatePresence>
        {!open && (
          <motion.button
            key="ask-fab"
            type="button"
            onClick={() => {
              setMounted(true);
              setOpen(true);
            }}
            onPointerEnter={loadPanel}
            onFocus={loadPanel}
            onTouchStart={loadPanel}
            aria-label="Open Ask Fahad AI chat"
            aria-haspopup="dialog"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ delay: 1.4, duration: 0.4, ease }}
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.96 }}
            className="fixed bottom-[calc(max(1rem,env(safe-area-inset-bottom))+4.25rem)] right-4 z-40 inline-flex h-12 items-center gap-2 rounded-full border border-white/15 bg-linear-to-b from-steel to-graphite px-4 text-sm font-medium text-bone shadow-[0_10px_30px_-10px_rgb(0_0_0/0.8)] backdrop-blur-md transition-colors hover:border-white/30 sm:bottom-[5.75rem] sm:right-6"
          >
            <Sparkles className="h-4 w-4 text-signal" aria-hidden="true" />
            Ask Fahad AI
          </motion.button>
        )}
      </AnimatePresence>

      {mounted && (
        <Suspense fallback={null}>
          <AssistantPanel open={open} onClose={close} />
        </Suspense>
      )}
    </>
  );
}