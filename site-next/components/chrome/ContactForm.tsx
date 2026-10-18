"use client";
import { useActionState, useEffect, useRef } from "react";
import { sendMessage } from "@/app/actions";
import type { ContactState } from "@/lib/contact";
import { cn } from "@/lib/cn";
import { ArrowRight } from "./icons";

const INITIAL: ContactState = { ok: false };

export function ContactForm({ onSent, className = "gap-5" }: { onSent?: () => void; className?: string }) {
  const [state, action, pending] = useActionState(sendMessage, INITIAL);
  const form = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.ok) { form.current?.reset(); onSent?.(); }
  }, [state.ok, onSent]);

  if (state.ok) {
    return (
      <div role="status" className="py-6">
        <p className="text-h3">Thanks. I&apos;ll reply soon.</p>
        <p className="mt-3 text-muted">Usually within a day.</p>
      </div>
    );
  }

  return (
    <form ref={form} action={action} noValidate className={cn("flex flex-col", className)}>
      <Field label="Name" name="name" autoComplete="name" error={state.fieldErrors?.name} />
      <Field label="Email" name="email" type="email" autoComplete="email" error={state.fieldErrors?.email} />
      <Field label="What are you building?" name="body" multiline error={state.fieldErrors?.body} />
      <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label>Website<input type="text" name="website" tabIndex={-1} autoComplete="off" /></label>
      </div>
      {state.error && <p role="alert" className="text-ember">{state.error}</p>}
      <button
        type="submit"
        disabled={pending}
        className="group mt-2 inline-flex h-14 w-fit items-center gap-3 rounded-pill bg-fg pl-7 pr-2 text-bg transition-colors duration-300 hover:bg-ember hover:text-white disabled:opacity-60"
      >
        <span>{pending ? "Sending…" : "Send message"}</span>
        <span className="grid size-10 place-items-center rounded-pill bg-bg text-fg transition-transform duration-300 group-hover:translate-x-0.5">
          <ArrowRight />
        </span>
      </button>
    </form>
  );
}

function Field({ label, name, type = "text", multiline, error, autoComplete }: {
  label: string; name: string; type?: string; multiline?: boolean; error?: string; autoComplete?: string;
}) {
  const id = `contact-${name}`;
  const cls = cn(
    "w-full border-b bg-transparent pb-3 pt-1 text-h3 placeholder:text-muted/60 focus:border-ember focus:outline-none",
    error ? "border-ember" : "border-line",
  );
  const aria = { "aria-invalid": !!error, "aria-describedby": error ? `${id}-err` : undefined };
  return (
    <div>
      <label htmlFor={id} className="text-meta text-muted">{label}</label>
      {multiline ? (
        <textarea id={id} name={name} rows={3} className={cn(cls, "resize-none")} {...aria} />
      ) : (
        <input id={id} name={name} type={type} autoComplete={autoComplete} className={cls} {...aria} />
      )}
      {error && <p id={`${id}-err`} className="mt-1.5 text-sm text-ember">{error}</p>}
    </div>
  );
}
