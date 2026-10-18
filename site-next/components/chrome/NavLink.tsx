"use client";
import type { AnchorHTMLAttributes, MouseEvent } from "react";
import { scrollToHash } from "@/lib/scroll";

/** Plain anchor that smooth-scrolls (via Lenis) for same-page targets: "/", "#id" or "/#id". External links pass through. */
export function NavLink({ href, onClick, children, ...rest }: AnchorHTMLAttributes<HTMLAnchorElement> & { href: string }) {
  const internal = href === "/" || href.startsWith("#") || href.startsWith("/#");
  const handle = (e: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(e);
    if (!internal || e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
    if (scrollToHash(href)) e.preventDefault();
  };
  return <a href={href} onClick={handle} {...rest}>{children}</a>;
}
