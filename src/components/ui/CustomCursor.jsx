import { useEffect, useRef } from 'react';
import './CustomCursor.css';

const TRAIL_LENGTH = 8;

export default function CustomCursor() {
  const dotRef = useRef(null);
  const ringRef = useRef(null);
  const trailRefs = useRef([]);
  const pos = useRef({ x: 0, y: 0 });
  const ringPos = useRef({ x: 0, y: 0 });
  const trailPositions = useRef(
    Array.from({ length: TRAIL_LENGTH }, () => ({ x: 0, y: 0 }))
  );
  const isHovering = useRef(false);

  useEffect(() => {
    const onMouseMove = (e) => {
      pos.current = { x: e.clientX, y: e.clientY };
      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${e.clientX - 4}px, ${e.clientY - 4}px)`;
      }
    };

    const animate = () => {
      // Ring follow
      ringPos.current.x += (pos.current.x - ringPos.current.x) * 0.15;
      ringPos.current.y += (pos.current.y - ringPos.current.y) * 0.15;

      if (ringRef.current) {
        const size = isHovering.current ? 48 : 32;
        ringRef.current.style.transform = `translate(${ringPos.current.x - size / 2}px, ${ringPos.current.y - size / 2}px)`;
      }

      // Trail follow — each dot follows the one ahead with increasing lag
      for (let i = 0; i < TRAIL_LENGTH; i++) {
        const target = i === 0 ? pos.current : trailPositions.current[i - 1];
        const lag = 0.12 - i * 0.008; // decreasing responsiveness
        trailPositions.current[i].x += (target.x - trailPositions.current[i].x) * lag;
        trailPositions.current[i].y += (target.y - trailPositions.current[i].y) * lag;

        const el = trailRefs.current[i];
        if (el) {
          el.style.transform = `translate(${trailPositions.current[i].x}px, ${trailPositions.current[i].y}px)`;
        }
      }

      requestAnimationFrame(animate);
    };

    const onMouseEnterInteractive = () => {
      isHovering.current = true;
      ringRef.current?.classList.add('cursor-hover');
      dotRef.current?.classList.add('cursor-dot-hover');
    };

    const onMouseLeaveInteractive = () => {
      isHovering.current = false;
      ringRef.current?.classList.remove('cursor-hover');
      dotRef.current?.classList.remove('cursor-dot-hover');
    };

    document.addEventListener('mousemove', onMouseMove);
    const raf = requestAnimationFrame(animate);

    // Add hover listeners to interactive elements
    const interactives = document.querySelectorAll('a, button, [data-cursor-hover], input, textarea');
    interactives.forEach((el) => {
      el.addEventListener('mouseenter', onMouseEnterInteractive);
      el.addEventListener('mouseleave', onMouseLeaveInteractive);
    });

    // Re-observe for dynamically added elements
    const observer = new MutationObserver(() => {
      const newInteractives = document.querySelectorAll('a, button, [data-cursor-hover], input, textarea');
      newInteractives.forEach((el) => {
        el.removeEventListener('mouseenter', onMouseEnterInteractive);
        el.removeEventListener('mouseleave', onMouseLeaveInteractive);
        el.addEventListener('mouseenter', onMouseEnterInteractive);
        el.addEventListener('mouseleave', onMouseLeaveInteractive);
      });
    });
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      document.removeEventListener('mousemove', onMouseMove);
      cancelAnimationFrame(raf);
      observer.disconnect();
      interactives.forEach((el) => {
        el.removeEventListener('mouseenter', onMouseEnterInteractive);
        el.removeEventListener('mouseleave', onMouseLeaveInteractive);
      });
    };
  }, []);

  return (
    <>
      <div ref={dotRef} className="cursor-dot" />
      <div ref={ringRef} className="cursor-ring" />
      {/* Trail dots */}
      {Array.from({ length: TRAIL_LENGTH }, (_, i) => (
        <div
          key={i}
          ref={(el) => { trailRefs.current[i] = el; }}
          className="cursor-trail-dot"
          style={{
            opacity: 1 - (i / TRAIL_LENGTH) * 0.85,
            width: `${Math.max(2, 6 - i * 0.5)}px`,
            height: `${Math.max(2, 6 - i * 0.5)}px`,
          }}
        />
      ))}
    </>
  );
}
