"use client";
import { useEffect, useState } from "react";
import { person } from "@/content/punya";

const fmt = () =>
  new Intl.DateTimeFormat("en-IN", { hour: "2-digit", minute: "2-digit", hour12: true, timeZone: person.timezone })
    .format(new Date())
    .toUpperCase();

/** Live Pune time. `className` is the complete class string (the reference resolves it per call site). */
export function LocalTime({ className, place = true }: { className: string; place?: boolean }) {
  const [t, setT] = useState("");
  useEffect(() => {
    setT(fmt());
    const id = setInterval(() => setT(fmt()), 10_000);
    return () => clearInterval(id);
  }, []);
  return <span className={className}>{t ? (place ? `${t} · ${person.city}` : t) : " "}</span>;
}
