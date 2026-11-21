/**
 * Vercel serverless function: POST /api/contact
 * Sends the contact form through Resend (https://resend.com) when configured.
 *
 * Environment variables (set in Vercel → Project → Settings → Environment Variables):
 *   RESEND_API_KEY      required — your Resend API key (never exposed to the browser)
 *   CONTACT_TO_EMAIL    optional — inbox that receives messages (default: fahadkhan10151015@gmail.com)
 *   CONTACT_FROM_EMAIL  optional — verified sender (default: "Portfolio <onboarding@resend.dev>")
 *
 * Without RESEND_API_KEY the function answers 501 and the website falls back to
 * opening the visitor's email app with the message pre-filled.
 */
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  const key = process.env.RESEND_API_KEY;
  if (!key) return res.status(501).json({ error: "Email service not configured", fallback: "mailto" });

  let body = req.body;
  if (typeof body === "string") {
    try {
      body = JSON.parse(body);
    } catch {
      body = {};
    }
  }
  const { name = "", email = "", subject = "", message = "", company = "" } = body || {};

  // honeypot: bots fill hidden fields
  if (company) return res.status(200).json({ ok: true });

  if (
    String(name).trim().length < 2 ||
    !EMAIL_RE.test(String(email).trim()) ||
    String(subject).trim().length < 3 ||
    String(message).trim().length < 10 ||
    String(message).length > 5000
  ) {
    return res.status(400).json({ error: "Invalid input" });
  }

  const to = process.env.CONTACT_TO_EMAIL || "fahadkhan10151015@gmail.com";
  const from = process.env.CONTACT_FROM_EMAIL || "Portfolio <onboarding@resend.dev>";

  try {
    const r = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from,
        to: [to],
        reply_to: String(email).trim(),
        subject: `[Portfolio] ${String(subject).trim().slice(0, 150)}`,
        html: `<p><strong>From:</strong> ${esc(name)} &lt;${esc(email)}&gt;</p><p style="white-space:pre-wrap">${esc(message)}</p>`,
        text: `From: ${name} <${email}>\n\n${message}`,
      }),
    });
    if (!r.ok) return res.status(502).json({ error: "Email provider error" });
    return res.status(200).json({ ok: true });
  } catch {
    return res.status(502).json({ error: "Email provider unreachable" });
  }
}
