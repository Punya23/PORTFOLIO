// Run: node --experimental-strip-types lib/contact.check.ts
import assert from "node:assert/strict";
// @ts-expect-error node needs the .ts extension; tsc does not allow it
import { validateContact } from "./contact.ts";

const ok = validateContact({ name: " Ada ", email: "ada@x.io", body: " hi ", website: "" });
assert.deepEqual(ok, { ok: true, value: { name: "Ada", email: "ada@x.io", body: "hi" } });
const bad = validateContact({ name: "", email: "nope", body: "   ", website: "" });
assert.ok(!bad.ok && bad.fieldErrors.name && bad.fieldErrors.email && bad.fieldErrors.body);
console.log("contact validation ok");
