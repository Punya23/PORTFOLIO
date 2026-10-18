"use server";

import { person } from "@/content/punya";
import { validateContact, type ContactState } from "@/lib/contact";

/** Server action behind <ContactForm/>. Validates at the trust boundary; honeypot field is `website`. */
export async function sendMessage(_prev: ContactState, formData: FormData): Promise<ContactState> {
  const str = (k: string) => (typeof formData.get(k) === "string" ? (formData.get(k) as string) : "");
  const input = { name: str("name"), email: str("email"), body: str("body"), website: str("website") };

  // Bots fill the hidden field: pretend success, deliver nothing.
  if (input.website) return { ok: true };

  const res = validateContact(input);
  if (!res.ok) return { ok: false, fieldErrors: res.fieldErrors };

  const key = process.env.RESEND_API_KEY;
  if (!key) {
    // Fail closed in production: never tell a visitor "thanks" for a message that went nowhere.
    if (process.env.NODE_ENV === "production") return { ok: false, error: `Messages aren't switched on yet. Please email ${person.email} instead.` };
    console.info("[contact] (dev, RESEND_API_KEY not set, not delivered)", res.value);
    return { ok: true };
  }

  const { name, email, body } = res.value;
  try {
    const r = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { authorization: `Bearer ${key}`, "content-type": "application/json" },
      body: JSON.stringify({
        from: process.env.CONTACT_FROM ?? "Portfolio <onboarding@resend.dev>",
        to: [person.email],
        reply_to: email,
        subject: `Portfolio message from ${name.replace(/[\r\n]+/g, " ").slice(0, 80)}`,
        text: `From: ${name} <${email}>\n\n${body}`,
      }),
      signal: AbortSignal.timeout(15_000),
    });
    if (!r.ok) {
      console.error("[contact] resend failed", r.status, (await r.text()).slice(0, 300));
      return { ok: false, error: `Couldn't send that. Please email ${person.email} instead.` };
    }
    return { ok: true };
  } catch (err) {
    console.error("[contact] resend error", err);
    return { ok: false, error: `Couldn't send that. Please email ${person.email} instead.` };
  }
}
