/** Contact-form contract + validation, shared by the server action and its check. */
export type ContactState = {
  ok: boolean;
  fieldErrors?: Partial<Record<"name" | "email" | "body", string>>;
  error?: string;
};

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export type ContactInput = { name: string; email: string; body: string; website: string };

/** Returns trimmed values or field errors. A filled honeypot (`website`) is reported separately by the caller. */
export function validateContact(raw: ContactInput):
  | { ok: true; value: { name: string; email: string; body: string } }
  | { ok: false; fieldErrors: NonNullable<ContactState["fieldErrors"]> } {
  const name = raw.name.trim();
  const email = raw.email.trim();
  const body = raw.body.trim();
  const fieldErrors: NonNullable<ContactState["fieldErrors"]> = {};
  if (!name) fieldErrors.name = "Please tell me your name.";
  else if (name.length > 100) fieldErrors.name = "That name is a little long.";
  if (!email) fieldErrors.email = "Please add your email.";
  else if (email.length > 254 || !EMAIL.test(email)) fieldErrors.email = "That email doesn't look right.";
  if (!body) fieldErrors.body = "Tell me a bit about what you're building.";
  else if (body.length > 5000) fieldErrors.body = "Please keep it under 5000 characters.";
  return Object.keys(fieldErrors).length ? { ok: false, fieldErrors } : { ok: true, value: { name, email, body } };
}
