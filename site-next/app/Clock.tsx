"use client";
import { useEffect } from "react";

/** Keeps every <time data-clock> on the page in sync with Pune local time. */
export default function Clock() {
  useEffect(() => {
    const fmt = new Intl.DateTimeFormat("en-IN", { hour: "2-digit", minute: "2-digit", hour12: true, timeZone: "Asia/Kolkata" });
    const tick = () => {
      const t = fmt.format(new Date()).toUpperCase();
      document.querySelectorAll<HTMLElement>("[data-clock]").forEach((el) => (el.textContent = `${t} · Pune, India`));
    };
    tick();
    const id = setInterval(tick, 15_000);
    return () => clearInterval(id);
  }, []);
  return null;
}
