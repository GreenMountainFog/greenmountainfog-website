// Cloudflare Pages Function — POST /api/contact
// Receives the contact-form submission, validates it, and emails it via Resend.
//
// Required environment variable (set in Cloudflare Pages → Settings → Environment variables):
//   RESEND_API_KEY  — Resend API key (https://resend.com)
//
// Optional environment variables:
//   CONTACT_TO     — destination email (defaults to hello@greenmountainfog.com)
//   CONTACT_FROM   — verified Resend sender (defaults to website@greenmountainfog.com)

const TO_DEFAULT = "hello@greenmountainfog.com";
const FROM_DEFAULT = "website@greenmountainfog.com";

const TOPIC_LABELS = {
  "managed-it": "Managed IT & helpdesk",
  apple: "Apple-specific help",
  backup: "Backup or data recovery",
  "small-business": "Small-business setup / POS",
  other: "Something else",
};

const json = (body, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });

const escapeHtml = (s) =>
  String(s ?? "").replace(/[&<>"']/g, (c) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
  }[c]));

export async function onRequestPost(context) {
  const { request, env } = context;

  let data;
  try {
    data = await request.json();
  } catch {
    return json({ error: "Invalid request body." }, 400);
  }

  // honeypot — bots tend to populate every field
  if (data.website && String(data.website).trim() !== "") {
    return json({ ok: true });
  }

  const name = String(data.name || "").trim();
  const email = String(data.email || "").trim();
  const company = String(data.company || "").trim();
  const topic = String(data.topic || "").trim();
  const message = String(data.message || "").trim();

  if (!name || !email || !topic || !message) {
    return json({ error: "Missing required fields." }, 400);
  }
  if (name.length > 200 || email.length > 200 || company.length > 200 || message.length > 5000) {
    return json({ error: "Submission too long." }, 400);
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return json({ error: "That email address doesn't look right." }, 400);
  }

  const topicLabel = TOPIC_LABELS[topic] || topic;
  const to = env.CONTACT_TO || TO_DEFAULT;
  const from = env.CONTACT_FROM || FROM_DEFAULT;

  if (!env.RESEND_API_KEY) {
    return json(
      { error: "Email delivery isn't configured yet. Please email hello@greenmountainfog.com directly." },
      503,
    );
  }

  const subject = `[GMF] ${topicLabel} — ${name}`;
  const text = [
    `New contact-form submission from greenmountainfog.com`,
    ``,
    `Name:    ${name}`,
    `Email:   ${email}`,
    `Company: ${company || "—"}`,
    `Topic:   ${topicLabel}`,
    ``,
    `Message:`,
    message,
  ].join("\n");

  const html = `
    <div style="font-family: -apple-system, system-ui, sans-serif; color:#1c2c26; max-width: 560px;">
      <h2 style="font-family: 'JetBrains Mono', monospace; color:#0a231d; margin:0 0 16px;">New contact-form submission</h2>
      <table style="border-collapse: collapse; width: 100%; font-size: 14px;">
        <tr><td style="padding:6px 12px 6px 0; color:#5b6660; vertical-align:top;">Name</td><td style="padding:6px 0;"><strong>${escapeHtml(name)}</strong></td></tr>
        <tr><td style="padding:6px 12px 6px 0; color:#5b6660; vertical-align:top;">Email</td><td style="padding:6px 0;"><a href="mailto:${escapeHtml(email)}">${escapeHtml(email)}</a></td></tr>
        <tr><td style="padding:6px 12px 6px 0; color:#5b6660; vertical-align:top;">Company</td><td style="padding:6px 0;">${escapeHtml(company || "—")}</td></tr>
        <tr><td style="padding:6px 12px 6px 0; color:#5b6660; vertical-align:top;">Topic</td><td style="padding:6px 0;">${escapeHtml(topicLabel)}</td></tr>
      </table>
      <hr style="border:none; border-top:1px solid #d5d8ca; margin:20px 0;"/>
      <div style="white-space: pre-wrap; line-height: 1.55;">${escapeHtml(message)}</div>
    </div>
  `;

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: `Green Mountain Fog <${from}>`,
        to: [to],
        reply_to: email,
        subject,
        text,
        html,
      }),
    });

    if (!res.ok) {
      const detail = await res.text().catch(() => "");
      console.error("Resend failed:", res.status, detail);
      return json({ error: "Couldn't send your message right now. Please email hello@greenmountainfog.com directly." }, 502);
    }

    return json({ ok: true });
  } catch (err) {
    console.error("Resend exception:", err);
    return json({ error: "Couldn't send your message right now. Please email hello@greenmountainfog.com directly." }, 502);
  }
}

export const onRequest = ({ request }) =>
  new Response("Method Not Allowed", {
    status: 405,
    headers: { Allow: "POST" },
  });
