"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { AnchorHTMLAttributes, MouseEvent } from "react";
import { scrollToHash } from "@/lib/scroll";

type Props = AnchorHTMLAttributes<HTMLAnchorElement> & { href: string };

/**
 * Site link. Routes ("/work") use next/link, so navigation is client-side and prefetched (no reload, the
 * intro and the smooth-scroll instance survive). In-page targets ("#id") smooth-scroll via Lenis, and "/"
 * while already on "/" scrolls to the top instead of navigating.
 */
export function NavLink({ href, onClick, children, ...rest }: Props) {
  const pathname = usePathname();
  const hashOnly = href.startsWith("#") || href.startsWith("/#");
  const sameHome = href === "/" && pathname === "/";

  if (!hashOnly && !sameHome) return <Link href={href} onClick={onClick} {...rest}>{children}</Link>;

  const handle = (e: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(e);
    if (e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
    if (scrollToHash(href)) e.preventDefault();
  };
  return <a href={href} onClick={handle} {...rest}>{children}</a>;
}
