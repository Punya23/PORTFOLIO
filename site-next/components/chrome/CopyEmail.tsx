"use client";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/cn";

/** Click-to-copy email with a "Copy" / "Copied" chip. */
export function CopyEmail({ email, className }: { email: string; className?: string }) {
  const [copied, setCopied] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);

  async function copy() {
    try {
      await navigator.clipboard.writeText(email);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = email;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      ta.remove();
    }
    setCopied(true);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setCopied(false), 1800);
  }
  useEffect(() => () => clearTimeout(timer.current), []);

  return (
    <button
      type="button"
      onClick={copy}
      data-cursor="Copy"
      aria-label={`Copy email address ${email}`}
      className={cn("group relative inline-flex items-center gap-3 text-left transition-colors hover:text-ember", className)}
    >
      <span className="underline decoration-line decoration-1 underline-offset-[0.22em] transition-colors group-hover:decoration-ember">{email}</span>
      <span
        aria-live="polite"
        className={cn(
          "text-meta rounded-pill px-2.5 py-1 transition-all duration-300",
          copied
            ? "bg-ember text-white opacity-100"
            : "translate-x-1 bg-fg/10 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 group-focus-visible:opacity-100",
        )}
      >
        {copied ? "Copied" : "Copy"}
      </span>
    </button>
  );
}
