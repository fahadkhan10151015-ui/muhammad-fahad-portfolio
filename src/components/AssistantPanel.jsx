import { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowRight, ArrowUpRight, Download, Mail, RotateCcw, Send, Sparkles, X } from "lucide-react";
import { WhatsAppIcon } from "./BrandIcons.jsx";
import { WELCOME_MESSAGE, getReply, suggestedQuestions } from "../lib/assistant.js";

const ease = [0.22, 1, 0.36, 1];
const isPhone = () => typeof window !== "undefined" && window.matchMedia("(max-width: 639px)").matches;

let nextId = 1;
const makeMessage = (role, text, links = [], typed = false) => ({ id: nextId++, role, text, links, typed });
// Ids of answers that have already finished "typing", so reopening the panel doesn't replay them.
const finished = new Set();

/** Turns https:// URLs in an assistant answer into real links. */
function RichText({ text }) {
  return text.split(/(https?:\/\/[^\s)]*[^\s).,])/g).map((part, i) =>
    /^https?:\/\//.test(part) ? (
      <a
        key={i}
        href={part}
        target="_blank"
        rel="noopener noreferrer"
        className="break-all underline underline-offset-2 hover:text-white"
      >
        {part}
      </a>
    ) : (
      part
    )
  );
}

const buttonClass =
  "inline-flex min-h-10 items-center gap-2 rounded-full border border-white/15 bg-white/[0.06] px-3.5 text-sm font-medium text-bone transition-colors hover:border-white/30 hover:bg-white/[0.12]";

function ActionLink({ link, onNavigate }) {
  if (link.to) {
    return (
      <Link to={link.to} onClick={onNavigate} className={buttonClass}>
        {link.label}
        <ArrowRight className="h-4 w-4 text-ash" aria-hidden="true" />
      </Link>
    );
  }

  let Icon = ArrowUpRight;
  if (link.href.startsWith("mailto:")) Icon = Mail;
  else if (link.href.includes("wa.me")) Icon = WhatsAppIcon;
  else if (link.download) Icon = Download;

  return (
    <a
      href={link.href}
      {...(link.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      {...(link.download ? { download: link.download } : {})}
      className={buttonClass}
    >
      <Icon className={`h-4 w-4 ${link.href.includes("wa.me") ? "text-whatsapp" : ""}`} aria-hidden="true" />
      {link.label}
    </a>
  );
}

function TypingDots() {
  return (
    <div
      className="flex w-fit items-center gap-1 rounded-2xl rounded-tl-md border border-white/10 bg-graphite/80 px-4 py-3.5"
      aria-label="Typing"
    >
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="h-1.5 w-1.5 rounded-full bg-ash"
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{ duration: 1, repeat: Infinity, delay: i * 0.15 }}
        />
      ))}
    </div>
  );
}

/** One assistant message. New answers are revealed a few characters at a time. */
function BotMessage({ message, onTick, onNavigate }) {
  const reduce = useReducedMotion();
  const instant = reduce || !message.typed || finished.has(message.id);
  const [count, setCount] = useState(instant ? message.text.length : 0);
  const done = count >= message.text.length;

  useEffect(() => {
    if (instant) return;
    const step = Math.max(2, Math.ceil(message.text.length / 60));
    const id = setInterval(() => {
      setCount((c) => {
        const next = Math.min(c + step, message.text.length);
        if (next >= message.text.length) {
          finished.add(message.id);
          clearInterval(id);
        }
        return next;
      });
    }, 18);
    return () => clearInterval(id);
  }, [instant, message.id, message.text.length]);

  useEffect(() => {
    onTick();
  }, [count, done, onTick]);

  return (
    <div className="flex flex-col items-start gap-2">
      <p className="max-w-[90%] whitespace-pre-line break-words rounded-2xl rounded-tl-md border border-white/10 bg-graphite/80 px-3.5 py-2.5 text-[0.92rem] leading-relaxed text-bone/95">
        <RichText text={message.text.slice(0, count)} />
      </p>
      {done && message.links?.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25, ease }}
          className="flex flex-wrap gap-2"
        >
          {message.links.map((l) => (
            <ActionLink key={l.to || l.href} link={l} onNavigate={onNavigate} />
          ))}
        </motion.div>
      )}
    </div>
  );
}

/** The chat panel. Loaded on demand by PortfolioAssistant.jsx (not part of the first page load). */
export default function AssistantPanel({ open, onClose }) {
  const [messages, setMessages] = useState(() => [makeMessage("bot", WELCOME_MESSAGE)]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const listRef = useRef(null);
  const inputRef = useRef(null);
  const timers = useRef([]);

  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  const scrollToEnd = useCallback(() => {
    const el = listRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, []);
  // Keep the newest message in view.
  useEffect(scrollToEnd, [scrollToEnd, messages, typing, open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    // Don't pop the on-screen keyboard open on phones.
    if (!isPhone()) inputRef.current?.focus();
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  const ask = (text) => {
    const question = text.trim();
    if (!question) return;
    setMessages((m) => [...m, makeMessage("user", question)]);
    setTyping(true);
    timers.current.push(
      setTimeout(() => {
        const { text: answer, links } = getReply(question);
        setMessages((m) => [...m, makeMessage("bot", answer, links, true)]);
        setTyping(false);
      }, 450)
    );
  };

  const onSubmit = (e) => {
    e.preventDefault();
    ask(input);
    setInput("");
  };

  const reset = () => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
    setTyping(false);
    setMessages([makeMessage("bot", WELCOME_MESSAGE)]);
    setInput("");
  };

  // On phones the panel covers the page, so close it after following a page link.
  const onNavigate = () => {
    if (isPhone()) onClose();
  };

  const emptyChat = messages.length === 1 && !typing;

  const suggestion = (q, className) => (
    <button
      key={q}
      type="button"
      onClick={() => ask(q)}
      className={`border border-white/12 bg-white/[0.04] text-bone/90 transition-colors hover:border-white/30 hover:bg-white/[0.1] ${className}`}
    >
      {q}
    </button>
  );

  return (
    <>
      <AnimatePresence>
        {open && (
          <motion.div
            key="ask-panel"
            role="dialog"
            aria-label="Ask Fahad AI"
            initial={{ opacity: 0, y: 24, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.98 }}
            transition={{ duration: 0.28, ease }}
            className="fixed inset-x-3 bottom-[max(0.75rem,env(safe-area-inset-bottom))] z-50 flex h-[min(36rem,calc(100svh-6rem))] origin-bottom-right flex-col overflow-hidden rounded-3xl border border-white/[0.14] bg-charcoal/80 bg-linear-to-b from-white/[0.08] to-white/[0.02] shadow-[0_30px_80px_-20px_rgb(0_0_0/0.9),inset_0_1px_0_rgb(255_255_255/0.08)] backdrop-blur-2xl sm:inset-x-auto sm:bottom-[9rem] sm:right-6 sm:h-[min(36rem,calc(100svh-11rem))] sm:w-[25rem]"
          >
            <header className="flex items-center justify-between gap-3 border-b border-white/[0.08] px-4 py-3.5">
              <div className="flex min-w-0 items-center gap-3">
                <span className="relative grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-linear-to-br from-steel to-graphite ring-1 ring-white/10">
                  <Sparkles className="h-4 w-4 text-signal" aria-hidden="true" />
                  <span className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full bg-whatsapp ring-2 ring-charcoal" aria-hidden="true" />
                </span>
                <div className="min-w-0">
                  <p className="text-[0.95rem] font-semibold leading-tight text-bone">Ask Fahad AI</p>
                  <p className="truncate text-xs text-ash">Portfolio assistant · English / Roman Urdu</p>
                </div>
              </div>
              <div className="flex shrink-0 items-center gap-1.5">
                <button
                  type="button"
                  onClick={reset}
                  aria-label="Clear conversation"
                  title="Clear conversation"
                  className="grid h-10 w-10 place-items-center rounded-full border border-white/10 text-ash transition-colors hover:border-white/25 hover:text-bone"
                >
                  <RotateCcw className="h-4 w-4" aria-hidden="true" />
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  aria-label="Close chat"
                  title="Close"
                  className="grid h-10 w-10 place-items-center rounded-full border border-white/10 text-ash transition-colors hover:border-white/25 hover:text-bone"
                >
                  <X className="h-4 w-4" aria-hidden="true" />
                </button>
              </div>
            </header>

            <div
              ref={listRef}
              role="log"
              aria-live="polite"
              className="flex-1 space-y-3 overflow-y-auto overscroll-contain scroll-smooth px-4 py-4"
            >
              {messages.map((m) =>
                m.role === "user" ? (
                  <motion.div
                    key={m.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.25, ease }}
                    className="flex justify-end"
                  >
                    <p className="max-w-[88%] whitespace-pre-line break-words rounded-2xl rounded-tr-md bg-bone px-3.5 py-2.5 text-[0.92rem] leading-relaxed text-ink">
                      {m.text}
                    </p>
                  </motion.div>
                ) : (
                  <motion.div
                    key={m.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.25, ease }}
                  >
                    <BotMessage message={m} onTick={scrollToEnd} onNavigate={onNavigate} />
                  </motion.div>
                )
              )}
              {typing && <TypingDots />}

              {emptyChat && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.3, ease }}
                >
                  <p className="mb-2 font-mono text-xs text-ash">// try asking</p>
                  <div className="flex flex-wrap gap-2">
                    {suggestedQuestions.map((q) => suggestion(q, "min-h-10 rounded-2xl px-3.5 py-2 text-left text-[0.85rem]"))}
                  </div>
                </motion.div>
              )}
            </div>

            <div className="border-t border-white/[0.08] bg-charcoal/50 pb-3 pt-2.5">
              {!emptyChat && (
                <ul
                  aria-label="Suggested questions"
                  className="flex gap-2 overflow-x-auto px-4 pb-2.5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
                >
                  {suggestedQuestions.map((q) => (
                    <li key={q} className="shrink-0">
                      {suggestion(q, "min-h-9 rounded-full px-3.5 text-[0.8rem]")}
                    </li>
                  ))}
                </ul>
              )}

              <form onSubmit={onSubmit} className="flex items-center gap-2 px-4">
                <div className="relative min-w-0 flex-1">
                  <input
                    ref={inputRef}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    maxLength={200}
                    placeholder="Ask about skills, projects, contact…"
                    aria-label="Your question"
                    autoComplete="off"
                    className="min-h-11 w-full rounded-full border border-white/10 bg-ink/60 pl-4 pr-11 text-base text-bone placeholder:text-ash/70 focus:border-white/30 focus:outline-none"
                  />
                  {input && (
                    <button
                      type="button"
                      onClick={() => {
                        setInput("");
                        inputRef.current?.focus();
                      }}
                      aria-label="Clear input"
                      className="absolute right-1.5 top-1/2 grid h-8 w-8 -translate-y-1/2 place-items-center rounded-full text-ash transition-colors hover:text-bone"
                    >
                      <X className="h-4 w-4" aria-hidden="true" />
                    </button>
                  )}
                </div>
                <button
                  type="submit"
                  disabled={!input.trim()}
                  aria-label="Send question"
                  className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-bone text-ink transition-opacity disabled:opacity-40"
                >
                  <Send className="h-4 w-4" aria-hidden="true" />
                </button>
              </form>
              <p className="mt-2 px-4 text-center text-[0.7rem] text-ash/80">
                Runs in your browser · answers come only from this portfolio
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
