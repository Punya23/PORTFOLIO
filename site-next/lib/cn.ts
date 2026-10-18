/** Join truthy class names. site.css is precompiled, so no tailwind-merge: pass non-conflicting classes. */
export const cn = (...a: Array<string | false | null | undefined>) => a.filter(Boolean).join(" ");
export const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));
export const pad2 = (n: number | string) => String(n).padStart(2, "0");
