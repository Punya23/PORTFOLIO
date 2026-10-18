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

  // TODO(user): wire email delivery here (Resend / SMTP / n8n webhook) and return {ok:true} only after it succeeds.
  if (process.env.NODE_ENV === "production") {
    // Fail closed: never tell a visitor "thanks" for a message that went nowhere.
    return { ok: false, error: `Messages aren't switched on yet. Please email ${person.email} instead.` };
  }
  console.info("[contact] (dev, not delivered)", res.value);
  return { ok: true };
}
