type P = { className?: string };

export function Sparkle({ className = "size-3.5" }: P) {
  return (
    <svg viewBox="0 0 16 16" className={className} fill="currentColor" aria-hidden="true">
      <path d="M8 0c.4 3.9 1.6 6.1 3.4 7.2.9.5 2.1.7 4.6.8-2.5.1-3.7.3-4.6.8C9.6 9.9 8.4 12.1 8 16c-.4-3.9-1.6-6.1-3.4-7.2C3.7 8.3 2.5 8.1 0 8c2.5-.1 3.7-.3 4.6-.8C6.4 6.1 7.6 3.9 8 0Z" />
    </svg>
  );
}

export function ArrowRight({ className = "size-4" }: P) {
  return (
    <svg viewBox="0 0 16 16" className={className} fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
      <path d="M2.5 8h11M9 3.5 13.5 8 9 12.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
